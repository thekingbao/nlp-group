import { SectionHeader } from './Primitives'

const MODULES = [
  {
    icon: '🔑', num: 'Module 01', title: 'Onboarding & Authentication',
    features: [
      'Splash & giới thiệu tính năng Zero Anxiety, TLP Protocol',
      'Đăng nhập qua số điện thoại / Apple ID / Google',
      'OTP verification & cấu hình dòng xe (CCS2, Type 2, GB/T, dung lượng pin)',
    ],
    color: 'var(--ev-teal)',
  },
  {
    icon: '🗺️', num: 'Module 02', title: 'Map Hub & Micro-Navigation',
    features: [
      'Cluster trạm trực quan với ghim phân loại TLP 4 cấp độ',
      'Bottom Sheet tóm tắt: tên, khoảng cách, số trụ trống, công suất đỉnh',
      'Bộ lọc nhanh: 11/30/60/120/240/360kW, chuẩn sạc, mạng lưới',
      'Micro-navigation: ghim chính xác ram dốc, barie, giới hạn chiều cao',
    ],
    color: 'var(--ev-teal)',
  },
  {
    icon: '🏪', num: 'Module 03', title: 'Station Detail & Waitlist',
    features: [
      'Sơ đồ từng trụ A1/A2/B1 với công suất thực tế và trạng thái TLP',
      'Tiện ích xung quanh (Amenities Grid): cà phê, nhà vệ sinh, gym',
      'Hàng chờ ảo (Virtual Waitlist): đếm ngược xe đang sạc từ xa',
      '1-Tap Crowdsource Check-in: xác thực thực địa nhanh nhận điểm thưởng',
    ],
    color: 'var(--ev-green)',
  },
  {
    icon: '⚡', num: 'Module 04', title: 'Active Charging Session HUD',
    features: [
      'Vòng tròn SVG tiến trình % SoC với viền brand-teal',
      'Telemetry vi mô: Điện áp (V), Dòng điện (A), Công suất tức thì (kW)',
      'Dự toán chi phí & đơn giá thời gian thực (Zero-Lock Escrow)',
      'Slider Button ngắt sạc khẩn cấp — chống chạm nhầm',
    ],
    color: 'var(--tlp-safe)',
  },
  {
    icon: '🧭', num: 'Module 05', title: 'Smart Dynamic Route Planner',
    features: [
      'Lập hành trình tính toán theo độ dốc địa hình (Elevation SoC)',
      'Chiến thuật sạc nhanh tối ưu: 10% → 70% thay vì chờ 100%',
      'Cảnh báo pin tụt do thời tiết/tốc độ cao & đề xuất trạm dự phòng',
    ],
    color: 'var(--tlp-caution)',
  },
  {
    icon: '👤', num: 'Module 06', title: 'Profile & Charging History',
    features: [
      'Quản lý ví sạc & thanh toán (MoMo, Thẻ ngân hàng, VETC)',
      'Lịch sử phiên sạc: kWh nạp, thời gian, chi phí, hóa đơn VAT',
      'Báo cáo tiết kiệm chi phí & lượng CO₂ giảm thiểu',
    ],
    color: 'var(--tlp-blocked)',
  },
]

export default function ModulesSection() {
  return (
    <section className="evkit-section" id="modules">
      <div className="evkit-container">
        <SectionHeader
          label="App Architecture"
          title="6 Phân hệ Giao diện"
          desc="Cấu trúc màn hình ứng dụng NLP-EGREEN Mobile — từ onboarding đến lịch sử sạc."
        />
        <div className="ev-grid-3" style={{ marginTop: 'var(--ev-sp4)' }}>
          {MODULES.map((m, i) => (
            <div key={i} className={`module-card ev-reveal ev-d${(i % 4) + 1}`}
              style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="module-icon">{m.icon}</div>
              <div className="module-num">{m.num}</div>
              <div className="module-title">{m.title}</div>
              <div className="module-features">
                {m.features.map((f, j) => (
                  <div key={j} className="module-feature" style={{ '--dot-color': m.color }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Screen flow diagram */}
        <div className="evkit-card" style={{ marginTop: 'var(--ev-sp4)', padding: 'var(--ev-sp3)' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ev-faint)', marginBottom: 'var(--ev-sp2)' }}>
            LUỒNG THAO TÁC — SCREEN FLOW
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Map Hub', color: 'var(--ev-teal)' },
              { label: 'Station Detail', color: 'var(--ev-teal)' },
              { label: 'Micro-Nav', color: 'var(--ev-green)' },
              { label: 'QR / Auto Auth', color: 'var(--ev-green)' },
              { label: 'Active HUD', color: 'var(--tlp-safe)' },
              { label: 'Escrow Settlement', color: 'var(--tlp-caution)' },
            ].map((s, i, arr) => (
              <>
                <div key={`s${i}`} style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--ev-r)',
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}40`,
                  color: s.color,
                  fontSize: '.78rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </div>
                {i < arr.length - 1 && (
                  <span key={`a${i}`} style={{ color: 'var(--ev-faint)', fontSize: '1rem' }}>→</span>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
