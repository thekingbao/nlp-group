import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalProvider, usePortal } from './store.tsx'
import Home          from './Home'
import AdminPortal   from './portals/admin'
import LegalPortal   from './portals/legal'
import FinancePortal from './portals/finance'
import EVKitPage     from './portals/evkit'
import LoginPage     from './pages/Login.jsx'
import { useEffect } from 'react'

// ─── Auth guard — redirects to /login if no access token ──────────────────────
function RequireAuth({ children }) {
  const { loading, user } = usePortal()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', fontSize: 14 }}>
      Đang tải…
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  // Apply dark theme globally
  useEffect(() => { document.documentElement.dataset.theme = 'dark' }, [])

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/admin/*"   element={<RequireAuth><AdminPortal /></RequireAuth>} />
      <Route path="/legal/*"   element={<RequireAuth><LegalPortal /></RequireAuth>} />
      <Route path="/finance/*" element={<RequireAuth><FinancePortal /></RequireAuth>} />
      <Route path="/evkit"     element={<RequireAuth><EVKitPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <PortalProvider>
      <AppRoutes />
    </PortalProvider>
  )
}
