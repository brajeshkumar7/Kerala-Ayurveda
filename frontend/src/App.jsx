import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreateWebsitePage from './pages/CreateWebsitePage'
import PaymentPage from './pages/PaymentPage'
import SuccessPage from './pages/SuccessPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateWebsitePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  )
}

export default App
