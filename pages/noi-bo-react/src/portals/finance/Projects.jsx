import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, ProgressBar, Drawer } from '../../components/UI'

export default function FinProjects() {
  const { getProjects, getInvoices, actions, fmt, fmtDate, pct } = usePortal()
  const [drawer, setDrawer] = useState(null)
  const projs = getProjects()

  const statusBadge = (s) => {
    const m = { active:'active', installing:'installing', pending:'pending', completed:'completed' }
    return m[s] || s
  }

  return (
    <>
      <Topbar title="Thu tiền theo Dự án" sub="Công nợ và tiến độ thanh toán từng dự án" />
      <div className="portal-content">
        <Panel title="Thu tiền theo dự án">
          <table className="portal-table">
            <thead><tr><th>Mã DA</th><th>Dự án</th><th>Giá trị HĐ</th><th>Đã thu</th><th>Còn lại</th><th>Tiến độ</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {projs.map(p => {
                const pp  = pct(p.paid, p.value)
                const rem = p.value - p.paid
                const pendingInvs = getInvoices(p.id).filter(i => i.status !== 'paid')
                return (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td><div className="td-name">{p.name}</div><div className="td-sub">{p.client}</div></td>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{fmt(p.value)}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--success)', fontWeight: 700 }}>{fmt(p.paid)}</td>
                    <td style={{ whiteSpace: 'nowrap', color: rem > 0 ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 600 }}>{fmt(rem)}</td>
                    <td style={{ minWidth: 110 }}>
                      <div className="td-sub">{pp}%</div>
                      <ProgressBar value={pp} />
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td>
                      {pendingInvs.length > 0 && (
                        <button className="vnkr-btn vnkr-btn--primary btn-sm" onClick={() => setDrawer(pendingInvs)}>
                          + Thu ({pendingInvs.length})
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Quick pay drawer */}
      {drawer && (
        <QuickProjPayDrawer invs={drawer} onClose={() => setDrawer(null)} />
      )}
    </>
  )
}

function QuickProjPayDrawer({ invs, onClose }) {
  const { getProject, actions, fmt, fmtDate } = usePortal()
  return (
    <Drawer open title="Thu tiền dự án" sub={`${invs.length} hóa đơn chờ`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {invs.map(i => {
          const p = getProject(i.projectId)
          return (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.845rem' }}>{i.id}</div>
                <div className="td-sub">Đến hạn: {fmtDate(i.due)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '.845rem', whiteSpace: 'nowrap' }}>{fmt(i.amount)}</span>
                <button
                  className="vnkr-btn vnkr-btn--primary btn-sm"
                  style={{ background: 'var(--success)', border: 'none' }}
                  onClick={() => {
                    if (window.confirm(`Thu hóa đơn ${i.id}?`)) actions.updateInvoiceStatus(i.id, 'paid')
                  }}
                >✅ Thu</button>
              </div>
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}
