import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, var(--success), #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#000', margin: '0 auto 16px' }}>N</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text)' }}>Cổng Nội bộ NLP Group</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.95rem', margin: 0 }}>Hệ thống quản trị nội bộ — Admin · Pháp chế · Tài chính</p>
        <span className="badge badge-blue" style={{ marginTop: 10, display: 'inline-flex' }}>
          <span className="badge-dot" />React + Vanilla CSS
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, width: '100%', maxWidth: 880, marginBottom: 16 }}>
        <PortalCard to="/admin/dashboard" icon="📊" name="Admin Dashboard"    desc="Tổng quan toàn bộ dự án, hóa đơn, pháp lý và tài chính."                                                              tag="Quản trị hệ thống"       color="var(--success)" />
        <PortalCard to="/legal/overview"  icon="⚖️" name="Phòng Pháp chế"     desc="Quản lý hồ sơ pháp lý, hợp đồng EPC, giấy phép và phê duyệt."                                                        tag="Pháp lý & Hợp đồng"      color="#7c3aed" />
        <PortalCard to="/finance/dashboard" icon="💰" name="Phòng Tài chính"  desc="Theo dõi dòng tiền, ghi nhận thanh toán, phân tích công nợ."                                                          tag="Kế toán & Dòng tiền"     color="var(--brand-alt)" />
      </div>

      <div style={{ width: '100%', maxWidth: 880 }}>
        <PortalCard to="/evkit" icon="⚡" name="NLP-EGREEN UI Kit" desc="Kế hoạch thiết kế Design System & Sprint Roadmap cho app sạc xe điện — TLP Protocol, Design Tokens, 6 Modules, Flutter prototype." tag="Sprint Roadmap · UI Kit" color="#49DBC8" />
      </div>

      <div style={{ marginTop: 40, fontSize: '.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        NLP Group · Hệ thống quản trị nội bộ · React + Vanilla CSS
      </div>
    </div>
  )
}

function PortalCard({ to, icon, name, desc, tag, color }) {
  return (
    <Link
      to={to}
      style={{ display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', textAlign: 'center', textDecoration: 'none', color: 'var(--text)', transition: 'all .25s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color }}
      onMouseLeave={e => { e.currentTarget.style.transform = '';                 e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, borderRadius: '16px 16px 0 0' }} />
      <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{name}</div>
      <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{desc}</div>
      <span className="badge badge-blue" style={{ borderColor: color, color }}>
        <span className="badge-dot" style={{ background: color }} />{tag}
      </span>
    </Link>
  )
}
