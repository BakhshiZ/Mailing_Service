#📬 Mailing List Web App

This is a full-stack mailing list application built with:

- **Frontend:** React, TypeScript, Vite, Bootstrap
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Email Provider:** Gmail SMTP

Users are able to:

- Subscribe / Unsubscribe to the mailing list
- View total current subscribers
- Broadcast an email to all subscribers

**Note:** Broadcasting of emails runs on a background thread so that the user can still use the site while emails are being sent.

---

# ⚙️ Backend Setup

## 1️⃣ Create Virtual Environment and Run The Backend

# For Windows devices

```bash
cd backend
python -m venv mailing_service_env
mailing_service_env\Scripts\activate
```

# For Mac/Linux devices

```bash
cd backend
python3 -m venv mailing_service_env
source mailing_service_env/bin/activate
```

## 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

## 3️⃣ PostgreSQL Table

Create this table in your database

```sql
CREATE TABLE subscriber(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT TRUE
);
```

## 4️⃣ Create `.env` File

Inside `backend/` create:

```
DB_HOST="localhost"
DB_NAME="your_database_name"
DB_USER="your_user"
DB_PASSWORD="your_password"
DB_PORT=your_db_port

SMTP_HOST=smtp.gmail.com
SMTP_USER=yourEmail@gmail.com
SMTP_PASSWORD=your_16_character_app_password
SMTP_PORT=587
MAIL_FROM=yourEmail@gmail.com
```

**NOTE:** You must enable 2-Step Verification on Gmail and generate an [**App Password**](https://myaccount.google.com/)

## 5️⃣ Run Backend

# For Windows Devices

```bash
python main.py
```

# For Mac/Linux Devices

```bash
python3 main.py
```

Server runs at:

```
http://localhost:8000
```

---

# 💻 Frontend Setup

**In a separate terminal**

## 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

## 2️⃣ Run Dev Server

```bash
npm run dev
```

Frontend server runs at:

```
http://localhost:5173
```

---

# 🧠 How Broadcasting Works

1. Frontend sends POST `/broadcast`
2. FastAPI starts a background thread
3. Thread fetches subscribers
4. Email sent via Gmail SMTP

---

# 📌 Author

**Bakhshi Zulfiqar**
Github: https://github.com/BakhshiZ

Built as a full-stack learning project using React + FastAPI.
