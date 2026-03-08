# Razorpay Payment Integration Testing Guide

Complete testing procedures for the Razorpay payment system.

## Test Scenarios

### Scenario 1: Successful Payment Flow

**Objective**: Verify complete payment flow from form to website creation

**Steps**:
1. Navigate to http://localhost:5173
2. Click "Get Started"
3. Fill clinic form with:
   - Doctor name: "Dr. Test Patient"
   - Clinic name: "Test Clinic"
   - Email: "test@example.com"
   - Phone: "+91-9876543210"
   - Domain: "test-clinic"
   - Select Basic plan ($99.99)
4. Click "Create Website & Proceed to Payment"

**Expected Results**:
- ✅ Payment modal appears
- ✅ Order summary shows clinic name and amount
- ✅ "Pay with Razorpay" button is visible

5. Click "Pay with Razorpay" button

**Expected Results**:
- ✅ Razorpay modal opens
- ✅ Form shows payment options (Card, UPI, Netbanking, etc.)

6. Select Card payment
7. Enter test card details:
   ```
   Card Number: 4111 1111 1111 1111
   Name: Any name
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits (e.g., 123)
   ```
8. Click "Continue"

**Expected Results**:
- ✅ OTP/3D Secure prompt appears

9. Enter OTP: `123456`
10. Click "Verify"

**Expected Results**:
- ✅ Modal closes
- ✅ Success message displays
- ✅ User redirected to success page
- ✅ Page shows:
    - Clinic name
    - Domain name
    - Payment ID (pay_xxxxx)
    - Order ID (order_xxxxx)
    - Created At timestamp

**Verify in Database**:
```javascript
db.doctorsites.findOne({ domainName: "test-clinic" })
// Should show: paymentId, orderId, amount fields populated
```

### Scenario 2: Payment Failure

**Objective**: Verify proper error handling on failed payment

**Steps**:
1. Fill clinic form
2. Click "Create Website & Proceed to Payment"
3. Click "Pay with Razorpay"
4. Select Card payment
5. Enter failed test card:
   ```
   Card Number: 4222 2222 2222 2222
   Expiry: Any future date
   CVV: Any 3 digits
   ```
6. Enter OTP: `000000` (wrong OTP)

**Expected Results**:
- ✅ Payment fails with error message
- ✅ Modal doesn't close
- ✅ Error message displayed to user
- ✅ User can click "Pay with Razorpay" again to retry

### Scenario 3: Payment Cancellation

**Objective**: Verify user can cancel payment and retry

**Steps**:
1. Fill clinic form
2. Click "Create Website & Proceed to Payment"
3. Click "Pay with Razorpay"
4. Close Razorpay modal (click X or press ESC)

**Expected Results**:
- ✅ Modal closes gracefully
- ✅ Error message: "Payment cancelled by user" or similar
- ✅ Payment modal still visible (user can retry)
- ✅ No website created in database

### Scenario 4: Network Error During Payment

**Objective**: Verify resilience to network errors

**Steps**:
1. Fill clinic form
2. Click "Create Website & Proceed to Payment"
3. Open browser DevTools (F12)
4. Go to Network tab
5. Check "Offline" checkbox to simulate network outage
6. Click "Pay with Razorpay"

**Expected Results**:
- ✅ Error message displayed
- ✅ No crash or hang
- ✅ User can retry after going online

### Scenario 5: Multiple Payment Attempts

**Objective**: Verify system handles retries correctly

**Steps**:
1. Fill clinic form
2. Click payment button
3. Try payment with test card that fails
4. Observe error message
5. Click "Pay with Razorpay" again
6. Try same test card (should fail again)
7. Click "Pay with Razorpay" once more
8. Use success test card: `4111 1111 1111 1111`
9. Complete payment

**Expected Results**:
- ✅ Each attempt is independent
- ✅ No duplicate websites created
- ✅ Only final successful payment is stored

### Scenario 6: Form Validation

**Objective**: Verify form validates before showing payment

**Steps**:

**Test Missing Email:**
1. Fill all fields except email
2. Click "Create Website & Proceed to Payment"
3. **Expected**: Validation error for email

**Test Invalid Phone:**
1. Fill phone with: "123" (too short)
2. **Expected**: Validation error for phone

**Test Missing Clinic Name:**
1. Leave clinic name empty
2. **Expected**: Validation error

**Test Duplicate Domain:**
1. Use domain that already exists from previous payment
2. **Expected**: Domain already taken error

## API Endpoint Testing

### Test Create Order Endpoint

```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 9999,
    "clinicName": "API Test Clinic",
    "customerEmail": "api-test@example.com",
    "customerPhone": "+91-9876543210",
    "domainName": "api-test-clinic"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_12345xxx",
    "amount": 9999,
    "currency": "INR",
    "status": "created"
  }
}
```

### Test Verify Payment Endpoint

```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_12345xxx",
    "razorpay_payment_id": "pay_12345xxx",
    "razorpay_signature": "xxxxxxxxxxxxxxx"
  }'
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "razorpay_payment_id": "pay_12345xxx"
}
```

**Expected Response** (Failure):
```json
{
  "success": false,
  "error": "Payment signature verification failed"
}
```

### Test Get Order Details

```bash
curl -X GET http://localhost:5000/api/payment/order/order_12345xxx
```

