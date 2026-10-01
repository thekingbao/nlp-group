import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalProvider } from './store'
import Home          from './Home'
import AdminPortal   from './portals/admin'
import LegalPortal   from './portals/legal'
import FinancePortal from './portals/finance'
import EVKitPage     from './portals/evkit'
import { useEffect } from 'react'

export default function App() {
  // Apply VNKR dark theme globally
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'
  }, [])

  return (
    <PortalProvider>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/admin/*"  element={<AdminPortal />} />
        <Route path="/legal/*"  element={<LegalPortal />} />
        <Route path="/finance/*" element={<FinancePortal />} />
        <Route path="/evkit"    element={<EVKitPage />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </PortalProvider>
  )
}
