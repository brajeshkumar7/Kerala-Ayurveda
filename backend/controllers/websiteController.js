import DoctorSite from '../models/DoctorSite.js'

/**
 * Create a new clinic website
 * POST /api/websites
 */
export const createWebsite = async (req, res) => {
  try {
    const {
      doctorName,
      clinicName,
      doctorQualification,
      doctorExperience,
      phone,
      whatsapp,
      email,
      address,
      city,
      googleMapsLink,
      services,
      bio,
      domainName,
      template = 'classic'
    } = req.body

    // Validate required fields
    if (!doctorName || !clinicName || !doctorQualification || !email || !phone || !address || !city || !services || !domainName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    // Check if domain already exists
    const existingDomain = await DoctorSite.findOne({ domainName: domainName.toLowerCase() })
    if (existingDomain) {
      return res.status(409).json({
        success: false,
        message: 'This domain name is already taken. Please choose another.'
      })
    }

    // Create new clinic website
    const newWebsite = new DoctorSite({
      doctorName,
      clinicName,
      doctorQualification,
      doctorExperience: parseInt(doctorExperience),
      phone,
      whatsapp: whatsapp || null,
      email,
      address,
      city,
      googleMapsLink: googleMapsLink || null,
      services,
      bio: bio || '',
      domainName: domainName.toLowerCase(),
      template,
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : null,
      isPublished: true, // Auto-publish when created
      status: 'published'
    })

    // Save to database
    const savedWebsite = await newWebsite.save()

    res.status(201).json({
      success: true,
      message: 'Website created successfully',
      data: {
        id: savedWebsite._id,
        doctorName: savedWebsite.doctorName,
        clinicName: savedWebsite.clinicName,
        domainName: savedWebsite.domainName,
        fullDomain: savedWebsite.fullDomainUrl,
        email: savedWebsite.email,
        phone: savedWebsite.phone,
        city: savedWebsite.city,
        template: savedWebsite.template,
        profilePhoto: savedWebsite.profilePhoto,
        status: savedWebsite.status,
        createdAt: savedWebsite.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating website:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(409).json({
        success: false,
        message: `A website with this ${field} already exists`
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create website. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

/**
 * Get all clinic websites
 * GET /api/websites
 */
export const getWebsites = async (req, res) => {
  try {
    const { city, template, status, page = 1, limit = 10 } = req.query

    // Build filter
    const filter = {}
    if (city) filter.city = city
    if (template) filter.template = template
    if (status) filter.status = status

    const skip = (page - 1) * limit

    const websites = await DoctorSite.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('-customContent')

    const total = await DoctorSite.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: websites,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching websites:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch websites'
    })
  }
}

/**
 * Get a single clinic website by ID
 * GET /api/websites/:id
 */
export const getWebsite = async (req, res) => {
  try {
    const { id } = req.params

    const website = await DoctorSite.findById(id)

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      data: website
    })
  } catch (error) {
    console.error('Error fetching website:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch website'
    })
  }
}

/**
 * Get website by domain name
 * GET /api/websites/domain/:domainName
 */
export const getWebsiteByDomain = async (req, res) => {
  try {
    const { domainName } = req.params

    const website = await DoctorSite.findOne({ domainName: domainName.toLowerCase() })

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      data: website
    })
  } catch (error) {
    console.error('Error fetching website:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch website'
    })
  }
}

/**
 * Update a clinic website
 * PUT /api/websites/:id
 */
export const updateWebsite = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Don't allow updating certain fields
    delete updates._id
    delete updates.fullDomain
    delete updates.createdAt

    const website = await DoctorSite.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Website updated successfully',
      data: website
    })
  } catch (error) {
    console.error('Error updating website:', error)

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update website'
    })
  }
}

/**
 * Delete a clinic website
 * DELETE /api/websites/:id
 */
export const deleteWebsite = async (req, res) => {
  try {
    const { id } = req.params

    const website = await DoctorSite.findByIdAndDelete(id)

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Website deleted successfully',
      data: { id: website._id }
    })
  } catch (error) {
    console.error('Error deleting website:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete website'
    })
  }
}

/**
 * Publish a clinic website
 * POST /api/websites/:id/publish
 */
export const publishWebsite = async (req, res) => {
  try {
    const { id } = req.params

    const website = await DoctorSite.findByIdAndUpdate(
      id,
      {
        isPublished: true,
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    )

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Website published successfully',
      data: website
    })
  } catch (error) {
    console.error('Error publishing website:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to publish website'
    })
  }
}

/**
 * Unpublish a clinic website
 * POST /api/websites/:id/unpublish
 */
export const unpublishWebsite = async (req, res) => {
  try {
    const { id } = req.params

    const website = await DoctorSite.findByIdAndUpdate(
      id,
      {
        isPublished: false,
        status: 'draft'
      },
      { new: true }
    )

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Website unpublished successfully',
      data: website
    })
  } catch (error) {
    console.error('Error unpublishing website:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unpublish website'
    })
  }
}
