import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge } from '../../components/UI'

export default function LegalAlerts() {
  const { getProjects, getDocs, actions } = usePortal()
  const projs = getProjects()
  const docs  = getDocs()

  const urgentProjs = projs.filter(p => ['pending','review'].includes(p.legalStatus))
  const missingDocs = docs.filter(d => d.status === 'missing')

  const approveLegal = (id, name) => {
    const note = window.prompt('Ghi chú phê duyệt:', 'Hồ sơ đầy đủ, đã phê duyệt.')
    if (note !== null) actions.updateLegalStatus(id, 'approved', note)
  }

  const requestLegal = (id, name) => {
    const note = window.prompt('Yêu cầu bổ sung:', 'Cần bổ sung hồ sơ.')
    if (note !== null) actions.updateLegalStatus(id, 'pending', note)
  }

  return (
    <>
      <Topbar title="Cảnh báo pháp lý" sub={`${urgentProjs.length + missingDocs.length} vấn đề cần xử lý`} />
      <div className="portal-content">
        {urgentProjs.length === 0 && missingDocs.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontSize: '1rem' }}>
            ✅ Không có cảnh báo nào cần xử lý
          </div>
        )}

        {urgentProjs.map(p => (
          <div key={p.id} style={{ background: 'rgba(240,165,0,.05)', border: '1px solid rgba(240,165,0,.2)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 700 }}>⚠️ {p.name}</span>
                <span className="td-id" style={{ marginLeft: 8 }}>{p.id}</span>
              </div>
              <Badge status={p.legalStatus} />
            </div>
            <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginBottom: 12 }}>{p.legalNote}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="vnkr-btn vnkr-btn--primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => approveLegal(p.id, p.name)}>✅ Phê duyệt</button>
              <button className="vnkr-btn vnkr-btn--outline btn-sm" onClick={() => requestLegal(p.id, p.name)}>📋 Yêu cầu bổ sung</button>
            </div>
          </div>
        ))}

        {missingDocs.map(d => {
          const p = getProjects().find(x => x.id === d.projectId)
          return (
            <div key={d.id} style={{ background: 'rgba(232,65,24,.05)', border: '1px solid rgba(232,65,24,.2)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 700 }}>❌ Thiếu: {d.type}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '.85rem' }}>— {p?.name}</span>
                </div>
                <Badge status={d.status} />
              </div>
              <div style={{ marginTop: 10 }}>
                <button className="vnkr-btn vnkr-btn--outline btn-sm" onClick={() => alert(`📨 Đã gửi yêu cầu bổ sung: ${d.type}`)}>📨 Gửi yêu cầu bổ sung</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
