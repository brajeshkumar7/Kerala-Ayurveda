import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    firstName: String,
    lastName: String,
    businessName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    profileImage: String,
    websites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website'
    }],
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active'
      },
      startDate: Date,
      endDate: Date,
      paymentMethod: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

export default User
