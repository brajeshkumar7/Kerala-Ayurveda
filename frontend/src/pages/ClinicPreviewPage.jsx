import React from 'react'
import ClinicTemplate from '../components/ClinicTemplate'

const ClinicPreviewPage = () => {
  // Sample clinic data - this would come from API in production
  const sampleClinicData = {
    clinicName: 'Ayurveda Wellness Center',
    doctorName: 'Dr. Raj Kumar',
    qualification: 'BAMS, MD (Ayurveda)',
    experience: 15,
    doctorPhoto: 'https://via.placeholder.com/400x400?text=Dr.+Raj+Kumar',
    bio: 'Dr. Raj Kumar is an esteemed Ayurvedic physician with over 15 years of clinical experience in treating various chronic conditions through the principles of Ayurveda. He specializes in panchakarma therapy and has helped thousands of patients achieve optimal health and wellness.',
    clinicDescription: 'Our clinic is dedicated to providing authentic Ayurvedic treatments with a modern approach. We combine traditional wisdom with contemporary medical knowledge to offer the best healthcare solutions for our patients.',
    services: [
      'Panchakarma Therapy',
      'Abhyanga (Oil Massage)',
      'Shirodhara Treatment',
      'Pizhichil Therapy',
      'Basti Treatment',
      'Consultation & Diagnosis'
    ],
    address: '123 Wellness Street, Suite 100, Kottayam, Kerala - 686001',
    googleMapsLink: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDYiS0C_bH0xMSR-lMXXR5q1Q5dZDKbMhg&q=ayurveda+clinic+kottayam',
    phone: '+91-9876543210',
    whatsapp: '+919876543210'
  }

  return (
    <div>
      <ClinicTemplate clinic={sampleClinicData} />
    </div>
  )
}

export default ClinicPreviewPage
