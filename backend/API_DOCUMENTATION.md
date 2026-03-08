# Backend API Documentation

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurwebsites?retryWrites=true&w=majority

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Payment Gateway (Optional)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 3. Run Server
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

Server will run on `http://localhost:5000`

---

## API Endpoints

### Websites

#### POST /api/websites
Create a new clinic website.

**Request:**
```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{
    "doctorName": "Dr. Raj Kumar",
    "clinicName": "Ayurveda Wellness Center",
    "doctorQualification": "BAMS, MD",
    "doctorExperience": 15,
    "phone": "+1-555-123-4567",
    "whatsapp": "+1-555-123-4567",
    "email": "clinic@example.com",
    "address": "123 Wellness Street, Suite 100",
    "city": "Kerala",
    "googleMapsLink": "https://maps.google.com/...",
    "services": "Panchakarma, Oil Massage, Consultation, Herbal Remedies",
    "bio": "Experienced Ayurvedic doctor with 15 years of practice",
    "domainName": "rajayurveda",
    "template": "classic"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Website created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Raj Kumar",
    "clinicName": "Ayurveda Wellness Center",
    "domainName": "rajayurveda",
    "fullDomain": "rajayurveda.ayurwebsites.com",
    "email": "clinic@example.com",
    "phone": "+1-555-123-4567",
    "city": "Kerala",
    "template": "classic",
    "profilePhoto": null,
    "status": "draft",
    "createdAt": "2024-03-08T10:00:00.000Z"
  }
}
```

**Required Fields:**
- `doctorName` - Doctor's full name
- `clinicName` - Clinic name
- `doctorQualification` - Qualifications (e.g., BAMS, MD)
- `doctorExperience` - Years of experience (0-70)
- `phone` - Contact phone number
- `email` - Email address
- `address` - Physical address
- `city` - City location
- `services` - Description of services
- `domainName` - Unique domain name (alphanumeric, no spaces)

**Optional Fields:**
- `whatsapp` - WhatsApp number
- `googleMapsLink` - Google Maps location link
- `bio` - Doctor biography
- `template` - Website template (classic, modern, minimal, elegant)
- `profilePhoto` - Profile image file (multipart/form-data)

---

#### GET /api/websites
Get all clinic websites with pagination.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `city` - Filter by city
- `template` - Filter by template
- `status` - Filter by status (draft, published, suspended)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "doctorName": "Dr. Raj Kumar",
      "clinicName": "Ayurveda Wellness Center",
      "city": "Kerala",
      "email": "clinic@example.com",
      "phone": "+1-555-123-4567",
      "status": "draft",
      "createdAt": "2024-03-08T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

#### GET /api/websites/:id
Get a single clinic website by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Raj Kumar",
    "clinicName": "Ayurveda Wellness Center",
    "doctorQualification": "BAMS, MD",
    "doctorExperience": 15,
    "phone": "+1-555-123-4567",
    "whatsapp": "+1-555-123-4567",
    "email": "clinic@example.com",
    "address": "123 Wellness Street, Suite 100",
    "city": "Kerala",
    "googleMapsLink": "https://maps.google.com/...",
    "services": "Panchakarma, Oil Massage, Consultation",
    "bio": "Experienced Ayurvedic doctor",
    "domainName": "rajayurveda",
    "fullDomain": "rajayurveda.ayurwebsites.com",
    "template": "classic",
    "status": "draft",
    "isPublished": false,
    "views": 0,
    "profilePhoto": "/uploads/profile-123456.jpg",
    "createdAt": "2024-03-08T10:00:00.000Z",
    "updatedAt": "2024-03-08T10:00:00.000Z"
  }
}
```

---

#### GET /api/websites/domain/:domainName
Get a clinic website by domain name.

**Response (200 OK):**
Same as GET /api/websites/:id

---

#### PUT /api/websites/:id
Update a clinic website.

**Request Body:**
Any field from the website data can be updated.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Website updated successfully",
  "data": { ... }
}
```

---

#### DELETE /api/websites/:id
Delete a clinic website.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Website deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011"
  }
}
```

---

#### POST /api/websites/:id/publish
Publish a clinic website.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Website published successfully",
  "data": {
    "isPublished": true,
    "status": "published",
    "publishedAt": "2024-03-08T10:00:00.000Z"
  }
}
```

---

#### POST /api/websites/:id/unpublish
Unpublish a clinic website.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Website unpublished successfully",
  "data": {
    "isPublished": false,
    "status": "draft"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 409 Conflict (Domain Already Exists)
```json
{
  "success": false,
  "message": "This domain name is already taken. Please choose another."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Website not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Failed to create website. Please try again."
}
```

---

## Database Models

### DoctorSite Model

```javascript
{
  // Doctor Information
  doctorName: String (required, indexed),
  doctorQualification: String (required),
  doctorExperience: Number (0-70, required),
  bio: String,
  profilePhoto: String (file path),

  // Clinic Information
  clinicName: String (required, indexed),
  address: String (required),
  city: String (required, indexed),
  googleMapsLink: String,

  // Services
  services: String (required),

  // Contact
  email: String (required, indexed, validated),
  phone: String (required),
  whatsapp: String,

  // Domain
  domainName: String (required, unique, indexed),
  fullDomain: String (unique, indexed),

  // Website Settings
  template: String (classic, modern, minimal, elegant),
  status: String (draft, published, suspended),
  isPublished: Boolean,
  publishedAt: Date,

  // Analytics
  views: Number,
  contactSubmissions: Number,

  // Metadata
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],

  timestamps: true
}
```

---

## File Upload

When including a profile photo:

```bash
curl -X POST http://localhost:5000/api/websites \
  -F "doctorName=Dr. Raj Kumar" \
  -F "clinicName=Clinic Name" \
  -F "doctorQualification=BAMS" \
  -F "doctorExperience=15" \
  -F "phone=+1-555-123-4567" \
  -F "email=clinic@example.com" \
  -F "address=123 Street" \
  -F "city=Kerala" \
  -F "services=Ayurvedic Services" \
  -F "domainName=clinic" \
  -F "profilePhoto=@/path/to/image.jpg"
```

**Allowed Image Formats:** JPEG, PNG, WebP
**Max File Size:** 5MB
**Upload Directory:** `/uploads/`

---

## Testing with Postman

1. Create a new POST request to `http://localhost:5000/api/websites`
2. Set Headers:
   - `Content-Type: application/json`
3. Add request body with clinic details
4. Send request

Or for file upload:
1. Change to form-data in Body
2. Add fields as form data
3. For profilePhoto, set type to "File" and select image

---

## Common Issues & Solutions

**1. MongooseError - Connection Failed**
- Ensure MongoDB is running
- Check MONGODB_URI in .env is correct
- For Atlas: Check whitelist IP and credentials

**2. Domain Already Taken Error (409)**
- The domain name must be unique
- Try a different domain name

**3. File Upload Failed**
- Check max file size (5MB)
- Verify image format (JPEG, PNG, WebP only)
- Ensure uploads directory exists

**4. CORS Error**
- Add frontend URL to CORS whitelist
- Update FRONTEND_URL in .env

---

## Security Notes

- Always validate inputs on the client side before sending
- Use environment variables for sensitive data
- Never commit .env files to git
- Use HTTPS in production
- Implement rate limiting for production
- Add authentication middleware for protected routes

---

## Performance Tips

1. Use pagination for listing endpoints
2. Add database indexes for frequently queried fields
3. Implement caching for read operations
4. Use compression middleware
5. Monitor database query performance

---

For more information, check the individual route and controller files in the backend directory.
