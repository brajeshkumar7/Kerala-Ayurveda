import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../styles/ClinicWebsitePage.css'

// derive API base with environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api"
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '')

const normalizeClinicData = (data) => ({
  clinicName: data.clinicName,
  doctorName: data.doctorName,
  qualification: data.qualification || data.doctorQualification,
  experience: data.experience || data.doctorExperience,
  bio: data.bio,
  doctorPhoto: data.doctorPhoto || data.profilePhoto,
  services: data.services,
  phone: data.phone,
  whatsapp: data.whatsapp,
  email: data.email,
  address: data.address,
  city: data.city,
  googleMapsLink: data.googleMapsLink
})

export default function ClinicWebsitePage() {
  const [searchParams] = useSearchParams()
  const [clinicData, setClinicData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClinicData()
  }, [])

  const fetchClinicData = async () => {
    try {
      setLoading(true)
      setError(null)

      const domain = searchParams.get('domain')
      let response

      if (domain) {
        response = await fetch(`${API_BASE_URL}/websites/domain/${encodeURIComponent(domain)}`)
      } else {
        response = await fetch(`${BACKEND_BASE_URL}/api/site-data`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setClinicData(normalizeClinicData(result.data))
      } else {
        setError('Clinic website not found')
      }
    } catch (err) {
      console.error('Error fetching clinic data:', err)
      setError('Failed to load clinic website')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="clinic-website-loading">
        <div className="spinner"></div>
        <p>Loading clinic website...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="clinic-website-error">
        <h2>?? {error}</h2>
        <p>The clinic website you're looking for could not be found.</p>
      </div>
    )
  }

  if (!clinicData) {
    return (
      <div className="clinic-website-error">
        <h2>Website Not Found</h2>
        <p>This clinic website is not available.</p>
      </div>
    )
  }

  const getImageUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${BACKEND_BASE_URL}${path}`
  }

  return (
    <div className="clinic-website">
      <header className="clinic-header">
        <div className="clinic-header-content">
          <h1>{clinicData.clinicName}</h1>
          <p className="clinic-tagline">Professional Ayurvedic Healthcare</p>
        </div>
      </header>

      <section className="clinic-hero">
        <div className="hero-container">
          <div className="doctor-section">
            {clinicData.doctorPhoto && (
              <div className="doctor-photo-container">
                <img
                  src={getImageUrl(clinicData.doctorPhoto)}
                  alt={clinicData.doctorName}
                  className="doctor-photo"
                />
              </div>
            )}
            <div className="doctor-info">
              <h2>Dr. {clinicData.doctorName}</h2>
              <p className="qualification">{clinicData.qualification}</p>
              <p className="experience">Experience: {clinicData.experience} years</p>

              {clinicData.bio && (
                <div className="bio">
                  <h3>About</h3>
                  <p>{clinicData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="clinic-services">
        <div className="container">
          <h2>Services Offered</h2>
          <div className="services-list">
            {typeof clinicData.services === 'string' ? (
              <p>{clinicData.services}</p>
            ) : Array.isArray(clinicData.services) ? (
              <ul>
                {clinicData.services.map((service, index) => (
                  <li key={index}>? {service}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="clinic-contact">
        <div className="container">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>?? Phone</h3>
              <a href={`tel:${clinicData.phone}`} className="contact-link">
                {clinicData.phone}
              </a>
            </div>

            {clinicData.whatsapp && (
              <div className="contact-item">
                <h3>?? WhatsApp</h3>
                <a
                  href={`https://wa.me/${clinicData.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  {clinicData.whatsapp}
                </a>
              </div>
            )}

            <div className="contact-item">
              <h3>?? Email</h3>
              <a href={`mailto:${clinicData.email}`} className="contact-link">
                {clinicData.email}
              </a>
            </div>

            <div className="contact-item">
              <h3>?? Address</h3>
              <p className="address-text">
                {clinicData.address}<br />
                {clinicData.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      {clinicData.googleMapsLink && (
        <section className="clinic-map">
          <div className="container">
            <h2>Location</h2>
            <a
              href={clinicData.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              ?? View on Google Maps
            </a>
          </div>
        </section>
      )}

      <footer className="clinic-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {clinicData.clinicName}. All rights reserved.</p>
          <p>Powered by <strong>AyurWebsites</strong></p>
        </div>
      </footer>
    </div>
  )
}
