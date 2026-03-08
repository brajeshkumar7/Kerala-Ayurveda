import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    websiteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    stripePaymentIntentId: String,
    invoiceNumber: {
      type: String,
      unique: true
    },
    description: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    errorMessage: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: String,
    refundedAt: Date
  },
  {
    timestamps: true
  }
)

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
