import mongoose from 'mongoose'

const doctorSiteSchema = new mongoose.Schema(
  {
    // Doctor Information
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      index: true
    },
    doctorQualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true
    },
    doctorExperience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: 0,
      max: 70
    },
    bio: {
      type: String,
      default: ''
    },
    profilePhoto: {
      type: String,
      default: null
    },

    // Clinic Information
    clinicName: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
      index: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    googleMapsLink: {
      type: String,
      default: null
    },

    // Services
    services: {
      type: String,
      required: [true, 'Services description is required']
    },

    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      index: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    whatsapp: {
      type: String,
      default: null,
      trim: true
    },

    // Domain
    domainName: {
      type: String,
      required: [true, 'Domain name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/, 'Invalid domain name format'],
      index: true
    },
    fullDomain: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },

    // Website Settings
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'elegant'],
      default: 'classic'
    },

    // Status
    status: {
      type: String,
      enum: ['draft', 'published', 'suspended'],
      default: 'draft'
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },

    // Analytics
    views: {
      type: Number,
      default: 0
    },
    contactSubmissions: {
      type: Number,
      default: 0
    },

    // User Reference (optional, for linking to user)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // SEO Settings
    metaTitle: {
      type: String,
      default: null
    },
    metaDescription: {
      type: String,
      default: null
    },
    metaKeywords: [String],

    // Custom Settings
    customContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

// Index for common queries
doctorSiteSchema.index({ doctorName: 1, city: 1 })
doctorSiteSchema.index({ clinicName: 1 })
doctorSiteSchema.index({ createdAt: -1 })

// Virtual for full domain
doctorSiteSchema.virtual('fullDomainUrl').get(function () {
  return `${this.domainName}.ayurwebsites.com`
})

// Pre-save middleware to set fullDomain
doctorSiteSchema.pre('save', function (next) {
  if (!this.fullDomain) {
    this.fullDomain = `${this.domainName}.ayurwebsites.com`
  }
  next()
})

const DoctorSite = mongoose.model('DoctorSite', doctorSiteSchema)

export default DoctorSite
