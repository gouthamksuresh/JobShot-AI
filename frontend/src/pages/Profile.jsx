import { useState, useEffect, useContext } from "react"
import { ToastContext } from "../App"
import { Btn, Card, CardHeader, Input, Divider } from "../components/UI"

const API = "http://localhost:8000"

const MASTER_RESUME = `GOUTHAM K SURESH
DevOps Engineer | Cloud & Infrastructure | SRE
Kodungallur, Kerala, India
me.goutham.tech@gmail.com | +91 9746154656
linkedin.com/in/gouthamksuresh | github.com/gouthamksuresh

────────────────────────────────────────
PROFESSIONAL SUMMARY
────────────────────────────────────────
BCA graduate (AI Specialization) with two internships — DevOps at
Elevate Labs and Data Science at Prinston Smart Engineers.
Hands-on with Jenkins, GitHub Actions, Docker, Kubernetes, AWS, GCP,
Python, and Pandas. Built a live full-stack commercial website for a
UK client (Next.js, React, Supabase). Certified in Google Cloud and
AI with Python. Seeking DevOps / Cloud / SRE role.

────────────────────────────────────────
EXPERIENCE
────────────────────────────────────────
DevOps Intern — Elevate Labs, Bengaluru        Sep 2025 – Jan 2026
• Designed and optimized CI/CD pipelines using Jenkins and GitHub Actions
• Containerized apps with Docker; deployed via Kubernetes
• Deployed on AWS and GCP — scalable, fault-tolerant infrastructure
• Monitored pipeline health and system metrics
• Simulated production release workflows: build, test, deploy

Data Science Intern — Prinston Smart Engineers  Jan 2025 – Mar 2025
• Analyzed datasets using Python and Pandas — EDA & visualization
• Built laptop recommendation system (60% faster selection speed)
• Explored ML models for classification and recommendation tasks

────────────────────────────────────────
PROJECTS
────────────────────────────────────────
DevFlow — Production-Grade DevOps Pipeline        In Progress
Docker · Kubernetes · Terraform · GitHub Actions · AWS · Prometheus
• End-to-end pipeline: Docker → CI/CD → Terraform IaC → AWS → K8s
• Live monitoring with Prometheus + Grafana

JobShot AI — Automated Job Application Engine     In Progress
Python · FastAPI · React · Claude API · Gmail SMTP
• AI reads job → tailors resume → writes email → sends in one click

CI/CD Pipeline Automation                         Dec 2025
Jenkins · GitHub Actions · Docker

Internship Management System                      Jan 2025
Python · Flask · SQLite · JavaScript
• 70% workload reduction, 3× efficiency, 45% match accuracy

JSS Beauty — Full-Stack Client Website            2024
Next.js · React · Supabase · Tailwind · TypeScript
• Live: jssbeauty.co.uk — admin dashboard with Supabase Auth

────────────────────────────────────────
TECHNICAL SKILLS
────────────────────────────────────────
DevOps & Cloud : Docker, Kubernetes, Jenkins, GitHub Actions, AWS, GCP
Data Science   : Python, Pandas, EDA, ML Model Evaluation
Programming    : Python, JavaScript, Java, C, C#, PHP, SQL
Frameworks     : Flask, Next.js, React, Tailwind CSS
Databases      : MySQL, SQLite, Supabase
Tools          : Git, GitHub, VS Code, Open Source Tools

────────────────────────────────────────
EDUCATION
────────────────────────────────────────
BCA — AI Specialization                           2022–2025
Bengaluru North University · Krupanidhi Degree College
CGPA: 6.59 | Final Sem: 71.14% | Internship: 90/100 | Project: 130/150

Class XII — Computer Science (Kerala Board)       2022
St. Joseph's HSS, Mathilakam
70.33% | CS: 166/200 (A) | Physics: 160/200 (A)

────────────────────────────────────────
CERTIFICATIONS
────────────────────────────────────────
AI with Python — Keonics
Google Cloud Fundamentals — Qwiklabs`

