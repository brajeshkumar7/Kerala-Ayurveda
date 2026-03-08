# Clinic Website Template Documentation

## Overview

The **ClinicTemplate** is a fully responsive, modern clinic website component built with React. It displays comprehensive clinic and doctor information with interactive sections and mobile-friendly design.

## Files

- **ClinicTemplate.jsx** - Main React component
- **ClinicTemplate.css** - Responsive styling
- **ClinicPreviewPage.jsx** - Example page showing how to use the template

## Features

✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop  
✅ **Hero Section** - Eye-catching introduction with call-to-action  
✅ **Doctor Profile** - Photo, bio, qualifications, and experience  
✅ **Services Directory** - List of treatments and services offered  
✅ **Clinic Information** - Address, Google Maps integration  
✅ **Contact Actions** - Direct call and WhatsApp integration  
✅ **Modern Design** - Gradient backgrounds, smooth animations, hover effects  
✅ **Accessible** - Semantic HTML, proper link handling  

## Usage

### Basic Usage

```jsx
import ClinicTemplate from '../components/ClinicTemplate'

const MyClinicPage = () => {
  const clinicData = {
    clinicName: 'My Clinic',
    doctorName: 'Dr. Name',
    qualification: 'Qualification',
    experience: 10,
    // ... more data
  }

  return <ClinicTemplate clinic={clinicData} />
}
```

### Props

The `ClinicTemplate` component accepts a single `clinic` prop with the following structure:

```javascript
{
  // Required fields
  clinicName: string,           // Clinic/Business name
  doctorName: string,           // Doctor's full name
  qualification: string,        // Doctor's qualifications (e.g., "BAMS, MD")
  experience: number,           // Years of experience
  
  // Contact fields
  phone: string,                // Phone number (with country code)
  whatsapp: string,             // WhatsApp number (with country code)
  email: string,                // Email address (optional)
  
  // Location & Maps
  address: string,              // Full clinic address
  googleMapsLink: string,       // Google Maps embed URL or link
  
  // Doctor Information
  doctorPhoto: string,          // URL to doctor's photo
  bio: string,                  // Doctor's biography
  clinicDescription: string,    // Description of the clinic
  
  // Services
  services: array,              // Array of service names OR comma-separated string
}
```

### Complete Example

```jsx
import ClinicTemplate from '../components/ClinicTemplate'

const ViewClinic = () => {
  const clinic = {
    clinicName: 'Ayurveda Wellness Center',
    doctorName: 'Dr. Raj Kumar',
    qualification: 'BAMS, MD (Ayurveda)',
    experience: 15,
    
    phone: '+91-9876543210',
    whatsapp: '+919876543210',
    email: 'clinic@example.com',
    
    address: '123 Wellness Street, Suite 100, Kottayam, Kerala',
    googleMapsLink: 'https://www.google.com/maps/embed/v1/place?...',
    
    doctorPhoto: 'https://example.com/doctor-photo.jpg',
    bio: 'Dr. Raj Kumar is a renowned Ayurvedic physician with 15+ years of experience...',
    clinicDescription: 'We provide authentic Ayurvedic treatments...',
    
    services: [
      'Panchakarma Therapy',
      'Oil Massage',
      'Consultation'
    ]
  }

  return <ClinicTemplate clinic={clinic} />
}

export default ViewClinic
```

## Sections Breakdown

### 1. Hero Section
- Clinic name
- Doctor name
- Tagline
- Call & WhatsApp buttons
- Full-height background with gradient

### 2. About Doctor Section
- Doctor's photo
- Name and qualification
- Years of experience badge
- Bio/about text
- Clinic description

### 3. Services Section
- Grid layout of services
- Service cards with hover effects
- Emoji icons for visual appeal

### 4. Clinic Information Section
- Clinic address
- Google Maps embedded
- Link to open in Google Maps

### 5. Contact Footer Section
- Clickable call button
- WhatsApp action button
- Working hours information
- Footer with copyright

## Customization

### Change Colors

Edit the CSS in `ClinicTemplate.css`:

```css
/* Change primary color (purple) */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

Current colors:
- Primary: `#667eea` (Blue-purple)
- Secondary: `#764ba2` (Purple)
- Call Button: `#ff6b6b` (Red)
- WhatsApp Button: `#25d366` (Green)

### Modify Services Array

Services can be passed as:
- Array: `["Service 1", "Service 2"]`
- String: `"Service 1, Service 2"` (comma-separated)

