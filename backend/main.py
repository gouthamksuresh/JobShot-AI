from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional
import json, os, sqlite3, datetime

from ai import generate_all
from scraper import scrape_job
from email_sender import send_email
from pdf_gen import generate_resume_pdf
from sheets import export_to_sheets

app = FastAPI(title="JobShot AI v2")

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"], allow_headers=["*"])

# ── DB ────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect("jobshot.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    db = get_db()
    db.execute("""CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT, role TEXT, hr_email TEXT, job_url TEXT,
        status TEXT DEFAULT 'Applied',
        applied_at TEXT,
        resume TEXT, cover_letter TEXT, email_body TEXT
    )""")
    db.commit(); db.close()

init_db()

def load_profile():
    with open("profile.json") as f: return json.load(f)

# ── Models ────────────────────────────────────────────
class JobInput(BaseModel):
    job_url:         Optional[str] = Field(None, max_length=1000)
    hr_email:        Optional[str] = Field(None, max_length=255)
    company:         Optional[str] = Field(None, max_length=255)
    role:            Optional[str] = Field(None, max_length=255)
    job_description: Optional[str] = Field(None, max_length=50000)

class SendInput(BaseModel):
    company: str = Field(..., max_length=255)
    role: str = Field(..., max_length=255)
    hr_email: str = Field(..., max_length=255)
    job_url: Optional[str] = Field(None, max_length=1000)
    resume: str = Field(..., max_length=50000)
    cover_letter: str = Field(..., max_length=50000)
    email_body: str = Field(..., max_length=10000)

class StatusUpdate(BaseModel):
    status: str = Field(..., max_length=50)

class ProfileUpdate(BaseModel):
    profile: dict

# ── Routes ────────────────────────────────────────────
@app.get("/")
def root(): return {"status": "JobShot AI v2 running"}

@app.post("/generate")
async def generate(data: JobInput):
    job_description = data.job_description or ""
    company = data.company or ""
    role    = data.role    or ""
    hr_email = data.hr_email or ""
    if data.job_url:
        scraped = scrape_job(data.job_url)
        job_description = scraped.get("description", job_description)
        company = scraped.get("company", company)
        role    = scraped.get("role",    role)
    if not job_description:
        raise HTTPException(400, "No job description found. Paste it manually.")
    profile = load_profile()
    result = generate_all(profile, job_description, company, role, hr_email)
    return {"company": company, "role": role, "hr_email": hr_email, **result}

@app.post("/send")
async def send(data: SendInput):
    pdf_path = generate_resume_pdf()
    success = send_email(
        to=data.hr_email,
        subject=f"Application — {data.role} | Goutham K Suresh",
        body=data.email_body,
        resume_path=pdf_path
    )
    if not success:
        raise HTTPException(500, "Email failed. Check Gmail credentials in .env")
    db = get_db()
    db.execute("""INSERT INTO applications
        (company,role,hr_email,job_url,status,applied_at,resume,cover_letter,email_body)
        VALUES (?,?,?,?,'Applied',?,?,?,?)""",
        (data.company, data.role, data.hr_email, data.job_url,
         datetime.datetime.now().isoformat(),
         data.resume, data.cover_letter, data.email_body))
    db.commit(); db.close()
    return {"success": True}

@app.get("/applications")
def get_applications():
    db = get_db()
    rows = db.execute("SELECT * FROM applications ORDER BY applied_at DESC").fetchall()
    db.close()
    return [dict(r) for r in rows]

@app.patch("/applications/{app_id}")
def update_status(app_id: int, data: StatusUpdate):
    db = get_db()
    db.execute("UPDATE applications SET status=? WHERE id=?", (data.status, app_id))
    db.commit(); db.close()
    return {"success": True}

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    db = get_db()
    db.execute("DELETE FROM applications WHERE id=?", (app_id,))
    db.commit(); db.close()
    return {"success": True}

@app.post("/export-sheets")
async def export_sheets():
    db = get_db()
    rows = db.execute("SELECT * FROM applications ORDER BY applied_at DESC").fetchall()
    db.close()
    apps = [dict(r) for r in rows]
    url = export_to_sheets(apps)
    return {"success": True, "url": url}

@app.get("/profile")
def get_profile(): return load_profile()

@app.put("/profile")
def update_profile(data: ProfileUpdate):
    with open("profile.json","w") as f: json.dump(data.profile, f, indent=2)
    return {"success": True}

@app.post("/pdf")
async def create_pdf():
    path = generate_resume_pdf()
    return FileResponse(path, media_type="application/pdf",
                        filename="Goutham_K_Suresh_Resume.pdf")
