import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { KpiCard, Panel, Badge } from '../../components/UI'
import { Link } from 'react-router-dom'

export default function FinDashboard() {
  const { stats, getInvoices, getProject, fmt, fmtDate, pct } = usePortal()
  const s = stats()
  const urgentInvs = getInvoices().filter(i => i.status !== 'paid')
  const overdueTotal = getInvoices().filter(i => i.status === 'overdue').reduce((a, i) => a + i.amount, 0)

  return (
    <>
      <Topbar title="Tổng quan Tài chính" sub="Theo dõi dòng tiền, hóa đơn và công nợ">
        <Link to="/finance/invoices" className="vnkr-btn vnkr-btn--primary btn-sm">+ Ghi nhận TT</Link>
      </Topbar>
      <div className="portal-content">
        <div className="kpi-grid">
          <KpiCard label="Tổng giá trị HĐ" value={fmt(s.totalValue)}   sub={`${s.totalProjects} dự án`}           color="var(--info)"     barColor="var(--info)"     icon="💼" />
          <KpiCard label="Đã thu"           value={fmt(s.totalPaid)}    sub={`${pct(s.totalPaid,s.totalValue)}%`}  color="var(--success)"  barColor="var(--success)"  icon="✅" />
          <KpiCard label="Phải thu còn lại" value={fmt(s.outstanding)}  sub={`${s.pending} chờ · ${s.overdue} quá hạn`} color="var(--warning)" barColor="var(--warning)" icon="⏳" />
          <KpiCard label="Quá hạn TT"       value={fmt(overdueTotal)}   sub={`${s.overdue} hóa đơn`}               color="var(--error)"    barColor="var(--error)"    icon="🚨" />
        </div>

        {/* Bar chart */}
        <Panel title="📊 Doanh thu theo dự án"
          actions={
            <div style={{ display: 'flex', gap: 14, fontSize: '.75rem', color: 'var(--text-muted)', alignItems: 'center' }}>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--info)', marginRight: 4 }}/>Giá trị HĐ</span>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--success)', marginRight: 4 }}/>Đã thu</span>
            </div>
          }
        >
          <BarChart />
        </Panel>

        <Panel
          title="⚡ Hóa đơn cần xử lý"
          actions={<Link to="/finance/invoices" className="vnkr-btn vnkr-btn--outline btn-sm">Xem tất cả</Link>}
        >
          {urgentInvs.length === 0
            ? <p style={{ padding: '32px', color: 'var(--text-muted)', textAlign: 'center' }}>✅ Tất cả hóa đơn đã thanh toán</p>
            : urgentInvs.map(i => {
                const p = getProject(i.projectId)
                return (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.845rem' }}>{i.id}</div>
                      <div className="td-sub" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '.845rem', whiteSpace: 'nowrap' }}>{fmt(i.amount)}</div>
                      <Badge status={i.status} />
                    </div>
                  </div>
                )
              })
          }
        </Panel>
      </div>
    </>
  )
}

function BarChart() {
  const { getProjects, fmt } = usePortal()
  const projs = getProjects()
  const maxVal = Math.max(...projs.map(p => p.value))

  return (
    <div className="bar-chart-wrap">
      {projs.map(p => {
        const hVal  = Math.round((p.value / maxVal) * 130)
        const hPaid = Math.round((p.paid  / maxVal) * 130)
        return (
          <div key={p.id} className="bar-group">
            <div className="bar-pair">
              <div className="bar-seg" style={{ height: hVal, background: 'rgba(30,111,165,.45)' }} title={`${p.id}: ${fmt(p.value)}`} />
              <div className="bar-seg" style={{ height: hPaid, background: 'var(--success)' }} title={`Đã thu: ${fmt(p.paid)}`} />
            </div>
            <div className="bar-label">{p.id}</div>
          </div>
        )
      })}
    </div>
  )
}
