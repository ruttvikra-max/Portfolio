import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CardTilt from './components/CardTilt.jsx'

function App() {
  return <CardTilt />
}

const mount = document.createElement('div')
mount.id = 'tier2-root'
document.body.appendChild(mount)

createRoot(mount).render(
  <StrictMode>
    <App />
  </StrictMode>
)
