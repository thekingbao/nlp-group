import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { usePortal } from '../../store'
import { Sidebar, Topbar } from '../../components/Layout'
import { KpiCard, Panel, Badge, ProgressBar, LiveNotif } from '../../components/UI'

// ── Sub-views ──────────────────────────────────────────────────────────────
import AdminDashboard  from './Dashboard'
import AdminProjects   from './Projects'
import AdminInvoices   from './Invoices'
import AdminLegalView  from './LegalView'
import AdminFinView    from './FinView'

const NAV = (overdueCount, legalIssues) => [
  {
    section: 'Tổng quan',
    items: [
      { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
      { to: '/admin/projects',  icon: '🏗️', label: 'Dự án', badge: 7 },
    ],
  },
  {
    section: 'Vận hành',
    items: [
      { to: '/admin/invoices', icon: '🧾', label: 'Hóa đơn', badge: overdueCount },
      { to: '/admin/legal',    icon: '⚖️', label: 'Pháp chế', badge: legalIssues },
      { to: '/admin/finance',  icon: '💰', label: 'Tài chính' },
    ],
  },
]

const PORTAL_LINKS = [
  { to: '/legal/overview', icon: '⚖️', label: 'Phòng Pháp chế' },
  { to: '/finance/dashboard', icon: '💰', label: 'Phòng Tài chính' },
]

export default function AdminPortal() {
  const { stats, state } = usePortal()
  const s = stats()
  const overdueCount = state.invoices.filter(i => i.status === 'overdue').length
  const legalIssues = s.legalIssues

  return (
    <div className="portal-layout">
      <Sidebar
        role="Admin Dashboard"
        logoMark="N"
        accentColor="var(--success)"
        navItems={NAV(overdueCount, legalIssues)}
        portalLinks={PORTAL_LINKS}
        userName="Nguyễn Văn Admin"
        userRole="Quản trị hệ thống"
      />
      <main className="portal-main">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects"  element={<AdminProjects />} />
          <Route path="invoices"  element={<AdminInvoices />} />
          <Route path="legal"     element={<AdminLegalView />} />
          <Route path="finance"   element={<AdminFinView />} />
        </Routes>
      </main>
    </div>
  )
}
