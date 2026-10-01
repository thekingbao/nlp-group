import { Routes, Route, Navigate } from 'react-router-dom'
import { usePortal } from '../../store'
import { Sidebar } from '../../components/Layout'
import FinDashboard from './Dashboard'
import FinInvoices  from './Invoices'
import FinCashflow  from './Cashflow'
import FinProjects  from './Projects'

const NAV = (overdueCount) => [
  {
    section: 'Tài chính',
    items: [
      { to: '/finance/dashboard', icon: '📊', label: 'Tổng quan' },
      { to: '/finance/invoices',  icon: '🧾', label: 'Hóa đơn', badge: overdueCount },
      { to: '/finance/cashflow',  icon: '📈', label: 'Dòng tiền' },
      { to: '/finance/projects',  icon: '🏗️', label: 'Thu theo dự án' },
    ],
  },
]

const PORTAL_LINKS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Admin Dashboard' },
  { to: '/legal/overview',  icon: '⚖️', label: 'Phòng Pháp chế' },
]

export default function FinancePortal() {
  const { state } = usePortal()
  const overdueCount = state.invoices.filter(i => i.status === 'overdue').length

  return (
    <div className="portal-layout">
      <Sidebar
        role="Phòng Tài chính"
        logoMark="💰"
        accentColor="var(--brand-alt)"
        navItems={NAV(overdueCount)}
        portalLinks={PORTAL_LINKS}
        userName="Lê Thị Tài Chính"
        userRole="Kế toán trưởng"
      />
      <main className="portal-main">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FinDashboard />} />
          <Route path="invoices"  element={<FinInvoices />} />
          <Route path="cashflow"  element={<FinCashflow />} />
          <Route path="projects"  element={<FinProjects />} />
        </Routes>
      </main>
    </div>
  )
}
