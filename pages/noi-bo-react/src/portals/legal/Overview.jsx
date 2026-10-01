import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, KpiCard, Drawer } from '../../components/UI'
import LegalDocDrawer from './DocDrawer'

export default function LegalOverview() {
  const { getProjects, getDocs, actions, fmtDate } = usePortal()
  const projs = getProjects()
  const docs  = getDocs()

  const approved = projs.filter(p => p.legalStatus === 'approved').length
  const review   = projs.filter(p => p.legalStatus === 'review').length
  const pending  = projs.filter(p => p.legalStatus === 'pending').length
  const missing  = docs.filter(d => d.status === 'missing' || d.status === 'pending').length

  const [drawerProject, setDrawerProject] = useState(null)

  const approveLegal = (id) => {
    const note = window.prompt('Ghi chú phê duyệt:', 'Hồ sơ đầy đủ, đã phê duyệt.')
    if (note !== null) actions.updateLegalStatus(id, 'approved', note)
  }

  const requestLegal = (id) => {
    const note = window.prompt('Nội dung yêu cầu bổ sung:', 'Cần bổ sung hồ sơ đất và giấy phép PCCC.')
    if (note !== null) actions.updateLegalStatus(id, 'pending', note)
  }

  return (
    <>
      <Topbar title="Tổng quan pháp lý" sub="Quản lý hồ sơ pháp lý & trạng thái dự án" />
      <div className="portal-content">
        {/* Stats */}
        <div className="kpi-grid">
          <KpiCard label="Đã phê duyệt"   value={approved} color="var(--success)"  barColor="var(--success)"  icon="✅" />
          <KpiCard label="Đang xét duyệt" value={review}   color="#c084fc"          barColor="#7c3aed"          icon="🔍" />
          <KpiCard label="Chờ bổ sung"    value={pending}  color="var(--warning)"   barColor="var(--warning)"   icon="⏳" />
          <KpiCard label="Thiếu hồ sơ"    value={missing}  color="var(--error)"     barColor="var(--error)"     icon="❌" />
        </div>

        <Panel title="Tình trạng pháp lý tất cả dự án">
          <table className="portal-table">
            <thead><tr><th>Mã DA</th><th>Dự án</th><th>Khách hàng</th><th>Pháp lý</th><th>Hợp đồng</th><th>Ghi chú</th><th>Hành động</th></tr></thead>
            <tbody>
              {projs.map(p => {
                const pDocs = getDocs(p.id)
                const contract = pDocs.find(d => d.type.includes('Hợp đồng'))
                return (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td><div className="td-name">{p.name}</div><div className="td-sub">{p.region}</div></td>
                    <td className="td-sub">{p.client}</td>
                    <td><Badge status={p.legalStatus} /></td>
                    <td>{contract ? <Badge status={contract.status} /> : <Badge status="missing" label="❌ Chưa có HĐ" />}</td>
                    <td style={{ fontSize: '.8rem', color: 'var(--text-muted)', maxWidth: 200 }}>{p.legalNote}</td>
                    <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => approveLegal(p.id)}>✅ Duyệt</button>
                      <button className="btn btn-outline btn-sm" onClick={() => requestLegal(p.id)}>📋 Yêu cầu</button>
                      <button className="btn btn-outline btn-sm" onClick={() => setDrawerProject(p)}>📄 Hồ sơ</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Drawer */}
      {drawerProject && (
        <LegalDocDrawer project={drawerProject} onClose={() => setDrawerProject(null)} />
      )}
    </>
  )
}