const MASTER_COVER = `Dear Hiring Manager,

I am writing to express my strong interest in the DevOps Engineer
position at your organisation. As a BCA graduate (AI Specialization)
with a 4-month DevOps internship at Elevate Labs, Bengaluru, I bring
hands-on experience with Jenkins, GitHub Actions, Docker, Kubernetes,
AWS, and GCP — the exact tools modern infrastructure teams use daily.

During my internship, I designed and optimised CI/CD pipelines that
reduced manual deployment effort significantly. I containerised
applications with Docker, orchestrated them via Kubernetes, and
deployed workloads on AWS and GCP. My project DevFlow demonstrates
a production-grade pipeline: Dockerfile → GitHub Actions CI/CD →
Terraform IaC → Kubernetes orchestration → Prometheus/Grafana
monitoring — built independently to deepen real-world expertise.

I am eager to contribute from day one and grow within a team that
values reliability, automation, and continuous improvement. I would
welcome the opportunity to discuss how my background aligns with
your needs.

Warm regards,
Goutham K Suresh
+91 9746154656 | me.goutham.tech@gmail.com
github.com/gouthamksuresh | linkedin.com/in/gouthamksuresh`

const DEFAULT_JSON = JSON.stringify({
  "personal": {
    "name": "Goutham K Suresh",
    "dob": "04-01-2005",
    "email": "me.goutham.tech@gmail.com",
    "phone": "+91 9746154656",
    "city": "Kodungallur, Kerala, India",
    "linkedin": "linkedin.com/in/gouthamksuresh",
    "github": "github.com/gouthamksuresh",
    "apaar_id": "777693978367"
  },
  "education": [
    {
      "level": "Graduation",
      "degree": "Bachelor of Computer Applications (BCA)",
      "specialization": "AI Specialization",
      "university": "Bengaluru North University",
      "college": "Krupanidhi Degree College, Chikkabellandur, Bengaluru",
      "year": "2022-2025",
      "cgpa": "6.59",
      "semester_results": [
        {"sem": 1, "percentage": "68.00", "sgpa": 7.19},
        {"sem": 2, "percentage": "62.25", "sgpa": 6.60},
        {"sem": 3, "percentage": "60.88", "sgpa": 6.28},
        {"sem": 4, "percentage": "59.50", "sgpa": 6.33},
        {"sem": 5, "percentage": "56.71", "sgpa": 5.88},
        {"sem": 6, "percentage": "71.14", "sgpa": 7.33}
      ],
      "standout_scores": {"internship": "90/100", "project_work": "130/150"},
      "key_subjects": ["Cloud Computing","Cyber Security","AI & Applications","OS","Networks","DBMS","Python","Software Engineering","PHP & MySQL","Data Structures","C# & .NET","Open Source Tools"]
    },
    {
      "level": "Class XII", "stream": "Computer Science",
      "board": "Kerala Board of HSE", "school": "St. Joseph HSS, Mathilakam",
      "year": "2022", "percentage": "70.33", "total_score": "844/1200",
      "subject_scores": {"Computer Science": "166/200 (A)", "Physics": "160/200 (A)", "Chemistry": "130/200 (B)", "Mathematics": "121/200 (B)", "English": "138/160 (B)", "Malayalam": "129/160 (B)"}
    },
    {
      "level": "Class X", "board": "CBSE",
      "school": "Amrita Vidyalayam, Kodungallur, Thrissur", "year": "2020", "result": "PASS"
    }
  ],
  "experience": [
    {
      "role": "DevOps Intern", "company": "Elevate Labs",
      "location": "Bengaluru", "duration": "Sep 2025 – Jan 2026",
      "university_grade": "90/100",
      "tools": ["Jenkins","GitHub Actions","Docker","Kubernetes","AWS","GCP"],
      "responsibilities": [
        "Designed and optimized CI/CD pipelines using Jenkins and GitHub Actions",
        "Containerized applications with Docker; orchestrated via Kubernetes",
        "Deployed on AWS and GCP — scalable, fault-tolerant infrastructure",
        "Monitored pipeline health and system metrics",
        "Simulated production release workflows: build, test, deploy"
      ]
    },
    {
      "role": "Data Science Intern", "company": "Prinston Smart Engineers",
      "location": "Bengaluru", "duration": "Jan 2025 – Mar 2025",
      "tools": ["Python","Pandas","EDA","Machine Learning"],
      "responsibilities": [
        "Analyzed datasets using Python and Pandas — EDA and visualization",
        "Built laptop recommendation system improving selection speed by 60%",
        "Explored ML models for classification and recommendation tasks"
      ]
    }
  ],
  "projects": [
    {"name": "DevFlow — Production-Grade DevOps Pipeline", "status": "In Progress", "stack": ["Docker","Kubernetes","Terraform","GitHub Actions","AWS","Prometheus","Grafana","Bash"]},
    {"name": "JobShot AI — Automated Job Application Engine", "status": "In Progress", "stack": ["Python","FastAPI","React","Claude AI API","Gmail SMTP","SQLite"]},
    {"name": "CI/CD Pipeline Automation", "date": "Dec 2025", "stack": ["Jenkins","GitHub Actions","Docker"]},
    {"name": "Internship Management System", "date": "Jan 2025", "stack": ["Python","Flask","SQLite","JavaScript"], "metrics": {"workload_reduction": "70%", "efficiency": "3x", "match_accuracy": "+45%"}},
    {"name": "JSS Beauty — Full-Stack Client Web App", "date": "2024", "url": "https://www.jssbeauty.co.uk", "stack": ["Next.js","React","Supabase","Tailwind CSS","TypeScript"]}
  ],
  "skills": {
    "devops_cloud": ["Docker","Kubernetes","Jenkins","GitHub Actions","AWS","GCP","CI/CD","Linux","Bash","Terraform"],
    "data_science": ["Python","Pandas","EDA","ML Model Evaluation","Data Visualization"],
    "programming": ["Python","JavaScript","Java","C","C#","PHP","SQL"],
    "frameworks": ["Flask","FastAPI","Next.js","React","Tailwind CSS"],
    "databases": ["MySQL","SQLite","Supabase"],
    "tools": ["Git","GitHub","VS Code"]
  },
  "certifications": ["AI with Python — Keonics", "Google Cloud Fundamentals — Qwiklabs"],
  "languages": ["English","Malayalam","Hindi"],
  "interests": ["Open Source","Cloud Infrastructure","AI/ML","DevOps Automation"],
  "target": {
    "roles": ["DevOps Engineer","Cloud Engineer","SRE","Infrastructure Engineer"],
    "locations": ["Bengaluru","Hyderabad","Remote","Any"],
    "company_type": "Mid-size product company or any permanent role",
    "timeline": "ASAP"
  }
}, null, 2)

