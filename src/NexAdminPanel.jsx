import { useState, useEffect, useRef, useCallback } from "react";
import {
  Key, Sun, Moon, Lock, LogOut, Database, Upload, Search,
  Copy, Check, RefreshCw, Eye, EyeOff, Zap, Shield,
  AlertCircle, CheckCircle, X, Clock, User, ChevronRight,
  Terminal, Package, Activity
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
//  ⚠  PASSWORD CONFIG — Yahan apna password rakh
//     Source code mein visible hai — production ke liye
//     server-side auth use karo (only real protection)
// ═══════════════════════════════════════════════════════════
const ADMIN_PASSWORD = "NexAdmin@2026"; // ← CHANGE KARO

// ═══════════════════════════════════════════════════════════
//  API ENDPOINTS
// ═══════════════════════════════════════════════════════════
const ENV_API  = "https://envapi-nine.vercel.app/api/env";
const KEY_API  = "https://your-key-api.vercel.app/api/keys"; // ← Update karo

// ─── Crypto ─────────────────────────────────────────────
async function sha256(msg) {
  const buf  = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── ENV helpers ────────────────────────────────────────
function textToDict(text) {
  const d = {};
  text.split("\n").forEach(line => {
    const i   = line.indexOf("=");
    if (i < 1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (key) d[key] = val;
  });
  return d;
}
function dictToText(d) {
  return Object.entries(d).map(([k, v]) => `${k}=${v}`).join("\n");
}

// ─── Anti-DevTools (deterrent, not unbreakable) ──────────
function useAntiDebug(active, onDetect) {
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      if (
        window.outerWidth  - window.innerWidth  > 160 ||
        window.outerHeight - window.innerHeight > 160
      ) onDetect();
    }, 2000);
    const noCtx = e => e.preventDefault();
    document.addEventListener("contextmenu", noCtx);
    return () => { clearInterval(id); document.removeEventListener("contextmenu", noCtx); };
  }, [active, onDetect]);
}

// ─── Toast ──────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{ position:"fixed", top:16, right:16, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className={`nex-toast nex-toast-${t.type}`}>
          {t.type === "error"   ? <AlertCircle  size={14}/> :
           t.type === "warning" ? <AlertCircle  size={14}/> :
                                  <CheckCircle  size={14}/>}
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)} className="nex-toast-close"><X size={12}/></button>
        </div>
      ))}
    </div>
  );
}

// ─── Reusable Input ─────────────────────────────────────
function Field({ label, value, onChange, type="text", placeholder, rows, mono=true }) {
  const base = { label, value, onChange, placeholder };
  const cls  = "nex-input" + (mono ? " nex-mono" : "");
  return (
    <div className="nex-field">
      {label && <label className="nex-label">{label}</label>}
      {rows
        ? <textarea {...base} rows={rows} className={cls} style={{resize:"vertical"}}/>
        : <input    {...base} type={type} className={cls}/>
      }
    </div>
  );
}

