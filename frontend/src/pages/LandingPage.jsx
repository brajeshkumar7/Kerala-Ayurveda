import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import '../styles/LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useStore()

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <h1>AyurWebsites</h1>
          <p>Create Your Professional Ayurvedic Business Website in Minutes</p>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <h2>Why Choose AyurWebsites?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Easy to Use</h3>
              <p>No coding required. Create a professional website with just a few clicks.</p>
            </div>
            <div className="feature-card">
              <h3>Fully Customizable</h3>
              <p>Choose from beautiful templates designed specifically for Ayurvedic businesses.</p>
            </div>
            <div className="feature-card">
              <h3>Affordable Pricing</h3>
              <p>Flexible payment plans to suit businesses of all sizes.</p>
            </div>
            <div className="feature-card">
              <h3>Mobile Responsive</h3>
              <p>Your website looks perfect on all devices - desktop, tablet, and mobile.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate('/create')}
          >
            Create Your Website Now
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 AyurWebsites. All rights reserved.</p>
      </footer>
    </div>
  )
}