export default function Profile({ C, dark }) {
  const showToast = useContext(ToastContext)
  const [profile,   setProfile]   = useState(null)
  const [jsonBrain, setJsonBrain] = useState(DEFAULT_JSON)
  const [jsonError, setJsonError] = useState("")
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    fetch(`${API}/profile`)
      .then(r => r.json())
      .then(d => { setProfile(d); setJsonBrain(JSON.stringify(d, null, 2)) })
      .catch(() => {})
  }, [])

  function updateField(key, val) {
    setProfile(p => ({ ...p, personal: { ...p.personal, [key]: val } }))
  }

  async function saveProfile() {
    setSaving(true)
    try {
      // Validate JSON brain
      const parsed = JSON.parse(jsonBrain)
      await fetch(`${API}/profile`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ profile: parsed })
      })
      setJsonError("")
      showToast("Profile & JSON brain saved!")
    } catch (e) {
      if (e instanceof SyntaxError) setJsonError("Invalid JSON — fix syntax before saving")
      else showToast("Save failed", "error")
    }
    setSaving(false)
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type:"text/plain" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = filename; a.click()
  }

  async function downloadResumePDF() {
    try {
      const res = await fetch(`${API}/pdf`, { method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({}) })
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "Goutham_K_Suresh_Resume.pdf"; a.click()
      showToast("Resume PDF downloaded!")
    } catch { showToast("Download failed","error") }
  }

  const boxStyle = {
    background: C.codeBg, border:`1px solid ${C.border}`, borderRadius:7,
    padding:14, fontSize:12, color:C.sub, lineHeight:1.8,
    whiteSpace:"pre-wrap", fontFamily:"'JetBrains Mono','Fira Code',monospace",
    maxHeight:220, overflowY:"auto"
  }

  const sectionStyle = {
    background:C.card, border:`1px solid ${C.cardBorder}`,
    borderRadius:10, padding:16, marginBottom:14
  }

  return (
    <div style={{ maxWidth:760 }}>

      {/* ── Primary Resume ── */}
      <div style={sectionStyle}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>📄 Primary Resume</span>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="secondary" sm onClick={() => downloadText(MASTER_RESUME,"Goutham_K_Suresh_Resume.txt")}
              style={{ borderColor:C.border }}>
              ⬇ TXT
            </Btn>
            <Btn variant="secondary" sm onClick={downloadResumePDF}
              style={{ borderColor:C.border }}>
              ⬇ PDF
            </Btn>
          </div>
        </div>
        <div style={boxStyle}>{MASTER_RESUME}</div>
      </div>

      {/* ── Primary Cover Letter ── */}
      <div style={sectionStyle}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>📝 Primary Cover Letter</span>
          <Btn variant="secondary" sm onClick={() => downloadText(MASTER_COVER,"Goutham_K_Suresh_Cover_Letter.txt")}
            style={{ borderColor:C.border }}>
            ⬇ Download
          </Btn>
        </div>
        <div style={boxStyle}>{MASTER_COVER}</div>
      </div>

      {/* ── JSON Brain ── */}
      <div style={sectionStyle}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>🧠 JSON Brain</span>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="secondary" sm onClick={() => downloadText(jsonBrain,"profile.json")}
              style={{ borderColor:C.border }}>
              ⬇ Export
            </Btn>
            <Btn variant="primary" sm onClick={saveProfile} disabled={saving}>
              {saving ? "Saving..." : "💾 Save Brain"}
            </Btn>
          </div>
        </div>
        <p style={{ fontSize:11, color:C.muted, marginBottom:10 }}>
          This is what the AI reads every time it generates your resume, cover letter, and email. Edit directly — it's just JSON.
        </p>
        {jsonError && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6,
            padding:"7px 12px", fontSize:12, color:"#dc2626", marginBottom:10 }}>
            ⚠️ {jsonError}
          </div>
        )}
        <textarea value={jsonBrain} onChange={e => { setJsonBrain(e.target.value); setJsonError("") }}
          rows={12} style={{
            width:"100%", padding:12, fontSize:12, fontFamily:"'JetBrains Mono','Fira Code',monospace",
            border:`1px solid ${jsonError ? "#fca5a5" : C.border}`, borderRadius:7,
            background:C.codeBg, color:C.sub, lineHeight:1.7,
            boxSizing:"border-box", resize:"vertical", outline:"none"
          }} />
      </div>

      {/* ── Personal Info ── */}
      <div style={sectionStyle}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>👤 Personal Info</span>
          <Btn variant="primary" sm onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "💾 Save"}
          </Btn>
        </div>
        {profile && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            {[
              ["Full Name","name"],["Email","email"],
              ["Phone","phone"],["City","city"],
              ["LinkedIn","linkedin"],["GitHub","github"],
            ].map(([label,key]) => (
              <div key={key} style={{ marginBottom:12 }}>
                <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:5 }}>{label}</label>
                <input value={profile.personal?.[key] || ""} onChange={e=>updateField(key,e.target.value)}
                  style={{ width:"100%", padding:"8px 12px", fontSize:13, borderRadius:7,
                    border:`1px solid ${C.inputBorder}`, background:C.input,
                    color:C.text, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
