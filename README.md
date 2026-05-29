# ⚡ JobShot AI v2 — Automated Job Application Engine
### Built by Goutham K Suresh

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)

> Paste a job link → AI reads it → tailors resume → writes cover letter + email → you approve → sends in one click.

---

## 📦 What's Inside

```
jobshot-v2/
├── backend/
│   ├── main.py            ← FastAPI server — all routes
│   ├── ai.py              ← Claude API — generates resume, cover letter, email
│   ├── scraper.py         ← Scrapes LinkedIn, Naukri, any job URL
│   ├── email_sender.py    ← Gmail SMTP — sends with PDF attached
│   ├── pdf_gen.py         ← Generates resume PDF (ReportLab)
│   ├── sheets.py          ← Google Sheets export (on-demand)
│   ├── profile.json       ← Your complete JSON Brain (all details)
│   ├── resume_output.pdf  ← Your master resume PDF
│   ├── requirements.txt
│   └── .env.example       ← Copy to .env and fill keys
└── frontend/
    ├── src/
    │   ├── App.jsx            ← Shell, sidebar, dark mode
    │   ├── components/UI.jsx  ← All shared components
    │   └── pages/
    │       ├── Apply.jsx      ← Job input → AI generate → approve → send
    │       ├── Tracker.jsx    ← Kanban board + Google Sheets export
    │       └── Profile.jsx    ← Resume + Cover Letter + JSON Brain editor
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🏗️ Architecture & Tech Stack

This project is built using a modern, lightweight, and highly decoupled architecture.

### Frontend
- **Framework**: React 18 built with **Vite**.
- **State Management**: Built-in React Hooks (`useState`, `useEffect`) and Context API—no heavy Redux required.
- **Styling**: Handcrafted, zero-dependency design system using inline styles and CSS variables with a built-in dark/light mode engine.

### Backend
- **API Framework**: **FastAPI** (Python) running on Uvicorn, with **Pydantic** for rigorous data validation.
- **Database**: Local **SQLite3** (`jobshot.db`) to store application history safely on your machine.
- **AI Engine**: **Anthropic API** (`claude-sonnet-4`) reads your JSON profile and custom tailors resumes and cover letters.
- **Web Scraper**: Custom scraper using **BeautifulSoup4** and **Requests** to extract job descriptions automatically.
- **PDF Generation**: **ReportLab** dynamically draws an ATS-friendly A4 PDF resume.
- **Email & Export**: Built-in `smtplib` for Gmail SMTP integration and `gspread` for Google Sheets export.

---

## ✅ Features

- 🌙 **Dark mode** — toggle in sidebar, persisted
- 🛡️ **Security first** — approval gate before every send
- ✨ **AI generation** — resume, cover letter, email tailored per job
- ⬜ **Kanban tracker** — Applied → Responded → Interview → Offer
- 📊 **Export to Sheets** — one-click push to Google Sheets
- 👤 **Full profile** — resume preview, cover letter, JSON brain editor
- 🧠 **JSON Brain** — complete profile with all education, experience, projects

---

## 🚀 Setup — Step by Step

### Step 1 — Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Open .env and fill in your keys (see below)
```

### Step 2 — Get Your API Keys

**Anthropic API Key (for AI generation):**
1. Go to https://console.anthropic.com
2. Sign up → API Keys → Create Key
3. Add to .env as `ANTHROPIC_API_KEY`

**Gmail App Password (for sending emails):**
1. Go to myaccount.google.com → Security
2. Enable 2-Step Verification
3. Search "App Passwords" → Create one for "Mail"
4. Copy the 16-character password to .env as `GMAIL_APP_PASS`

**Google Sheets (optional — for export feature):**
1. console.cloud.google.com → New Project
2. Enable Google Sheets API
3. Create Service Account → Download JSON key
4. Share your Google Sheet with the service account email
5. Add `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON` to .env
6. Uncomment `gspread` and `google-auth` in requirements.txt → pip install

### Step 3 — Run Backend
```bash
# Inside backend/ with venv active
uvicorn main:app --reload --port 8000
```
→ Backend running at http://localhost:8000

### Step 4 — Frontend
```bash
cd frontend
npm install
npm run dev
```
→ App running at http://localhost:5173

---

## 🎮 How to Use

1. Open **http://localhost:5173**
2. Go to **Apply to Job**
3. Paste a job URL or HR email
4. Click **Generate with AI**
5. Review **Resume**, **Cover Letter**, **Email** tabs
6. Click **Approve & Enable Send**
7. Click **Send Application** — done ✅
8. Check **Tracker** to see it logged

---

## 🧠 JSON Brain — profile.json

Your complete profile lives in `backend/profile.json`. It includes:
- Personal info, education (10th, 12th, BCA with all semesters)
- Both internships with full details and tools
- All 5 projects with stacks and metrics
- Skills, certifications, target roles

The AI reads this every time it generates content. Update it anytime — or edit it from the My Profile page in the UI.

---

## 🔒 Security

- **Strictly Local Storage:** All application data is stored in a local SQLite database.
- **Explicit Consent:** Nothing is sent or exported without your explicit click and approval.
- **Network Hardened:** Built-in SSRF and DoS protection on the web scraper to prevent local network scanning or memory exhaustion.
- **Payload Validation:** API endpoints enforce rigorous payload size limits via Pydantic.
- **Zero Tracking:** No analytics or third-party tracking scripts.
- **Secure Credentials:** Gmail and API credentials are read strictly from your local `.env`.

---

## 📅 Roadmap

- [x] AI resume + cover letter + email generation
- [x] Approval gate before sending
- [x] Kanban application tracker
- [x] Google Sheets export
- [x] Dark mode
- [x] Full JSON brain with complete profile
- [x] Resume PDF download
- [ ] Follow-up reminder system
- [ ] Naukri auto-apply integration
- [ ] Chrome extension for one-click apply
