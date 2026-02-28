import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MusicBtn from './MusicBtn.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <MusicBtn />
  </StrictMode>,
)
