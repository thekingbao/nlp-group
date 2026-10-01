import { TlpBadge, SectionHeader } from './Primitives'

const TOKENS = [
  { name: '--color-bg-primary',    hex: '#0D1117', role: 'Nền canvas bản đồ và nền chính toàn app', type: 'bg' },
  { name: '--color-surface-card',  hex: '#161B22', role: 'Nền Bottom Sheet, Modal, Card chi tiết trạm', type: 'bg' },
  { name: '--color-surface-raised',hex: '#22272E', role: 'Thanh tìm kiếm nổi, ô nhập liệu', type: 'bg' },
  { name: '--color-border-subtle', hex: '#30363D', role: 'Viền ngăn cách card, thanh navigation đáy', type: 'border' },
  { name: '--primitive-brand-teal',hex: '#49DBC8', role: 'Màu thương hiệu chính, nút CTA, thanh tiến trình sạc', type: 'brand' },
  { name: '--primitive-brand-green',hex: '#BEFF6C', role: 'Năng lượng sạc, cổng sạc sẵn sàng phục vụ', type: 'brand' },
  { name: '--tlp-safe',            hex: '#00D68F', role: 'TLP Safe — trụ online OCPP, có giao dịch < 15 phút', type: 'tlp' },
  { name: '--tlp-caution',         hex: '#FFAA00', role: 'TLP Caution — không có phiên sạc > 4h, xe xăng lấn', type: 'tlp' },
  { name: '--tlp-blocked',         hex: '#FF3D71', role: 'TLP Blocked — mất tín hiệu, hỏng ngàm, cúp điện', type: 'tlp' },
  { name: '--tlp-system',          hex: '#57606A', role: 'TLP System — bảo trì định kỳ, mạng lưới nội bộ', type: 'tlp' },
]

const TYPE_MAP = {
  bg: '#1C2128', border: '#2d3d52', brand: '#0d2626', tlp: '#1a1a2e',
}

export default function TokensSection() {
  return (
    <section className="evkit-section" id="tokens">
      <div className="evkit-container">
        <SectionHeader
          label="Design Tokens"
          title="Hệ thống Design Tokens chuẩn hóa"
          desc="CSS Custom Properties định nghĩa toàn bộ màu sắc semantic — từ nền bản đồ đến 4 cấp độ TLP Trust Level."
        />

        <div style={{ marginTop: 'var(--ev-sp4)' }}>
          {/* TLP visual preview */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 'var(--ev-sp3)' }}>
            {['safe','caution','blocked','system'].map(l => (
              <div key={l} className="evkit-card ev-reveal" style={{ flex: 1, minWidth: 160, padding: 'var(--ev-sp2)', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                <TlpBadge level={l} />
                <div style={{ fontSize: '.75rem', color: 'var(--ev-muted)', lineHeight: 1.5 }}>
                  {{
                    safe: 'Trụ online OCPP + giao dịch < 15p + chỗ trống',
                    caution: 'Không có phiên sạc > 4h hoặc có xe xăng lấn',
                    blocked: 'Mất tín hiệu / hỏng ngàm / trạm mất điện',
                    system: 'Bảo trì định kỳ / mạng lưới nội bộ restricted',
                  }[l]}
                </div>
              </div>
            ))}
          </div>

          {/* Full token table */}
          <div className="evkit-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="token-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Preview</th>
                  <th>Hex</th>
                  <th>Mục đích sử dụng</th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map(t => (
                  <tr key={t.name}>
                    <td><span className="token-name">{t.name}</span></td>
                    <td>
                      <div
                        className="color-swatch"
                        style={{ background: t.hex }}
                        title={t.hex}
                      />
                    </td>
                    <td><span className="token-hex">{t.hex}</span></td>
                    <td style={{ fontSize: '.8rem', color: 'var(--ev-muted)', maxWidth: 280 }}>{t.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
