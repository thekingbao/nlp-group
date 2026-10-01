import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './evkit.css'
import { TlpBadge, PhoneFrame, MapHubScreen, StationDetailScreen, ChargeHUDScreen } from './Primitives'
import PrinciplesSection from './Principles'
import TokensSection     from './Tokens'
import ComponentsSection from './Components'
import ModulesSection    from './Modules'
import SprintSection     from './Sprints'

// ── Reveal on scroll ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.ev-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function EVKitPage() {
  useReveal()

  return (
    <div className="evkit-root">
      {/* ── Navbar ── */}
      <nav className="evkit-nav">
        <div className="evkit-nav__inner">
          <div className="evkit-logo">
            <div className="evkit-logo__mark">⚡</div>
            <span>NLP-<em>EGREEN</em> UI Kit</span>
          </div>
          <ul className="evkit-nav__links">
            <li><a href="#principles">Nguyên tắc</a></li>
            <li><a href="#tokens">Tokens</a></li>
            <li><a href="#components">Components</a></li>
            <li><a href="#modules">Modules</a></li>
            <li><a href="#sprints">Sprint Plan</a></li>
          </ul>
          <Link to="/" className="ev-btn ev-btn-outline" style={{ padding: '6px 14px', fontSize: '.8rem' }}>← Cổng nội bộ</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="evkit-hero">
        <div className="evkit-container">
          <div className="evkit-hero__inner">
            {/* Left */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--ev-sp3)' }}>
                <TlpBadge level="safe" />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 4, fontSize: '.72rem', fontWeight: 700, background: 'rgba(73,219,200,.1)', border: '1px solid rgba(73,219,200,.2)', color: 'var(--ev-teal)' }}>
                  @vnkr-labs/ui-kit
                </span>
              </div>
              <h1 className="evkit-hero__title">
                <span style={{ color: 'var(--ev-teal)' }}>Real-time Truth.</span>
                <br />
                <span style={{ color: 'var(--ev-green)' }}>Zero Anxiety.</span>
                <br />
                <span style={{ fontSize: '60%', color: 'var(--ev-muted)', fontWeight: 500 }}>NLP-EGREEN Design System</span>
              </h1>
              <p className="evkit-hero__slogan">
                Kế hoạch triển khai UI/UX cho ứng dụng sạc xe điện thế hệ mới — từ Design Tokens đến prototype Flutter hoàn chỉnh với giao thức xác thực thực địa <strong style={{ color: 'var(--ev-text)' }}>TLP (Trust Level Protocol)</strong>.
              </p>
              <div className="evkit-hero__ctas">
                <a href="#tokens" className="ev-btn ev-btn-teal">🎨 Xem Design Tokens</a>
                <a href="#sprints" className="ev-btn ev-btn-outline">📅 Sprint Roadmap</a>
              </div>
              <div className="evkit-stat-row">
                {[
                  { val: '4',  lbl: 'Sprint' },
                  { val: '8',  lbl: 'Tuần' },
                  { val: '6',  lbl: 'Modules' },
                  { val: '10', lbl: 'Tokens màu' },
                ].map(s => (
                  <div key={s.lbl} className="evkit-stat-pill">
                    <span className="evkit-stat-pill__val">{s.val}</span>
                    <span className="evkit-stat-pill__lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: phone mockups */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'flex-end' }}>
              <PhoneFrame width={170}>
                <MapHubScreen />
              </PhoneFrame>
              <PhoneFrame width={190} main>
                <ChargeHUDScreen />
              </PhoneFrame>
              <PhoneFrame width={170} style={{ transform: 'translateY(20px)' }}>
                <StationDetailScreen />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      <PrinciplesSection />
      <TokensSection />
      <ComponentsSection />
      <ModulesSection />
      <SprintSection />

      {/* ── Footer ── */}
      <footer className="evkit-footer">
        <div className="evkit-container">
          <div className="evkit-footer__inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="evkit-logo__mark" style={{ width: 24, height: 24, fontSize: 11 }}>⚡</div>
              <span style={{ fontWeight: 700, fontSize: '.875rem' }}>NLP-<em style={{ color: 'var(--ev-teal)', fontStyle: 'normal' }}>EGREEN</em></span>
              <TlpBadge level="safe" />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span className="evkit-footer__copy">Design System v2.0</span>
              <span className="evkit-footer__copy">@vnkr-labs/ui-kit</span>
              <span className="evkit-footer__copy">Dark Mode Only · Work Sans</span>
            </div>
            <Link to="/" className="evkit-footer__copy" style={{ color: 'var(--ev-teal)' }}>← Cổng nội bộ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
