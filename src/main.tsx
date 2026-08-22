import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')

function showError(err: unknown) {
  const message = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ''}` : String(err)
  if (!rootEl) return
  rootEl.innerHTML = `<pre style="padding:24px;margin:0;font:13px/1.45 ui-monospace,monospace;color:#991b1b;background:#fef2f2;white-space:pre-wrap">${message.replace(/</g, '<')}</pre>`
}

window.addEventListener('error', (e) => showError(e.error || e.message))
window.addEventListener('unhandledrejection', (e) => showError(e.reason))

try {
  if (!rootEl) throw new Error('#root bulunamadı')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  showError(err)
}
