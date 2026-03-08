import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import '../styles/LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useStore()
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast Setup',
      description: 'Launch your clinic website in just 10 minutes. No coding, no hassle.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Templates',
      description: 'Professional, modern templates designed specifically for Ayurvedic clinics.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Perfect display on all devices - desktop, tablet, and mobile phones.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime guarantee.'
    },
    {
      icon: '🌐',
      title: 'Custom Domain',
      description: 'Use your own domain name and establish your professional online presence.'
    },
    {
      icon: '📊',
      title: 'Built-in Analytics',
      description: 'Track visitor metrics and understand your clinic\'s online performance.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 20,
      yearPrice: 200,
      description: 'Perfect for new clinics',
      features: [
        'Custom domain',
        '5 service pages',
        'Contact form',
        'Mobile responsive',
        'Email support'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: 49,
      yearPrice: 490,
      description: 'For growing practices',
      features: [
        'Everything in Starter',
        'Unlimited pages',
        'Appointment booking',
        'Payment integration',
        'SEO optimization',
        'Priority support'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 99,
      yearPrice: 990,
      description: 'For established clinics',
      features: [
        'Everything in Professional',
        'Multi-clinic management',
        'Custom integrations',
        'Advanced analytics',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      recommended: false
    }
  ]

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🌿 AyurWebsites</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <button 
              className="nav-cta"
              onClick={() => navigate('/create')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <p className="cta-subtext">✓ No credit card required  ✓ Start free  ✓ Cancel anytime</p>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Clinics Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
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
              <div className="mockup">
                <div className="mockup-header">
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                  <span className="mockup-dot"></span>
                </div>
                <div className="mockup-content">
                  <div className="mockup-line long"></div>
                  <div className="mockup-line"></div>
                  <div className="mockup-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AyurWebsites?</h2>
            <p>Everything you need to establish a professional online presence</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that works best for your clinic</p>
          </div>

          <div className="pricing-toggle">
            <span>Monthly</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            <span>Yearly <span className="save-badge">Save 20%</span></span>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
              >
                {plan.recommended && <div className="recommended-badge">Most Popular</div>}
                
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/month</span>
                </div>
                <p className="plan-annual">Or ${plan.yearPrice}/year (20% off)</p>

                <button 
                  className={`btn-pricing ${plan.recommended ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => navigate('/create')}
                >
                  Get Started
                </button>

                <div className="features-list">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="checkmark">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AyurWebsites</h4>
              <p>Professional websites for Ayurvedic clinics</p>
              <div className="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Twitter">𝕏</a>
                <a href="#" title="Instagram">📷</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
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
            <p>Made with 🌿 for Ayurvedic Clinics</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
