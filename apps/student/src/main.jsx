import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

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
