# AyurWebsites - Full Stack SaaS Project

A complete full-stack SaaS platform for creating Ayurvedic business websites. Built with React + Vite frontend and Node.js + Express backend with MongoDB.

## Project Structure

### Frontend (`/frontend`)
- **React 18** with **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API requests

**Pages:**
- LandingPage - Homepage with features showcase
- CreateWebsitePage - Website creation form
- PaymentPage - Payment processing
- SuccessPage - Order confirmation

**Folders:**
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/store/` - Zustand store for state management
- `src/services/` - API service configuration
- `src/hooks/` - Custom React hooks
- `src/styles/` - CSS stylesheets

### Backend (`/backend`)
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- RESTful API architecture

**Folders:**
- `controllers/` - Request handlers
- `routes/` - API endpoint definitions
- `models/` - MongoDB schema definitions
- `services/` - Business logic
- `middlewares/` - Custom middleware functions
- `config/` - Database and environment configuration
- `templates/` - Email and document templates
- `uploads/` - File storage for user uploads

**Models:**
- User - User accounts and subscriptions
- Website - Website data and configurations
- Payment - Payment transactions and invoices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the development server:
```bash
npm run dev
```

Backend API will run on `http://localhost:5000`

## API Endpoints

### ✅ Websites (FULLY IMPLEMENTED)
- `POST /api/websites` - Create website ✅
- `GET /api/websites` - Get all websites with pagination & filters ✅
- `GET /api/websites/:id` - Get specific website ✅
- `GET /api/websites/domain/:domainName` - Get website by domain ✅
- `PUT /api/websites/:id` - Update website ✅
- `DELETE /api/websites/:id` - Delete website ✅
- `POST /api/websites/:id/publish` - Publish website ✅
- `POST /api/websites/:id/unpublish` - Unpublish website ✅

**Features:**
- File upload for profile photos
- Automatic domain generation
- Duplicate domain detection
- Pagination support
- Filter by city, template, status
- Comprehensive validation and error handling

**See:** [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for detailed endpoints

### Payments (In Progress)
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment status
- `POST /api/payments/:id/verify` - Verify payment

### Auth (In Progress)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Uploads (In Progress)
- `POST /api/uploads/image` - Upload image
- `POST /api/uploads/document` - Upload document

## Features

- ✅ Complete project structure (frontend + backend separated)
- ✅ Professional landing page with 6 features + 3-tier pricing
- ✅ Multi-tab clinic website creation form with validation
- ✅ Frontend-backend integration with Axios + FormData
- ✅ MongoDB integration with DoctorSite schema
- ✅ **Complete Website API** (8 endpoints fully implemented)
  - ✅ File upload handling (profile photos)
  - ✅ Unique domain checking
  - ✅ Pagination and filtering
  - ✅ Publish/unpublish functionality
  - ✅ Comprehensive validation and error handling
- ✅ State management with Zustand
- ✅ RESTful API structure
- ✅ Environment configuration
- ✅ Comprehensive API documentation (3 docs)
- ✅ Automated test suite
- ⏳ Payment processing gateway (routes/controllers stubbed)
- ⏳ User authentication (JWT framework ready)
- ⏳ Email service (SMTP configuration needed)

## Next Steps

### Immediate (Testing)
1. **Setup MongoDB** 
   - Local: Start MongoDB with `mongod`
   - Cloud: Use MongoDB Atlas connection string

2. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Test the API**
   ```bash
   cd backend
   npm run dev        # Terminal 1
   node test-api.js   # Terminal 2
   ```

4. **Frontend Integration Testing**
   ```bash
   cd frontend
   npm run dev
   # Test form submission and file upload
   ```

### High Priority
1. **Complete Payment Integration**
   - Implement Stripe API integration
   - Complete `paymentController.js` functions
   - Add payment endpoints

2. **User Authentication**
   - Complete `authController.js` (register, login, getProfile)
   - Implement JWT middleware
   - Protect website endpoints with auth

3. **Email Service**
   - Configure SMTP settings
   - Implement welcome emails
   - Send order confirmations

### Documentation
- ✅ API_DOCUMENTATION.md - Complete API reference
- ✅ BACKEND_SETUP.md - Setup and deployment guide
- ✅ API_QUICK_REFERENCE.md - Developer quick reference
- ✅ IMPLEMENTATION_SUMMARY.md - What's implemented

See `backend/` directory for these files.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

### Frontend (.env.local - optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```
 
## Architecture

### Frontend Architecture
- Component-based structure
- Centralized state management with Zustand
- API layer abstraction with Axios
- React Router for client-side routing

### Backend Architecture
- MVC pattern (Models, Views/Routes, Controllers)
- Separated services layer for business logic
- Middleware-based request handling
- MongoDB for data persistence

## Technologies Used

**Frontend:**
- React 18
- Vite
- React Router v6
- Zustand
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer (file uploads)

## Development Tips

1. The frontend proxy is configured in `vite.config.js` to forward `/api` requests to the backend
2. All API calls should use relative paths starting with `/api`
3. MongoDB documents are automatically timestamped with `createdAt` and `updatedAt`
4. Use `.env.example` as a template for local environment setup

## License

ISC

---

**Ready to build?** Start by implementing the controller functions and connecting to your MongoDB instance!
