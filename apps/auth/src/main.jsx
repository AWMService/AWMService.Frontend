import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import '@awm/shared/src/i18n/index.js'
import './index.css'
import { ApiProvider, AuthProvider, SingleSignOnPage } from '@awm/shared'

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
