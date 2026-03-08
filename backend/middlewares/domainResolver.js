import DoctorSite from '../models/DoctorSite.js'

/**
 * Domain Resolver Middleware
 * 
 * Resolves clinic website data based on request hostname
 * Enables dynamic website rendering based on custom domains
 * 
 * Usage:
 * app.use(domainResolver)
 * 
 * After middleware execution:
 * - req.siteData will contain the DoctorSite document if domain exists
 * - req.siteData will be undefined if domain is not found
 */

export const domainResolver = async (req, res, next) => {
  try {
    // Extract hostname and remove port number if present
    // Example: "rajayurveda.ayurwebsites.com:3000" -> "rajayurveda.ayurwebsites.com"
    const hostname = req.hostname.split(':')[0]

    // Query DoctorSite collection for matching domain
    const site = await DoctorSite.findOne({
      domainName: hostname.toLowerCase(),
      isPublished: true // Only return published websites
    })

    // Attach site data to request if found
    if (site) {
      req.siteData = site
      console.log(`✓ Domain resolved: ${hostname} -> ${site.clinicName}`)
    } else {
      // Site not found, but don't stop middleware chain
      req.siteData = null
      console.log(`✗ Domain not found: ${hostname}`)
    }

    // Continue to next middleware/route handler
    next()
  } catch (error) {
    console.error('Domain resolver error:', error.message)
    
    // Set siteData to null on error and continue
    // This ensures the application doesn't crash
    req.siteData = null
    next()
  }
}

export default domainResolver