### Responsive Breakpoints

The template is optimized for:
- **Desktop**: Full-width layouts, multi-column grids
- **Tablet** (≤768px): Adjusted font sizes, 2-column to 1-column transitions
- **Mobile** (≤480px): Single column, touch-friendly buttons
- **Extra Small** (<360px): Minimal padding, compact layouts

## API Integration

### Fetching Clinic Data

```jsx
import { useEffect, useState } from 'react'
import ClinicTemplate from '../components/ClinicTemplate'

const ClinicPage = ({ domainName }) => {
  const [clinic, setClinic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch clinic data from API
    fetch(`/api/websites/domain/${domainName}`)
      .then(res => res.json())
      .then(data => {
        setClinic(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [domainName])

  if (loading) return <div>Loading...</div>
  if (!clinic) return <div>Clinic not found</div>

  return <ClinicTemplate clinic={clinic} />
}

export default ClinicPage
```

## Button Actions

### Call Button
- Automatically uses the `phone` field
- Creates a tel: link (opens phone dialer on mobile)

### WhatsApp Button
- Uses the `whatsapp` field
- Opens WhatsApp with pre-filled message
- Works on mobile and web

### Google Maps
- Embeds maps directly on the page
- Also provides a link to open in Google Maps
- Requires valid Google Maps URL

## Styling Classes

Main CSS classes for custom styling:

```css
.clinic-website          /* Main wrapper */
.hero                    /* Hero section */
.hero-content            /* Hero content */
.clinic-title            /* Clinic name heading */
.about-doctor            /* About section */
.doctor-photo            /* Doctor image */
.services                /* Services section */
.services-grid           /* Services grid layout */
.service-card            /* Individual service card */
.clinic-info             /* Clinic information section */
.contact-footer          /* Contact footer section */
.clinic-footer           /* Page footer */
```

## Browser Support

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized CSS with minimal animations
- Responsive images with proper sizing
- Lazy-loaded Google Maps embed
- Fast component rendering

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3, h4)
- Link titles and alt attributes
- Good color contrast ratios
- Touch-friendly button sizes (minimum 44px)

## Mobile Optimization

- Full responsive design
- Touch-friendly buttons and links
- Optimized font sizes for readability
- Proper spacing on small screens
- Simplified layouts for mobile

## Example with Real Data

```jsx
const realClinicData = {
  clinicName: 'Ayurveda Healing Center',
  doctorName: 'Dr. Priya Sharma',
  qualification: 'BAMS, MD (Ayurveda), Certified Panchakarma Specialist',
  experience: 12,
  
  phone: '+91-9988776655',
  whatsapp: '+919988776655',
  
  address: '456 Health Avenue, Kochi, Kerala 682001',
  googleMapsLink: 'https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=kochi+ayurveda',
  
  doctorPhoto: 'https://api.ayurwebsites.com/uploads/profile-123.jpg',
  bio: 'Dr. Priya Sharma specializes in treating digestive disorders, women health issues, and stress-related conditions using traditional Ayurvedic principles combined with modern diagnostic tools.',
  clinicDescription: 'Our clinic offers integrated Ayurvedic healthcare with expert physicians, authentic treatments, and a healing environment.',
  
  services: [
    'Panchakarma Detoxification',
    'Abhyanga Oil Massage',
    'Shirodhara Brain Therapy',
    'Pizhichil Full Body Treatment',
    'Nasya Nasal Therapy',
    'Online Consultation',
    'Diet & Lifestyle Counseling',
    'Herbal Medicine Prescription'
  ]
}
```

## Troubleshooting

### Maps not showing?
- Ensure `googleMapsLink` is a valid Google Maps embed URL
- Check if Google Maps API key is valid

### Buttons not working?
- Phone format: `+91-XXXXXXXXXX`
- WhatsApp format: `+91XXXXXXXXXX` (no special characters)

### Images not loading?
- Check if image URLs are accessible
- Ensure proper CORS headers if using external images

### Styling issues on mobile?
- Clear browser cache
- Test in incognito/private mode
- Check viewport meta tag in HTML

## Future Enhancements

Potential improvements:
- Appointment booking system
- Patient testimonials section
- Service pricing display
- Doctor availability/schedule
- Patient reviews/ratings
- Multi-language support
- Dark mode option

---

**Status**: ✅ Production Ready

The ClinicTemplate is fully functional and ready for deployment!
