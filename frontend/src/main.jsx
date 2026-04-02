import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initGA } from './utils/analytics';
import './index.css'
import App from './App.jsx'

initGA();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
