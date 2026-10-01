// ── Shared primitives for EV Kit UI ──────────────────────────────────────

export function TlpBadge({ level }) {
  const map = {
    safe:    { cls: 'tlp-safe',    dot: '#00D68F', label: 'TLP Safe' },
    caution: { cls: 'tlp-caution', dot: '#FFAA00', label: 'TLP Caution' },
    blocked: { cls: 'tlp-blocked', dot: '#FF3D71', label: 'TLP Blocked' },
    system:  { cls: 'tlp-system',  dot: '#57606A', label: 'TLP System' },
  }
  const t = map[level] || map.system
  return (
    <span className={`tlp-badge ${t.cls}`}>
      <span className="tlp-dot" style={{ background: t.dot }} />
      {t.label}
    </span>
  )
}

export function PowerTag({ kw }) {
  return <span className="power-tag">⚡ {kw}kW</span>
}

export function ConnectorChip({ type }) {
  const icons = { CCS2: '🔌', 'Type 2': '🔋', 'GB/T': '⚡', CHAdeMO: '🔋' }
  return <span className="connector-chip">{icons[type] || '🔌'} {type}</span>
}

export function SectionHeader({ label, title, desc, center }) {
  return (
    <div style={center ? { textAlign: 'center' } : {}}>
      <div className="evkit-section-label"><span className="evkit-section-dot" />{label}</div>
      <h2 className="evkit-section-title">{title}</h2>
      <div className="evkit-divider" style={center ? { margin: '0 auto var(--ev-sp3)' } : {}} />
      {desc && <p className="evkit-section-desc" style={center ? { margin: '0 auto' } : {}}>{desc}</p>}
    </div>
  )
}

// ── Phone mockup shell ─────────────────────────────────────────────────
export function PhoneFrame({ children, width = 200, main = false, style }) {
  return (
    <div
      className={`phone-frame${main ? ' phone-frame-main' : ''}`}
      style={{ width, boxShadow: main ? '0 32px 80px rgba(0,0,0,.7),0 0 40px rgba(73,219,200,.08),0 0 0 1px rgba(73,219,200,.12)' : undefined, ...style }}
    >
      <div className="phone-notch" />
      <div className="phone-screen">{children}</div>
    </div>
  )
}

// ── Map Hub screen mockup ─────────────────────────────────────────────
export function MapHubScreen() {
  return (
    <div style={{ background: '#0D1117', padding: 8, minHeight: 340, fontSize: 7, fontFamily: 'var(--ev-font)', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#49DBC8', fontWeight: 700, letterSpacing: '.05em', fontSize: 8 }}>NLP-EGREEN</span>
        <span style={{ color: '#57606A', fontSize: 7 }}>9:41 AM</span>
      </div>
      {/* Search bar */}
      <div style={{ background: '#22272E', border: '1px solid #30363D', borderRadius: 10, padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 8, color: '#49DBC8' }}>🔍</span>
        <span style={{ color: '#57606A', fontSize: 7 }}>Tìm trạm sạc gần đây...</span>
      </div>
      {/* Map area */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#0f1e16 0%,#0a1a20 100%)', borderRadius: 10, minHeight: 180, position: 'relative', overflow: 'hidden' }}>
        {/* Grid lines */}
        {[20,50,80].map(y => <div key={y} style={{ position:'absolute', top:`${y}%`, left:0, right:0, height:1, background:'rgba(73,219,200,.04)' }} />)}
        {[20,50,80].map(x => <div key={x} style={{ position:'absolute', left:`${x}%`, top:0, bottom:0, width:1, background:'rgba(73,219,200,.04)' }} />)}
        {/* Pins */}
        <MapPin x={30} y={35} color="#00D68F" pulse />
        <MapPin x={55} y={50} color="#00D68F" />
        <MapPin x={70} y={28} color="#FFAA00" />
        <MapPin x={42} y={65} color="#FF3D71" />
        <MapPin x={20} y={55} color="#57606A" />
        {/* User dot */}
        <div style={{ position:'absolute', left:'47%', top:'48%', width:8, height:8, borderRadius:'50%', background:'#49DBC8', boxShadow:'0 0 8px rgba(73,219,200,.8)', border:'1.5px solid #0D1117' }} />
      </div>
      {/* Bottom bar */}
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: 10, padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#49DBC8', fontSize: 8, fontWeight: 700 }}>🗺 Bản đồ</span>
        <span style={{ color: '#57606A', fontSize: 8 }}>⏱ Lộ trình</span>
        <span style={{ color: '#57606A', fontSize: 8 }}>👤 Tài khoản</span>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#49DBC8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⚡</div>
      </div>
    </div>
  )
}

function MapPin({ x, y, color, pulse }) {
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
      {pulse && <div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:`1px solid ${color}`, animation:'none', opacity:.4 }} />}
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '1.5px solid #0D1117', boxShadow: `0 0 6px ${color}66` }} />
    </div>
  )
}

