import { useNavigate } from 'react-router-dom'
import '../styles/LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">AyurWebsites</div>
          <div className="nav-links">
            <a href="#contact">Contact</a>
            <button
              className="nav-dashboard"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className="nav-cta"
              onClick={() => navigate('/create')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Launch Your Ayurvedic Clinic Website in 10 Minutes
            </h1>
            <p className="hero-subtitle">
              Professional clinic website on your own domain with zero technical skills.
              No coding required. Start attracting more patients today.
            </p>

            <div className="hero-cta">
              <button
                className="btn-primary btn-lg"
                onClick={() => navigate('/create')}
              >
                Create My Clinic Website
              </button>
              <p className="cta-subtext">No credit card required | Start free | Cancel anytime</p>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Clinics Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Patients Reached</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-placeholder">
              <div className="mockup clinic-preview">
                <div className="mockup-header clinic-preview-header">
                  <div className="preview-brand">Smith Clinic</div>
                  <span className="preview-status">Live</span>
                </div>
                <div className="mockup-content clinic-preview-content">
                  <div className="preview-hero">
                    <div className="preview-avatar"></div>
                    <div className="preview-intro">
                      <h4>Dr. David Smith</h4>
                      <p>Ayurvedic Specialist</p>
                    </div>
                  </div>
                  <div className="preview-grid">
                    <div className="preview-card">
                      <span className="preview-card-title">Services</span>
                      <p>Panchakarma, Skin Care, Digestive Care</p>
                    </div>
                    <div className="preview-card">
                      <span className="preview-card-title">Contact</span>
                      <p>Book online in under 1 minute</p>
                    </div>
                  </div>
                  <button className="preview-btn" type="button">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Grow Your Clinic?</h2>
          <p>Join hundreds of Ayurvedic clinics already using AyurWebsites</p>
          <button
            className="btn-primary btn-lg"
            onClick={() => navigate('/create')}
          >
            Start Your Free Website Now
          </button>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AyurWebsites</h4>
              <p>Professional websites for Ayurvedic clinics</p>
              <div className="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">X</a>
                <a href="#" title="Instagram">IG</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 AyurWebsites. All rights reserved.</p>
            <p>Made for Ayurvedic Clinics</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
