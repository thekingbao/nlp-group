import { useState } from 'react'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge, FilterRow, LiveNotif } from '../../components/UI'

const FILTERS = [
  { value: '',         label: 'Tất cả' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'pending',  label: 'Chờ duyệt' },
  { value: 'review',   label: 'Đang xét' },
]

export default function LegalProjects() {
  const { getProjects, actions } = usePortal()
  const [filter, setFilter] = useState('')
  const [notif, setNotif] = useState('')

  const projs = filter ? getProjects({ legalStatus: filter }) : getProjects()

  const approveLegal = (id, name) => {
    const note = window.prompt('Ghi chú phê duyệt:', 'Hồ sơ đầy đủ, đã phê duyệt.')
    if (note !== null) {
      actions.updateLegalStatus(id, 'approved', note)
      setNotif(`✅ Đã phê duyệt pháp lý: ${name}`)
      setTimeout(() => setNotif(''), 4000)
    }
  }

  const requestLegal = (id, name) => {
    const note = window.prompt('Yêu cầu bổ sung:', 'Cần bổ sung hồ sơ đất và giấy phép PCCC.')
    if (note !== null) {
      actions.updateLegalStatus(id, 'pending', note)
      setNotif(`📋 Đã gửi yêu cầu bổ sung: ${name}`)
      setTimeout(() => setNotif(''), 4000)
    }
  }

  return (
    <>
      <Topbar title="Dự án & Hợp đồng" sub="Quản lý trạng thái pháp lý từng dự án" />
      <div className="portal-content">
        <LiveNotif msg={notif} color="#c084fc" bg="rgba(124,58,237,.08)" border="rgba(124,58,237,.25)" />
        <Panel title="Danh sách dự án">
          <FilterRow filters={FILTERS} active={filter} onChange={setFilter} />
          <table className="portal-table">
            <thead><tr><th>Mã</th><th>Dự án</th><th>Loại</th><th>Pháp lý</th><th>Ghi chú</th><th>Hành động</th></tr></thead>
            <tbody>
              {projs.map(p => (
                <tr key={p.id}>
                  <td className="td-id">{p.id}</td>
                  <td><div className="td-name">{p.name}</div><div className="td-sub">{p.client}</div></td>
                  <td><Badge status={p.type} /></td>
                  <td><Badge status={p.legalStatus} /></td>
                  <td style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{p.legalNote}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" style={{ background: 'var(--success)', border: 'none' }} onClick={() => approveLegal(p.id, p.name)}>✅ Duyệt</button>
                    <button className="btn btn-outline btn-sm" onClick={() => requestLegal(p.id, p.name)}>🔄 Bổ sung</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  )
}
