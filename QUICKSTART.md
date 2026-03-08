# Quick Start Guide - AyurWebsites

Get AyurWebsites running in 10 minutes!

## Prerequisites

- Node.js 16+ installed
- MongoDB running locally
- Razorpay test keys (free account at razorpay.com)

## 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup Database

MongoDB should be running:
```bash
# macOS
brew services start mongodb-community

# Windows - MongoDB should auto-start, or:
mongod
```

### 3. Get Razorpay Keys

1. Go to https://razorpay.com
2. Create account
3. Dashboard → Settings → API Keys
4. Copy **Test Keys** (marked as "Test Mode")

### 4. Configure Environment

**backend/.env**
```
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
RAZORPAY_KEY_ID=rzp_test_xxxxx    # Paste your test key
RAZORPAY_KEY_SECRET=xxxxxx         # Paste your test secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**frontend/.env.local**
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx  # Same as above
VITE_API_URL=http://localhost:5000
```

### 5. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should see: ✓ Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should see: ➜  Local:   http://localhost:5173/
```

## Test Payment Flow

1. Open http://localhost:5173
2. Click "Get Started"
3. Fill clinic form
4. Click "Create Website & Proceed to Payment"
5. Click "Pay with Razorpay"
6. Use test card: `4111 1111 1111 1111`
7. Enter any future expiry date and any CVV
8. When asked for OTP: enter `123456`
9. ✅ Payment complete! Website should be created

## Useful Commands

```bash
# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build

# Backend
cd backend
npm run dev      # Start with auto-reload
npm run start    # Start production mode
npm test         # Run tests
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module 'razorpay'" | Run `npm install razorpay` in backend |
| MongoDB not connecting | Ensure `mongod` is running, check MONGODB_URI |
| Payment modal not showing | Check `window.Razorpay` in browser console |
| Signature verification failed | Verify RAZORPAY_KEY_SECRET matches exactly |

## File Locations

Important files:
```
backend/
├── controllers/paymentController.js    ← Razorpay logic
├── routes/payments.js                  ← API endpoints
└── .env                                ← Keys

frontend/
├── components/RazorpayPayment.jsx      ← Payment modal
├── pages/CreateWebsitePage.jsx         ← Form + flow
└── .env.local                          ← Keys
```

## Example Request/Response

**Create Order:**
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 9999,
    "clinicName": "Test Clinic",
    "customerEmail": "test@example.com",
    "customerPhone": "+91-9876543210",
    "domainName": "test-clinic"
  }'
```

**Verify Payment:**
```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_signature": "signature_xxxxx"
  }'
```

## Next Steps

1. ✅ Test a complete payment
2. ✅ View created website at custom domain
3. 📖 Read [RAZORPAY_INTEGRATION_GUIDE.md](RAZORPAY_INTEGRATION_GUIDE.md) for advanced usage
4. 📖 Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
5. 🚀 Deploy to production!

## Production Deployment

Update `.env` with **Live Mode** Razorpay keys when deploying:

```bash
# Get from Razorpay Dashboard in Live Mode
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
```

Then deploy frontend build and backend to your server.

## Support

- **Razorpay Help**: https://razorpay.com/support
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

**You're all set!** 🎉 Start building awesome Ayurvedic websites!
