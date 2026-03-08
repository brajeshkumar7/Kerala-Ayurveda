# AyurWebsites - Complete Setup Guide

## Project Overview

AyurWebsites is a full-stack SaaS platform that enables Ayurvedic practitioners to create professional clinic websites in minutes. The platform includes:

- ✅ Professional landing page with pricing tiers
- ✅ Multi-tab clinic website creation form
- ✅ Responsive clinic website template
- ✅ Custom domain routing for clinic websites
- ✅ **Razorpay payment integration** (NEW!)
- ✅ MongoDB database for clinic information
- ✅ File upload support for clinic photos

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: CSS3 with Flexbox/Grid
- **Payment**: Razorpay JavaScript SDK
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **Payment**: Razorpay Node.js SDK
- **Security**: Crypto (HMAC-SHA256 signatures)

## Prerequisites

Before starting, ensure you have:

- Node.js 16+ installed
- npm or yarn package manager
- MongoDB 4.4+ (local or cloud)
- Git for version control
- A Razorpay account (free to create)
- A code editor (VS Code recommended)

## Installation Steps

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd "Kerla Ayurveda"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

**Key packages installed:**
- express - Web framework
- mongoose - MongoDB ODM
- razorpay - Payment gateway
- multer - File upload handling
- dotenv - Environment variables
- cors - Cross-origin requests

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**Key packages installed:**
- react - UI framework
- vite - Build tool
- zustand - State management
- axios - HTTP client
- react-router-dom - Routing

### Step 4: Configure MongoDB

**Option A: Local MongoDB**

```bash
# Windows: Start MongoDB service
mongod

# Linux/Mac: Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Step 5: Configure Razorpay Keys

#### 5a: Get Test Keys

1. Visit https://razorpay.com (create free account if needed)
2. Go to Dashboard → Settings → API Keys
3. Ensure **Test Mode** is selected (toggle at top)
4. Copy your:
   - **Key ID**: Starts with `rzp_test_`
   - **Key Secret**: Long alphanumeric string

#### 5b: Backend Configuration

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ayurwebsites

# Razorpay (Test Keys)
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

#### 5c: Frontend Configuration

Create `frontend/.env.local`:

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` and add:

```
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcd
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:5000
✓ MongoDB connected to mongodb://localhost:27017/ayurwebsites
✓ Payment routes loaded
```

### Start Frontend Development Server

*In a new terminal:*

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in x ms

➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

## Testing the Payment Flow

### 1. Create a Clinic Website

1. Click **"Get Started"** button on landing page
2. Fill in the clinic details:
   - Doctor name
   - Clinic name
   - Specializations
   - Contact information
   - Upload clinic photo (optional)
   - Choose domain name
   - Select pricing plan

3. Click **"Create Website & Proceed to Payment"**

### 2. Payment Modal Appears

A modal will display:
- Clinic name
- Domain name
- Amount in rupees (e.g., ₹4,999)
- **"Pay with Razorpay"** button

### 3. Test Payment

Click **"Pay with Razorpay"** and use test card:

```
Card Number:  4111 1111 1111 1111
Expiry:       12/25 (or any future date)
CVV:          123 (any 3 digits)
OTP:          123456 (when prompted)
```

### 4. Verify Payment

After payment completes:
- Frontend verifies payment signature
- Backend confirms signature validity
- Website is created in database
- Success page displays with details

### 5. View Created Website

Navigate to your clinic domain:

```
http://your-clinic-name.localhost:5000
```

Or visit dashboard to see all created websites.

## Project Structure

### Backend (`/backend`)

```
backend/
├── models/
│   └── DoctorSite.js          # MongoDB schema for clinics
├── controllers/
│   ├── paymentController.js   # Payment operations
│   ├── websiteController.js   # Website operations
│   └── ...
├── routes/
│   ├── payments.js            # Payment endpoints
│   ├── websites.js            # Website endpoints
│   ├── clinicWebsite.js       # Dynamic clinic routing
│   └── ...
├── middleware/
│   ├── domainResolver.js      # Custom domain detection
│   └── ...
├── uploads/                   # User-uploaded files
├── server.js                  # Express app setup
├── .env                       # Configuration (git-ignored)
└── .env.example              # Configuration template
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── RazorpayPayment.jsx     # Payment modal
│   │   ├── ClinicTemplate.jsx       # Clinic website template
│   │   └── ...
│   ├── pages/
│   │   ├── CreateWebsitePage.jsx    # Form with payment
│   │   ├── LandingPage.jsx          # Homepage
│   │   ├── HomePage.jsx             # Smart homepage selector
│   │   └── ...
│   ├── store/
│   │   └── websiteStore.js          # Zustand state
│   ├── services/
│   │   └── api.js                   # Axios instance
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── index.html                # Entry point
├── .env.example             # Configuration template
├── .env.local              # Local configuration (git-ignored)
└── vite.config.js          # Vite configuration
```

