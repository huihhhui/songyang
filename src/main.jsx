import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App.jsx'
import './app/styles.css'
import { AudioProvider } from './audio/AudioProvider.jsx'
import { assetPath } from './lib/assetPath.js'

document.documentElement.style.setProperty('--asset-ke-bq-house', `url(${assetPath('ke/bq-01-earthen-house-v13.png')})`)
document.documentElement.style.setProperty('--asset-ke-lamp', `url(${assetPath('ke/sz-02-lamp-v10.png')})`)
document.documentElement.style.setProperty('--asset-source-teacher', `url(${assetPath('source/banqiao/teacher-weaving.jpg')})`)
document.documentElement.style.setProperty('--asset-bamboo-strip', `url(${assetPath('imagegen/banqiao-assets/banqiao-bamboo-strip-v1-alpha-trim.png')})`)
document.documentElement.style.setProperty('--asset-lan-scrollbar', `url(${assetPath('imagegen/banqiao-assets/lan-scrollbar-v1.png')})`)
document.documentElement.style.setProperty('--asset-font-oradano', `url(${assetPath('imagegen/banqiao-assets/ORADANOMingChaoTi/ORADANOMingChaoTi/CC0-OradanoMingChaoTi-2.ttf')})`)
document.documentElement.style.setProperty('--asset-font-crayon', `url(${assetPath('imagegen/banqiao-assets/KidTYPE-Crayon/KidTYPE-Crayon/殴り書きクレヨン')})`)
document.documentElement.style.setProperty('--asset-font-huiwen', `url(${assetPath('imagegen/banqiao-assets/Huiwenmingchaoti/汇文明朝体.otf')})`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AudioProvider><App /></AudioProvider>
    </HashRouter>
  </StrictMode>,
)
