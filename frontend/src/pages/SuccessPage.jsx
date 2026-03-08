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

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          
          <h1>Payment Successful!</h1>
          
          <p className="success-message">
            Congratulations! Your website "<strong>{websiteData.name}</strong>" has been successfully created.
          </p>

          <div className="details">
            <div className="detail-item">
              <span className="label">Transaction ID:</span>
              <span className="value">{payment.transactionId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">${payment.amount?.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Website Template:</span>
              <span className="value">{websiteData.template}</span>
            </div>
          </div>

          <div className="next-steps">
            <h2>What's Next?</h2>
            <ol>
              <li>An email confirmation has been sent to your registered email address</li>
              <li>Your website will be live within the next 24 hours</li>
              <li>You can start editing your website from your dashboard</li>
              <li>We'll send you a separate email with your login credentials</li>
            </ol>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => navigate('/')}>
              Back to Home
            </button>
            <button className="btn-secondary" onClick={() => navigate('/create')}>
              Create Another Website
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
