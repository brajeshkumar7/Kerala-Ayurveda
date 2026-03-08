import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingPage from './LandingPage'

const CLINIC_BASE_DOMAIN = (import.meta.env.VITE_CLINIC_BASE_DOMAIN || 'ayurwebsites.com').toLowerCase()
const ENABLE_CUSTOM_SUBDOMAINS = import.meta.env.VITE_ENABLE_CUSTOM_SUBDOMAINS === 'true'

const getClinicDomainFromHost = (hostname) => {
  if (!ENABLE_CUSTOM_SUBDOMAINS) return null

  const host = hostname.toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1') return null

  const suffix = `.${CLINIC_BASE_DOMAIN}`
  if (!host.endsWith(suffix)) return null

  const subdomain = host.slice(0, -suffix.length)

  // Accept only single-level subdomain like "gupta.ayurwebsites.com"
  if (!subdomain || subdomain.includes('.')) return null

  return subdomain
}

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const clinicDomain = getClinicDomainFromHost(window.location.hostname)

    if (clinicDomain) {
      navigate(`/clinic?domain=${encodeURIComponent(clinicDomain)}`, { replace: true })
    }
  }, [navigate])

  return <LandingPage />
}

export default HomePage
