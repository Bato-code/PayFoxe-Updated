import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import OneSignal from 'react-onesignal'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

// Initialize OneSignal (safe even without App ID)
OneSignal.init({
  appId: import.meta.env.VITE_ONESIGNAL_APP_ID || '',
  allowLocalhostAsSecureOrigin: true,
}).catch(err => console.warn('OneSignal init skipped (no App ID):', err))