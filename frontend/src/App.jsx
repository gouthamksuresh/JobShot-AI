import { useState, useEffect, createContext, useContext } from "react"
import Apply from "./pages/Apply"
import Tracker from "./pages/Tracker"
import Profile from "./pages/Profile"
import { Toast } from "./components/UI"

export const ThemeContext = createContext()
export const ToastContext = createContext()

const NAV = [
  { id:"apply",   icon:"⚡", label:"Apply to Job" },
  { id:"tracker", icon:"⬜", label:"Tracker" },
  { id:"profile", icon:"◎",  label:"My Profile" },
]

export default function App() {
  const [page,  setPage]  = useState("apply")
  const [dark,  setDark]  = useState(() => localStorage.getItem("jobshot-dark") === "true")
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light")
    localStorage.setItem("jobshot-dark", dark)
  }, [dark])

  function showToast(msg, type = "success") {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }

  const C = dark ? DARK : LIGHT

  return (
    <ThemeContext.Provider value={{ dark, C }}>
    <ToastContext.Provider value={showToast}>
      <div style={{ display:"grid", gridTemplateColumns:"210px 1fr", height:"100vh",
        fontFamily:"'Inter', system-ui, sans-serif", background:C.bg, color:C.text }}>

        {/* Sidebar */}
        <aside style={{ background:C.surface, borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column" }}>

          {/* Logo */}
          <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:600, fontSize:15, color:C.text, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ color:"#1A6AFF" }}>⚡</span> JobShot AI
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>Goutham K Suresh</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:8,
              background: dark ? "#0d2818" : "#f0fdf4", border:`1px solid ${dark?"#16a34a30":"#bbf7d0"}`,
              borderRadius:100, padding:"3px 9px", fontSize:10, color:"#16a34a" }}>
              🔒 Local &amp; Secure
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding:"8px 0", flex:1 }}>
            {NAV.map(n => (
              <div key={n.id} onClick={() => setPage(n.id)} style={{
                display:"flex", alignItems:"center", gap:9,
                padding:"9px 16px", fontSize:13, cursor:"pointer",
                color: page===n.id ? "#1A6AFF" : C.muted,
                background: page===n.id ? (dark?"#0d1e3d":"#eff6ff") : "transparent",
                borderLeft: `2.5px solid ${page===n.id ? "#1A6AFF" : "transparent"}`,
                fontWeight: page===n.id ? 500 : 400,
                transition:"all .12s", userSelect:"none"
              }}>
                <span>{n.icon}</span> {n.label}
              </div>
            ))}
          </nav>

          {/* Dark toggle */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:C.muted }}>{dark ? "☀️ Light" : "🌙 Dark"}</span>
            <div onClick={() => setDark(d => !d)} style={{
              width:36, height:20, borderRadius:100, cursor:"pointer", position:"relative",
              background: dark ? "#1A6AFF" : C.border, transition:"background .2s"
            }}>
              <div style={{
                position:"absolute", top:2, left:2, width:16, height:16, borderRadius:"50%",
                background:"#fff", transition:"transform .2s",
                transform: dark ? "translateX(16px)" : "translateX(0)"
              }} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Security bar */}
          <div style={{ padding:"5px 20px", fontSize:11,
            background: dark ? "#0d2818" : "#f0fdf4",
            borderBottom:`1px solid ${dark?"#16a34a20":"#dcfce7"}`,
            color:"#16a34a", display:"flex", alignItems:"center", gap:6 }}>
            🛡️ All data stays on your machine &nbsp;·&nbsp; Nothing sent without your approval &nbsp;·&nbsp; No tracking
          </div>

          {/* Topbar */}
          <div style={{ padding:"14px 22px", borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:500, color:C.text }}>
                {NAV.find(n=>n.id===page)?.label}
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                {page==="apply"   && "Paste a job link — AI tailors everything, you approve before sending"}
                {page==="tracker" && "Kanban board — move cards to update status · Export to Sheets"}
                {page==="profile" && "Resume · Cover letter · JSON brain — all editable"}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 22px" }}>
            {page==="apply"   && <Apply C={C} dark={dark} />}
            {page==="tracker" && <Tracker C={C} dark={dark} />}
            {page==="profile" && <Profile C={C} dark={dark} />}
          </div>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} C={C} />}
      </div>
    </ToastContext.Provider>
    </ThemeContext.Provider>
  )
}

export const LIGHT = {
  bg:"#f9fafb", surface:"#ffffff", border:"#e5e7eb",
  text:"#0f172a", sub:"#374151", muted:"#6b7280",
  input:"#ffffff", inputBorder:"#d1d5db",
  card:"#ffffff", cardBorder:"#e5e7eb",
  codeBg:"#f8fafc", accent:"#1A6AFF",
}

export const DARK = {
  bg:"#0d1117", surface:"#161b22", border:"#30363d",
  text:"#e6edf3", sub:"#c9d1d9", muted:"#8b949e",
  input:"#0d1117", inputBorder:"#30363d",
  card:"#161b22", cardBorder:"#30363d",
  codeBg:"#0d1117", accent:"#1A6AFF",
}
