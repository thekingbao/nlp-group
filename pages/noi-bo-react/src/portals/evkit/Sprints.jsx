import { SectionHeader } from './Primitives'

const SPRINTS = [
  {
    num: 'Sprint 1',
    title: 'Design System Tokens & UI Kit',
    weeks: 'Tuần 1 – 2',
    cls: 'sprint-1',
    color: 'var(--ev-teal)',
    tasks: [
      'Khởi tạo gói @vnkr-labs/icons: SVG chuẩn hóa (súng CCS2, Type 2, TLP icons, EV icons)',
      'Khởi tạo @vnkr-labs/ui-kit: Design Tokens CSS — màu sắc, Work Sans typography, 4/8-point grid',
      'Primitive Components: Button (primary/secondary/slider-stop), BadgeTLP, PowerTag, ConnectorChip',
      'Dark Mode token layer đầy đủ với CSS custom properties',
    ],
    deliverables: ['@vnkr-labs/tokens v1.0', '@vnkr-labs/icons v1.0', 'Figma Token Sheet'],
  },
  {
    num: 'Sprint 2',
    title: 'Wireframe & Màn hình Cốt lõi',
    weeks: 'Tuần 3 – 4',
    cls: 'sprint-2',
    color: 'var(--ev-green)',
    tasks: [
      'Map Hub: Viewport culling, cluster TLP, floating search bar, quick filter bar',
      'Station Details: Sơ đồ slot trực quan, TLP Trust Badge, ảnh ram dốc micro-guide',
      'Active Charging HUD: SVG progress ring, telemetry grid, cost estimator, slider stop',
      'Luồng Waitlist: đăng ký hàng chờ từ xa, countdown timer, push notification',
    ],
    deliverables: ['Figma Wireframes ×3 screens', 'Flutter Widget Spec', 'Interaction Notes'],
  },
  {
    num: 'Sprint 3',
    title: 'Prototype Tương tác & Smart Planner',
    weeks: 'Tuần 5 – 6',
    cls: 'sprint-3',
    color: 'var(--tlp-caution)',
    tasks: [
      'Flutter Prototype Shell: luồng tương tác hoàn chỉnh 6 module',
      'Smart Dynamic Planner: đồ thị elevation SoC, điểm dừng tối ưu 10%→70%',
      '1-Tap Crowdsource Check-in: popup < 3 giây, rewards token/voucher integration',
      'Haptic & Visual feedback: mọi thay đổi TLP < 200ms, smooth animation 60fps',
    ],
    deliverables: ['Flutter Prototype Demo', 'Smart Planner UI', 'Crowdsource flow'],
  },
  {
    num: 'Sprint 4',
    title: 'Đóng gói Demo & Bàn giao Kỹ thuật',
    weeks: 'Tuần 7 – 8',
    cls: 'sprint-4',
    color: 'var(--tlp-blocked)',
    tasks: [
      'Đóng gói source Flutter sạch, chia module theo chuẩn nlp-egreen architecture',
      'Tài liệu kỹ thuật tích hợp SDK Google Maps/Mapbox + OCPP/OCPI API',
      'Backend Telemetry spec: BLE OBD2 / Apple CarKey / Google Auto API',
      'Security review: Escrow flow, Zero-Lock payment, session isolation',
    ],
    deliverables: ['Flutter App Bundle', 'API Integration Docs', 'Backend Spec PDF'],
  },
]

export default function SprintSection() {
  return (
    <section className="evkit-section" id="sprints">
      <div className="evkit-container">
        <SectionHeader
          label="Sprint Roadmap"
          title="Lộ trình Triển khai 8 Tuần"
          desc="Kế hoạch sprint chi tiết từ Design Tokens đến bàn giao prototype Flutter hoàn chỉnh."
          center
        />

        <div className="ev-grid-2" style={{ marginTop: 'var(--ev-sp4)' }}>
          {SPRINTS.map((s, i) => (
            <div key={i} className={`sprint-card ${s.cls} ev-reveal ev-d${(i % 4) + 1}`}>
              <div className="sprint-num">{s.num}</div>
              <div className="sprint-title">{s.title}</div>
              <div className="sprint-weeks">{s.weeks}</div>
              <div className="sprint-tasks">
                {s.tasks.map((t, j) => (
                  <div key={j} className="sprint-task">{t}</div>
                ))}
              </div>
              {/* Deliverables */}
              <div style={{ marginTop: 'var(--ev-sp2)', paddingTop: 10, borderTop: '1px solid var(--ev-border-sm)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {s.deliverables.map((d, j) => (
                  <span key={j} style={{
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}30`,
                    color: s.color,
                    borderRadius: 'var(--ev-r-sm)',
                    padding: '3px 8px',
                    fontSize: '.7rem',
                    fontWeight: 700,
                    fontFamily: 'var(--ev-mono)',
                  }}>
                    📦 {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline bar */}
        <div className="evkit-card" style={{ marginTop: 'var(--ev-sp4)', padding: 'var(--ev-sp3)' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ev-faint)', marginBottom: 'var(--ev-sp2)' }}>
            TIMELINE — 8 TUẦN
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 8 }, (_, i) => {
              const colors = ['var(--ev-teal)','var(--ev-teal)','var(--ev-green)','var(--ev-green)','var(--tlp-caution)','var(--tlp-caution)','var(--tlp-blocked)','var(--tlp-blocked)']
              const sprints = ['S1','S1','S2','S2','S3','S3','S4','S4']
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                  <div style={{ height: 24, width: '100%', borderRadius: 4, background: colors[i] }} />
                  <span style={{ fontSize: '.65rem', color: 'var(--ev-faint)', fontFamily: 'var(--ev-mono)' }}>W{i + 1}</span>
                  <span style={{ fontSize: '.65rem', color: colors[i], fontFamily: 'var(--ev-mono)', fontWeight: 700 }}>{sprints[i]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
