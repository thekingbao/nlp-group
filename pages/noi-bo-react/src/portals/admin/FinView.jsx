import { Link } from 'react-router-dom'
import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { Panel, KpiCard, ProgressBar } from '../../components/UI'

export default function AdminFinView() {
  const { getProjects, stats, fmt, pct } = usePortal()
  const projs = getProjects()
  const s = stats()
  return (
    <>
      <Topbar title="Tài chính" sub="Tổng quan tài chính dự án">
        <Link to="/finance/dashboard" className="vnkr-btn vnkr-btn--primary btn-sm">↗ Mở Portal Tài chính</Link>
      </Topbar>
      <div className="portal-content">
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <KpiCard label="Tổng doanh thu"  value={fmt(s.totalValue)}    color="var(--info)"    barColor="var(--info)" />
          <KpiCard label="Đã thu"          value={fmt(s.totalPaid)}     color="var(--success)" barColor="var(--success)" />
          <KpiCard label="Còn phải thu"    value={fmt(s.outstanding)}   color="var(--warning)" barColor="var(--warning)" />
        </div>
        <Panel title="Thu tiền theo dự án">
          <table className="portal-table">
            <thead><tr><th>Mã</th><th>Dự án</th><th>Giá trị HĐ</th><th>Đã thu</th><th>Còn lại</th><th>Tiến độ</th></tr></thead>
            <tbody>
              {projs.map(p => {
                const pp = pct(p.paid, p.value)
                const rem = p.value - p.paid
                return (
                  <tr key={p.id}>
                    <td className="td-id">{p.id}</td>
                    <td className="td-name">{p.name}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.value)}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--success)', fontWeight: 700 }}>{fmt(p.paid)}</td>
                    <td style={{ whiteSpace: 'nowrap', color: rem > 0 ? 'var(--warning)' : 'var(--text-muted)', fontWeight: 600 }}>{fmt(rem)}</td>
                    <td style={{ minWidth: 110 }}>
                      <div className="td-sub">{pp}%</div>
                      <ProgressBar value={pp} />
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
