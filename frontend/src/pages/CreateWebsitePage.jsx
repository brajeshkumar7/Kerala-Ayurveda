import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import '../styles/CreateWebsitePage.css'

export default function CreateWebsitePage() {
  const navigate = useNavigate()
  const { websiteData, setWebsiteData, updateWebsiteField, setLoading, setError } = useStore()
  const [formData, setFormData] = useState(websiteData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.template) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      setWebsiteData(formData)
      navigate('/payment')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save website data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-website-page">
      <div className="container">
        <h1>Create Your Website</h1>
        
        <form onSubmit={handleSubmit} className="website-form">
          <div className="form-group">
            <label htmlFor="name">Website Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., MyAyurvedaClinic"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your business..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="template">Choose Template *</label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleChange}
              required
            >
              <option value="">Select a template</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.contact.email}
                onChange={handleContactChange}
                placeholder="contact@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.contact.phone}
                onChange={handleContactChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.contact.address}
                onChange={handleContactChange}
                placeholder="Your business address"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
