import { Link } from 'react-router-dom'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { KpiCard, Panel, Badge } from '../../components/UI'

export default function AdminDashboard() {
  const { stats, getProjects, getInvoices, getProject, fmt, fmtDate, pct } = usePortal()
  const s     = stats()
  const projs = getProjects().slice(0, 5)
  const urgentInvs = getInvoices().filter(i => i.status !== 'paid').slice(0, 6)

  return (
    <>
      <Topbar title="Dashboard tổng quan" sub="Theo dõi toàn bộ dự án và hoạt động nội bộ">
        <Link to="/admin/projects" className="btn btn-outline btn-sm">↗ Dự án</Link>
      </Topbar>

      <div className="portal-content">
        {/* KPIs */}
        <div className="kpi-grid">
          <KpiCard label="Tổng giá trị HĐ"  value={fmt(s.totalValue)}    sub={`${s.totalProjects} dự án`}           color="var(--success)"  barColor="var(--success)"  icon="📁" />
          <KpiCard label="Đã thu"            value={fmt(s.totalPaid)}     sub={`${pct(s.totalPaid,s.totalValue)}%`}  color="var(--info)"     barColor="var(--info)"     icon="✅" />
          <KpiCard label="Còn phải thu"      value={fmt(s.outstanding)}   sub={`${s.overdue} quá hạn · ${s.pending} chờ`} color="var(--warning)" barColor="var(--warning)" icon="⏳" />
          <KpiCard label="Vấn đề pháp lý"   value={s.legalIssues}        sub="dự án cần xử lý"                      color="var(--error)"    barColor="var(--error)"    icon="⚖️" />
        </div>

        <div className="grid-2">
          {/* Recent projects */}
          <Panel
            title="Dự án gần đây"
            actions={<Link to="/admin/projects" className="btn btn-outline btn-sm">Xem tất cả</Link>}
          >
            <table className="portal-table">
              <thead><tr><th>Mã</th><th>Dự án</th><th>Trạng thái</th><th>Pháp lý</th></tr></thead>
              <tbody>
                {projs.map(p => (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td>
                      <div className="td-name">{p.name}</div>
                      <div className="td-sub">{p.region}</div>
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td><Badge status={p.legalStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          {/* Urgent invoices */}
          <Panel
            title="Hóa đơn cần xử lý"
            actions={<Link to="/admin/invoices" className="btn btn-outline btn-sm">Xem tất cả</Link>}
          >
            {urgentInvs.length === 0
              ? <p style={{ padding: '32px', color: 'var(--text-muted)', textAlign: 'center' }}>✅ Không có hóa đơn tồn đọng</p>
              : (
                <table className="portal-table">
                  <thead><tr><th>Mã HĐ</th><th>Dự án</th><th>Số tiền</th><th>Trạng thái</th></tr></thead>
                  <tbody>
                    {urgentInvs.map(i => {
                      const p = getProject(i.projectId)
                      return (
                        <tr key={i.id}>
                          <td className="td-id">{i.id}</td>
                          <td className="td-name" style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.name}</td>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{fmt(i.amount)}</td>
                          <td><Badge status={i.status} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )
            }
          </Panel>
        </div>
      </div>
    </>
  )
}
