import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, ProgressBar, FilterRow } from '../../components/UI'

const FILTERS = [
  { value: '',            label: 'Tất cả' },
  { value: 'active',      label: 'Đang vận hành' },
  { value: 'installing',  label: 'Đang lắp đặt' },
  { value: 'pending',     label: 'Chờ triển khai' },
  { value: 'completed',   label: 'Hoàn thành' },
]

export default function AdminProjects() {
  const { getProjects, actions, fmt, pct } = usePortal()
  const [filter, setFilter] = useState('')

  const projs = getProjects(filter ? { status: filter } : {})

  const quickStatus = (p) => {
    const ns = window.prompt(`Cập nhật trạng thái "${p.name}":\n(active/installing/pending/completed)`, p.status)
    if (ns && ['active','installing','pending','completed'].includes(ns)) {
      actions.updateProjectStatus(p.id, ns)
    }
  }

  return (
    <>
      <Topbar title="Quản lý dự án" sub={`${projs.length} dự án`} />
      <div className="portal-content">
        <Panel title={`Danh sách dự án (${projs.length})`}>
          <FilterRow filters={FILTERS} active={filter} onChange={setFilter} />
          <table className="portal-table">
            <thead>
              <tr>
                <th>Mã</th><th>Dự án</th><th>Khách hàng</th><th>Loại</th>
                <th>Giá trị HĐ</th><th>Thanh toán</th><th>Trạng thái</th><th>Pháp lý</th><th></th>
              </tr>
            </thead>
            <tbody>
              {projs.map(p => {
                const pp = pct(p.paid, p.value)
                return (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td>
                      <div className="td-name">{p.name}</div>
                      <div className="td-sub">{p.region}</div>
                    </td>
                    <td className="td-sub">{p.client}</td>
                    <td><Badge status={p.type} /></td>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{fmt(p.value)}</td>
                    <td style={{ minWidth: 110 }}>
                      <div className="td-sub">{pp}% đã thu</div>
                      <ProgressBar value={pp} />
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td><Badge status={p.legalStatus} /></td>
                    <td>
                      <button className="btn-icon" title="Cập nhật" onClick={() => quickStatus(p)}>✏️</button>
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
