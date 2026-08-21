import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App.jsx'
import './app/styles.css'
import { AudioProvider } from './audio/AudioProvider.jsx'
import { assetPath } from './lib/assetPath.js'

const cssAsset = (path) => `url(${new URL(assetPath(path), document.baseURI).href})`

document.documentElement.style.setProperty('--asset-ke-bq-house', cssAsset('ke/bq-01-earthen-house-v13.png'))
document.documentElement.style.setProperty('--asset-ke-lamp', cssAsset('ke/sz-02-lamp-v10.png'))
document.documentElement.style.setProperty('--asset-source-teacher', cssAsset('source/banqiao/teacher-weaving.jpg'))
document.documentElement.style.setProperty('--asset-bamboo-strip', cssAsset('imagegen/banqiao-assets/banqiao-bamboo-strip-v1-alpha-trim.png'))
document.documentElement.style.setProperty('--asset-lan-scrollbar', cssAsset('imagegen/banqiao-assets/lan-scrollbar-v1.png'))
document.documentElement.style.setProperty('--asset-font-pingfang', cssAsset('fonts/PingFangQiaoMuTi.ttf'))
document.documentElement.style.setProperty('--asset-font-crayon', cssAsset('fonts/KidTypeCrayon.ttf'))
// Keep the Chinese font in a short, ASCII asset path so Vite and GitHub Pages
// serve it consistently across local and production builds.
document.documentElement.style.setProperty('--asset-font-huiwen', cssAsset('fonts/HuiwenMing.otf'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AudioProvider><App /></AudioProvider>
    </HashRouter>
  </StrictMode>,
)
