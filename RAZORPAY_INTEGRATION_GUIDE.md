# Razorpay Payment Integration Guide

## Overview

AyurWebsites now integrates **Razorpay** for secure payment processing. The payment flow is:

1. **User fills clinic form** on CreateWebsitePage
2. **User clicks "Create Website & Proceed to Payment"**
3. **Payment modal opens** with Razorpay checkout
4. **User completes payment** in Razorpay modal
5. **Payment verified** via signature verification
6. **Website created** on backend with payment details
7. **Success page shown** with clinic details

## Setup Instructions

### Step 1: Get Razorpay Keys

1. Create account at https://razorpay.com
2. Navigate to Dashboard → Settings → API Keys
3. Copy your **Test Keys** (for development):
   - Key ID: `rzp_test_xxxxx`
   - Key Secret: `xxxxxxxxxx`

### Step 2: Backend Configuration

Update `backend/.env`:

```
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1
```

### Step 3: Frontend Configuration

Create `frontend/.env.local`:

```
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
```

### Step 4: Add Razorpay Script

Add to `frontend/index.html` (in the `<head>` section):

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 5: Install Razorpay npm Package

Backend:

```bash
cd backend
npm install razorpay
```

## API Endpoints

### Create Order
```
POST /api/payment/create-order

Body: {
  amount: 9999,              // Amount in paisa
  clinicName: "Clinic Name",
  customerEmail: "email@example.com",
  customerPhone: "+91-9876543210",
  domainName: "clinic-domain"
}

Response: {
  success: true,
  order: {
    id: "order_123xxx",
    amount: 9999,
    currency: "INR",
    status: "created"
  }
}
```

### Verify Payment
```
POST /api/payment/verify

Body: {
  razorpay_order_id: "order_123xxx",
  razorpay_payment_id: "pay_123xxx",
  razorpay_signature: "signature_hash"
}

Response: {
  success: true,
  message: "Payment verified successfully",
  razorpay_payment_id: "pay_123xxx"
}
```

### Get Order Details
```
GET /api/payment/order/:orderId

Response: {
  success: true,
  order: { ... order details ... }
}
```

### Get Payment Details
```
GET /api/payment/payment/:paymentId

Response: {
  success: true,
  payment: { ... payment details ... }
}
```

### Refund Payment
```
POST /api/payment/refund

Body: {
  razorpay_payment_id: "pay_123xxx",
  amount: 5000  // Optional - full refund if omitted
}

Response: {
  success: true,
  refund: { ... refund details ... }
}
```

## Frontend Payment Flow

### RazorpayPayment Component

```jsx
import RazorpayPayment from '../components/RazorpayPayment'

<RazorpayPayment
  clinicData={formData}
  amount={9999}  // Amount in paisa
  onPaymentSuccess={(paymentDetails) => {
    // Handle successful payment
    // Save payment ID to database
    // Show success message
  }}
  onPaymentError={(error) => {
    // Handle payment error
    // Show error message to user
  }}
/>
```

### How It Works

1. **User clicks "Pay with Razorpay"**
   ```javascript
   createRazorpayOrder() // Create order on backend
   ```

2. **Razorpay Modal Opens**
   ```javascript
   openRazorpayModal(order) // Opens Razorpay checkout
   ```

3. **User Enters Payment Details**
   - Card, Netbanking, UPI, Wallet, etc.

4. **Payment Success**
   ```javascript
   verifyPayment(paymentResponse) // Verify signature
   onPaymentSuccess(paymentDetails) // Create website
   ```

5. **Payment Failure**
   ```javascript
   showError(errorMessage) // Show error to user
   ```

## Signature Verification

The signature is crucial for security. Never trust the frontend response directly!

```javascript
// Backend verification
const body = orderId + '|' + paymentId
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex')

const isValid = expectedSignature === receivedSignature
```

## Testing with Test Keys

Use these test card numbers (in test mode):

