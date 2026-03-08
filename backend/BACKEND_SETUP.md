# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB (for development)
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# Verify connection with MongoDB Compass or mongo shell
mongo
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string and add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurwebsites?retryWrites=true&w=majority
```

### 3. Create `.env` File
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
JWT_SECRET=your_secret_key_12345
FRONTEND_URL=http://localhost:5173
```

### 4. Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:5000`

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── websiteController.js  # Website creation/management
│   ├── paymentController.js  # Payment processing
│   └── authController.js     # User authentication
├── models/
│   ├── DoctorSite.js        # Clinic website schema
│   ├── User.js              # User account schema
│   └── Payment.js           # Payment transaction schema
├── routes/
│   ├── websites.js          # Website endpoints
│   ├── payments.js          # Payment endpoints
│   ├── auth.js              # Authentication endpoints
│   └── uploads.js           # File upload endpoints
├── middlewares/
│   └── validation.js        # Validation & auth middleware
├── services/
│   ├── uploadService.js     # File upload logic
│   ├── paymentService.js    # Payment processing logic
│   └── emailService.js      # Email notification logic
├── templates/               # Email templates
├── uploads/                 # Uploaded files directory
├── server.js               # Main server file
├── package.json            # Dependencies
├── .env.example            # Environment template
└── API_DOCUMENTATION.md    # API reference
```

---

## Database Schema

### DoctorSite Collection

```javascript
{
  // Doctor Info
  doctorName: String,
  doctorQualification: String,
  doctorExperience: Number,
  bio: String,
  profilePhoto: String,

  // Clinic Info
  clinicName: String,
  address: String,
  city: String,
  googleMapsLink: String,

  // Services
  services: String,

  // Contact
  email: String,
  phone: String,
  whatsapp: String,

  // Domain
  domainName: String (unique),
  fullDomain: String,

  // Settings
  template: String,
  status: String,
  isPublished: Boolean,

  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

---

## Core Features Implemented

✅ **Website Creation (POST /api/websites)**
- Create clinic websites with doctor information
- Support for profile photo upload
- Automatic domain assignment

✅ **Website Management**
- Get all websites (with pagination & filtering)
- Get single website
- Update website details
- Delete website
- Publish/Unpublish website

✅ **File Upload**
- Profile photo upload (JPEG, PNG, WebP)
- Max size: 5MB
- Stored in `/uploads/` directory

✅ **Data Validation**
- Email format validation
- Domain name validation
- Required field validation
- File type & size validation

✅ **Error Handling**
- Comprehensive error messages
- Validation error details
- Duplicate domain detection

---

## API Endpoints Summary

### Websites
```
POST   /api/websites              - Create new website
GET    /api/websites              - Get all websites (paginated)
GET    /api/websites/:id          - Get single website
GET    /api/websites/domain/:name - Get by domain name
PUT    /api/websites/:id          - Update website
DELETE /api/websites/:id          - Delete website
POST   /api/websites/:id/publish  - Publish website
```

### Complete API Documentation
See `API_DOCUMENTATION.md` for detailed endpoint specifications, examples, and error codes.

---

## Testing the API

### Using cURL

**Create a website:**
```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{
    "doctorName": "Dr. Raj Kumar",
    "clinicName": "Clinic Name",
    "doctorQualification": "BAMS",
    "doctorExperience": 15,
    "phone": "+91-9876543210",
    "email": "clinic@example.com",
    "address": "123 Street",
    "city": "Kerala",
    "services": "Panchakarma, Massage",
    "domainName": "myclinic"
  }'
```

**Get all websites:**
```bash
curl http://localhost:5000/api/websites?page=1&limit=10
```

**Get single website:**
```bash
curl http://localhost:5000/api/websites/{id}
```

### Using Postman

1. Import provided Postman collection (if available)
2. Set base URL: `http://localhost:5000`
3. Create requests for each endpoint
4. Use form-data for file uploads

### Automated Testing

```bash
node test-api.js
```

This runs all API tests and displays results.

---

## Frontend Integration

### Environment Setup

In `frontend/.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

The Vite development server already has a proxy configured for `/api` requests.

### Making API Calls

```javascript
// In frontend/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
})

// Create website
export const websiteApi = {
  create: (data) => api.post('/websites', data)
}
```

---

## Common Issues & Solutions

### ❌ MongoDB Connection Failed
**Error:** `MongooseError: Cannot connect to MongoDB`

**Solutions:**
1. Ensure MongoDB is running (`mongod`)
2. Check MONGODB_URI in `.env`
3. For Atlas: Verify connection string and whitelist your IP
4. Check network connectivity

### ❌ Domain Already Exists (409)
**Error:** `This domain name is already taken`

**Solution:**
- Use a unique domain name
- Check existing domains in database

### ❌ File Upload Failed
**Error:** `File type not allowed` or `File size exceeded`

**Solutions:**
- Use only JPEG, PNG, or WebP images
- Keep file size under 5MB
- Check if `/uploads` directory exists

### ❌ Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Or use different port: `PORT=5001 npm run dev`

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Add frontend URL to CORS:
   ```javascript
   // In server.js
   app.use(cors({ origin: process.env.FRONTEND_URL }))
   ```
2. Update FRONTEND_URL in `.env`

---

## Development Workflow

1. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Development Server** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test API Endpoints**
   ```bash
   npm run test-api
   ```

5. **View Logs**
   - Backend: Check terminal output
   - Frontend: Check browser console (F12)
   - Database: Use MongoDB Compass

---

## Production Deployment

### Before Deploying

1. **Environment Variables**
   - Use production MongoDB Atlas connection
   - Set NODE_ENV=production
   - Use strong JWT_SECRET
   - Configure CORS for production domain

2. **Security**
   - Enable HTTPS
   - Add rate limiting
   - Implement authentication
   - Validate all inputs

3. **Database**
   - Create backups
   - Add indexes for performance
   - Monitor query performance

4. **File Storage**
   - Use cloud storage (AWS S3, etc.)
   - Don't rely on local `/uploads`

### Deployment Platforms

**Heroku:**
```bash
git push heroku main
```

**Railway:**
```bash
railway up
```

**AWS/GCP/DigitalOcean:**
- Set environment variables
- Run `npm install && npm start`

---

## Monitoring & Logging

### View Logs
```bash
# Real-time logs
npm run dev

# See specific endpoint logs
# Check console output in terminal
```

### Database Monitoring
Use MongoDB Compass or Atlas Dashboard to:
- View collections and documents
- Monitor query performance
- Check index usage
- Run aggregations

---

## Next Steps

1. ✅ Setup complete
2. 📝 Implement authentication middleware
3. 💳 Configure payment gateway (Stripe)
4. 📧 Setup email notifications
5. 🔒 Add security headers and validation
6. 📊 Add analytics tracking
7. 🧪 Write unit tests
8. 📦 Deploy to production

---

## Support & Resources

- **MongoDB**: https://docs.mongodb.com/
- **Express.js**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **Node.js**: https://nodejs.org/

---

## License

ISC

---

Happy coding! 🚀
