import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import '@awm/shared/src/i18n/index.js'
import './index.css'
import { ApiProvider, AuthProvider, SingleSignOnPage, useAuth, authService, getLoginUrl } from '@awm/shared'

function Logout() {
  const { logout } = useAuth()
  
  useEffect(() => {
    // We use a direct call to clear tokens for this specific domain (port 3000)
    // and then redirect to login.
    authService.logout()
    window.location.assign('/login')
  }, [])

  return null
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SingleSignOnPage />} />
      <Route path="/logout" element={<Logout />} />
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
