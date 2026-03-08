import DoctorSite from '../models/DoctorSite.js'

/**
 * Domain Resolver Middleware
 *
 * Resolves clinic website data based on request hostname.
 * Supports:
 * - subdomain.localhost (development)
 * - subdomain.ayurwebsites.com (production)
 * - direct domain matches stored in domainName/fullDomain
 */
export const domainResolver = async (req, res, next) => {
  try {
    const hostname = req.hostname.toLowerCase().split(':')[0]
    const hostParts = hostname.split('.').filter(Boolean)
    const subdomain = hostParts.length > 1 ? hostParts[0] : null

    const domainCandidates = new Set([hostname])
    if (subdomain) domainCandidates.add(subdomain)
    if (hostname.endsWith('.localhost')) {
      domainCandidates.add(hostname.replace(/\.localhost$/, ''))
    }

    const fullDomainCandidates = new Set([hostname])
    for (const domain of domainCandidates) {
      fullDomainCandidates.add(`${domain}.localhost`)
      fullDomainCandidates.add(`${domain}.ayurwebsites.com`)
    }

    const site = await DoctorSite.findOne({
      isPublished: true,
      $or: [
        { domainName: { $in: Array.from(domainCandidates) } },
        { fullDomain: { $in: Array.from(fullDomainCandidates) } }
      ]
    })

    if (site) {
      req.siteData = site
      console.log(`Domain resolved: ${hostname} -> ${site.clinicName}`)
    } else {
      req.siteData = null
      console.log(`Domain not found: ${hostname}`)
    }

    next()
  } catch (error) {
    console.error('Domain resolver error:', error.message)
    req.siteData = null
    next()
  }
}

export default domainResolver
