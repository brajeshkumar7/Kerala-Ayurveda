import express from 'express'

const router = express.Router()

/**
 * Dynamic Clinic Website Routes
 *
 * These routes depend on req.siteData from domainResolver middleware
 * registered in server.js.
 */

/**
 * GET /
 *
 * If a clinic domain is resolved, redirect browser to frontend clinic page.
 * If request prefers JSON, return clinic payload directly.
 */
router.get('/', (req, res) => {
  if (req.siteData) {
    const wantsHtml = req.accepts('html') && !req.path.startsWith('/api')

    if (wantsHtml) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      const clinicUrl = `${frontendUrl}/clinic?domain=${encodeURIComponent(req.siteData.domainName)}`
      return res.redirect(clinicUrl)
    }

    return res.json({
      success: true,
      isClinicSite: true,
      message: `Welcome to ${req.siteData.clinicName}`,
      data: {
        clinicName: req.siteData.clinicName,
        clinicDescription: req.siteData.clinicDescription || '',
        doctorName: req.siteData.doctorName,
        qualification: req.siteData.doctorQualification,
        experience: req.siteData.doctorExperience,
        bio: req.siteData.bio,
        doctorPhoto: req.siteData.profilePhoto,
        services: req.siteData.services,
        phone: req.siteData.phone,
        whatsapp: req.siteData.whatsapp,
        email: req.siteData.email,
        address: req.siteData.address,
        city: req.siteData.city,
        googleMapsLink: req.siteData.googleMapsLink,
        template: req.siteData.template,
        isPublished: req.siteData.isPublished,
        domainName: req.siteData.domainName,
        fullDomain: req.siteData.fullDomain
      }
    })
  }

  return res.json({
    success: true,
    isClinicSite: false,
    isLandingPage: true,
    message: 'Welcome to AyurWebsites',
    domain: req.hostname
  })
})

/**
 * GET /api/site-data
 *
 * Returns resolved clinic data for current domain.
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

router.get('/contact', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({ success: false, message: 'Website not found' })
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

router.get('/services', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({ success: false, message: 'Website not found' })
  }

  return res.json({
    success: true,
    data: {
      clinicName: req.siteData.clinicName,
      services: req.siteData.services
    }
  })
})

router.get('/about', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({ success: false, message: 'Website not found' })
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

router.post('/contact-form', (req, res) => {
  if (!req.siteData) {
    return res.status(404).json({ success: false, message: 'Website not found' })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    })
  }

  return res.json({
    success: true,
    message: 'Thank you for your message. We will contact you soon.',
    clinicName: req.siteData.clinicName,
    clinicEmail: req.siteData.email
  })
})

router.get('*', (req, res) => {
  if (req.siteData) {
    return res.redirect(`/?from=${encodeURIComponent(req.originalUrl)}`)
  }

  return res.json({
    success: true,
    isClinicSite: false,
    isLandingPage: true,
    message: 'AyurWebsites - Create Your Clinic Website'
  })
})

export default router
