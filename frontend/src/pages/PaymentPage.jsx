import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { paymentApi } from '../services/api'
import '../styles/PaymentPage.css'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { websiteData, setPayment, setLoading, setError } = useStore()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const amount = 99.99 // Example pricing

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      setError('Please fill in all card details')
      return
    }

    setLoading(true)
    try {
      const response = await paymentApi.processPayment({
        amount,
        currency: 'USD',
        paymentMethod,
        cardData,
        websiteName: websiteData.name
      })

      setPayment({
        amount,
        status: 'completed',
        transactionId: response.data.transactionId
      })

      navigate('/success')
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-page">
      <div className="container">
        <h1>Complete Your Payment</h1>
        
        <div className="payment-summary">
          <h2>Order Summary</h2>
          <p><strong>Clinic Name:</strong> {websiteData.clinicName || 'Your Clinic'}</p>
          <p><strong>Doctor:</strong> {websiteData.doctorName}</p>
          <p><strong>Location:</strong> {websiteData.city}</p>
          <p><strong>Template:</strong> {websiteData.template}</p>
          <p className="amount"><strong>Total Amount:</strong> ${amount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              <label className="method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card
              </label>
              <label className="method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/create')}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Pay ${amount.toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
