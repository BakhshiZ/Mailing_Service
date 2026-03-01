import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import psycopg2
from psycopg2 import errors
import os
from typing import List
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage
import threading

load_dotenv()

class MailingListUser(BaseModel):
    user_email: EmailStr

class BroadcastPayload(BaseModel):
    subject: str
    body: str

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

mailing_app = FastAPI()

origins = [
    "http://localhost:5173"
]

mailing_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def send_broadcast_email(subject: str, body:str, recipients: list[str]):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = smtp_user # sending to myself for testing purposes
    msg["Bcc"] = ", ".join(recipients)
    msg.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

def thread_broadcast_func(subject: str, body: str):
    with conn.cursor() as cur:
        cur.execute("SELECT email FROM subscriber WHERE subscribed = TRUE;")
        recipients = [result[0] for result in cur.fetchall()] # list of emails

        if recipients is not None:
            send_broadcast_email(subject, body, recipients)

@mailing_app.post("/add_user")
def add_user(payload: MailingListUser):
    try:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO subscriber (email, subscribed) VALUES (%s, %s)", 
                        (payload.user_email, True))
            conn.commit()
            return {"status": "ok"}
    except errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Email must be unique")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@mailing_app.get('/subscribers')
def get_subscribers():
    with conn.cursor() as cur:
        cur.execute(
            "SELECT COUNT(*) FROM subscriber WHERE subscribed = True;"
        )
        result = cur.fetchone()

        if result is None:
            return {"count": 0}

        return {"count": result[0]}

@mailing_app.delete('/remove_user')
def remove_subscriber(payload: MailingListUser):
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM subscriber WHERE email = %s;", (payload.user_email,))
            deleted = cur.rowcount
            conn.commit()

            if deleted == 0:
                raise HTTPException(status_code=400, detail="Error. Email not found")

        return {"status": "ok"}
    
    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@mailing_app.post('/broadcast')
def broadcast(payload: BroadcastPayload):
    thread = threading.Thread(
        target=thread_broadcast_func,
        args=(payload.subject, payload.body)
    )
    thread.start()

    return {"status": "broadcast has started"}

if __name__ == '__main__':
    uvicorn.run(app=mailing_app,
                host="0.0.0.0",
                port=8000)