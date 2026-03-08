# Testing Guide - AyurWebsites API

This guide walks you through testing the fully implemented Website API endpoints.

## 🎯 What's Been Implemented

The backend has a **fully functional Website API** with 8 endpoints:

1. ✅ **CREATE** - POST /api/websites (with file upload)
2. ✅ **READ** - GET /api/websites (with pagination & filters)
3. ✅ **READ BY ID** - GET /api/websites/:id
4. ✅ **READ BY DOMAIN** - GET /api/websites/domain/:domainName
5. ✅ **UPDATE** - PUT /api/websites/:id
6. ✅ **DELETE** - DELETE /api/websites/:id
7. ✅ **PUBLISH** - POST /api/websites/:id/publish
8. ✅ **UNPUBLISH** - POST /api/websites/:id/unpublish

All endpoints have:
- ✅ Validation
- ✅ Error handling
- ✅ Database integration
- ✅ File upload support
- ✅ Pagination/filtering
- ✅ Comprehensive documentation

## 🧪 Quick Test (5 minutes)

### Step 1: Start the Backend

Open a terminal in the backend directory:

```bash
cd backend
npm install      # First time only
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Step 2: Run the Automated Test Suite

Open another terminal in the backend directory:

```bash
cd backend
node test-api.js
```

This will automatically test all 8 endpoints and show results:

```
Testing AyurWebsites API...

✅ Test 1: Create Website
✅ Test 2: Get All Websites
✅ Test 3: Get Single Website
✅ Test 4: Get Website by Domain
✅ Test 5: Update Website
✅ Test 6: Publish Website
✅ Test 7: Unpublish Website
✅ Test 8: Delete Website

All tests passed! ✨
```

**That's it!** The API is working correctly.

---

## 📋 Manual Testing (Detailed)

If you want to test individual endpoints manually using cURL or Postman:

### Test 1: Create a Website

```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{
    "doctorName": "Dr. Rajesh Kumar",
    "clinicName": "Ayurveda Wellness Center",
    "doctorQualification": "BAMS, MD (Ayurveda)",
    "doctorExperience": 15,
    "phone": "+91-9876543210",
    "whatsapp": "+91-9876543210",
    "email": "dr.rajesh@example.com",
    "address": "123 Wellness Street, Suite 100",
    "city": "Kottayam",
    "googleMapsLink": "https://maps.google.com/?q=ayurveda+clinic",
    "services": "Panchakarma, Abhyanga (Oil Massage), Consultation",
    "bio": "Dr. Rajesh is an experienced Ayurvedic practitioner with 15 years of experience",
    "domainName": "rajayurveda2024",
    "template": "modern"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Website created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Rajesh Kumar",
    "clinicName": "Ayurveda Wellness Center",
    "domainName": "rajayurveda2024",
    "fullDomain": "rajayurveda2024.ayurwebsites.com",
    "email": "dr.rajesh@example.com",
    "phone": "+91-9876543210",
    "city": "Kottayam",
    "template": "modern",
    "status": "draft",
    "isPublished": false,
    "createdAt": "2024-03-08T10:30:00.000Z"
  }
}
```

**Save the ID** (`_id`) from the response - you'll need it for the next tests.

---

### Test 2: Get All Websites

```bash
curl -X GET "http://localhost:5000/api/websites?page=1&limit=5&city=Kottayam"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1
  }
}
```

---

### Test 3: Get Specific Website by ID

Replace `{ID}` with the ID from Test 1:

```bash
curl -X GET http://localhost:5000/api/websites/{ID}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Rajesh Kumar",
    ...
  }
}
```

---

### Test 4: Get Website by Domain

```bash
curl -X GET http://localhost:5000/api/websites/domain/rajayurveda2024
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "doctorName": "Dr. Rajesh Kumar",
    "domainName": "rajayurveda2024",
    "fullDomain": "rajayurveda2024.ayurwebsites.com",
    ...
  }
}
```

---

### Test 5: Update Website

Replace `{ID}` with your website ID:

```bash
curl -X PUT http://localhost:5000/api/websites/{ID} \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio with more experience details",
    "services": "Panchakarma, Abhyanga, Consultation, Massage Therapy"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bio": "Updated bio with more experience details",
    "services": "Panchakarma, Abhyanga, Consultation, Massage Therapy",
    ...
  }
}
```

---

### Test 6: Publish Website

```bash
curl -X POST http://localhost:5000/api/websites/{ID}/publish \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Website published successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isPublished": true,
    "status": "published",
    "publishedAt": "2024-03-08T10:35:00.000Z"
  }
}
```

---

### Test 7: Unpublish Website

```bash
curl -X POST http://localhost:5000/api/websites/{ID}/unpublish \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Website unpublished successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isPublished": false,
    "status": "draft"
  }
}
```

---

### Test 8: Delete Website

```bash
curl -X DELETE http://localhost:5000/api/websites/{ID}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Website deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011"
  }
}
```

---

## 🔍 Error Testing

### Test: Duplicate Domain Name

Try creating two websites with the same domain:

```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{"domainName": "rajayurveda2024", ...}'
```

**Expected Response (409 Conflict):**
```json
{
  "success": false,
  "error": "Domain name already registered"
}
```

### Test: Invalid Email

```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", ...}'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email validation failed"
}
```

### Test: Missing Required Field

```bash
curl -X POST http://localhost:5000/api/websites \
  -H "Content-Type: application/json" \
  -d '{"doctorName": "Dr. Test"}'  // Missing other required fields
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "All fields are required"
}
```

### Test: Website Not Found

```bash
curl -X GET http://localhost:5000/api/websites/invalid-id-123
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Website not found"
}
```

---

## 🎨 Testing with Postman

Prefer using Postman? Here's how:

1. **Import requests:**
   - Create a new Collection: "AyurWebsites API"

2. **Create these requests:**
   - `POST` http://localhost:5000/api/websites
   - `GET` http://localhost:5000/api/websites
   - `GET` http://localhost:5000/api/websites/{{website_id}}
   - `GET` http://localhost:5000/api/websites/domain/{{domain_name}}
   - `PUT` http://localhost:5000/api/websites/{{website_id}}
   - `DELETE` http://localhost:5000/api/websites/{{website_id}}
   - `POST` http://localhost:5000/api/websites/{{website_id}}/publish
   - `POST` http://localhost:5000/api/websites/{{website_id}}/unpublish

3. **Set request bodies and headers as shown in tests above**

---

## 🌐 Testing Frontend Integration

Once you've verified the API is working, test the frontend:

### Step 1: Start the Frontend

```bash
cd frontend
npm install    # First time only
npm run dev
```

The app will run at `http://localhost:5173`

