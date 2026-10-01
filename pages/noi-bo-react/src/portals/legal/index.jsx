import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { usePortal } from '../../store'
import { Sidebar } from '../../components/Layout'
import LegalOverview  from './Overview'
import LegalProjects  from './Projects'
import LegalDocs      from './Docs'
import LegalAlerts    from './Alerts'

const NAV = (missingCount, alertCount) => [
  {
    section: 'Pháp chế',
    items: [
      { to: '/legal/overview',  icon: '📋', label: 'Tổng quan' },
      { to: '/legal/projects',  icon: '🏗️', label: 'Dự án & Hợp đồng' },
      { to: '/legal/docs',      icon: '📄', label: 'Hồ sơ pháp lý', badge: missingCount },
      { to: '/legal/alerts',    icon: '🚨', label: 'Cảnh báo', badge: alertCount },
    ],
  },
]

const PORTAL_LINKS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Admin Dashboard' },
  { to: '/finance/dashboard', icon: '💰', label: 'Phòng Tài chính' },
]

export default function LegalPortal() {
  const { state, getDocs, getProjects } = usePortal()
  const missingCount = getDocs().filter(d => d.status === 'missing' || d.status === 'pending').length
  const alertCount   = getProjects().filter(p => ['pending','review'].includes(p.legalStatus)).length

  return (
    <div className="portal-layout">
      <Sidebar
        role="Phòng Pháp chế"
        logoMark="⚖️"
        accentColor="#7c3aed"
        navItems={NAV(missingCount, alertCount)}
        portalLinks={PORTAL_LINKS}
        userName="Trần Thị Pháp Lý"
        userRole="Trưởng phòng Pháp chế"
      />
      <main className="portal-main">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview"  element={<LegalOverview />} />
          <Route path="projects"  element={<LegalProjects />} />
          <Route path="docs"      element={<LegalDocs />} />
          <Route path="alerts"    element={<LegalAlerts />} />
        </Routes>
      </main>
    </div>
  )
}
