// Shared badge component using VNKR tokens + portal.css classes

export const STATUS_MAP = {
  active:     ['badge-green',  '● Đang vận hành'],
  installing: ['badge-blue',   '● Đang lắp đặt'],
  pending:    ['badge-yellow', '● Chờ triển khai'],
  completed:  ['badge-gray',   '● Hoàn thành'],
  approved:   ['badge-green',  '✅ Đã duyệt'],
  review:     ['badge-purple', '🔍 Đang xét'],
  missing:    ['badge-red',    '❌ Thiếu hồ sơ'],
  draft:      ['badge-blue',   '📝 Bản nháp'],
  signed:     ['badge-green',  '✍️ Đã ký'],
  paid:       ['badge-green',  '✅ Đã thu'],
  overdue:    ['badge-red',    '🔴 Quá hạn'],
  solar:      ['badge-yellow', '☀️ Solar'],
  ev:         ['badge-blue',   '⚡ EV'],
  full:       ['badge-gray',   'Thanh lý'],
  deposit:    ['badge-gray',   'Đặt cọc'],
  progress:   ['badge-gray',   'Đợt %'],
}

export function Badge({ status, label }) {
  const [cls, defaultLabel] = STATUS_MAP[status] || ['badge-gray', status]
  return (
    <span className={`badge-status ${cls}`}>
      <span className="badge-dot" />
      {label ?? defaultLabel}
    </span>
  )
}

export function ProgressBar({ value, color }) {
  const bg = color || (value === 100 ? 'var(--success)' : value > 60 ? 'var(--brand-alt)' : 'var(--warning)')
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%`, background: bg }} />
    </div>
  )
}

export function KpiCard({ label, value, sub, icon, color, barColor }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__bar" style={{ background: barColor || color || 'var(--brand-alt)' }} />
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value" style={{ color: color || 'var(--text)' }}>{value}</div>
      {sub && <div className="kpi-card__sub">{sub}</div>}
      {icon && <div className="kpi-card__icon">{icon}</div>}
    </div>
  )
}

export function Panel({ title, actions, children, style }) {
  return (
    <div className="panel" style={style}>
      {(title || actions) && (
        <div className="panel__header">
          <h3 className="panel__title">{title}</h3>
          {actions && <div className="panel__actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function LiveNotif({ msg, color = 'var(--info)', bg = 'rgba(30,111,165,.08)', border = 'rgba(30,111,165,.25)' }) {
  if (!msg) return null
  return (
    <div className="live-notif" style={{ background: bg, border: `1px solid ${border}`, color }}>
      <span>🔔</span>
      <span>{msg}</span>
    </div>
  )
}

export function FilterRow({ filters, active, onChange }) {
  return (
    <div className="filter-row">
      <span className="filter-row__label">Lọc:</span>
      {filters.map(f => (
        <button
          key={f.value}
          className={`filter-chip${active === f.value ? ' active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export function Drawer({ open, onClose, title, sub, children }) {
  return (
    <>
      <div className={`portal-overlay${open ? ' show' : ''}`} onClick={onClose} />
      <div className={`portal-drawer${open ? ' open' : ''}`}>
        <div className="portal-drawer__header">
          <div>
            <div className="portal-drawer__title">{title}</div>
            {sub && <div className="portal-drawer__sub">{sub}</div>}
          </div>
          <button className="vnkr-btn vnkr-btn--outline btn-sm" onClick={onClose}>✕ Đóng</button>
        </div>
        <div className="portal-drawer__body">{children}</div>
      </div>
    </>
  )
}
