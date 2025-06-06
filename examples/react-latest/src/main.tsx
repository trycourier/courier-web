import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Strict mode is disabled to get an idea of the production build
createRoot(document.getElementById('root')!).render(<App />)
