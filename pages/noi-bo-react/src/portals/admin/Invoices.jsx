import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, FilterRow } from '../../components/UI'

const FILTERS = [
  { value: '',        label: 'Tất cả' },
  { value: 'paid',    label: 'Đã thu' },
  { value: 'pending', label: 'Chờ TT' },
  { value: 'overdue', label: 'Quá hạn' },
]

const TYPE_LABEL = { full: 'Thanh lý', deposit: 'Đặt cọc', progress: 'Đợt %' }

export default function AdminInvoices() {
  const { getInvoices, getProject, actions, fmt, fmtDate } = usePortal()
  const [filter, setFilter] = useState('')
  const invs = filter ? getInvoices().filter(i => i.status === filter) : getInvoices()

  return (
    <>
      <Topbar title="Quản lý hóa đơn" sub={`${invs.length} hóa đơn`} />
      <div className="portal-content">
        <Panel title="Danh sách hóa đơn">
          <FilterRow filters={FILTERS} active={filter} onChange={setFilter} />
          <table className="portal-table">
            <thead>
              <tr><th>Mã HĐ</th><th>Dự án</th><th>Loại</th><th>Số tiền</th><th>Phát hành</th><th>Đến hạn</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {invs.map(i => {
                const p = getProject(i.projectId)
                return (
                  <tr key={i.id}>
                    <td className="td-id">{i.id}</td>
                    <td>
                      <div className="td-name" style={{ maxWidth: 180 }}>{p?.name}</div>
                      <div className="td-sub">{i.projectId}</div>
                    </td>
                    <td><Badge status={i.type} label={TYPE_LABEL[i.type] || i.type} /></td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(i.amount)}</td>
                    <td style={{ fontSize: '.8rem' }}>{fmtDate(i.issued)}</td>
                    <td style={{ fontSize: '.8rem', color: i.status === 'overdue' ? 'var(--error)' : undefined, fontWeight: i.status === 'overdue' ? 700 : 400 }}>
                      {fmtDate(i.due)}
                    </td>
                    <td><Badge status={i.status} /></td>
                    <td>
                      {i.status !== 'paid' && (
                        <button
                          className="vnkr-btn vnkr-btn--primary btn-sm"
                          onClick={() => {
                            if (window.confirm(`Xác nhận đã thu ${i.id}?`)) {
                              actions.updateInvoiceStatus(i.id, 'paid')
                            }
                          }}
                        >
                          Thu tiền
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
    </>
  )
}
