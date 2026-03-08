import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import '../styles/SuccessPage.css'

export default function SuccessPage() {
  const navigate = useNavigate()
  const { payment, websiteData } = useStore()

  useEffect(() => {
    if (!payment.transactionId) {
      navigate('/create')
    }
  }, [payment, navigate])

  const websiteUrl = `http://${websiteData.domainName}.localhost:5000`

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          
          <h1>Your clinic website is live!</h1>
          
          <div className="domain-display">
            <p className="domain-label">Your Website</p>
            <p className="domain-name">{websiteData.domainName}</p>
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
            <button className="btn-home" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
