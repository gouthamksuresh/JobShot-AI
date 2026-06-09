import { useState, useContext } from "react"
import { ToastContext } from "../App"
import { Input, Textarea, Btn, Tab, Pill, PreviewBox, ProgressBar, ApprovalGate, Badge } from "../components/UI"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

const STEPS = [
  [20, "Reading job description..."],
  [45, "Extracting required skills..."],
  [65, "Tailoring your resume..."],
  [82, "Writing cover letter..."],
  [95, "Drafting email to HR..."],
]

export default function Apply({ C }) {
  const showToast = useContext(ToastContext)
  const [inputTab,   setInputTab]   = useState("link")
  const [jobUrl,     setJobUrl]     = useState("")
  const [hrEmail,    setHrEmail]    = useState("")
  const [company,    setCompany]    = useState("")
  const [role,       setRole]       = useState("")
  const [jobDesc,    setJobDesc]    = useState("")
  const [loading,    setLoading]    = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [loadMsg,    setLoadMsg]    = useState("")
  const [result,     setResult]     = useState(null)
  const [previewTab, setPreviewTab] = useState("resume")
  const [approved,   setApproved]   = useState(false)
  const [sent,       setSent]       = useState(false)
  const [error,      setError]      = useState("")
  const [copied,     setCopied]     = useState(false)

  async function handleGenerate() {
    setError(""); setResult(null); setApproved(false); setSent(false)
    setLoading(true); setProgress(0)
    let i = 0
    const iv = setInterval(() => {
      if (i < STEPS.length) { setProgress(STEPS[i][0]); setLoadMsg(STEPS[i][1]); i++ }
    }, 600)
    try {
      const res = await fetch(`${API}/generate`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ job_url: inputTab==="link"?jobUrl:null, hr_email:hrEmail,
          company, role, job_description: inputTab!=="link"?jobDesc:null })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Generation failed")
      clearInterval(iv); setProgress(100); setLoadMsg("Done — review all tabs then approve")
      setTimeout(() => { setLoading(false); setResult(data) }, 400)
    } catch (err) {
      clearInterval(iv); setLoading(false); setError(err.message)
    }
  }

  async function handleSend() {
    if (!approved || !result) return
    try {
      const res = await fetch(`${API}/send`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          company: result.company || company, role: result.role || role,
          hr_email: hrEmail, job_url: jobUrl,
          resume: result.resume, cover_letter: result.cover_letter, email_body: result.email_body
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)
      setSent(true); showToast("Application sent & logged to tracker!")
    } catch (err) { setError(err.message) }
  }

  function handleCopy() {
    const content = result?.[previewTab] || ""
    navigator.clipboard.writeText(content)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
    showToast("Copied to clipboard")
  }

  async function handleDownloadPdf() {
    try {
      showToast("Generating PDF...")
      const res = await fetch(`${API}/pdf`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to generate PDF")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Goutham_K_Suresh_Resume.pdf"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    }
  }

  const inputTabs = [["link","🔗 Job Link"],["email","📧 HR Email"],["manual","✍️ Manual"]]
  const previewTabs = [["resume","📄 Resume"],["cover_letter","📝 Cover Letter"],["email_body","📧 Email"]]

  return (
    <div style={{ maxWidth:820 }}>
      {/* Input method tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, marginBottom:18 }}>
        {inputTabs.map(([id,lbl]) => <Tab key={id} id={id} label={lbl} active={inputTab===id} onClick={setInputTab} />)}
      </div>

      {inputTab === "link" && <>
        <Input label="Job posting URL" value={jobUrl} onChange={setJobUrl}
          placeholder="https://linkedin.com/jobs/view/... or naukri.com/..." C={C} />
        <Input label="HR Email (optional)" value={hrEmail} onChange={setHrEmail}
          placeholder="hr@company.com" type="email" C={C} />
      </>}

      {inputTab === "email" && <>
        <Input label="HR Email" value={hrEmail} onChange={setHrEmail} placeholder="hr@company.com" type="email" C={C} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Company" value={company} onChange={setCompany} placeholder="e.g. Razorpay" C={C} />
          <Input label="Role" value={role} onChange={setRole} placeholder="e.g. DevOps Engineer" C={C} />
        </div>
        <Textarea label="Paste job description" value={jobDesc} onChange={setJobDesc}
          placeholder="Paste the full job description here..." C={C} />
      </>}

      {inputTab === "manual" && <>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Company" value={company} onChange={setCompany} placeholder="e.g. Razorpay" C={C} />
          <Input label="Role" value={role} onChange={setRole} placeholder="e.g. DevOps Engineer" C={C} />
        </div>
        <Input label="HR Email" value={hrEmail} onChange={setHrEmail} placeholder="hr@company.com" type="email" C={C} />
        <Textarea label="Job description" value={jobDesc} onChange={setJobDesc}
          placeholder="Paste the full job description here..." C={C} />
      </>}

      {error && (
        <div style={{ background:C.card, border:"1px solid #fecaca", borderRadius:7,
          padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14 }}>
          ⚠️ {error}
        </div>
      )}

      <Btn onClick={handleGenerate} disabled={loading}
        style={{ width:"100%", justifyContent:"center", marginBottom:18 }}>
        {loading ? "⏳ Generating..." : "✨ Generate with AI"}
      </Btn>

      {loading && <ProgressBar progress={progress} msg={loadMsg} C={C} />}

      {result && (
        <div>
          {/* Match score + skills */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:500, color:C.text }}>
              Match Score: <span style={{ color:"#16a34a", fontWeight:600 }}>{result.match_score}%</span>
            </span>
            {(result.matched_skills||[]).map(s => (
              <Badge key={s} label={s} variant="blue" />
            ))}
          </div>

          {/* Approval gate */}
          <ApprovalGate
            approved={approved}
            onApprove={() => { setApproved(true); showToast("Approved — send is now active") }}
            onDiscard={() => { setResult(null); setApproved(false) }}
            C={C} />

          {/* Preview tabs */}
          <div style={{ display:"flex", gap:7, marginBottom:12 }}>
            {previewTabs.map(([id,lbl]) => <Pill key={id} id={id} label={lbl} active={previewTab===id} onClick={setPreviewTab} />)}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:11, color:C.muted }}>
              {previewTab==="resume"?"Tailored resume":previewTab==="cover_letter"?"Cover letter":"Email to HR"}
            </span>
            <Btn variant="secondary" sm onClick={handleCopy} style={{ borderColor:C.border }}>
              {copied ? "✅ Copied" : "📋 Copy"}
            </Btn>
          </div>

          <PreviewBox content={result[previewTab] || ""} C={C} />

          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <Btn onClick={handleSend} disabled={!approved || sent}
              style={{ flex:1, justifyContent:"center", background: sent ? "#16a34a" : "#1A6AFF" }}>
              {sent ? "✅ Sent & Logged" : "📤 Send Application"}
            </Btn>
            <Btn variant="secondary" sm style={{ borderColor:C.border }} onClick={handleDownloadPdf}>⬇ PDF</Btn>
          </div>
        </div>
      )}
    </div>
  )
}
