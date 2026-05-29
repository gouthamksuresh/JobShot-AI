import { useState, useEffect, useContext } from "react"
import { ToastContext } from "../App"
import { Btn, Badge } from "../components/UI"

const API = "http://localhost:8000"

const COLUMNS = [
  { id:"Applied",   label:"Applied",   color:"#1A6AFF", badgeVariant:"blue"  },
  { id:"Responded", label:"Responded", color:"#16a34a", badgeVariant:"green" },
  { id:"Interview", label:"Interview", color:"#b45309", badgeVariant:"amber" },
  { id:"Offer",     label:"Offer",     color:"#7c3aed", badgeVariant:"blue"  },
]

const REJECTED_COL = { id:"Rejected", label:"Rejected", color:"#dc2626", badgeVariant:"red" }
const NO_REPLY_COL = { id:"No Reply", label:"No Reply", color:"#6b7280", badgeVariant:"gray" }

export default function Tracker({ C, dark }) {
  const showToast = useContext(ToastContext)
  const [apps, setApps]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [showAll, setShowAll]   = useState(false)

  useEffect(() => { fetchApps() }, [])

  async function fetchApps() {
    try {
      const res = await fetch(`${API}/applications`)
      const data = await res.json()
      setApps(data)
    } catch { setApps([]) }
    setLoading(false)
  }

  async function moveCard(id, newStatus) {
    setApps(apps.map(a => a.id===id ? {...a, status:newStatus} : a))
    await fetch(`${API}/applications/${id}`, {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ status: newStatus })
    })
    showToast(`Moved to ${newStatus}`)
  }

  async function deleteCard(id) {
    if (!confirm("Delete this application?")) return
    setApps(apps.filter(a => a.id!==id))
    await fetch(`${API}/applications/${id}`, { method:"DELETE" })
    showToast("Application deleted")
  }

  async function exportSheets() {
    try {
      const res = await fetch(`${API}/export-sheets`, { method:"POST" })
      const data = await res.json()
      if (data.url) window.open(data.url, "_blank")
      showToast("Exported to Google Sheets!")
    } catch { showToast("Export failed — check backend config") }
  }

  const stats = [
    ["Total", apps.length, C.text],
    ["Responded", apps.filter(a=>a.status==="Responded").length, "#16a34a"],
    ["Interview", apps.filter(a=>a.status==="Interview").length, "#b45309"],
    ["Offer", apps.filter(a=>a.status==="Offer").length, "#7c3aed"],
  ]

  const mainCols = showAll ? [...COLUMNS, REJECTED_COL, NO_REPLY_COL] : COLUMNS

  function KanbanCard({ a }) {
    const date = a.applied_at
      ? new Date(a.applied_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"})
      : "—"
    const otherCols = [...COLUMNS, REJECTED_COL, NO_REPLY_COL].filter(c => c.id !== a.status)

    return (
      <div style={{ background:C.bg, border:`1px solid ${C.border}`,
        borderRadius:8, padding:10, cursor:"default", transition:"border .15s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="#1A6AFF"}
        onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
        <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{a.company}</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.role}</div>
        {a.hr_email && <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>📧 {a.hr_email}</div>}
        <div style={{ fontSize:10, color:C.muted, marginTop:5 }}>📅 {date}</div>
        <div style={{ display:"flex", gap:4, marginTop:9, flexWrap:"wrap" }}>
          {otherCols.slice(0,3).map(c => (
            <button key={c.id} onClick={() => moveCard(a.id, c.id)}
              style={{ fontSize:10, padding:"2px 7px", borderRadius:4, cursor:"pointer",
                border:`1px solid ${C.border}`, background:"transparent",
                color:C.muted, fontFamily:"inherit" }}>
              → {c.label}
            </button>
          ))}
          <button onClick={() => deleteCard(a.id)}
            style={{ fontSize:10, padding:"2px 7px", borderRadius:4, cursor:"pointer",
              border:"1px solid #fecaca", background:"transparent",
              color:"#ef4444", fontFamily:"inherit" }}>
            🗑
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {stats.map(([l,v,color]) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:9, padding:"12px 14px" }}>
            <div style={{ fontSize:11, color:C.muted }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:500, color, marginTop:3 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Actions row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <button onClick={() => setShowAll(s=>!s)}
          style={{ fontSize:12, color:C.muted, background:"none", border:"none",
            cursor:"pointer", fontFamily:"inherit" }}>
          {showAll ? "Hide Rejected/No Reply" : "Show all columns"}
        </button>
        <Btn variant="secondary" sm onClick={exportSheets} style={{ borderColor:C.border }}>
          📊 Export to Sheets
        </Btn>
      </div>

      {/* Kanban */}
      {loading ? (
        <div style={{ textAlign:"center", padding:40, color:C.muted, fontSize:13 }}>Loading...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${mainCols.length},1fr)`, gap:12 }}>
          {mainCols.map(col => {
            const cards = apps.filter(a => a.status === col.id)
            return (
              <div key={col.id} style={{ background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:10, padding:10, minHeight:300 }}>
                {/* Column header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginBottom:10, padding:"0 2px" }}>
                  <span style={{ fontSize:11, fontWeight:500, color:col.color,
                    textTransform:"uppercase", letterSpacing:".05em" }}>
                    {col.label}
                  </span>
                  <span style={{ fontSize:11, background:C.bg,
                    border:`1px solid ${C.border}`, borderRadius:100,
                    padding:"1px 7px", color:C.muted }}>
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {cards.length === 0 && (
                    <div style={{ padding:"20px 0", textAlign:"center",
                      fontSize:12, color:C.muted }}>
                      No applications
                    </div>
                  )}
                  {cards.map(a => <KanbanCard key={a.id} a={a} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
