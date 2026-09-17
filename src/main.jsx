import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import rtlCache from './rtlCache.js'
import theme from './theme.js'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* HashRouter تا مسیرها بعد از نصب PWA و بازکردن آفلاین هم به‌درستی کار کنند */}
        <HashRouter>
          <App />
        </HashRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
)
