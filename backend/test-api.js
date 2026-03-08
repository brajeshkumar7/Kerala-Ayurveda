/**
 * API Test File - Test Website Creation and Other Endpoints
 * 
 * Usage:
 * 1. Make sure backend is running: npm run dev
 * 2. Update the API_URL if needed
 * 3. Run: node test-api.js
 */

const API_URL = 'http://localhost:5000/api'
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

// Test data
const testWebsiteData = {
  doctorName: 'Dr. Raj Kumar',
  clinicName: 'Ayurveda Wellness Center',
  doctorQualification: 'BAMS, MD',
  doctorExperience: 15,
  phone: '+91-9876543210',
  whatsapp: '+91-9876543210',
  email: 'clinic@example.com',
  address: '123 Wellness Street, Suite 100',
  city: 'Kottayam',
  googleMapsLink: 'https://maps.google.com/?q=ayurveda+clinic',
  services: 'Panchakarma Treatment, Oil Massage, Herbal Consultation, Ayurvedic Remedies',
  bio: 'Dr. Raj Kumar is an experienced Ayurvedic practitioner with 15 years of clinical experience. Specializing in Panchakarma detoxification and chronic disease management.',
  domainName: 'rajayurveda-' + Date.now(),
  template: 'modern'
}

/**
 * Test 1: Create a new website
 */
async function testCreateWebsite() {
  console.log('\n--- TEST 1: Create Website ---')
  console.log('Creating website for:', testWebsiteData.doctorName)

  try {
    const response = await fetch(`${API_URL}/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testWebsiteData)
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website created successfully!')
      console.log('Website ID:', data.data.id)
      console.log('Domain:', data.data.fullDomain)
      return data.data.id
    } else {
      console.log('✗ Error creating website:', data.message)
      console.log('Details:', data.errors || data)
      return null
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
    return null
  }
}

/**
 * Test 2: Get all websites
 */
async function testGetAllWebsites() {
  console.log('\n--- TEST 2: Get All Websites ---')

  try {
    const response = await fetch(`${API_URL}/websites?page=1&limit=5`, {
      method: 'GET'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Websites retrieved successfully!')
      console.log(`Total websites: ${data.pagination.total}`)
      console.log(`Showing page ${data.pagination.page} of ${data.pagination.pages}`)
      console.log(`\nFirst 3 websites:`)
      data.data.slice(0, 3).forEach((site, index) => {
        console.log(`  ${index + 1}. ${site.clinicName} - ${site.doctorName}`)
      })
      return data.data[0]?.id || null
    } else {
      console.log('✗ Error fetching websites:', data.message)
      return null
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
    return null
  }
}

/**
 * Test 3: Get single website
 */
async function testGetWebsite(websiteId) {
  if (!websiteId) {
    console.log('\n--- TEST 3: Get Website (Skipped - No ID) ---')
    return
  }

  console.log('\n--- TEST 3: Get Single Website ---')
  console.log('Fetching website ID:', websiteId)

  try {
    const response = await fetch(`${API_URL}/websites/${websiteId}`, {
      method: 'GET'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website retrieved successfully!')
      console.log('Clinic:', data.data.clinicName)
      console.log('Doctor:', data.data.doctorName)
      console.log('Status:', data.data.status)
      console.log('Created:', new Date(data.data.createdAt).toLocaleString())
    } else {
      console.log('✗ Error fetching website:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Test 4: Get website by domain
 */
async function testGetWebsiteByDomain(domainName) {
  console.log('\n--- TEST 4: Get Website by Domain ---')
  console.log('Fetching domain:', domainName)

  try {
    const response = await fetch(`${API_URL}/websites/domain/${domainName}`, {
      method: 'GET'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website found by domain!')
      console.log('Clinic:', data.data.clinicName)
      console.log('Full Domain:', data.data.fullDomain)
    } else {
      console.log('✗ Domain not found:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Test 5: Update website
 */
async function testUpdateWebsite(websiteId) {
  if (!websiteId) {
    console.log('\n--- TEST 5: Update Website (Skipped - No ID) ---')
    return
  }

  console.log('\n--- TEST 5: Update Website ---')
  console.log('Updating website ID:', websiteId)

  const updateData = {
    bio: 'Updated biography: Dr. Raj Kumar specializes in Panchakarma and immune system enhancement.',
    phone: '+91-9876543211'
  }

  try {
    const response = await fetch(`${API_URL}/websites/${websiteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website updated successfully!')
      console.log('Updated bio:', data.data.bio.substring(0, 50) + '...')
    } else {
      console.log('✗ Error updating website:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Test 6: Publish website
 */
async function testPublishWebsite(websiteId) {
  if (!websiteId) {
    console.log('\n--- TEST 6: Publish Website (Skipped - No ID) ---')
    return
  }

  console.log('\n--- TEST 6: Publish Website ---')
  console.log('Publishing website ID:', websiteId)

  try {
    const response = await fetch(`${API_URL}/websites/${websiteId}/publish`, {
      method: 'POST'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website published successfully!')
      console.log('Status:', data.data.status)
      console.log('Is Published:', data.data.isPublished)
      console.log('Published at:', data.data.publishedAt)
    } else {
      console.log('✗ Error publishing website:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Test 7: Unpublish website
 */
async function testUnpublishWebsite(websiteId) {
  if (!websiteId) {
    console.log('\n--- TEST 7: Unpublish Website (Skipped - No ID) ---')
    return
  }

  console.log('\n--- TEST 7: Unpublish Website ---')
  console.log('Unpublishing website ID:', websiteId)

  try {
    const response = await fetch(`${API_URL}/websites/${websiteId}/unpublish`, {
      method: 'POST'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website unpublished successfully!')
      console.log('Status:', data.data.status)
      console.log('Is Published:', data.data.isPublished)
    } else {
      console.log('✗ Error unpublishing website:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Test 8: Delete website
 */
async function testDeleteWebsite(websiteId) {
  if (!websiteId) {
    console.log('\n--- TEST 8: Delete Website (Skipped - No ID) ---')
    return
  }

  console.log('\n--- TEST 8: Delete Website ---')
  console.log('Deleting website ID:', websiteId)

  try {
    const response = await fetch(`${API_URL}/websites/${websiteId}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✓ Website deleted successfully!')
      console.log('Deleted ID:', data.data.id)
    } else {
      console.log('✗ Error deleting website:', data.message)
    }
  } catch (error) {
    console.log('✗ Network error:', error.message)
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('='.repeat(50))
  console.log('AyurWebsites - API Test Suite')
  console.log('='.repeat(50))
  console.log('API URL:', API_URL)
  console.log('Time:', new Date().toLocaleString())

  let createdWebsiteId = null
  let firstWebsiteId = null

  // Run tests in sequence
  createdWebsiteId = await testCreateWebsite()
  firstWebsiteId = await testGetAllWebsites()
  await testGetWebsite(createdWebsiteId || firstWebsiteId)
  await testGetWebsiteByDomain(testWebsiteData.domainName)
  await testUpdateWebsite(createdWebsiteId || firstWebsiteId)
  await testPublishWebsite(createdWebsiteId || firstWebsiteId)
  await testUnpublishWebsite(createdWebsiteId || firstWebsiteId)
  // Uncomment to delete: await testDeleteWebsite(createdWebsiteId || firstWebsiteId)

  console.log('\n' + '='.repeat(50))
  console.log('Test Suite Completed')
  console.log('='.repeat(50))
}

// Run the tests
runTests().catch(console.error)
