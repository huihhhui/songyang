import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App.jsx'
import './app/styles.css'
import { AudioProvider } from './audio/AudioProvider.jsx'
import { assetPath } from './lib/assetPath.js'

const cssAsset = (path) => `url(${new URL(assetPath(path), document.baseURI).href})`
const fontAsset = (path) => new URL(assetPath(path), document.baseURI).href

// Keep font URLs absolute at runtime. Edge can reject a CSS variable nested
// inside @font-face src, while a concrete style URL works in local and Pages.
const fontStyle = document.createElement('style')
fontStyle.textContent = [
  ['KidTYPE Crayon', 'fonts/KidTypeCrayon.ttf', 'truetype'],
  ['Huiwen Ming', 'fonts/HuiwenMing.otf', 'opentype'],
].map(([family, path, format]) => `@font-face{font-family:"${family}";src:url("${fontAsset(path)}") format("${format}");font-style:normal;font-weight:100 900;font-display:swap;}`).join('')
document.head.appendChild(fontStyle)

document.documentElement.style.setProperty('--asset-ke-bq-house', cssAsset('ke/bq-01-earthen-house-v13.png'))
document.documentElement.style.setProperty('--asset-ke-lamp', cssAsset('ke/sz-02-lamp-v10.png'))
document.documentElement.style.setProperty('--asset-source-teacher', cssAsset('source/banqiao/teacher-weaving.jpg'))
document.documentElement.style.setProperty('--asset-bamboo-strip', cssAsset('imagegen/banqiao-assets/banqiao-bamboo-strip-v1-alpha-trim.png'))
document.documentElement.style.setProperty('--asset-lan-scrollbar', cssAsset('imagegen/banqiao-assets/lan-scrollbar-v1.png'))
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
