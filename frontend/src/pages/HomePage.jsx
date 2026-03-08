import React, { useEffect, useState } from 'react'
import ClinicTemplate from '../components/ClinicTemplate'
import LandingPage from './LandingPage'

/**
 * Home Page Component
 * 
 * Dynamically renders either:
 * 1. Clinic Website (if accessed via clinic domain)
 * 2. Landing Page (if accessed via main domain)
 * 
 * Uses the GET / endpoint that leverages domainResolver middleware
 */

const HomePage = () => {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Fetch data from root endpoint (which uses domainResolver)
        const response = await fetch('/')
        const result = await response.json()

        if (result.success) {
          setPageData(result)
          setError(null)
        } else {
          setError(result.message || 'Failed to load page')
        }
      } catch (err) {
        console.error('Error fetching page data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#d32f2f'
      }}>
        <div>
          <h2>Error Loading Page</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // No data
  if (!pageData) {
    return <LandingPage />
  }

  // Clinic domain - render clinic website
  if (pageData.isClinicSite && pageData.data) {
    return <ClinicTemplate clinic={pageData.data} />
  }

  // Main domain - render landing page
  if (pageData.isLandingPage) {
    return <LandingPage />
  }

  // Fallback
  return <LandingPage />
}

export default HomePage