// ─── Section Card ───────────────────────────────────────
function Card({ icon: Icon, title, sub, children }) {
  return (
    <div className="nex-card nex-fade-in">
      <div className="nex-card-header">
        <div className="nex-icon-wrap"><Icon size={16}/></div>
        <div>
          <div className="nex-card-title">{title}</div>
          {sub && <div className="nex-card-sub">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Btn ────────────────────────────────────────────────
function Btn({ onClick, disabled, loading, children, variant="primary", small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`nex-btn nex-btn-${variant}${small?" nex-btn-sm":""}`}
    >
      {loading ? <><RefreshCw size={13} className="nex-spin"/> Yudh chal raha hai...</> : children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function AdminPanel() {
  const [dark,        setDark]        = useState(true);
  const [authed,      setAuthed]      = useState(false);
  const [tab,         setTab]         = useState("keys");
  const [pw,          setPw]          = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [loginErr,    setLoginErr]    = useState("");
  const [logging,     setLogging]     = useState(false);
  const [toasts,      setToasts]      = useState([]);
  const correctHash = useRef("");

  // Keys
  const [keyName,     setKeyName]     = useState("");
  const [keyDays,     setKeyDays]     = useState("30");
  const [genLoading,  setGenLoading]  = useState(false);
  const [genResult,   setGenResult]   = useState(null);
  const [copied,      setCopied]      = useState(false);

  // ENV
  const [envMode,     setEnvMode]     = useState("upload");
  const [uploadBot,   setUploadBot]   = useState("");
  const [uploadText,  setUploadText]  = useState("");
  const [searchBot,   setSearchBot]   = useState("");
  const [editText,    setEditText]    = useState("");
  const [editVis,     setEditVis]     = useState(false);
  const [envLoad,     setEnvLoad]     = useState(false);

  // Setup hash on mount
  useEffect(() => { sha256(ADMIN_PASSWORD).then(h => { correctHash.current = h; }); }, []);

  const addToast = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);

  useAntiDebug(authed, () => {
    setAuthed(false);
    addToast("⚠️ DevTools detected — session terminated.", "error");
  });

  // ── Login ──
  const handleLogin = async () => {
    if (!pw) return;
    setLogging(true); setLoginErr("");
    await new Promise(r => setTimeout(r, 900));
    const h = await sha256(pw);
    if (h === correctHash.current) { setAuthed(true); setPw(""); }
    else { setLoginErr("Invalid credentials. Access denied."); setPw(""); }
    setLogging(false);
  };

  // ── Generate Key ──
  const handleGenKey = async () => {
    if (!keyName || !keyDays) return addToast("Name aur days daalo!", "error");
    setGenLoading(true);
    try {
      const res  = await fetch(`${KEY_API}/generate`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name: keyName.toUpperCase(), days: parseInt(keyDays) })
      });
      const data = await res.json();
      if (res.ok) { setGenResult(data); addToast("✅ License key generated!"); setKeyName(""); }
      else          addToast(data.detail || "Generation failed", "error");
    } catch { addToast("❌ KEY_API unreachable — endpoint configure karo.", "error"); }
    setGenLoading(false);
  };

  const copyKey = async () => {
    if (!genResult?.key) return;
    await navigator.clipboard.writeText(genResult.key);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
    addToast("📋 Key copied to clipboard!");
  };

  // ── ENV ──
  const handleUpload = async () => {
    if (!uploadBot || !uploadText) return addToast("Bot name aur data dono daalo!", "error");
    setEnvLoad(true);
    try {
      const res  = await fetch(`${ENV_API}/upload`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ bot_name: uploadBot, env_data: textToDict(uploadText) })
      });
      const data = await res.json();
      if (res.ok) { addToast("✅ " + data.message); setUploadBot(""); setUploadText(""); }
      else          addToast(data.detail || "Upload failed", "error");
    } catch { addToast("❌ Server error!", "error"); }
    setEnvLoad(false);
  };

  const handleFetch = async () => {
    if (!searchBot) return addToast("Bot name daalo!", "error");
    setEnvLoad(true);
    try {
      const res  = await fetch(`${ENV_API}/${searchBot}`);
      const data = await res.json();
      if (res.ok) { setEditText(dictToText(data.data.env_data)); setEditVis(true); addToast("✅ Data loaded!"); }
      else { setEditVis(false); addToast(data.detail || "Not found", "error"); }
    } catch { addToast("❌ Server error!", "error"); }
    setEnvLoad(false);
  };

  const handleEdit = async () => {
    if (!searchBot || !editText) return;
    setEnvLoad(true);
    try {
      const res  = await fetch(`${ENV_API}/edit/${searchBot}`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ env_data: textToDict(editText) })
      });
      const data = await res.json();
      if (res.ok) addToast("✅ " + data.message);
      else         addToast(data.detail || "Update failed", "error");
    } catch { addToast("❌ Server error!", "error"); }
    setEnvLoad(false);
  };

  const d = dark;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Global CSS + Animations
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Syne:wght@700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Animations ── */
    @keyframes nexFadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
    @keyframes nexFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
    @keyframes nexSpin     { to{transform:rotate(360deg)} }
    @keyframes nexToast    { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:none} }
    @keyframes nexGlitch   {
      0%,90%,100% { clip-path:none; transform:none }
      92%  { clip-path:inset(10% 0 80% 0); transform:translate(-3px,0) }
      94%  { clip-path:inset(50% 0 30% 0); transform:translate(3px,0) }
      96%  { clip-path:inset(80% 0 5%  0); transform:translate(-2px,0) }
    }
    @keyframes nexPulse    { 0%,100%{opacity:.6} 50%{opacity:1} }
    @keyframes nexGrid     { from{background-position:0 0} to{background-position:40px 40px} }
    @keyframes nexOrb      { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(25px,-35px) scale(1.08)} 66%{transform:translate(-18px,20px) scale(.93)} }
    @keyframes nexBlink    { 0%,100%{opacity:1} 50%{opacity:0} }

    .nex-fade-in           { animation: nexFadeUp .45s ease both }
    .nex-fade-in-d1        { animation: nexFadeUp .45s ease .15s both }
    .nex-fade-in-d2        { animation: nexFadeUp .45s ease .30s both }
    .nex-float             { animation: nexFloat 3.5s ease-in-out infinite }
    .nex-spin              { animation: nexSpin 1s linear infinite }
    .nex-glitch            { animation: nexGlitch 5s ease-in-out infinite }
    .nex-pulse             { animation: nexPulse 2s ease infinite }
    .nex-blink             { animation: nexBlink 1s step-end infinite }
    .nex-toast             { animation: nexToast .3s ease }

    /* ── Theme vars (dark default) ── */
    .nex-root {
      --bg:       ${d ? "#06060f"                  : "#f0ede8"};
      --surface:  ${d ? "rgba(8,8,28,.97)"         : "rgba(255,255,255,.97)"};
      --card:     ${d ? "rgba(10,10,32,.85)"       : "#ffffff"};
      --border:   ${d ? "rgba(0,255,180,.13)"      : "rgba(0,0,0,.09)"};
      --accent:   ${d ? "#00ffc8"                  : "#7c3aed"};
      --accent2:  ${d ? "#a855f7"                  : "#2563eb"};
      --text:     ${d ? "#dde6f0"                  : "#0f172a"};
      --muted:    ${d ? "#4a5568"                  : "#9ca3af"};
      --inp:      ${d ? "rgba(0,0,0,.45)"          : "#f8fafc"};
      --inpbdr:   ${d ? "rgba(0,255,180,.18)"      : "#e2e8f0"};
      --glow:     ${d ? "0 0 40px rgba(0,255,180,.12),0 20px 60px rgba(0,0,0,.7)" : "0 4px 30px rgba(0,0,0,.07)"};
      --danger:   #ef4444;
      --warn:     #f59e0b;
      --ok:       ${d ? "#00ffc8" : "#059669"};
      font-family: 'JetBrains Mono', monospace;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    /* ── Layout ── */
    .nex-shell   { display:flex; min-height:100vh; position:relative; }
    .nex-sidebar { position:fixed; top:0; left:0; height:100vh; width:228px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; z-index:100; transition:transform .3s; }
    .nex-main    { flex:1; margin-left:228px; min-height:100vh; }
    .nex-header  { padding:20px 32px; border-bottom:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:space-between; backdrop-filter:blur(20px); }
    .nex-content { padding:32px; max-width:920px; }
    .nex-mnav   { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:8px 12px; z-index:100; }

    @media(max-width:768px){
      .nex-sidebar  { transform:translateX(-100%); }
      .nex-main     { margin-left:0; padding-bottom:72px; }
      .nex-mnav    { display:flex; align-items:center; justify-content:space-around; }
      .nex-content  { padding:20px 16px; }
      .nex-2col     { grid-template-columns:1fr !important; }
    }

    /* ── Grid BG ── */
    .nex-grid-bg {
      position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:
        linear-gradient(rgba(0,255,180,.022) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,180,.022) 1px, transparent 1px);
      background-size:40px 40px;
      animation: nexGrid 6s linear infinite;
    }

    /* ── Dashboard Orbs ── */
    .nex-dash-orb1 {
      position:fixed; top:-80px; left:160px;
      width:500px; height:500px;
      background:radial-gradient(circle, rgba(0,255,180,.13) 0%, transparent 70%);
      border-radius:50%; filter:blur(40px);
      animation:nexOrb 11s ease-in-out infinite;
      pointer-events:none; z-index:0;
    }
    .nex-dash-orb2 {
      position:fixed; bottom:-100px; right:80px;
      width:420px; height:420px;
      background:radial-gradient(circle, rgba(168,85,247,.12) 0%, transparent 70%);
      border-radius:50%; filter:blur(50px);
      animation:nexOrb 14s ease-in-out infinite reverse;
      pointer-events:none; z-index:0;
    }
    .nex-dash-orb3 {
      position:fixed; top:40%; left:40%;
      width:300px; height:300px;
      background:radial-gradient(circle, rgba(59,130,246,.07) 0%, transparent 70%);
      border-radius:50%; filter:blur(60px);
      animation:nexOrb 18s ease-in-out 3s infinite;
      pointer-events:none; z-index:0;
    }

    /* ── Scanline sweep (dark only) ── */
    @keyframes nexScan {
      0%   { transform:translateY(-100%); opacity:.4; }
      100% { transform:translateY(100vh); opacity:0; }
    }
    .nex-scanline {
      position:fixed; left:0; right:0; height:2px;
      background:linear-gradient(90deg,transparent,rgba(0,255,180,.35),transparent);
      animation:nexScan 6s linear infinite;
      pointer-events:none; z-index:1;
    }

    /* ── Sidebar glow line ── */
    .nex-sidebar::after {
      content:'';
      position:absolute; top:0; right:-1px; width:1px; height:100%;
      background:linear-gradient(to bottom, transparent, rgba(0,255,180,.4) 30%, rgba(168,85,247,.3) 70%, transparent);
      animation:nexPulse 3s ease-in-out infinite;
    }

    /* ── Card hover lift ── */
    .nex-card { transition:transform .2s, box-shadow .2s; }
    .nex-card:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,255,180,.08) !important; }

    /* ── Accent border glow on focused inputs ── */
    .nex-input:focus {
      border-color:var(--accent) !important;
      box-shadow:0 0 0 3px rgba(0,255,180,.08), 0 0 20px rgba(0,255,180,.06) !important;
    }

    /* ── Nav active glow ── */
    .nex-navbtn.active {
      box-shadow:0 0 20px rgba(0,255,180,.1);
    }

    /* ── Sidebar nav ── */
    .nex-logo     { padding:26px 20px 22px; border-bottom:1px solid var(--border); }
    .nex-logo-txt { font-family:'Syne',sans-serif; font-weight:900; font-size:17px; letter-spacing:3px; color:var(--text); }
    .nex-logo-sub { font-size:8px; letter-spacing:4px; color:var(--muted); margin-top:2px; }
    .nex-nav      { flex:1; padding:14px 10px; display:flex; flex-direction:column; gap:3px; }
    .nex-navbtn   { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; font-family:inherit; font-size:12.5px; font-weight:500; cursor:pointer; transition:all .18s; border:1px solid transparent; background:none; color:var(--muted); width:100%; text-align:left; letter-spacing:.3px; }
    .nex-navbtn.active { background:rgba(0,255,180,.09); border-color:rgba(0,255,180,.25); color:var(--accent); }
    .nex-navbtn.active-light { background:rgba(124,58,237,.09); border-color:rgba(124,58,237,.25); color:var(--accent); }
    .nex-navbtn:hover:not(.active):not(.active-light) { color:var(--text); background:rgba(255,255,255,.04); }
    .nex-navbot   { padding:14px 10px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:6px; }
    .nex-danger-btn { color:var(--danger) !important; background:rgba(239,68,68,.05) !important; border-color:rgba(239,68,68,.12) !important; }
    .nex-chevron  { margin-left:auto; opacity:.5; }

    /* ── Cards ── */
    .nex-card        { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; margin-bottom:20px; }
    .nex-card-header { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
    .nex-icon-wrap   { width:38px; height:38px; border-radius:10px; background:rgba(0,255,180,.1); border:1px solid rgba(0,255,180,.2); display:flex; align-items:center; justify-content:center; color:var(--accent); flex-shrink:0; }
    .nex-card-title  { font-size:14px; font-weight:700; color:var(--text); }
    .nex-card-sub    { font-size:9px; letter-spacing:2.5px; color:var(--muted); margin-top:3px; }

    /* ── Inputs ── */
    .nex-field  { margin-bottom:16px; }
    .nex-label  { display:block; font-size:9px; letter-spacing:2.5px; color:var(--muted); margin-bottom:7px; }
    .nex-input  { background:var(--inp); border:1px solid var(--inpbdr); color:var(--text); border-radius:8px; padding:10px 14px; width:100%; font-family:inherit; font-size:12.5px; transition:border-color .2s, box-shadow .2s; outline:none !important; }
    .nex-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(0,255,180,.08); }
    .nex-input::placeholder { color:var(--muted); }

    /* ── Buttons ── */
    .nex-btn         { display:inline-flex; align-items:center; gap:7px; font-family:inherit; font-size:12.5px; font-weight:700; letter-spacing:.4px; cursor:pointer; border:none; border-radius:9px; transition:all .18s; padding:11px 20px; }
    .nex-btn:disabled { opacity:.5; cursor:not-allowed; }
    .nex-btn:not(:disabled):hover { transform:translateY(-1px); filter:brightness(1.08); }
    .nex-btn:not(:disabled):active { transform:translateY(0); }
    .nex-btn-primary { background:${d?"linear-gradient(135deg,#00ffc8,#00b89c)":"linear-gradient(135deg,#7c3aed,#6d28d9)"}; color:${d?"#000":"#fff"}; }
    .nex-btn-ghost   { background:transparent; border:1px solid var(--border); color:var(--muted); }
    .nex-btn-warn    { background:linear-gradient(135deg,#f59e0b,#d97706); color:#000; }
    .nex-btn-sm      { padding:8px 14px; font-size:11.5px; }
    .nex-btn-icon    { padding:9px; border-radius:8px; background:var(--inp); border:1px solid var(--inpbdr); color:var(--muted); }

    /* ── Sub-tabs ── */
    .nex-subtabs { display:flex; gap:8px; margin-bottom:22px; }
    .nex-stab    { padding:8px 16px; border-radius:8px; font-family:inherit; font-size:11.5px; font-weight:700; cursor:pointer; border:1px solid var(--border); background:transparent; color:var(--muted); transition:all .18s; letter-spacing:.3px; }
    .nex-stab.on { background:rgba(0,255,180,.1); border-color:rgba(0,255,180,.35); color:var(--accent); }

    /* ── Generated Key box ── */
    .nex-key-box    { background:var(--inp); border:1px solid var(--inpbdr); border-radius:10px; padding:16px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
    .nex-key-code   { font-size:14px; font-weight:700; color:var(--accent); letter-spacing:2px; word-break:break-all; }
    .nex-key-meta   { display:flex; gap:18px; font-size:10.5px; color:var(--muted); flex-wrap:wrap; }
    .nex-key-meta span { display:flex; align-items:center; gap:5px; }
    .nex-result-card { border-color:var(--accent) !important; background:rgba(0,255,180,.04) !important; }

    /* ── Status dot ── */
    .nex-online { display:flex; align-items:center; gap:8px; font-size:10px; color:var(--muted); }
    .nex-dot    { width:7px; height:7px; border-radius:50%; background:#00ffc8; box-shadow:0 0 8px #00ffc8; }

    /* ── Warning note ── */
    .nex-note   { padding:13px 16px; border-radius:10px; font-size:11px; line-height:1.6; }
    .nex-note-warn { background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.22); color:var(--warn); }
    .nex-note-info { background:rgba(59,130,246,.07); border:1px solid rgba(59,130,246,.2); color:#60a5fa; }

    /* ── Toasts ── */
    .nex-toast       { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; font-size:12px; font-weight:500; backdrop-filter:blur(12px); min-width:240px; max-width:340px; }
    .nex-toast-success { background:rgba(0,30,20,.95); border:1px solid rgba(0,255,180,.35); color:#00ffc8; }
    .nex-toast-error   { background:rgba(30,5,5,.95);  border:1px solid rgba(239,68,68,.4);  color:#fca5a5; }
    .nex-toast-warning { background:rgba(30,20,0,.95); border:1px solid rgba(245,158,11,.4); color:#fde68a; }
    .nex-toast-close   { background:none; border:none; cursor:pointer; color:inherit; opacity:.5; padding:2px; margin-left:auto; display:flex; }
    .nex-toast-close:hover { opacity:1; }

    /* ── Login card ── */
    .nex-login-wrap  { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px; position:relative; overflow:hidden; }
    .nex-login-card  { width:100%; max-width:420px; background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:44px 36px; position:relative; z-index:10; }
    .nex-orb1 { position:absolute; top:18%; left:25%; width:320px; height:320px; background:rgba(0,255,180,.05); border-radius:50%; filter:blur(90px); animation:nexOrb 9s ease-in-out infinite; pointer-events:none; }
    .nex-orb2 { position:absolute; bottom:18%; right:20%; width:220px; height:220px; background:rgba(168,85,247,.07); border-radius:50%; filter:blur(70px); animation:nexOrb 12s ease-in-out infinite reverse; pointer-events:none; }

    .nex-pw-wrap { position:relative; }
    .nex-pw-eye  { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted); padding:4px; display:flex; }
    .nex-pw-eye:hover { color:var(--text); }
    .nex-err     { font-size:10.5px; color:var(--danger); margin-top:7px; letter-spacing:.3px; }

    /* ── Mobile nav buttons ── */
    .nex-mnav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; background:none; border:none; cursor:pointer; font-family:inherit; font-size:8px; letter-spacing:2px; padding:4px 10px; border-radius:8px; transition:color .15s; }

    /* ── 2-col grid ── */
    .nex-2col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .nex-row  { display:flex; gap:10px; }
    .nex-row > .nex-field { flex:1; margin-bottom:0; }

    /* ── Divider ── */
    .nex-divider { border:none; border-top:1px solid var(--border); margin:22px 0; }
  `;

  const activeClass = (id) =>
    tab === id ? (d ? "nex-navbtn active" : "nex-navbtn active-light") : "nex-navbtn";

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  LOGIN GATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!authed) return (
    <>
      <style>{css}</style>
      <div className="nex-root nex-login-wrap">
        {d && <div className="nex-grid-bg"/>}
        {d && <><div className="nex-orb1"/><div className="nex-orb2"/></>}

        <div className="nex-login-card nex-fade-in" style={{ boxShadow: d ? "0 0 80px rgba(0,255,180,.08),0 30px 80px rgba(0,0,0,.85)" : "0 20px 60px rgba(0,0,0,.1)" }}>

          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:38 }}>
            <div className="nex-float" style={{ width:62, height:62, margin:"0 auto 16px", background:d?"rgba(0,255,180,.1)":"rgba(124,58,237,.1)", border:`1px solid ${d?"rgba(0,255,180,.3)":"rgba(124,58,237,.3)"}`, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield size={26} style={{ color:"var(--accent)" }}/>
            </div>
            <div className="nex-glitch" style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:26, letterSpacing:3, color:"var(--text)" }}>NEX ADMIN</div>
            <div style={{ fontSize:9, letterSpacing:4, color:"var(--muted)", marginTop:5 }}>SECURE CONTROL PANEL v2.0</div>
          </div>

          {/* Password */}
          <div className="nex-field">
            <label className="nex-label">ACCESS CODE</label>
            <div className="nex-pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={e => { setPw(e.target.value); setLoginErr(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password..."
                className="nex-input"
                style={{ paddingRight:40, borderColor: loginErr ? "var(--danger)" : undefined }}
              />
              <button className="nex-pw-eye" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
            {loginErr && <div className="nex-err">⚠ {loginErr}</div>}
          </div>

          <Btn onClick={handleLogin} disabled={!pw} loading={logging} variant="primary">
            <Lock size={13}/> AUTHENTICATE
          </Btn>

          <button
            onClick={() => setDark(!d)}
            className="nex-btn nex-btn-ghost"
            style={{ width:"100%", marginTop:10, justifyContent:"center" }}
          >
            {d ? <Sun size={13}/> : <Moon size={13}/>}
            {d ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>

          <div style={{ textAlign:"center", marginTop:22, fontSize:9.5, color:"var(--muted)", letterSpacing:.5, lineHeight:1.7 }}>
            🔒 SHA-256 hashed auth &nbsp;•&nbsp; Session-scoped<br/>
            Right-click disabled &nbsp;•&nbsp; DevTools monitored
          </div>
        </div>
      </div>
    </>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  DASHBOARD
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <>
      <style>{css}</style>
      <Toast toasts={toasts} remove={removeToast}/>

      <div className="nex-root nex-shell">
        {d && <div className="nex-grid-bg"/>}

        {/* ── SIDEBAR ── */}
        <aside className="nex-sidebar" style={{ boxShadow: d ? "4px 0 40px rgba(0,0,0,.6)" : "4px 0 20px rgba(0,0,0,.05)" }}>
          <div className="nex-logo">
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, background:d?"rgba(0,255,180,.12)":"rgba(124,58,237,.12)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap size={15} style={{ color:"var(--accent)" }}/>
              </div>
              <div>
                <div className="nex-logo-txt">NEX.</div>
                <div className="nex-logo-sub">ADMIN PANEL</div>
              </div>
            </div>
          </div>

          <nav className="nex-nav">
            <button className={activeClass("keys")} onClick={() => setTab("keys")}>
              <Key size={14}/> License Keys
              {tab==="keys" && <ChevronRight size={12} className="nex-chevron"/>}
            </button>
            <button className={activeClass("env")} onClick={() => setTab("env")}>
              <Database size={14}/> ENV Manager
              {tab==="env" && <ChevronRight size={12} className="nex-chevron"/>}
            </button>
          </nav>

          <div className="nex-navbot">
            <button className="nex-navbtn" onClick={() => setDark(!d)}>
              {d ? <Sun size={14}/> : <Moon size={14}/>}
              {d ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="nex-navbtn nex-danger-btn" onClick={() => setAuthed(false)}>
              <LogOut size={14}/> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="nex-main" style={{ position:"relative", zIndex:1 }}>

          {/* Header */}
          <div className="nex-header">
            <div>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:"var(--text)" }}>
                {tab === "keys" ? "🔑 License Keys" : "📦 ENV Manager"}
              </h1>
              <div style={{ fontSize:9, letterSpacing:3, color:"var(--muted)", marginTop:3 }}>
                {tab === "keys" ? "YUKII DRM — GENERATE & MANAGE LICENSES" : "BOT ENVIRONMENT VARIABLES"}
              </div>
            </div>
            <div className="nex-online">
              <div className="nex-dot nex-pulse"/>
              SECURE SESSION
            </div>
          </div>

          {/* Content */}
          <div className="nex-content">

            {/* ── KEYS TAB ── */}
            {tab === "keys" && (
              <>
                <Card icon={Key} title="Generate License" sub="YUKII-XXXX-XXXX-XXXX-XXXX-XXXX FORMAT">
                  <div className="nex-2col" style={{ marginBottom:18 }}>
                    <div className="nex-field" style={{ marginBottom:0 }}>
                      <label className="nex-label">RECIPIENT NAME</label>
                      <input value={keyName} onChange={e => setKeyName(e.target.value)} placeholder="e.g., SUDEEP" className="nex-input"/>
                    </div>
                    <div className="nex-field" style={{ marginBottom:0 }}>
                      <label className="nex-label">VALIDITY (DAYS)</label>
                      <input value={keyDays} onChange={e => setKeyDays(e.target.value)} type="number" min="1" placeholder="30" className="nex-input"/>
                    </div>
                  </div>
                  <Btn onClick={handleGenKey} loading={genLoading}>
                    <Zap size={13}/> GENERATE KEY
                  </Btn>
                </Card>

                {genResult && (
                  <div className="nex-card nex-result-card nex-fade-in">
                    <div style={{ fontSize:9, letterSpacing:3, color:"var(--accent)", marginBottom:14 }}>✅ KEY GENERATED</div>
                    <div className="nex-key-box">
                      <code className="nex-key-code">{genResult.key}</code>
                      <button onClick={copyKey} className="nex-btn-icon nex-btn" style={{ padding:"7px" }}>
                        {copied ? <Check size={15} style={{ color:"#00ffc8" }}/> : <Copy size={15}/>}
                      </button>
                    </div>
                    <div className="nex-key-meta">
                      <span><User size={11}/>{genResult.name || keyName}</span>
                      <span><Clock size={11}/>{genResult.expires_at || `Expires in ${keyDays} days`}</span>
                      <span><Activity size={11}/>Active</span>
                    </div>
                  </div>
                )}

                <div className="nex-note nex-note-warn" style={{ marginTop:4 }}>
                  ⚠ <strong>KEY_API</strong> set nahi hai — <code>KEY_API</code> variable ko apne Vercel backend URL se update karo (file ke top mein).
                </div>
              </>
            )}

            {/* ── ENV TAB ── */}
            {tab === "env" && (
              <>
                <div className="nex-subtabs">
                  <button className={`nex-stab${envMode==="upload"?" on":""}`} onClick={() => setEnvMode("upload")}>
                    <Upload size={12} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Upload
                  </button>
                  <button className={`nex-stab${envMode==="fetch"?" on":""}`} onClick={() => setEnvMode("fetch")}>
                    <Search size={12} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Fetch & Edit
                  </button>
                </div>

                {envMode === "upload" && (
                  <Card icon={Upload} title="Upload .env Data" sub="NAYA BOT ENV SAVE KARO">
                    <div className="nex-field">
                      <label className="nex-label">BOT NAME</label>
                      <input value={uploadBot} onChange={e => setUploadBot(e.target.value)} placeholder="music_bot" className="nex-input"/>
                    </div>
                    <div className="nex-field">
                      <label className="nex-label">ENV DATA (KEY=VALUE FORMAT)</label>
                      <textarea
                        value={uploadText}
                        onChange={e => setUploadText(e.target.value)}
                        rows={9}
                        placeholder={"API_ID=123456\nAPI_HASH=abcdef\nBOT_TOKEN=123:abc\nMONGO_URI=mongodb+srv://..."}
                        className="nex-input"
                        style={{ resize:"vertical", display:"block" }}
                      />
                    </div>
                    <Btn onClick={handleUpload} loading={envLoad}>
                      <Upload size={13}/> UPLOAD ENV
                    </Btn>
                  </Card>
                )}

                {envMode === "fetch" && (
                  <Card icon={Search} title="Fetch & Edit .env" sub="EXISTING BOT DATA LOAD KARO">
                    <div className="nex-row" style={{ marginBottom:20 }}>
                      <div className="nex-field">
                        <label className="nex-label">BOT NAME</label>
                        <input
                          value={searchBot}
                          onChange={e => setSearchBot(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleFetch()}
                          placeholder="music_bot"
                          className="nex-input"
                        />
                      </div>
                      <div style={{ display:"flex", alignItems:"flex-end", paddingBottom:0 }}>
                        <Btn onClick={handleFetch} loading={envLoad} variant="ghost" small>
                          {envLoad ? <RefreshCw size={13} className="nex-spin"/> : <Search size={13}/>}
                          Fetch
                        </Btn>
                      </div>
                    </div>

                    {editVis && (
                      <div className="nex-fade-in">
                        <hr className="nex-divider"/>
                        <div className="nex-field">
                          <label className="nex-label">EDIT ENV DATA</label>
                          <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            rows={11}
                            className="nex-input"
                            style={{ resize:"vertical", display:"block", borderColor:"rgba(245,158,11,.35)" }}
                          />
                        </div>
                        <Btn onClick={handleEdit} loading={envLoad} variant="warn">
                          <Check size={13}/> SAVE CHANGES
                        </Btn>
                      </div>
                    )}
                  </Card>
                )}

                <div className="nex-note nex-note-info">
                  💡 API endpoint: <code>envapi-nine.vercel.app</code> — upload, fetch, edit operations supported.
                </div>
              </>
            )}
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="nex-mnav">
          {[
            { id:"keys", icon:Key,      label:"KEYS" },
            { id:"env",  icon:Database, label:"ENV"  },
          ].map(({ id, icon:Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="nex-mnav-btn"
              style={{ color: tab===id ? "var(--accent)" : "var(--muted)" }}
            >
              <Icon size={21}/>{label}
            </button>
          ))}
          <button className="nex-mnav-btn" style={{ color:"var(--muted)" }} onClick={() => setDark(!d)}>
            {d ? <Sun size={21}/> : <Moon size={21}/>}
            THEME
          </button>
          <button className="nex-mnav-btn" style={{ color:"var(--danger)" }} onClick={() => setAuthed(false)}>
            <LogOut size={21}/>EXIT
          </button>
        </nav>
      </div>
    </>
  );
}
