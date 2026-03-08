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

### Websites
- `GET /api/websites` - Get all websites
- `GET /api/websites/:id` - Get specific website
- `POST /api/websites` - Create website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website
- `POST /api/websites/:id/publish` - Publish website

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment status
- `POST /api/payments/:id/verify` - Verify payment

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Uploads
- `POST /api/uploads/image` - Upload image
- `POST /api/uploads/document` - Upload document

## Features

- ✅ Complete project structure
- ✅ Frontend and backend separated
- ✅ MongoDB integration ready
- ✅ Payment processing flow
- ✅ File upload system
- ✅ State management with Zustand
- ✅ RESTful API structure
- ✅ Environment configuration

## Next Steps

1. **Connect MongoDB** - Update `.env` with your MongoDB connection string
2. **Implement Controllers** - Complete the controller functions with business logic
3. **Add Authentication** - Implement JWT-based authentication
4. **Setup Payment Gateway** - Integrate Stripe or PayPal
5. **Email Service** - Configure SMTP for sending emails
6. **Testing** - Add unit and integration tests
7. **Deployment** - Deploy to production servers

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
