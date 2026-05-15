import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import '@awm/shared/src/i18n/index.js'
import './index.css'
import { ApiProvider, AuthProvider, SingleSignOnPage, clearAuthTokens } from '@awm/shared'

// Pre-render logout: clear ALL tokens and redirect to /login
// This runs BEFORE React mounts, so AuthProvider never sees stale tokens.
if (window.location.pathname === '/logout') {
  clearAuthTokens();
  // Replace (not assign) so the user can't "back" into /logout
  window.location.replace('/login');
} else {
  function App() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<SingleSignOnPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ApiProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ApiProvider>
    </StrictMode>,
  )
}
