import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'elegant'],
      default: 'classic'
    },
    services: [{
      id: String,
      name: String,
      description: String,
      price: Number
    }],
    contact: {
      email: {
        type: String,
        required: true
      },
      phone: String,
      address: String
    },
    domain: {
      type: String,
      unique: true,
      sparse: true
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,
    customContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    seoSettings: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    analytics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
)

const Website = mongoose.model('Website', websiteSchema)

export default Website
