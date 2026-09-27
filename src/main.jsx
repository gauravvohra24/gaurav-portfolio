import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { preloadDeferredChunks } from './lib/lazy.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Fetch the deferred section chunks once the page has painted, so they're ready before the visitor scrolls.
const preload = () => setTimeout(preloadDeferredChunks, 200)
if (document.readyState === 'complete') preload()
else window.addEventListener('load', preload, { once: true })
