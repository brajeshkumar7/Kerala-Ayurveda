import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import '../styles/SuccessPage.css'

const CLINIC_BASE_DOMAIN = import.meta.env.VITE_CLINIC_BASE_DOMAIN || 'ayurwebsites.com'
const ENABLE_CUSTOM_SUBDOMAINS = import.meta.env.VITE_ENABLE_CUSTOM_SUBDOMAINS === 'true'

const getWebsiteUrl = (domainName) => {
  if (!domainName) return '#'

  const appRouteUrl = `${window.location.origin}/clinic?domain=${encodeURIComponent(domainName)}`

  if (!ENABLE_CUSTOM_SUBDOMAINS) {
    return appRouteUrl
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return appRouteUrl
  }

  return `https://${domainName}.${CLINIC_BASE_DOMAIN}`
}

export default function SuccessPage() {
  const navigate = useNavigate()
  const { payment, websiteData } = useStore()

  useEffect(() => {
    if (!payment.transactionId) {
      navigate('/landing')
    }
  }, [payment, navigate])

  const websiteUrl = getWebsiteUrl(websiteData.domainName)

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">Success</div>

          <h1>Your clinic website is live!</h1>

          <div className="domain-display">
            <p className="domain-label">Your Website</p>
            <p className="domain-name">
              {ENABLE_CUSTOM_SUBDOMAINS
                ? `${websiteData.domainName}.${CLINIC_BASE_DOMAIN}`
                : `${window.location.origin}/clinic?domain=${websiteData.domainName}`}
            </p>
          </div>

          <div className="details">
            <div className="detail-item">
              <span className="label">Clinic Name:</span>
              <span className="value">{websiteData.clinicName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Doctor:</span>
              <span className="value">{websiteData.doctorName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Payment ID:</span>
              <span className="value code">{payment.transactionId}</span>
            </div>
          </div>

          <div className="actions">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-visit"
            >
              Visit Website
            </a>
            <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
              View Dashboard
            </button>
            <button className="btn-home" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
