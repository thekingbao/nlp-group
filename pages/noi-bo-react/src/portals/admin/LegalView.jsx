import { Link } from 'react-router-dom'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, Badge } from '../../components/UI'

export default function AdminLegalView() {
  const { getProjects } = usePortal()
  const projs = getProjects()
  return (
    <>
      <Topbar title="Pháp chế" sub="Tình trạng pháp lý các dự án">
        <Link to="/legal/overview" className="btn btn-primary btn-sm">↗ Mở Portal Pháp chế</Link>
      </Topbar>
      <div className="portal-content">
        <Panel title="Tình trạng pháp lý">
          <table className="portal-table">
            <thead><tr><th>Mã</th><th>Dự án</th><th>Pháp lý</th><th>Ghi chú</th><th></th></tr></thead>
            <tbody>
              {projs.map(p => (
                <tr key={p.id}>
                  <td className="td-id">{p.id}</td>
                  <td><div className="td-name">{p.name}</div><div className="td-sub">{p.client}</div></td>
                  <td><Badge status={p.legalStatus} /></td>
                  <td style={{ fontSize: '.8rem', color: 'var(--text-muted)', maxWidth: 220 }}>{p.legalNote}</td>
                  <td><Link to="/legal/projects" className="btn btn-outline btn-sm">Xem chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  )
}
