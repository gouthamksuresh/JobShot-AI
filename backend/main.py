from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional
import json, os, datetime
from dotenv import load_dotenv
from supabase import create_client, Client

from ai import generate_all
from scraper import scrape_job
from email_sender import send_email
from pdf_gen import generate_resume_pdf
from sheets import export_to_sheets

app = FastAPI(title="JobShot AI v2")

load_dotenv()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"], allow_headers=["*"])

# ── Supabase Setup ────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def load_profile():
    if not supabase: return {}
    try:
        res = supabase.table("user_profile").select("profile_data").eq("id", 1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("profile_data", {})
    except Exception as e:
        print("Error loading profile:", e)
    return {}

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
    if supabase:
        supabase.table("applications").insert({
            "company": data.company, "role": data.role, "hr_email": data.hr_email,
            "job_url": data.job_url, "status": "Applied",
            "applied_at": datetime.datetime.now().isoformat(),
            "resume": data.resume, "cover_letter": data.cover_letter, "email_body": data.email_body
        }).execute()
    return {"success": True}

@app.get("/applications")
def get_applications():
    if not supabase: return []
    res = supabase.table("applications").select("*").order("applied_at", desc=True).execute()
    return res.data

@app.patch("/applications/{app_id}")
def update_status(app_id: int, data: StatusUpdate):
    if supabase:
        supabase.table("applications").update({"status": data.status}).eq("id", app_id).execute()
    return {"success": True}

@app.delete("/applications/{app_id}")
def delete_application(app_id: int):
    if supabase:
        supabase.table("applications").delete().eq("id", app_id).execute()
    return {"success": True}

@app.post("/export-sheets")
async def export_sheets():
    if not supabase: return {"success": False, "error": "Supabase not configured"}
    res = supabase.table("applications").select("*").order("applied_at", desc=True).execute()
    apps = res.data
    url = export_to_sheets(apps)
    return {"success": True, "url": url}

@app.get("/profile")
def get_profile(): return load_profile()

@app.put("/profile")
def update_profile(data: ProfileUpdate):
    if supabase:
        supabase.table("user_profile").upsert({"id": 1, "profile_data": data.profile}).execute()
    return {"success": True}

@app.post("/pdf")
async def create_pdf():
    path = generate_resume_pdf()
    return FileResponse(path, media_type="application/pdf",
                        filename="Goutham_K_Suresh_Resume.pdf")
