import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, FilterRow, Drawer } from '../../components/UI'

const FILTERS = [
  { value: '',        label: 'Tất cả' },
  { value: 'paid',    label: 'Đã thu' },
  { value: 'pending', label: 'Chờ TT' },
  { value: 'overdue', label: 'Quá hạn' },
]

const TYPE_LABEL = { full: 'Thanh lý', deposit: 'Đặt cọc', progress: 'Đợt %' }

export default function FinInvoices() {
  const { getInvoices, getProject, actions, fmt, fmtDate } = usePortal()
  const [filter, setFilter]       = useState('')
  const [drawer, setDrawer]       = useState(null)

  const invs = filter ? getInvoices().filter(i => i.status === filter) : getInvoices()

  const markPaid = (id) => {
    if (window.confirm(`Xác nhận đã thu hóa đơn ${id}?`)) {
      actions.updateInvoiceStatus(id, 'paid')
    }
  }

  return (
    <>
      <Topbar title="Quản lý Hóa đơn" sub={`${invs.length} hóa đơn`}>
        <button className="btn btn-primary btn-sm" onClick={() => setDrawer('new')}>+ Ghi nhận TT</button>
      </Topbar>
      <div className="portal-content">
        <Panel title="Danh sách hóa đơn">
          <FilterRow filters={FILTERS} active={filter} onChange={setFilter} />
          <table className="portal-table">
            <thead><tr><th>Mã HĐ</th><th>Dự án</th><th>Loại</th><th>Số tiền</th><th>Phát hành</th><th>Đến hạn</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {invs.map(i => {
                const p = getProject(i.projectId)
                return (
                  <tr key={i.id}>
                    <td className="td-id">{i.id}</td>
                    <td><div className="td-name" style={{ maxWidth: 180 }}>{p?.name}</div><div className="td-sub">{i.projectId}</div></td>
                    <td><Badge status={i.type} label={TYPE_LABEL[i.type] || i.type} /></td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(i.amount)}</td>
                    <td style={{ fontSize: '.8rem' }}>{fmtDate(i.issued)}</td>
                    <td style={{ fontSize: '.8rem', color: i.status === 'overdue' ? 'var(--error)' : undefined, fontWeight: i.status === 'overdue' ? 700 : 400 }}>
                      {fmtDate(i.due)}
                    </td>
                    <td><Badge status={i.status} /></td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {i.status !== 'paid' && (
                        <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => markPaid(i.id)}>✅ Thu</button>
                      )}
                      <button className="btn-icon" onClick={() => setDrawer(i)}>📋</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Invoice detail drawer */}
      {drawer && drawer !== 'new' && (
        <InvoiceDetailDrawer inv={drawer} onClose={() => setDrawer(null)} onPay={markPaid} />
      )}
      {drawer === 'new' && (
        <QuickPayDrawer onClose={() => setDrawer(null)} />
      )}
    </>
  )
}

function InvoiceDetailDrawer({ inv, onClose, onPay }) {
  const { getProject, fmt, fmtDate } = usePortal()
  const p = getProject(inv.projectId)
  return (
    <Drawer open title={`Chi tiết ${inv.id}`} sub={p?.name} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Số tiền</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--info)' }}>{fmt(inv.amount)}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Phát hành</div>
            <div style={{ fontWeight: 600 }}>{fmtDate(inv.issued)}</div>
          </div>
          <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Đến hạn</div>
            <div style={{ fontWeight: 600, color: inv.status === 'overdue' ? 'var(--error)' : undefined }}>{fmtDate(inv.due)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-section)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <span>Trạng thái</span><Badge status={inv.status} />
        </div>
        {inv.status !== 'paid' && (
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--success)', border: 'none' }} onClick={() => { onPay(inv.id); onClose() }}>
            ✅ Xác nhận đã thu tiền
          </button>
        )}
        <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>DỰ ÁN</div>
          <div style={{ fontWeight: 600 }}>{p?.name}</div>
          <div className="td-sub">{p?.client} · {p?.region}</div>
        </div>
      </div>
    </Drawer>
  )
}

function QuickPayDrawer({ onClose }) {
  const { getInvoices, getProject, actions, fmt, fmtDate } = usePortal()
  const pending = getInvoices().filter(i => i.status !== 'paid')
  return (
    <Drawer open title="Ghi nhận thanh toán" sub="Chọn hóa đơn cần xác nhận" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pending.length === 0
          ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0' }}>✅ Không có hóa đơn chờ thanh toán</p>
          : pending.map(i => {
              const p = getProject(i.projectId)
              return (
                <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.845rem' }}>{i.id} <Badge status={i.status} /></div>
                    <div className="td-sub" style={{ maxWidth: 180 }}>{p?.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '.845rem', whiteSpace: 'nowrap' }}>{fmt(i.amount)}</span>
                    <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => {
                      if (window.confirm(`Thu hóa đơn ${i.id}?`)) actions.updateInvoiceStatus(i.id, 'paid')
                    }}>✅ Thu</button>
                  </div>
                </div>
              )
            })
        }
      </div>
    </Drawer>
  )
}
