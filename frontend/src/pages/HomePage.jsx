import React from 'react'
import LandingPage from './LandingPage'

/**
 * Home Page Component
 * 
 * Renders the landing page for main domain
 * In production with domain resolver:
 * - Clinic domain → ClinicTemplate
 * - Main domain → LandingPage
 */

const HomePage = () => {
  // For development, always show landing page
  // In production, this would check the domain and load clinic template if needed
  return <LandingPage />
}

export default HomePage
