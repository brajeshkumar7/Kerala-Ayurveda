import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * AI Content Generator Service
 * Uses Google Gemini AI to generate professional website content for Ayurvedic clinics
 */

class AIContentGenerator {
  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      console.warn('Warning: GOOGLE_GEMINI_API_KEY not set in environment variables')
      this.genAI = null
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    }
  }

  /**
   * Generate clinic description based on doctor and clinic info
   */
  async generateClinicDescription(doctorName, clinicName, qualification, services) {
    if (!this.genAI) {
      return this.getFallbackClinicDescription(clinicName)
    }

    try {
      const prompt = `You are an expert copywriter for Ayurvedic healthcare websites. Generate a compelling and professional clinic description (150-200 words) for "${clinicName}" run by Dr. ${doctorName} (${qualification}). 
      
Services offered: ${services.join(', ')}

The description should:
- Be professional and welcoming
- Highlight Ayurvedic expertise
- Mention trustworthiness and patient care
- Include a call-to-action
- Be suitable for the homepage

Respond with only the description, no additional text.`

      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return text.trim()
    } catch (error) {
      console.error('Error generating clinic description:', error)
      return this.getFallbackClinicDescription(clinicName)
    }
  }

  /**
   * Generate professional doctor bio
   */
  async generateDoctorBio(doctorName, qualification, experience, specialization) {
    if (!this.genAI) {
      return this.getFallbackDoctorBio(doctorName, qualification, experience)
    }

    try {
      const prompt = `You are an expert healthcare copywriter. Generate a professional and engaging doctor bio (100-150 words) for Dr. ${doctorName}.

Details:
- Qualification: ${qualification}
- Experience: ${experience} years
- Specialization: ${specialization}

The bio should:
- Establish credibility and expertise
- Be warm and approachable
- Highlight patient care philosophy
- Mention Ayurvedic expertise
- Be suitable for a clinic website

Respond with only the bio, no additional text.`

      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return text.trim()
    } catch (error) {
      console.error('Error generating doctor bio:', error)
      return this.getFallbackDoctorBio(doctorName, qualification, experience)
    }
  }

  /**
   * Generate SEO meta tags and keywords
   */
  async generateSEOContent(clinicName, doctorName, city, services) {
    if (!this.genAI) {
      return this.getFallbackSEOContent(clinicName, city, services)
    }

    try {
      const prompt = `Generate SEO metadata for an Ayurvedic clinic website. Respond in JSON format ONLY with these exact keys:
{
  "metaDescription": "Meta description for Google (max 160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3", ...],
  "pageTitle": "SEO optimized page title (max 60 characters)"
}

Clinic: ${clinicName}
Doctor: Dr. ${doctorName}
Location: ${city}
Services: ${services.join(', ')}

Focus on:
- Ayurvedic clinic in ${city}
- Local SEO
- Service-based keywords
- Doctor's expertise

Respond with ONLY valid JSON, no other text.`

      const result = await this.model.generateContent(prompt)
      const jsonText = result.response.text()
      const seoData = JSON.parse(jsonText)
      return seoData
    } catch (error) {
      console.error('Error generating SEO content:', error)
      return this.getFallbackSEOContent(clinicName, city, services)
    }
  }

  /**
   * Generate service descriptions
   */
  async generateServiceDescription(serviceName, clinicContext) {
    if (!this.genAI) {
      return this.getFallbackServiceDescription(serviceName)
    }

    try {
      const prompt = `Generate a brief, professional description (50-80 words) for "${serviceName}" offered at an Ayurvedic clinic. ${clinicContext ? `Clinic context: ${clinicContext}` : ''}

The description should:
- Be client-friendly
- Explain benefits
- Sound professional yet approachable
- Be suitable for a website

Respond with only the description, no additional text.`

      const result = await this.model.generateContent(prompt)
      const text = result.response.text()
      return text.trim()
    } catch (error) {
      console.error('Error generating service description:', error)
      return this.getFallbackServiceDescription(serviceName)
    }
  }

  /**
   * Generate complete website content object
   */
  async generateWebsiteContent(doctorData) {
    if (!this.genAI) {
      return this.getFallbackWebsiteContent(doctorData)
    }

    try {
      const [
        clinicDescription,
        doctorBio,
        seoContent,
        ...serviceDescriptions
      ] = await Promise.all([
        this.generateClinicDescription(
          doctorData.doctorName,
          doctorData.clinicName,
          doctorData.doctorQualification,
          doctorData.services || []
        ),
        this.generateDoctorBio(
          doctorData.doctorName,
          doctorData.doctorQualification,
          doctorData.doctorExperience || 0,
          doctorData.services?.[0] || 'Ayurvedic Medicine'
        ),
        this.generateSEOContent(
          doctorData.clinicName,
          doctorData.doctorName,
          doctorData.city,
          doctorData.services || []
        ),
        ...(doctorData.services?.map(service =>
          this.generateServiceDescription(service, doctorData.clinicName)
        ) || [])
      ])

      // Generate service descriptions
      const serviceDescriptionMap = {}
      if (doctorData.services && serviceDescriptions.length > 0) {
        doctorData.services.forEach((service, index) => {
          serviceDescriptionMap[service] = serviceDescriptions[index] || ''
        })
      }

      return {
        clinicDescription,
        doctorBio,
        seoContent,
        serviceDescriptions: serviceDescriptionMap,
        generatedAt: new Date(),
        aiGenerated: true
      }
    } catch (error) {
      console.error('Error generating complete website content:', error)
      return this.getFallbackWebsiteContent(doctorData)
    }
  }

  // ===== FALLBACK CONTENT (When AI is not available) =====

  getFallbackClinicDescription(clinicName) {
    return `Welcome to ${clinicName}, your trusted destination for authentic Ayurvedic healthcare. We are dedicated to providing holistic treatment and wellness solutions using time-tested Ayurvedic principles. Our experienced practitioners combine traditional knowledge with modern understanding to offer personalized care for your health and wellbeing. Visit us today and experience the healing power of Ayurveda.`
  }

  getFallbackDoctorBio(doctorName, qualification, experience) {
    return `Dr. ${doctorName} is a highly qualified and experienced Ayurvedic practitioner with ${experience || '10+'} years of clinical expertise. With credentials in ${qualification}, Dr. ${doctorName} is committed to providing compassionate, personalized healthcare solutions. Specializing in holistic wellness and disease management, Dr. ${doctorName} believes in treating the root cause of ailments through Ayurvedic principles.`
  }

  getFallbackSEOContent(clinicName, city, services) {
    const serviceStr = services.slice(0, 3).join(', ')
    return {
      metaDescription: `${clinicName} - Professional Ayurvedic clinic in ${city} offering ${serviceStr} and more. Expert care for your health.`,
      keywords: [
        `Ayurvedic clinic in ${city}`,
        'Ayurveda',
        'Ayurvedic treatment',
        clinicName,
        ...services.slice(0, 3)
      ],
      pageTitle: `${clinicName} - Ayurveda in ${city}`
    }
  }

  getFallbackServiceDescription(serviceName) {
    return `Our ${serviceName} service provides comprehensive Ayurvedic treatment and wellness solutions. Experience personalized care delivered by our experienced practitioners using authentic Ayurvedic methods.`
  }

  getFallbackWebsiteContent(doctorData) {
    return {
      clinicDescription: this.getFallbackClinicDescription(doctorData.clinicName),
      doctorBio: this.getFallbackDoctorBio(
        doctorData.doctorName,
        doctorData.doctorQualification,
        doctorData.doctorExperience
      ),
      seoContent: this.getFallbackSEOContent(
        doctorData.clinicName,
        doctorData.city,
        doctorData.services || []
      ),
      serviceDescriptions: {},
      generatedAt: new Date(),
      aiGenerated: false
    }
  }
}

export default new AIContentGenerator()
