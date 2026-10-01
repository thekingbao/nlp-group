import { TlpBadge, PowerTag, ConnectorChip, PhoneFrame, MapHubScreen, StationDetailScreen, ChargeHUDScreen, SectionHeader } from './Primitives'

export default function ComponentsSection() {
  return (
    <section className="evkit-section" id="components">
      <div className="evkit-container">
        <SectionHeader
          label="Primitive Components"
          title="UI Components & Design Library"
          desc="Các primitive components tái sử dụng cho toàn hệ thống NLP-EGREEN — TLP badges, power tags, connector chips, buttons."
        />

        <div className="ev-grid-2" style={{ marginTop: 'var(--ev-sp4)', alignItems: 'start' }}>
          {/* Left: component showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ev-sp3)' }}>

            {/* TLP Badges */}
            <div className="comp-section">
              <div className="comp-section-title">BadgeTLP — Trust Level Protocol</div>
              <div className="comp-row">
                <TlpBadge level="safe" />
                <TlpBadge level="caution" />
                <TlpBadge level="blocked" />
                <TlpBadge level="system" />
              </div>
            </div>

            {/* Power Tags */}
            <div className="comp-section">
              <div className="comp-section-title">PowerTag — Công suất sạc</div>
              <div className="comp-row">
                {[11, 30, 60, 120, 180, 240, 360].map(kw => <PowerTag key={kw} kw={kw} />)}
              </div>
            </div>

            {/* Connector Chips */}
            <div className="comp-section">
              <div className="comp-section-title">ConnectorChip — Chuẩn sạc</div>
              <div className="comp-row">
                <ConnectorChip type="CCS2" />
                <ConnectorChip type="Type 2" />
                <ConnectorChip type="GB/T" />
                <ConnectorChip type="CHAdeMO" />
              </div>
            </div>

            {/* Buttons */}
            <div className="comp-section">
              <div className="comp-section-title">Buttons</div>
              <div className="comp-row">
                <button className="ev-btn ev-btn-teal">⚡ Bắt đầu sạc</button>
                <button className="ev-btn ev-btn-outline">📍 Dẫn đường</button>
              </div>
              <div className="comp-row" style={{ marginTop: 8 }}>
                <button className="ev-btn" style={{ background: 'rgba(255,61,113,.12)', color: '#FF3D71', border: '1.5px solid rgba(255,61,113,.25)', borderRadius: 'var(--ev-r-xl)' }}>
                  ⏹ Dừng sạc khẩn cấp
                </button>
              </div>
            </div>

            {/* Charging slot grid */}
            <div className="comp-section">
              <div className="comp-section-title">Slot Layout — Sơ đồ cổng trực quan</div>
              <div className="slot-grid">
                <div className="slot-item slot-available">
                  <div className="slot-label" style={{ color: '#BEFF6C' }}>A1</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>180kW · CCS2</div>
                  <div className="slot-sub" style={{ color: '#BEFF6C' }}>Sẵn sàng sạc</div>
                </div>
                <div className="slot-item slot-charging">
                  <div className="slot-label" style={{ color: '#FFAA00' }}>A2</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>180kW · CCS2</div>
                  <div className="slot-sub">Đang sạc 62% ~12p</div>
                </div>
                <div className="slot-item slot-available">
                  <div className="slot-label" style={{ color: '#BEFF6C' }}>B1</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>60kW · CCS2</div>
                  <div className="slot-sub" style={{ color: '#BEFF6C' }}>Sẵn sàng sạc</div>
                </div>
                <div className="slot-item slot-blocked">
                  <div className="slot-label" style={{ color: '#FF3D71' }}>B2</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>60kW · Type 2</div>
                  <div className="slot-sub" style={{ color: '#FF3D71' }}>Mất tín hiệu</div>
                </div>
                <div className="slot-item">
                  <div className="slot-label" style={{ color: '#57606A' }}>C1</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>22kW · Type 2</div>
                  <div className="slot-sub">Bảo trì</div>
                </div>
                <div className="slot-item slot-available">
                  <div className="slot-label" style={{ color: '#BEFF6C' }}>C2</div>
                  <div style={{ fontSize: '.7rem', color: '#8B949E', fontFamily: 'monospace' }}>22kW · Type 2</div>
                  <div className="slot-sub" style={{ color: '#BEFF6C' }}>Sẵn sàng</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: phone mockups */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <PhoneFrame width={190}>
              <MapHubScreen />
            </PhoneFrame>
            <PhoneFrame width={210} main>
              <StationDetailScreen />
            </PhoneFrame>
            <PhoneFrame width={190}>
              <ChargeHUDScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
