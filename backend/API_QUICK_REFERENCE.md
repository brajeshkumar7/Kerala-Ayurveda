# API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## 📝 Create Website
**POST** `/websites`

```javascript
const newWebsite = {
  doctorName: "Dr. Raj Kumar",
  clinicName: "Ayurveda Wellness Center",
  doctorQualification: "BAMS, MD",
  doctorExperience: 15,
  phone: "+91-9876543210",
  whatsapp: "+91-9876543210",
  email: "clinic@example.com",
  address: "123 Wellness Street",
  city: "Kottayam",
  googleMapsLink: "https://maps.google.com/...",
  services: "Panchakarma, Oil Massage, Consultation",
  bio: "Experienced Ayurvedic doctor...",
  domainName: "rajayurveda",
  template: "modern"
}

// With JavaScript/Fetch
fetch('http://localhost:5000/api/websites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newWebsite)
})
.then(res => res.json())
.then(data => console.log(data))

// With Axios
axios.post('/api/websites', newWebsite)
  .then(res => console.log(res.data))
  .catch(err => console.error(err))
```

---

## 📖 Get All Websites
**GET** `/websites?page=1&limit=10&city=Kerala&status=published`

```javascript
// Basic
GET /api/websites

// With Filters
GET /api/websites?page=1&limit=10
GET /api/websites?city=Kottayam
GET /api/websites?template=modern
GET /api/websites?status=published

// JavaScript
fetch('http://localhost:5000/api/websites?page=1&limit=10')
  .then(res => res.json())
  .then(data => {
    console.log('Total:', data.pagination.total)
    data.data.forEach(site => {
      console.log(`${site.clinicName} - ${site.doctorName}`)
    })
  })
```

---

## 🔍 Get Single Website
**GET** `/websites/:id`

```javascript
const websiteId = "507f1f77bcf86cd799439011"

// cURL
curl http://localhost:5000/api/websites/507f1f77bcf86cd799439011

// JavaScript
fetch(`http://localhost:5000/api/websites/${websiteId}`)
  .then(res => res.json())
  .then(website => console.log(website.data))

// Axios
axios.get(`/api/websites/${websiteId}`)
  .then(res => console.log(res.data.data))
```

---

## 🌐 Get by Domain
**GET** `/websites/domain/:domainName`

```javascript
// Get website by domain name
GET /api/websites/domain/rajayurveda

// JavaScript
fetch('http://localhost:5000/api/websites/domain/rajayurveda')
  .then(res => res.json())
  .then(data => {
    console.log(data.data.fullDomain) // rajayurveda.ayurwebsites.com
    console.log(data.data.clinicName)
  })
```

---

## ✏️ Update Website
**PUT** `/websites/:id`

```javascript
const updates = {
  bio: "Updated biography...",
  phone: "+91-9876543211",
  services: "Updated services..."
}

// JavaScript
fetch(`http://localhost:5000/api/websites/${websiteId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
})
.then(res => res.json())
.then(data => console.log('Updated:', data.data))

// Axios
axios.put(`/api/websites/${websiteId}`, updates)
  .then(res => console.log(res.data.data))
```

---

## 🗑️ Delete Website
**DELETE** `/websites/:id`

```javascript
// JavaScript
fetch(`http://localhost:5000/api/websites/${websiteId}`, {
  method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log('Deleted:', data.data.id))

// Axios
axios.delete(`/api/websites/${websiteId}`)
  .then(res => console.log('Deleted'))
  .catch(err => console.error(err))
```

---

## 📤 Upload Profile Photo
**POST** `/websites` (with file)

```javascript
// Using FormData
const formData = new FormData()
formData.append('doctorName', 'Dr. Raj')
formData.append('clinicName', 'Clinic')
// ... other fields ...
formData.append('profilePhoto', fileInputElement.files[0])

fetch('http://localhost:5000/api/websites', {
  method: 'POST',
  body: formData  // Don't set Content-Type header!
})
.then(res => res.json())
.then(data => {
  console.log('Photo URL:', data.data.profilePhoto)
})

// With Axios
const formData = new FormData()
// ... append fields ...
axios.post('/api/websites', formData)
  .then(res => console.log(res.data))
```

---

## ✅ Publish Website
**POST** `/websites/:id/publish`

```javascript
// Make draft website live
POST /api/websites/507f1f77bcf86cd799439011/publish

// JavaScript
fetch(`http://localhost:5000/api/websites/${websiteId}/publish`, {
  method: 'POST'
})
.then(res => res.json())
.then(data => {
  console.log('Published:', data.data.isPublished) // true
  console.log('Status:', data.data.status) // published
})
```

---

## ❌ Unpublish Website
**POST** `/websites/:id/unpublish`

```javascript
// Remove website from live
POST /api/websites/507f1f77bcf86cd799439011/unpublish

// JavaScript
fetch(`http://localhost:5000/api/websites/${websiteId}/unpublish`, {
  method: 'POST'
})
.then(res => res.json())
.then(data => {
  console.log('Unpublished:', data.data.isPublished) // false
})
```

---

## Response Format

### Success Response (201/200)
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
    "status": "draft",
    "createdAt": "2024-03-08T10:00:00.000Z"
  }
}
```

### Error Response (400/409/500)
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Field error 1", "Field error 2"]
}
```

### List Response with Pagination (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "clinicName": "...",
      "doctorName": "..."
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

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - New website created |
| 400 | Bad Request - Invalid data |
| 404 | Not Found - Website doesn't exist |
| 409 | Conflict - Domain already taken |
| 500 | Server Error - Backend issue |

---

## Common Field Values

### Templates
- `classic` - Classic Ayurveda theme
- `modern` - Modern design
- `minimal` - Clean minimal design
- `elegant` - Elegant layout

### Status
- `draft` - Not published
- `published` - Live website
- `suspended` - Temporarily disabled

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `city` - Filter by city
- `template` - Filter by template
- `status` - Filter by status

---

## Validation Rules

| Field | Rule |
|-------|------|
| doctorName | Required, string |
| clinicName | Required, string |
| doctorQualification | Required, string |
| doctorExperience | Required, 0-70 |
| email | Required, valid email format |
| phone | Required, min 10 digits |
| whatsapp | Optional, min 10 digits |
| domainName | Required, unique, alphanumeric + hyphens |
| services | Required, string |
| profilePhoto | Optional, JPEG/PNG/WebP, max 5MB |

---

## Example: Create Website with Frontend

```javascript
// In React component
import { useState } from 'react'
import { websiteApi } from '../services/api'

export default function CreateWebsite() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const response = await websiteApi.create(formData)
      console.log('Website created:', response.data)
      // Redirect or show success message
    } catch (err) {
      setError(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Website'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
```

---

## Debugging Tips

1. **Use browser DevTools**
   - Network tab: See request/response
   - Console: Check for errors

2. **Test with Postman/Insomnia**
   - Set custom headers
   - View detailed responses
   - Save requests

3. **Check MongoDB**
   - Use MongoDB Compass
   - Verify documents created
   - Check indexes

4. **Enable console logs**
   ```javascript
   // In backend controller
   console.log('Incoming request:', req.body)
   console.log('Saved document:', savedDocument)
   ```

5. **Check error messages**
   - Read the error message carefully
   - Check validation errors array
   - Look for helpful hints

---

## Performance Tips

- Use pagination for list endpoints
- Filter results to reduce data transfer
- Cache frequently accessed data
- Reuse database connections
- Monitor query performance

---

For more details, see `API_DOCUMENTATION.md`
