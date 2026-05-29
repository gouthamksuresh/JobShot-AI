// ── Shared reusable components ───────────────────────

export function Btn({ children, onClick, variant="primary", disabled=false, style={}, sm=false }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:6,
    padding: sm ? "5px 12px" : "8px 16px",
    fontSize: sm ? 12 : 13, fontFamily:"inherit", fontWeight:500,
    borderRadius:7, cursor: disabled ? "not-allowed" : "pointer",
    border:"none", transition:"all .15s", opacity: disabled ? 0.5 : 1,
  }
  const variants = {
    primary:   { background:"#1A6AFF", color:"#fff" },
    secondary: { background:"transparent", color:"inherit", border:"1px solid var(--c-border, #e5e7eb)" },
    success:   { background:"#16a34a", color:"#fff" },
    danger:    { background:"transparent", color:"#ef4444", border:"1px solid #fecaca" },
  }
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom:13 }}>
      {label && <label style={{ fontSize:12, color:"var(--c-muted)", display:"block", marginBottom:5 }}>{label}</label>}
      {children}
    </div>
  )
}

export function Input({ label, value, onChange, placeholder, type="text", C }) {
  return (
    <Field label={label}>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", padding:"8px 12px", fontSize:13,
          borderRadius:7, border:`1px solid ${C.inputBorder}`,
          background:C.input, color:C.text, fontFamily:"inherit",
          boxSizing:"border-box", outline:"none" }} />
    </Field>
  )
}

export function Textarea({ label, value, onChange, placeholder, rows=4, C }) {
  return (
    <Field label={label}>
      <textarea value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ width:"100%", padding:"8px 12px", fontSize:13,
          borderRadius:7, border:`1px solid ${C.inputBorder}`,
          background:C.input, color:C.text, fontFamily:"inherit",
          boxSizing:"border-box", resize:"vertical", lineHeight:1.6, outline:"none" }} />
    </Field>
  )
}

export function Card({ children, C, style={} }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`,
      borderRadius:10, padding:16, marginBottom:14, ...style }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
      <span style={{ fontSize:13, fontWeight:500 }}>{title}</span>
      {action}
    </div>
  )
}

export function Tab({ id, label, active, onClick }) {
  return (
    <button onClick={() => onClick(id)} style={{
      padding:"8px 16px", fontSize:13, cursor:"pointer",
      border:"none", background:"transparent", fontFamily:"inherit",
      borderBottom: active ? "2px solid #1A6AFF" : "2px solid transparent",
      color: active ? "#1A6AFF" : "var(--c-muted)", fontWeight: active ? 500 : 400,
      marginBottom:-1
    }}>{label}</button>
  )
}

export function Pill({ id, label, active, onClick }) {
  return (
    <button onClick={() => onClick(id)} style={{
      padding:"5px 13px", borderRadius:100, fontSize:12, cursor:"pointer",
      fontFamily:"inherit", border: active ? "none" : "1px solid var(--c-border)",
      background: active ? "#1A6AFF" : "transparent",
      color: active ? "#fff" : "var(--c-muted)", transition:"all .15s"
    }}>{label}</button>
  )
}

export function Badge({ label, variant="blue" }) {
  const colors = {
    blue:  { bg:"#eff6ff", text:"#1d4ed8" },
    green: { bg:"#f0fdf4", text:"#15803d" },
    amber: { bg:"#fffbeb", text:"#b45309" },
    red:   { bg:"#fef2f2", text:"#dc2626" },
    gray:  { bg:"#f8fafc", text:"#64748b" },
    darkBlue:  { bg:"#0d1e3d", text:"#60a5fa" },
    darkGreen: { bg:"#0d2818", text:"#4ade80" },
    darkAmber: { bg:"#2d1b00", text:"#fbbf24" },
    darkRed:   { bg:"#2d0d0d", text:"#f87171" },
    darkGray:  { bg:"#1c2128", text:"#8b949e" },
  }
  const c = colors[variant] || colors.blue
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px",
      borderRadius:100, fontSize:11, fontWeight:500,
      background:c.bg, color:c.text }}>
      {label}
    </span>
  )
}

export function Toast({ msg, type, C }) {
  const icon = type==="success" ? "✅" : type==="error" ? "❌" : "ℹ️"
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999,
      background:C.card, border:`1px solid ${C.border}`,
      borderRadius:8, padding:"10px 16px", fontSize:13, color:C.text,
      display:"flex", alignItems:"center", gap:8,
      boxShadow:"0 4px 24px rgba(0,0,0,0.12)", animation:"slideIn .3s ease" }}>
      <span>{icon}</span> {msg}
    </div>
  )
}

export function Divider({ C }) {
  return <div style={{ height:1, background:C.border, margin:"12px 0" }} />
}

export function PreviewBox({ content, C }) {
  return (
    <div style={{ background:C.codeBg, border:`1px solid ${C.border}`,
      borderRadius:7, padding:14, fontSize:12.5, color:C.sub,
      lineHeight:1.8, whiteSpace:"pre-wrap", minHeight:140,
      fontFamily:"'JetBrains Mono', 'Fira Code', monospace",
      maxHeight:280, overflowY:"auto" }}>
      {content}
    </div>
  )
}

export function ProgressBar({ progress, msg, C }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>{msg}</div>
      <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", background:"#1A6AFF", borderRadius:2,
          width:`${progress}%`, transition:"width .5s ease" }} />
      </div>
    </div>
  )
}

export function ApprovalGate({ approved, onApprove, onDiscard, C }) {
  if (approved) return (
    <div style={{ background: C.card.includes("161") ? "#0d2818" : "#f0fdf4",
      border:"1px solid #16a34a40", borderRadius:7, padding:"12px 14px",
      marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:18 }}>🛡️</span>
      <div>
        <div style={{ fontSize:12, fontWeight:500, color:"#16a34a" }}>Approved — send is now active</div>
        <div style={{ fontSize:11, color:"#16a34a", opacity:.8, marginTop:2 }}>You have reviewed this application</div>
      </div>
    </div>
  )
  return (
    <div style={{ background: C.card.includes("161") ? "#2d1b00" : "#fffbeb",
      border:"1px solid #f59e0b40", borderRadius:7, padding:"12px 14px",
      marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:18, marginTop:1 }}>⚠️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:500, color:"#b45309" }}>Review required before sending</div>
          <div style={{ fontSize:11, color:"#b45309", opacity:.85, marginTop:3 }}>
            Nothing leaves your machine without your approval. Check all three tabs — resume, cover letter, email — then approve.
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            <button onClick={onApprove} style={{ padding:"6px 14px", fontSize:12,
              borderRadius:6, border:"none", background:"#1A6AFF", color:"#fff",
              cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}>
              ✅ Approve &amp; Enable Send
            </button>
            <button onClick={onDiscard} style={{ padding:"6px 14px", fontSize:12,
              borderRadius:6, border:"1px solid #e5e7eb", background:"transparent",
              color:"inherit", cursor:"pointer", fontFamily:"inherit" }}>
              ✕ Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
