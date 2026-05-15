import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Initialize i18n before rendering
import '@awm/shared/src/i18n/index.js'

import './index.css'
import { ApiProvider, AuthProvider } from '@awm/shared';
import App from './App.jsx'

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
