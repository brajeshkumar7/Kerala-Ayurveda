import Razorpay from 'razorpay'
import crypto from 'crypto'

/**
 * Payment Controller - Razorpay Integration
 * Handles all payment-related operations
 */

// Initialize Razorpay with keys from environment
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

/**
 * POST /api/payment/create-order
 * 
 * Creates a Razorpay order for website creation
 * 
 * Request body:
 * {
 *   amount: number (in paisa, e.g., 9999 for ₹99.99),
 *   clinicName: string,
 *   customerEmail: string,
 *   customerPhone: string,
 *   domainName: string (optional)
 * }
 * 
 * Returns: { orderId, amount, currency, ... }
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, clinicName, customerEmail, customerPhone, domainName } = req.body

    // Validate required fields
    if (!amount || !clinicName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Amount, clinic name, email, and phone are required'
      })
    }

    // Amount should be in paisa (multiply by 100 if in rupees)
    const orderAmount = typeof amount === 'string' ? parseInt(amount) : amount

    // Create order options
    const options = {
      amount: orderAmount, // Amount in paisa
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        clinicName: clinicName,
        domainName: domainName || 'not-specified',
        customerEmail: customerEmail,
        customerPhone: customerPhone
      }
    }

    // Create order via Razorpay API
    const order = await razorpay.orders.create(options)

    return res.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        entity: order.entity,
        amount: order.amount,
        amount_paid: order.amount_paid,
        amount_due: order.amount_due,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        attempts: order.attempts,
        notes: order.notes,
        created_at: order.created_at
      }
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment order'
    })
  }
}

/**
 * POST /api/payment/verify
 * 
 * Verifies Razorpay payment using signature
 * This is called BEFORE creating the website
 * 
 * Request body:
 * {
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string
 * }
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Order ID, Payment ID, and Signature are required'
      })
    }

    // Create signature to verify payment
    const body = razorpay_order_id + '|' + razorpay_payment_id

    // Generate signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    // Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        error: 'Payment signature verification failed'
      })
    }

    // Signature is valid - payment is verified ✅
    return res.json({
      success: true,
      message: 'Payment verified successfully',
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id
    })
  } catch (error) {
    console.error('Error verifying payment:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify payment'
    })
  }
}

/**
 * POST /api/payment/capture
 * 
 * Captures payment (if authorized mode is used)
 */
export const capturePayment = async (req, res) => {
  try {
    const { razorpay_payment_id, amount } = req.body

    if (!razorpay_payment_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID and amount are required'
      })
    }

    // Capture the payment
    const payment = await razorpay.payments.capture(razorpay_payment_id, amount)

    return res.json({
      success: true,
      message: 'Payment captured successfully',
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency
      }
    })
  } catch (error) {
    console.error('Error capturing payment:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to capture payment'
    })
  }
}

/**
 * GET /api/payment/order/:orderId
 * 
 * Fetch order details from Razorpay
 */
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      })
    }

    // Fetch order from Razorpay
    const order = await razorpay.orders.fetch(orderId)

    return res.json({
      success: true,
      order: {
        id: order.id,
        entity: order.entity,
        amount: order.amount,
        amount_paid: order.amount_paid,
        amount_due: order.amount_due,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        attempts: order.attempts,
        notes: order.notes,
        created_at: order.created_at
      }
    })
  } catch (error) {
    console.error('Error fetching order:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order details'
    })
  }
}

/**
 * GET /api/payment/payment/:paymentId
 * 
 * Fetch payment details from Razorpay
 */
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      })
    }

    // Fetch payment from Razorpay
    const payment = await razorpay.payments.fetch(paymentId)

    return res.json({
      success: true,
      payment: {
        id: payment.id,
        entity: payment.entity,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        description: payment.description,
        email: payment.email,
        contact: payment.contact,
        fee: payment.fee,
        tax: payment.tax,
        notes: payment.notes,
        created_at: payment.created_at
      }
    })
  } catch (error) {
    console.error('Error fetching payment:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment details'
    })
  }
}

/**
 * POST /api/payment/refund
 * 
 * Refund a payment
 */
export const refundPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, amount } = req.body

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      })
    }

    // Create refund
    const refund = await razorpay.payments.refund(razorpay_payment_id, {
      amount: amount || undefined // undefined = full refund
    })

    return res.json({
      success: true,
      message: 'Payment refunded successfully',
      refund: {
        id: refund.id,
        entity: refund.entity,
        payment_id: refund.payment_id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        created_at: refund.created_at
      }
    })
  } catch (error) {
    console.error('Error refunding payment:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to refund payment'
    })
  }
}

/**
 * GET /api/payment/:paymentId
 * 
 * Get payment status (existing function)
 */
export const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      })
    }

    const payment = await razorpay.payments.fetch(paymentId)

    return res.json({
      success: true,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method
    })
  } catch (error) {
    console.error('Error fetching payment:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment'
    })
  }
}

/**
 * GET /api/payment (admin)
 * 
 * Get all payments (requires admin auth)
 */
export const getPayments = async (req, res) => {
  try {
    // TODO: Add admin authentication check
    
    const payments = await razorpay.payments.all({
      count: 50 // Fetch last 50 payments
    })

    return res.json({
      success: true,
      count: payments.count,
      payments: payments.items
    })
  } catch (error) {
    console.error('Error fetching payments:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payments'
    })
  }
}
