import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Shop from './pages/Shop.jsx'
import Send from './pages/Send.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Documentation from './pages/Documentation.jsx'
import { useEffect } from 'react'
import { prewarmServer } from './lib/peer'

function App() {
  useEffect(() => {
    prewarmServer();
    // Re-ping every 60s to stay awake while user explores
    const interval = setInterval(prewarmServer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <main className="page-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/send" element={<Send />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