### Step 2: Test the Form

1. Click "Create Your Website" on the landing page
2. Fill in the clinic information:
   - Doctor name, qualification, experience
   - Clinic name, address, city
   - Email, phone, WhatsApp
   - Services and bio
   - Domain name
3. Click "Create Website"
4. You should be redirected to payment page

### Step 3: Verify Database

Check MongoDB to see if your data was saved:

```bash
# If using local MongoDB
mongo
use ayurwebsites
db.doctorsites.find().pretty()
```

---

## ✅ Validation Checklist

When testing, verify:

- ✅ Create endpoint returns 201 status
- ✅ Domain uniqueness is enforced (409 on duplicate)
- ✅ Email validation works (400 on invalid)
- ✅ Phone validation works (must be 10+ digits)
- ✅ File upload works (5MB limit, JPEG/PNG/WebP)
- ✅ Get endpoints return 404 for missing records
- ✅ Update endpoint prevents modifying _id and createdAt
- ✅ Publish toggles isPublished and status correctly
- ✅ Pagination works (page and limit params)
- ✅ Filtering works (city, template, status params)
- ✅ Error messages are descriptive

---

## 📊 What Each Test Validates

| Test | Endpoint | What it tests |
|------|----------|---------------|
| 1 | POST /api/websites | Create website, file upload, validation |
| 2 | GET /api/websites | List with pagination, filters |
| 3 | GET /api/websites/:id | Fetch by ID, 404 handling |
| 4 | GET /api/websites/domain/:name | Query by domain name |
| 5 | PUT /api/websites/:id | Update fields, prevent system field updates |
| 6 | POST /api/websites/:id/publish | Toggle publish status |
| 7 | POST /api/websites/:id/unpublish | Toggle unpublish status |
| 8 | DELETE /api/websites/:id | Delete and removal from DB |

---

## 🐛 Debugging Tips

### API Not responding?
```bash
# Check if backend is running
curl http://localhost:5000/api/websites

# Check MongoDB connection
# Look for "MongoDB connected" in terminal output
```

### MongoDB connection error?
```bash
# Make sure MongoDB is running
# Option 1: Local MongoDB
mongod

# Option 2: MongoDB Atlas
# Update MONGODB_URI in .env with your Atlas connection string
```

### File upload not working?
```bash
# Check /uploads directory exists
# Check file is < 5MB
# Check file type is JPEG/PNG/WebP
# Check /uploads directory has write permissions
```

### Port already in use?
```bash
# Change PORT in .env file
# Or kill the process:
# Windows: netstat -ano | findstr :5000
# macOS: lsof -i :5000
```

---

## 📚 Documentation

For complete details, see:

- **API_DOCUMENTATION.md** - Full endpoint specifications
- **API_QUICK_REFERENCE.md** - Quick code examples
- **BACKEND_SETUP.md** - Setup and deployment guide
- **IMPLEMENTATION_SUMMARY.md** - What's implemented

---

## ✨ Summary

You now have:
- ✅ 8 fully functional API endpoints
- ✅ Complete database integration
- ✅ File upload support
- ✅ Comprehensive validation
- ✅ Error handling
- ✅ Automated test suite

**The Website API is production-ready!**

Next steps:
1. Test with the automated script: `node test-api.js`
2. Test frontend integration
3. Implement payment processing
4. Add user authentication
5. Deploy to production

Happy testing! 🎉
