import { NavLink } from 'react-router-dom'
import { usePortal } from '../store'

export function Sidebar({ role, logoMark, accentColor, navItems, portalLinks, userName, userRole }) {
  const { unreadCount } = usePortal()

  return (
    <aside className="portal-sidebar">
      {/* Logo */}
      <div className="portal-sidebar__logo">
        <div className="portal-sidebar__logo-mark" style={{ background: accentColor, color: '#fff' }}>
          {logoMark}
        </div>
        <div className="portal-sidebar__logo-text">
          {role}
          <span>NLP Group Nội bộ</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="portal-sidebar__nav">
        {navItems.map(section => (
          <div key={section.section}>
            <div className="portal-nav-section">{section.section}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `portal-nav-item${isActive ? ' active' : ''}`}
              >
                <span className="portal-nav-item__icon">{item.icon}</span>
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className="portal-nav-item__badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="portal-sidebar__footer">
        <div className="portal-links-group">
          {portalLinks.map(l => (
            <NavLink key={l.to} to={l.to} className="portal-link-btn">{l.icon} {l.label}</NavLink>
          ))}
        </div>
        <div className="portal-user">
          <div className="portal-user__avatar" style={{ background: accentColor }}>{userName.slice(0,2)}</div>
          <div className="portal-user__info">
            {userName}
            <span>{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function Topbar({ title, sub, children }) {
  return (
    <div className="portal-topbar">
      <div>
        <p className="portal-topbar__title">{title}</p>
        {sub && <p className="portal-topbar__sub">{sub}</p>}
      </div>
      <div className="portal-topbar__actions">{children}</div>
    </div>
  )
}
