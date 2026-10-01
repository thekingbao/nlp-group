import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@vnkr-labs/tokens/index.css'
import '@vnkr-labs/ui/index.css'
// VNKR JS utilities (toast, theme, modal)
import './portal.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
)
