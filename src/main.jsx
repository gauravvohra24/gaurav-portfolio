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

// Start fetching the deferred section chunks immediately, in parallel with the page's own
// assets, so they mount (almost always before first scroll) instead of shifting content later.
setTimeout(preloadDeferredChunks, 0)
