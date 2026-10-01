import { usePortal } from '../../store'
import { Topbar } from '../../components/Layout'
import { KpiCard, Panel, ProgressBar } from '../../components/UI'

export default function FinCashflow() {
  const { getProjects, getInvoices, stats, fmt, pct } = usePortal()
  const s = stats()
  const projs = getProjects()
  const maxVal = Math.max(...projs.map(p => p.value))

  const overdueTotal  = getInvoices().filter(i => i.status === 'overdue').reduce((a,i) => a+i.amount, 0)
  const pendingTotal  = getInvoices().filter(i => i.status === 'pending').reduce((a,i) => a+i.amount, 0)
  const overdueCount  = getInvoices().filter(i => i.status === 'overdue').length
  const pendingCount  = getInvoices().filter(i => i.status === 'pending').length
  const paidCount     = getInvoices().filter(i => i.status === 'paid').length
  const paidPct       = pct(paidCount, getInvoices().length)

  return (
    <>
      <Topbar title="Phân tích Dòng tiền" sub="Cashflow & phân tích công nợ toàn dự án" />
      <div className="portal-content">
        <div className="kpi-grid">
          <KpiCard label="Tổng doanh thu"  value={fmt(s.totalValue)}    color="var(--info)"    barColor="var(--info)"    icon="💼" />
          <KpiCard label="Đã thu"          value={fmt(s.totalPaid)}     color="var(--success)" barColor="var(--success)" icon="✅" />
          <KpiCard label="Chưa thu"        value={fmt(s.outstanding)}   color="var(--warning)" barColor="var(--warning)" icon="⏳" />
          <KpiCard label="Tỷ lệ thu"       value={`${pct(s.totalPaid, s.totalValue)}%`} color="#06b6d4" barColor="#06b6d4" icon="📈" />
        </div>

        <div className="grid-2">
          {/* Cashflow per project */}
          <Panel title="Dòng tiền theo dự án">
            {projs.map(p => {
              const pp = pct(p.paid, p.value)
              return (
                <div key={p.id} className="cf-row">
                  <div style={{ flex: 1.5 }}>
                    <div className="cf-row__label" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div className="cf-row__sub">{p.id}</div>
                  </div>
                  <div className="cf-row__bar">
                    <div style={{ fontSize: '.68rem', color: 'var(--text-muted)', marginBottom: 3 }}>{pp}%</div>
                    <ProgressBar value={pp} />
                  </div>
                  <div className="cf-row__amount">
                    <strong style={{ color: 'var(--success)' }}>{fmt(p.paid)}</strong>
                    <span>/ {fmt(p.value)}</span>
                  </div>
                </div>
              )
            })}
          </Panel>

          {/* Debt analysis */}
          <Panel title="Phân tích công nợ">
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'rgba(232,65,24,.06)', border: '1px solid rgba(232,65,24,.15)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Công nợ quá hạn</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--error)' }}>{fmt(overdueTotal)}</div>
                <div className="td-sub">{overdueCount} hóa đơn quá hạn</div>
              </div>
              <div style={{ background: 'rgba(240,165,0,.06)', border: '1px solid rgba(240,165,0,.15)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Đang chờ thanh toán</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--warning)' }}>{fmt(pendingTotal)}</div>
                <div className="td-sub">{pendingCount} hóa đơn</div>
              </div>
              <div style={{ background: 'rgba(0,168,120,.06)', border: '1px solid rgba(0,168,120,.15)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Đã thu đầy đủ</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>{paidCount} hóa đơn</div>
              </div>
              <div style={{ background: 'rgba(6,182,212,.06)', border: '1px solid rgba(6,182,212,.15)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Tỷ lệ thu thành công</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#06b6d4' }}>{paidPct}%</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
