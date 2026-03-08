import express from 'express'
import { domainResolver } from '../middlewares/domainResolver.js'

const router = express.Router()

/**
 * Dynamic Clinic Website Routes
 * 
 * These routes work with the domainResolver middleware to serve
 * clinic websites based on the request hostname/domain
 * 
 * Usage:
 * - Apply domainResolver middleware to these routes
 * - Clinic data will be available in req.siteData
 */

// Apply domain resolver middleware to all routes in this router
router.use(domainResolver)

/**
 * GET / - Render clinic website or landing page
 * 
 * If req.siteData exists (clinic domain):
 * - Returns clinic data formatted for ClinicTemplate component
 * - Displays: clinicName, doctorName, qualification, experience, 
 *            services, bio, phone, whatsapp, address, googleMapsLink
 * 
 * If no site data (main domain):
 * - Returns landing page flag
 * - Frontend renders LandingPage component
 */
router.get('/', (req, res) => {
  if (req.siteData) {
    // ✅ Clinic domain detected - render clinic website
    return res.json({
      success: true,
      isClinicSite: true,
      message: `Welcome to ${req.siteData.clinicName}`,
      data: {
        // Clinic Information
        clinicName: req.siteData.clinicName,
        clinicDescription: req.siteData.clinicDescription || '',
        
        // Doctor Information
        doctorName: req.siteData.doctorName,
        qualification: req.siteData.doctorQualification,
        experience: req.siteData.doctorExperience,
        bio: req.siteData.bio,
        doctorPhoto: req.siteData.profilePhoto,
        
        // Services
        services: req.siteData.services,
        
        // Contact Information
        phone: req.siteData.phone,
        whatsapp: req.siteData.whatsapp,
        email: req.siteData.email,
        
        // Address & Location
        address: req.siteData.address,
        city: req.siteData.city,
        googleMapsLink: req.siteData.googleMapsLink,
        
        // Metadata
        template: req.siteData.template,
        isPublished: req.siteData.isPublished,
        domainName: req.siteData.domainName,
        fullDomain: req.siteData.fullDomain
      }
    })
  }

  // ❌ No clinic data - return landing page flag
  return res.json({
    success: true,
    isClinicSite: false,
    isLandingPage: true,
    message: 'Welcome to AyurWebsites',
    domain: req.hostname
  })
})

/**
 * GET /api/site-data - Get clinic data for dynamic rendering
 * 
 * Used by frontend to fetch clinic data and render the website
 */
router.get('/api/site-data', (req, res) => {
  if (req.siteData) {
    return res.json({
      success: true,
      data: req.siteData
    })
  }

  return res.status(404).json({
    success: false,
    message: 'Clinic not found'
  })
})

/**
 * GET /contact - Get current site contact information
 */
router.get('/contact', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({
      success: false,
      message: 'Website not found'
    })
  }

  return res.json({
    success: true,
    data: {
      clinicName: req.siteData.clinicName,
      doctorName: req.siteData.doctorName,
      email: req.siteData.email,
      phone: req.siteData.phone,
      whatsapp: req.siteData.whatsapp,
      address: req.siteData.address
    }
  })
})

/**
 * GET /services - List all services for current clinic
 */
router.get('/services', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({
      success: false,
      message: 'Website not found'
    })
  }

  return res.json({
    success: true,
    data: {
      clinicName: req.siteData.clinicName,
      services: req.siteData.services
    }
  })
})

/**
 * GET /about - Get doctor information
 */
router.get('/about', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({
      success: false,
      message: 'Website not found'
    })
  }

  return res.json({
    success: true,
    data: {
      doctorName: req.siteData.doctorName,
      qualification: req.siteData.doctorQualification,
      experience: req.siteData.doctorExperience,
      bio: req.siteData.bio,
      profilePhoto: req.siteData.profilePhoto
    }
  })
})

/**
 * POST /contact-form - Submit contact form for clinic
 */
router.post('/contact-form', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({
      success: false,
      message: 'Website not found'
    })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    })
  }

  // TODO: Save contact form submission to database
  // TODO: Send email notification to clinic
  
  return res.json({
    success: true,
    message: 'Thank you for your message. We will contact you soon.',
    clinicName: req.siteData.clinicName,
    clinicEmail: req.siteData.email
  })
})

/**
 * Catch-all for undefined routes
 * 
 * If clinic domain: return home page data
 * If main domain: return landing page flag
 */
router.get('*', (req, res) => {
  if (req.siteData) {
    // Clinic domain - return clinic homepage data
    return res.json({
      success: true,
      isClinicSite: true,
      data: {
        clinicName: req.siteData.clinicName,
        doctorName: req.siteData.doctorName,
        qualification: req.siteData.doctorQualification,
        experience: req.siteData.doctorExperience,
        bio: req.siteData.bio,
        doctorPhoto: req.siteData.profilePhoto,
        services: req.siteData.services,
        phone: req.siteData.phone,
        whatsapp: req.siteData.whatsapp,
        address: req.siteData.address,
        googleMapsLink: req.siteData.googleMapsLink
      }
    })
  }

  // Main domain - return landing page
  return res.json({
    success: true,
    isClinicSite: false,
    isLandingPage: true,
    message: 'AyurWebsites - Create Your Clinic Website'
  })
})

export default router
