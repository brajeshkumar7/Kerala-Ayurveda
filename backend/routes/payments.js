import express from 'express'
import {
  createOrder,
  verifyPayment,
  capturePayment,
  getOrderDetails,
  getPaymentDetails,
  refundPayment,
  getPayment,
  getPayments
} from '../controllers/paymentController.js'

const router = express.Router()

/**
 * Payment Routes - Razorpay Integration
 */

// ===== CREATE ORDER =====
/**
 * POST /api/payment/create-order
 * Create a Razorpay order for website creation
 * 
 * Body: { amount, clinicName, customerEmail, customerPhone, domainName }
 * Returns: { orderId, amount, currency, ... }
 */
router.post('/create-order', createOrder)

// ===== VERIFY PAYMENT =====
/**
 * POST /api/payment/verify
 * Verify payment signature after successful transaction
 * 
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Returns: { success: true/false }
 */
router.post('/verify', verifyPayment)

// ===== CAPTURE PAYMENT =====
/**
 * POST /api/payment/capture
 * Capture authorized payment
 * 
 * Body: { razorpay_payment_id, amount }
 */
router.post('/capture', capturePayment)

// ===== REFUND PAYMENT =====
/**
 * POST /api/payment/refund
 * Refund a payment
 * 
 * Body: { razorpay_payment_id, amount (optional) }
 */
router.post('/refund', refundPayment)

// ===== GET ORDER DETAILS =====
/**
 * GET /api/payment/order/:orderId
 * Fetch order details from Razorpay
 */
router.get('/order/:orderId', getOrderDetails)

// ===== GET PAYMENT DETAILS =====
/**
 * GET /api/payment/payment/:paymentId
 * Fetch payment details from Razorpay
 */
router.get('/payment/:paymentId', getPaymentDetails)

// ===== GET SINGLE PAYMENT =====
/**
 * GET /api/payment/:paymentId
 * Get payment status
 */
router.get('/:paymentId', getPayment)

// ===== GET ALL PAYMENTS =====
/**
 * GET /api/payment
 * Get all payments (admin only)
 */
router.get('/', getPayments)

export default router