## Common Issues & Solutions

### Issue 1: "Cannot find module 'razorpay'"

**Solution:**
```bash
cd backend
npm install razorpay
```

### Issue 2: "MONGODB_URI is required"

**Solution:**
- Set `MONGODB_URI` in `backend/.env`
- Ensure MongoDB is running
- Check connection string format

### Issue 3: "Razorpay modal not opening"

**Solution:**
- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` is set in `frontend/.env.local`
- Ensure Razorpay script loaded: `console.log(window.Razorpay)`

### Issue 4: "Payment verification failed"

**Solution:**
- Verify `RAZORPAY_KEY_SECRET` matches exactly in `backend/.env`
- Check signature calculation in browser console
- Ensure backend is receiving payment data correctly

### Issue 5: "Website created but not showing custom domain"

**Solution:**
- Domain resolver middleware needs domain in hosts file or local DNS
- For testing, use direct IP with port: `http://localhost:5000`
- Custom domain working in production with proper DNS setup

## Database Schema

### DoctorSite Collection

```javascript
{
  _id: ObjectId,
  
  // Doctor Information
  doctorName: String,
  email: String,
  phone: String,
  qualifications: String,
  specializations: [String],
  
  // Clinic Information
  clinicName: String,
  clinicAddress: String,
  clinicPhone: String,
  
  // Website Details
  domainName: String,
  websiteTitle: String,
  aboutClinic: String,
  
  // Payment Information
  paymentId: String,
  orderId: String,
  amount: Number,
  paymentStatus: String,
  
  // Files
  profilePhoto: {
    filename: String,
    path: String,
    uploadDate: Date
  },
  
  // Status
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Payment Endpoints

```
POST   /api/payment/create-order      Create Razorpay order
POST   /api/payment/verify            Verify payment signature
POST   /api/payment/capture           Capture payment
POST   /api/payment/refund            Refund payment
GET    /api/payment/order/:orderId    Get order details
GET    /api/payment/payment/:paymentId Get payment details
GET    /api/payment/:paymentId        Single payment status
GET    /api/payment                   All payments (admin)
```

### Website Endpoints

```
POST   /api/websites                  Create website
GET    /api/websites/:id              Get website details
PUT    /api/websites/:id              Update website
DELETE /api/websites/:id              Delete website
GET    /api/websites                  List all websites
POST   /api/websites/:id/publish      Publish website
POST   /api/websites/:id/unpublish    Unpublish website
```

## Deploying to Production

### Step 1: Get Live Razorpay Keys

1. Complete Razorpay account verification
2. Go to Settings → API Keys
3. Switch to **Live Mode**
4. Copy Live Key ID and Secret

### Step 2: Update Environment

**backend/.env** (production):

```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxx
MONGODB_URI=<production-mongodb-uri>
NODE_ENV=production
```

### Step 3: Build Frontend

```bash
cd frontend
npm run build
# Creates dist/ folder with optimized build
```

### Step 4: Deploy

Common platforms:
- **Backend**: Heroku, Railway, Render, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3, Cloudflare Pages
- **Database**: MongoDB Atlas, AWS, DigitalOcean

## Production Checklist

- [ ] Live Razorpay keys configured
- [ ] HTTPS enabled for all endpoints
- [ ] CORS properly configured
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Payment webhook setup (optional)
- [ ] Custom domain DNS configured
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Sensitive data not in logs
- [ ] Admin authentication implemented

## Support & Documentation

- **Razorpay Docs**: https://razorpay.com/docs
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **MongoDB**: https://docs.mongodb.com
- **Vite**: https://vitejs.dev

## Next Steps

After successful setup:

1. ✅ Test complete payment flow
2. ✅ Create test websites with different domains
3. ✅ Verify websites display correctly on custom domains
4. ✅ Test file upload functionality
5. ✅ Set up production deployment
6. ✅ Configure Razorpay live mode
7. ✅ Add payment webhooks for production
8. ✅ Implement analytics tracking
9. ✅ Add admin dashboard
10. ✅ Set up email notifications

---

**Status**: ✅ Ready for production!

For detailed payment integration guide, see: [RAZORPAY_INTEGRATION_GUIDE.md](RAZORPAY_INTEGRATION_GUIDE.md)
