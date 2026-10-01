import { SectionHeader } from './Primitives'

const PRINCIPLES = [
  { icon: '🌙', title: 'Dark Mode First', desc: 'Nền canvas tối #0D1117 – chống chói mắt khi lái ban đêm, tiết kiệm pin OLED/AMOLED tối đa.' },
  { icon: '⚡', title: 'Driver-centric Interaction', desc: 'Touch target tối thiểu 48×48dp. Tác vụ quan trọng hoàn tất trong 1–2 chạm, kể cả khi xe đang chạy.' },
  { icon: '🎯', title: 'Real-time Truth', desc: 'Dữ liệu TLP xác thực đa nguồn (OCPP + crowdsource + AI). Không hiển thị trạng thái "Available" nếu chưa xác thực < 15 phút.' },
  { icon: '🔤', title: 'Work Sans + JetBrains Mono', desc: 'Font kỹ thuật số độ đọc cao – các chỉ số điện áp/dòng điện dùng monospace để canh hàng hoàn hảo.' },
  { icon: '🖥️', title: 'Viewport Culling Rendering', desc: 'Chỉ render trạm trong bán kính tầm nhìn bản đồ, giảm 70% RAM/GPU. Duy trì 60/120fps tại đô thị mật độ cao.' },
  { icon: '🔒', title: 'Zero-Lock Escrow', desc: 'Tiền sạc giữ trong escrow theo block 10.000đ. Sự cố ngắt điện → hoàn tiền tức thì, không khoá cọc.' },
]

export default function PrinciplesSection() {
  return (
    <section className="evkit-section" id="principles">
      <div className="evkit-container">
        <SectionHeader
          label="Nguyên tắc thiết kế"
          title="6 Design Principles cốt lõi"
          desc="Mọi quyết định thiết kế đều có nguồn gốc từ ngữ cảnh thực tế của tài xế xe điện Việt Nam."
        />
        <div className="ev-grid-3" style={{ marginTop: 'var(--ev-sp4)' }}>
          {PRINCIPLES.map((p, i) => (
            <div key={i} className={`principle-card ev-reveal ev-d${(i % 4) + 1}`}>
              <div className="principle-icon">{p.icon}</div>
              <div className="principle-title">{p.title}</div>
              <div className="principle-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
