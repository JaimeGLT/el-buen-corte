import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import VoiceflowChat from './components/Chat.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    {/* <VoiceflowChat /> */}
  </BrowserRouter>,
)