### Successful Payment
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456`

### Failed Payment
- Card Number: `4222 2222 2222 2222`

### Test UPI
- UPI: `success@razorpay` → Success
- UPI: `failure@razorpay` → Failure

## Payment States

### Order Creation
- Request sent to `/api/payment/create-order`
- Order created in Razorpay
- Order ID returned to frontend

### Payment Processing
- User opens Razorpay modal
- Enters payment details
- Razorpay processes payment

### Signature Verification
- Frontend sends payment details to `/api/payment/verify`
- Backend verifies signature using HMAC-SHA256
- Returns success/failure

### Website Creation
- After signature verification
- Frontend calls POST `/api/websites`
- Website created in database with payment ID

## Error Handling

### Common Errors

**1. Invalid Keys**
```
Error: API call failed: Invalid API key id
```
→ Check RAZORPAY_KEY_ID in .env

**2. Payment Verification Failed**
```
Error: Payment signature verification failed
```
→ Check RAZORPAY_KEY_SECRET, ensure it matches

**3. Order Not Found**
```
Error: Order with ID not found
```
→ Check order ID, verify it was created

**4. Payment Cancelled**
```
User dismissed payment modal
```
→ User can retry payment

## Frontend Files Modified

1. **CreateWebsitePage.jsx** - Added payment flow
2. **RazorpayPayment.jsx** - Payment component
3. **RazorpayPayment.css** - Component styling
4. **App.jsx** - Routes updated
5. **index.html** - Razorpay script added

## Backend Files Modified

1. **paymentController.js** - Razorpay integration
2. **routes/payments.js** - Payment endpoints
3. **.env.example** - Razorpay keys

## Production Deployment

### Step 1: Get Live Keys

1. Complete Razorpay onboarding
2. Navigate to Settings → API Keys
3. Switch to Live Mode
4. Copy your **Live Keys**

### Step 2: Update Environment

Update `backend/.env`:

```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

### Step 3: Verify Webhook (Optional)

For settlements, you can setup Razorpay webhooks:

1. Go to Settings → Webhooks
2. Add webhook URL
3. Select events: `payment.authorized`, `payment.failed`
4. Verify signatures in webhook handler

### Step 4: Test Live Payments

Use a small amount to test live payment flow before going public.

## Security Best Practices

✅ **Always verify signatures** on backend  
✅ **Never store payment details** in plaintext  
✅ **Use HTTPS** in production  
✅ **Rotate keys regularly**  
✅ **Enable webhooks** for critical payments  
✅ **Log payment transactions** for audit  
✅ **Use test keys** during development  
✅ **Monitor failed payments** and retry  

## Troubleshooting

### Payment Modal Not Opening

**Check 1**: Razorpay script loaded?
```javascript
console.log(window.Razorpay) // Should exist
```

**Check 2**: Valid Key ID?
```javascript
// Should be rzp_test_xxxxx or rzp_live_xxxxx
const key = import.meta.env.VITE_RAZORPAY_KEY_ID
```

**Check 3**: Order created successfully?
```javascript
// Check network tab for /api/payment/create-order response
```

### Signature Verification Fails

**Check 1**: Keys match?
```bash
# Backend .env
RAZORPAY_KEY_SECRET=xxxxxxxx

# Verify in payment controller
console.log(process.env.RAZORPAY_KEY_SECRET)
```

**Check 2**: Signature calculation correct?
```javascript
const body = orderId + '|' + paymentId
console.log('Body:', body)
console.log('Expected:', expectedSignature)
console.log('Received:', receivedSignature)
```

### Payment Created but Website Not Created

**Check**: Payment verified before website creation?
```javascript
// Verify endpoint should return success: true
// Only then create website
```

## Testing Checklist

- [ ] Razorpay script loads in browser
- [ ] Create order endpoint returns order ID
- [ ] Payment modal opens when clicking pay button
- [ ] Test card payment completes
- [ ] Signature verification succeeds
- [ ] Website created after payment
- [ ] Success page shows payment details
- [ ] Error messages display correctly
- [ ] Refund API works
- [ ] Order/payment details fetched correctly

## Support

- **Razorpay Docs**: https://razorpay.com/docs
- **Test Keys**: https://dashboard.razorpay.com/settings/api
- **Support**: support@razorpay.com

---

**Status**: ✅ Razorpay integration complete and ready for testing!
