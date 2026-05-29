# ⚡ JobShot AI v2 — Automated Job Application Engine
### Built by Goutham K Suresh

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

- All data stored locally (SQLite)
- Nothing sends without your explicit approval
- No third-party tracking
- Gmail credentials stored only in your local .env

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
