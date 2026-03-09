import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { websiteApi } from '../services/api'
import RazorpayPayment from '../components/RazorpayPayment'
import '../styles/CreateWebsitePage.css'

export default function CreateWebsitePage() {
  const navigate = useNavigate()
  const { websiteData, setWebsiteData, updateWebsiteField, updateContactField, setLoading, setError, clearError } = useStore()
  const [formData, setFormData] = useState(websiteData)
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState(websiteData.profilePhotoUrl || null)
  const [activeTab, setActiveTab] = useState('doctor')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  // Validation rules
  const validateForm = () => {
    const newErrors = {}

    // Doctor Information validation
    if (!formData.doctorName?.trim()) {
      newErrors.doctorName = 'Doctor name is required'
    }
    if (!formData.clinicName?.trim()) {
      newErrors.clinicName = 'Clinic name is required'
    }
    if (!formData.doctorQualification?.trim()) {
      newErrors.doctorQualification = 'Qualification is required'
    }
    if (!formData.doctorExperience) {
      newErrors.doctorExperience = 'Experience is required'
    } else if (formData.doctorExperience < 0 || formData.doctorExperience > 70) {
      newErrors.doctorExperience = 'Please enter a valid experience'
    }

    // Contact validation
    if (!formData.contact.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contact.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.contact.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10,}$/.test(formData.contact.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Clinic Information validation
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.services?.trim()) {
      newErrors.services = 'Please describe your services'
    }

    // Custom domain validation
    if (!formData.domainName?.trim()) {
      newErrors.domainName = 'Domain name is required'
    } else if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(formData.domainName)) {
      newErrors.domainName = 'Please enter a valid domain name'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle contact field change
  const handleContactChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Image size must be less than 5MB'
        }))
        return
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Only JPEG, PNG, and WebP images are allowed'
        }))
        return
      }

      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)

      setErrors(prev => ({
        ...prev,
        profilePhoto: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }

    // Form is valid - show payment modal
    // We won't call the API yet, we'll wait for payment success
    setShowPaymentModal(true)
    clearError()
  }

  /**
   * After payment success - Create website on backend
   */
  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      setLoading(true)
      setPaymentError(null)

      // Prepare form data with payment info
      const submitData = new FormData()
      submitData.append('doctorName', formData.doctorName)
      submitData.append('clinicName', formData.clinicName)
      submitData.append('doctorQualification', formData.doctorQualification)
      submitData.append('doctorExperience', formData.doctorExperience)
      submitData.append('address', formData.address)
      submitData.append('city', formData.city)
      submitData.append('googleMapsLink', formData.googleMapsLink)
      submitData.append('services', formData.services)
      submitData.append('bio', formData.bio)
      submitData.append('email', formData.contact.email)
      submitData.append('phone', formData.contact.phone)
      submitData.append('whatsapp', formData.contact.whatsapp)
      submitData.append('domainName', formData.domainName)
      submitData.append('template', formData.template)

      // Add payment info
      submitData.append('paymentId', paymentDetails.paymentId)
      submitData.append('paymentAmount', paymentDetails.amount)

      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto)
      }

      // Call API to create website
      const response = await websiteApi.create(submitData)

      // Update store with response data
      setWebsiteData({
        ...formData,
        profilePhotoUrl: response.data.profilePhoto,
        paymentId: paymentDetails.paymentId,
        transactionId: paymentDetails.paymentId,
        amount: paymentDetails.amount
      })

      // Close payment modal and navigate to success
      setShowPaymentModal(false)
      navigate('/success')
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create website. Please try again.'
      setPaymentError(errorMsg)
      setError(errorMsg)
      console.error('Error creating website:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (errorMsg) => {
    setPaymentError(errorMsg)
    setError(errorMsg)
  }

  return (
    <div className="create-website-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Create Your Clinic Website</h1>
          <p>Fill in your clinic details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="multi-section-form">
          {/* Tabs */}
          <div className="form-tabs">
            <button
              type="button"
              className={`tab-button ${activeTab === 'doctor' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctor')}
            >
              👨‍⚕️ Doctor Info
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'clinic' ? 'active' : ''}`}
              onClick={() => setActiveTab('clinic')}
            >
              🏥 Clinic Info
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              📞 Contact
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'domain' ? 'active' : ''}`}
              onClick={() => setActiveTab('domain')}
            >
              🌐 Domain
            </button>
          </div>

          {/* Doctor Information Section */}
          {activeTab === 'doctor' && (
            <div className="form-section">
              <h2>Doctor Information</h2>

              <div className="form-group">
                <label htmlFor="doctorName">Doctor Name *</label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Raj Kumar"
                  className={errors.doctorName ? 'error' : ''}
                />
                {errors.doctorName && <span className="error-message">{errors.doctorName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="clinicName">Clinic Name *</label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="e.g., Ayurveda Wellness Center"
                  className={errors.clinicName ? 'error' : ''}
                />
                {errors.clinicName && <span className="error-message">{errors.clinicName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doctorQualification">Qualification *</label>
                  <input
                    type="text"
                    id="doctorQualification"
                    name="doctorQualification"
                    value={formData.doctorQualification}
                    onChange={handleChange}
                    placeholder="e.g., BAMS, MD"
                    className={errors.doctorQualification ? 'error' : ''}
                  />
                  {errors.doctorQualification && <span className="error-message">{errors.doctorQualification}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="doctorExperience">Experience (years) *</label>
                  <input
                    type="number"
                    id="doctorExperience"
                    name="doctorExperience"
                    value={formData.doctorExperience}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    min="0"
                    max="70"
                    className={errors.doctorExperience ? 'error' : ''}
                  />
                  {errors.doctorExperience && <span className="error-message">{errors.doctorExperience}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Doctor Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell patients about yourself, your philosophy, and specialization..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profilePhoto">Profile Photo</label>
                <div className="photo-upload-container">
                  {photoPreview && (
                    <div className="photo-preview">
                      <img src={photoPreview} alt="Profile preview" />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => {
                          setPhotoPreview(null)
                          setFormData(prev => ({
                            ...prev,
                            profilePhoto: null
                          }))
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    onChange={handlePhotoUpload}
                    accept="image/jpeg,image/png,image/webp"
                    className="file-input"
                  />
                  <label htmlFor="profilePhoto" className="file-label">
                    📸 Click to upload or drag and drop
                  </label>
                  {errors.profilePhoto && <span className="error-message">{errors.profilePhoto}</span>}
                </div>
              </div>

              <button type="button" className="nav-btn-next" onClick={() => setActiveTab('clinic')}>
                Next → Clinic Info
              </button>
            </div>
          )}

          {/* Clinic Information Section */}
          {activeTab === 'clinic' && (
            <div className="form-section">
              <h2>Clinic Information</h2>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street, Suite 100"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Kerala"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="template">Website Template</label>
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="elegant">Elegant</option>
                    <option value="wellness">Wellness</option>
                    <option value="heritage">Heritage</option>
                    <option value="zen">Zen</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="googleMapsLink">Google Maps Link (optional)</label>
                <input
                  type="url"
                  id="googleMapsLink"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                  placeholder="Paste your Google Maps link here"
                />
              </div>

              <div className="form-group">
                <label htmlFor="services">Services & Treatments *</label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  placeholder="Describe your services, treatments, and specialties..."
                  rows="5"
                  className={errors.services ? 'error' : ''}
                />
                {errors.services && <span className="error-message">{errors.services}</span>}
              </div>

              <div className="form-nav-buttons">
                <button type="button" className="nav-btn-back" onClick={() => setActiveTab('doctor')}>
                  ← Back to Doctor Info
                </button>
                <button type="button" className="nav-btn-next" onClick={() => setActiveTab('contact')}>
                  Next → Contact
                </button>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div className="form-section">
              <h2>Contact Information</h2>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.contact.email}
                  onChange={handleContactChange}
                  placeholder="clinic@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.contact.phone}
                    onChange={handleContactChange}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp Number (optional)</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.contact.whatsapp}
                    onChange={handleContactChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="info-box">
                <p>💡 These contact details will be displayed on your website for patient inquiries</p>
              </div>

              <div className="form-nav-buttons">
                <button type="button" className="nav-btn-back" onClick={() => setActiveTab('clinic')}>
                  ← Back to Clinic Info
                </button>
                <button type="button" className="nav-btn-next" onClick={() => setActiveTab('domain')}>
                  Next → Domain
                </button>
              </div>
            </div>
          )}

          {/* Domain Section */}
          {activeTab === 'domain' && (
            <div className="form-section">
              <h2>Your Website Domain</h2>

              <div className="form-group">
                <label htmlFor="domainName">Domain Name *</label>
                <div className="domain-input-wrapper">
                  <input
                    type="text"
                    id="domainName"
                    name="domainName"
                    value={formData.domainName}
                    onChange={handleChange}
                    placeholder="e.g., myawesomeclinic"
                    className={errors.domainName ? 'error' : ''}
                  />
                  <span className="domain-extension">.ayurwebsites.com</span>
                </div>
                {errors.domainName && <span className="error-message">{errors.domainName}</span>}
                <p className="field-hint">
                  Your clinic will be available at: <strong>{formData.domainName || 'yourdomain'}.ayurwebsites.com</strong>
                </p>
              </div>

              <div className="info-box success">
                <p>✓ You can upgrade to a custom domain later (e.g., www.yourclinic.com)</p>
              </div>

              <div className="form-nav-buttons">
                <button type="button" className="nav-btn-back" onClick={() => setActiveTab('contact')}>
                  ← Back to Contact
                </button>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary btn-lg"
                  onClick={handleSubmit}
                >
                  {formData.loading ? 'Creating Website...' : 'Create Website & Proceed to Payment'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <div className="payment-header">
                <h2>Complete Your Payment</h2>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="payment-content">
                <div className="payment-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-item">
                    <span>Clinic: {formData.clinicName}</span>
                    <span className="font-bold">{formData.clinicName}</span>
                  </div>
                  <div className="summary-item">
                    <span>Domain: {formData.domainName}.ayurwebsites.com</span>
                  </div>
                  <div className="summary-item">
                    <span>Website Plan:</span>
                    <span className="font-bold">Professional - ₹99.99</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-total">
                    <span>Total Amount:</span>
                    <span className="amount">₹99.99</span>
                  </div>
                </div>

                {paymentError && (
                  <div className="error-box">
                    <p>{paymentError}</p>
                  </div>
                )}

                <RazorpayPayment
                  clinicData={{
                    clinicName: formData.clinicName,
                    email: formData.contact.email,
                    phone: formData.contact.phone,
                    domainName: formData.domainName
                  }}
                  amount={9999} // ₹99.99 in paisa
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />

                <p className="payment-security-note">
                  🔒 Your payment is secured with Razorpay's encrypted payment gateway
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
