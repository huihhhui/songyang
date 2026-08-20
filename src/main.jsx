import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App.jsx'
import './app/styles.css'
import { AudioProvider } from './audio/AudioProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AudioProvider><App /></AudioProvider>
    </HashRouter>
  </StrictMode>,
)
