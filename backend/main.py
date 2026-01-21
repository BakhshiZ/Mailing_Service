import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import psycopg2
from psycopg2 import errors
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class MailingListUser(BaseModel):
    user_email: EmailStr

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

cur = conn.cursor()

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
    except Exception:
        raise


@mailing_app.get('/subscribers')
def get_subscribers() -> List:
    cur.execute("SELECT * FROM subscriber WHERE subscribed = True;")
    return cur.fetchall()

@mailing_app.delete('/remove_user')
def remove_subscriber(payload: MailingListUser):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM subscriber WHERE email = %s;", (payload.user_email,))
        deleted = cur.rowcount
        conn.commit()

        if deleted == 0:
            raise HTTPException(status_code=400, detail="Error. Email not found")

    return {"status": "ok"}

if __name__ == '__main__':
    uvicorn.run(app=mailing_app,
                host="0.0.0.0",
                port=8000)