**Expected Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_12345xxx",
    "entity": "order",
    "amount": 9999,
    "amount_paid": 9999,
    "amount_due": 0,
    "currency": "INR",
    "status": "paid",
    ...
  }
}
```

### Test Get Payment Details

```bash
curl -X GET http://localhost:5000/api/payment/payment/pay_12345xxx
```

**Expected Response**:
```json
{
  "success": true,
  "payment": {
    "id": "pay_12345xxx",
    "entity": "payment",
    "amount": 9999,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "description": "Website creation - Test Clinic",
    ...
  }
}
```

## Browser Console Testing

### Check Razorpay Script Loaded

```javascript
// In browser console (F12)
console.log(window.Razorpay)
// Should print: Razorpay constructor function
```

### Check API Calls

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "XHR" (XMLHttpRequest)
4. Perform payment flow
5. Verify requests:

**Expected Requests**:
```
POST /api/payment/create-order     Status: 200
POST /api/payment/verify           Status: 200
POST /api/websites                 Status: 201
```

### Monitor Frontend State

```javascript
// Check payment state in component
// Add console.log in RazorpayPayment.jsx:
console.log('Loading:', loading)
console.log('Error:', error)
console.log('Order Created:', orderId)
console.log('Payment Verified:', paymentVerified)
```

## Database Verification

### Check Website Created

```javascript
// MongoDB Shell
db.doctorsites.findOne({ domainName: "test-clinic" })

// Should show:
{
  _id: ObjectId(...),
  doctorName: "Dr. Test Patient",
  clinicName: "Test Clinic",
  email: "test@example.com",
  phone: "+91-9876543210",
  domainName: "test-clinic",
  paymentId: "pay_12345xxx",
  orderId: "order_12345xxx",
  amount: 9999,
  isPublished: true,
  createdAt: Date(...),
  ...
}
```

### Check Payment Recorded

```javascript
// Count websites by payment status
db.doctorsites.countDocuments({ paymentId: { $exists: true } })
// Should increase with each successful payment
```

### List All Websites

```javascript
// See all created websites
db.doctorsites.find().pretty()

// See unpublished websites
db.doctorsites.find({ isPublished: false }).pretty()
```

## Performance Testing

### Load Test Order Creation

```bash
# Using Apache Bench
ab -n 100 -c 10 -p order.json \
  -T application/json \
  http://localhost:5000/api/payment/create-order

# order.json contains:
{
  "amount": 9999,
  "clinicName": "Test",
  "customerEmail": "test@test.com",
  "customerPhone": "+91-9876543210",
  "domainName": "test"
}
```

**Expected Results**:
- Response time < 500ms per request
- No server crashes
- Error rate 0%

### Load Test Payment Verification

```bash
# Simulate 50 concurrent verification requests
ab -n 50 -c 50 -p verify.json \
  -T application/json \
  http://localhost:5000/api/payment/verify
```

**Expected Results**:
- All requests complete
- No memory leaks
- Consistent response times

## Security Testing

### Test Signature Verification

**Scenario 1: Valid Signature**
```javascript
// Correct signature should verify
const signature = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(orderId + '|' + paymentId)
  .digest('hex')
// Should return: success: true
```

**Scenario 2: Invalid Signature**
```javascript
// Wrong signature should fail
const wrongSignature = 'invalid_signature_string'
// Should return: success: false, error message
```

**Scenario 3: Tampered Amount**
```javascript
// If amount changed after order creation
// Signature will still be valid (signatures verify order+payment+key)
// But database can verify amount matches original order
```

### Test SQL Injection Prevention

Clinic name contains special characters:
```
Clinic Name: "'; DROP TABLE doctorsites; --"
Domain: "test'; DROP--"
```

**Expected Results**:
- ✅ No database errors
- ✅ Special characters safely escaped
- ✅ Clinic created with literal string

### Test File Upload Security

**Scenario 1: Upload oversized file**
- Create file > 5MB
- Attempt upload
- Expected: "File size exceeds 5MB" error

**Scenario 2: Upload non-image file**
- Try uploading .exe, .pdf, .txt
- Expected: "Only JPEG/PNG/WebP allowed" error

**Scenario 3: Upload image with malicious code**
- See file validation protects against scripts in EXIF data

## Regression Testing

Run after any code changes:

- [ ] Payment creation works
- [ ] Signature verification works
- [ ] Website created after payment
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Domain uniqueness enforced
- [ ] File upload works
- [ ] Modal styling looks good
- [ ] Error messages clear
- [ ] Success page displays correctly
- [ ] Mobile layout responsive
- [ ] API endpoints return correct status codes
- [ ] Database records accurate
- [ ] No console errors

## Test Checklist

### Before Launching to Production

- [ ] All scenarios passed
- [ ] API endpoints tested
- [ ] Database verified
- [ ] Browser console clean (no errors)
- [ ] Network requests correct
- [ ] Form validation complete
- [ ] Error handling works
- [ ] Security tests passed
- [ ] Performance acceptable
- [ ] Responsive design tested
- [ ] Mobile payment works
- [ ] Refund API tested

### Success Criteria

✅ Payment flows without errors  
✅ Signature verification prevents fraud  
✅ Websites created correctly  
✅ User feedback clear and helpful  
✅ No sensitive data in logs  
✅ Database maintains integrity  
✅ System handles failures gracefully  

---

**Testing Status**: Ready to execute! Start with Scenario 1.
