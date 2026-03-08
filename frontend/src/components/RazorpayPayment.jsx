import React, { useState } from 'react'
import './RazorpayPayment.css'

/**
 * Razorpay Payment Component
 * 
 * Handles payment flow:
 * 1. Create order via API
 * 2. Open Razorpay payment modal
 * 3. User completes payment
 * 4. Verify signature
 * 5. Create website (if verified)
 */

const RazorpayPayment = ({ 
  clinicData, 
  amount = 9999, // Default: ₹99.99
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Step 1: Create Razorpay Order
   */
  const createRazorpayOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount, // Amount in paisa
          clinicName: clinicData.clinicName,
          customerEmail: clinicData.email,
          customerPhone: clinicData.phone,
          domainName: clinicData.domainName
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data.order
    } catch (err) {
      console.error('Error creating order:', err)
      setError(err.message)
      onPaymentError?.(err.message)
      throw err
    }
  }

  /**
   * Step 2: Open Razorpay Checkout Modal
   */
  const openRazorpayModal = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890abcd',
      amount: order.amount, // Amount in paisa
      currency: order.currency,
      name: 'AyurWebsites',
      description: `Create website for ${clinicData.clinicName}`,
      order_id: order.id,
      
      handler: (response) => {
        // Payment successful - Step 3
        verifyPayment(response)
      },

      prefill: {
        name: clinicData.clinicName,
        email: clinicData.email,
        contact: clinicData.phone
      },

      notes: {
        clinicName: clinicData.clinicName,
        domainName: clinicData.domainName
      },

      theme: {
        color: '#667eea'
      },

      modal: {
        ondismiss: () => {
          setLoading(false)
          setError('Payment cancelled')
          onPaymentError?.('Payment cancelled by user')
        }
      }
    }

    // Create Razorpay instance and open checkout
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  /**
   * Step 3: Verify Payment Signature
   */
  const verifyPayment = async (paymentResponse) => {
    try {
      setLoading(true)

      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      })

      const verifyData = await verifyResponse.json()

      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

      // ✅ Payment verified - Step 4: Create website
      onPaymentSuccess({
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        amount: amount,
        timestamp: new Date().toISOString()
      })

      setLoading(false)
    } catch (err) {
      console.error('Error verifying payment:', err)
      setError(err.message)
      onPaymentError?.(err.message)
      setLoading(false)
    }
  }

  /**
   * Main function: Handle payment button click
   */
  const handlePaymentClick = async () => {
    try {
      setError(null)
      const order = await createRazorpayOrder()
      openRazorpayModal(order)
    } catch (err) {
      // Error already set in createRazorpayOrder
    }
  }

  return (
    <div className="razorpay-payment">
      {error && (
        <div className="payment-error">
          <span>❌ {error}</span>
        </div>
      )}

      <button
        className="payment-button"
        onClick={handlePaymentClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          <>
            <span>💳</span> Pay ₹{(amount / 100).toFixed(2)} with Razorpay
          </>
        )}
      </button>

      <p className="payment-info">
        Secure payment powered by <strong>Razorpay</strong>
      </p>
    </div>
  )
}

export default RazorpayPayment
