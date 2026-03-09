import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { websiteApi } from '../services/api'
import '../styles/DashboardPage.css'

const CLINIC_BASE_DOMAIN = import.meta.env.VITE_CLINIC_BASE_DOMAIN || 'ayurwebsites.com'
const ENABLE_CUSTOM_SUBDOMAINS = import.meta.env.VITE_ENABLE_CUSTOM_SUBDOMAINS === 'true'

const getWebsiteUrl = (domainName) => {
  if (!domainName) return '#'

  const appRouteUrl = `${window.location.origin}/clinic?domain=${encodeURIComponent(domainName)}`

  if (!ENABLE_CUSTOM_SUBDOMAINS) {
    return appRouteUrl
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return appRouteUrl
  }

  return `https://${domainName}.${CLINIC_BASE_DOMAIN}`
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '')

  const getProfilePhotoUrl = (photo) => {
    if (!photo) return null
    if (photo.startsWith('data:') || photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo
    }
    return `${API_BASE_URL}${photo.startsWith('/') ? photo : `/${photo}`}`
  }

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await websiteApi.getAll()
      setWebsites(response.data.data || [])
    } catch (err) {
      console.error('Error fetching websites:', err)
      setError('Failed to load websites')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this website?')) {
      try {
        await websiteApi.delete(id)
        setWebsites(websites.filter(w => w._id !== id))
        alert('Website deleted successfully')
      } catch (err) {
        alert('Failed to delete website')
      }
    }
  }

  const handlePublish = async (id) => {
    try {
      await websiteApi.publish(id)
      setWebsites(websites.map(w =>
        w._id === id ? { ...w, isPublished: true } : w
      ))
      alert('Website published successfully')
    } catch (err) {
      alert('Failed to publish website')
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <p>Loading websites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Website Dashboard</h1>
          <p>Manage all your clinic websites</p>
        </div>
        <button className="btn-create-new" onClick={() => navigate('/create')}>
          + Create New Website
        </button>
      </div>

      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {websites.length === 0 ? (
        <div className="no-websites">
          <div className="empty-state">
            <h2>No websites yet</h2>
            <p>Create your first clinic website to get started</p>
            <button className="btn-primary" onClick={() => navigate('/create')}>
              Create Website
            </button>
          </div>
        </div>
      ) : (
        <div className="websites-grid">
          {websites.map(website => (
            <div key={website._id} className="website-card">
              {website.profilePhoto && (
                <div className="website-photo">
                  <img src={getProfilePhotoUrl(website.profilePhoto)} alt={website.clinicName} />
                </div>
              )}

              <div className="website-content">
                <h3>{website.clinicName}</h3>
                <p className="doctor-name">Dr. {website.doctorName}</p>

                <div className="website-details">
                  <div className="detail">
                    <span className="label">Domain:</span>
                    <span className="value">{website.domainName}</span>
                  </div>
                  <div className="detail">
                    <span className="label">City:</span>
                    <span className="value">{website.city}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Email:</span>
                    <span className="value">{website.email}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Phone:</span>
                    <span className="value">{website.phone}</span>
                  </div>
                  {website.paymentId && (
                    <div className="detail">
                      <span className="label">Payment ID:</span>
                      <span className="value code">{website.paymentId.substring(0, 20)}...</span>
                    </div>
                  )}
                </div>

                <div className="website-status">
                  {website.isPublished ? (
                    <span className="status published">Published</span>
                  ) : (
                    <span className="status draft">Draft</span>
                  )}
                </div>

                <div className="website-actions">
                  <a
                    href={getWebsiteUrl(website.domainName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-visit"
                  >
                    Visit Website
                  </a>

                  {!website.isPublished && (
                    <button
                      className="btn-publish"
                      onClick={() => handlePublish(website._id)}
                    >
                      Publish
                    </button>
                  )}

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(website._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-footer">
        <button className="btn-back" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  )
}