// ── Station Detail screen ─────────────────────────────────────────────
export function StationDetailScreen() {
  return (
    <div style={{ background: '#161B22', padding: 8, minHeight: 340, fontSize: 8, fontFamily: 'var(--ev-font)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 7, color: '#49DBC8' }}>←</span>
        <span style={{ fontWeight: 700, fontSize: 8 }}>NLP Charging Hub Q1</span>
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ background: 'rgba(0,214,143,.12)', color: '#00D68F', border: '1px solid rgba(0,214,143,.25)', borderRadius: 3, padding: '2px 5px', fontSize: 7, fontWeight: 700 }}>● TLP SAFE</span>
        <span style={{ background: 'rgba(73,219,200,.1)', color: '#49DBC8', borderRadius: 3, padding: '2px 5px', fontSize: 7, fontWeight: 700, fontFamily: 'monospace' }}>⚡ 180kW</span>
      </div>
      {/* Slot layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {[
          { id:'A1', kw:180, status:'available', label:'Sẵn sàng', color:'#BEFF6C' },
          { id:'A2', kw:180, status:'charging', label:'Đang sạc 62%', color:'#FFAA00' },
          { id:'B1', kw:60, status:'available', label:'Sẵn sàng', color:'#BEFF6C' },
          { id:'B2', kw:60, status:'blocked', label:'Mất tín hiệu', color:'#FF3D71' },
        ].map(s => (
          <div key={s.id} style={{ background: '#22272E', borderRadius: 6, padding: '5px 6px', border: `1px solid ${s.color}33` }}>
            <div style={{ fontWeight: 700, fontSize: 7, color: s.color }}>{s.id}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 7, color: '#8B949E' }}>{s.kw}kW CCS2</div>
            <div style={{ fontSize: 7, color: s.color, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Amenities */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['☕', '🚻', '🌐', '🅿️'].map(i => (
          <span key={i} style={{ background: '#22272E', border: '1px solid #30363D', borderRadius: 6, padding: '3px 6px', fontSize: 10 }}>{i}</span>
        ))}
      </div>
      <button style={{ background: '#49DBC8', color: '#000', borderRadius: 12, padding: '6px', fontSize: 8, fontWeight: 700, border: 'none', marginTop: 'auto' }}>
        ⚡ Bắt đầu sạc — Cổng A1
      </button>
    </div>
  )
}

// ── Active Charge HUD ─────────────────────────────────────────────────
export function ChargeHUDScreen() {
  return (
    <div style={{ background: '#0D1117', padding: 8, minHeight: 340, fontSize: 8, fontFamily: 'var(--ev-font)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 8, alignSelf: 'stretch' }}>Đang sạc · Cổng A1</div>
      {/* SVG Progress Ring */}
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#22272E" strokeWidth="7" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#49DBC8" strokeWidth="7"
            strokeDasharray={`${2 * Math.PI * 42 * 0.74} ${2 * Math.PI * 42}`}
            strokeDashoffset={2 * Math.PI * 42 * 0.25}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#E6EDF3', lineHeight: 1 }}>74%</span>
          <span style={{ fontSize: 7, color: '#49DBC8', fontWeight: 600 }}>SoC</span>
        </div>
      </div>
      {/* Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, alignSelf: 'stretch' }}>
        {[
          { label: 'Điện áp', val: '385V', unit: '' },
          { label: 'Dòng điện', val: '195A', unit: '' },
          { label: 'Công suất', val: '75.2', unit: 'kW' },
        ].map(t => (
          <div key={t.label} style={{ background: '#22272E', borderRadius: 6, padding: '5px 4px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 9, color: '#49DBC8' }}>{t.val}<span style={{ color: '#8B949E', fontSize: 7 }}>{t.unit}</span></div>
            <div style={{ fontSize: 6.5, color: '#57606A', marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>
      {/* Cost */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 8, padding: '5px 8px', alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 7, color: '#8B949E' }}>Chi phí tạm tính</span>
        <span style={{ fontSize: 8, fontWeight: 700, color: '#BEFF6C', fontFamily: 'monospace' }}>45.800 VNĐ</span>
      </div>
      {/* Emergency slider */}
      <div style={{ alignSelf: 'stretch', background: 'rgba(255,61,113,.08)', border: '1px solid rgba(255,61,113,.25)', borderRadius: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF3D71', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 }}>⏹</div>
        <span style={{ fontSize: 7, color: '#FF3D71', fontWeight: 600 }}>← Trượt để ngắt sạc khẩn cấp</span>
      </div>
    </div>
  )
}
