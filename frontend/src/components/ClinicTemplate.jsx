import React, { useState } from 'react'
import './ClinicTemplate.css'

const ClinicTemplate = ({ clinic = {} }) => {
  const {
    clinicName = 'Clinic Name',
    doctorName = 'Dr. Name',
    qualification = 'Qualification',
    experience = 0,
    doctorPhoto,
    bio = 'Doctor bio goes here',
    services = [],
    address = 'Clinic Address',
    googleMapsLink,
    phone = '',
    whatsapp = '',
    clinicDescription = ''
  } = clinic

  // Format arrays if they come as strings
  const serviceList = Array.isArray(services) 
    ? services 
    : services.split(',').map(s => s.trim()).filter(s => s)

  return (
    <div className="clinic-website">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="clinic-title">{clinicName}</h1>
          <p className="doctor-name">Welcome to {doctorName}'s Practice</p>
          <p className="tagline">Ayurvedic Healthcare Excellence</p>
          
          <div className="cta-buttons">
            {phone && (
              <a 
                href={`tel:${phone}`} 
                className="btn btn-call"
              >
                <span>📞</span> Call Now
              </a>
            )}
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hello, I'm interested in your services`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <span>💬</span> WhatsApp
              </a>
            )}
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* About Doctor Section */}
      <section className="about-doctor">
        <div className="container">
          <h2>About Dr. {doctorName.split(' ').pop()}</h2>
          
          <div className="about-content">
            {doctorPhoto && (
              <div className="doctor-photo-container">
                <img 
                  src={doctorPhoto} 
                  alt={doctorName}
                  className="doctor-photo"
                />
              </div>
            )}
            
            <div className="doctor-info">
              <div className="credential-badge">
                <h3>{doctorName}</h3>
                <p className="qualification">{qualification}</p>
                <p className="experience">
                  <strong>{experience}+ Years</strong> of Experience
                </p>
              </div>

              <div className="bio-section">
                <h4>About</h4>
                <p className="bio-text">{bio}</p>
              </div>

              {clinicDescription && (
                <div className="clinic-description">
                  <h4>Our Practice</h4>
                  <p>{clinicDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {serviceList.length > 0 && (
        <section className="services">
          <div className="container">
            <h2>Our Services</h2>
            <p className="section-subtitle">Comprehensive Ayurvedic Treatments</p>
            
            <div className="services-grid">
              {serviceList.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">🌿</div>
                  <h3>{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clinic Information Section */}
      <section className="clinic-info">
        <div className="container">
          <h2>Visit Us</h2>
          
          <div className="info-content">
            <div className="address-section">
              <h3>📍 Address</h3>
              <p className="address">{address}</p>
              
              {googleMapsLink && (
                <a 
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  View on Google Maps →
                </a>
              )}
            </div>

            {googleMapsLink && (
              <div className="map-section">
                <iframe
                  src={googleMapsLink.replace('maps.google.com', 'www.google.com/maps/embed/v1/place').replace('/maps?', '/maps/embed/v1?')}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Footer Section */}
      <section className="contact-footer">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>We're here to help with your healthcare needs</p>
          
          <div className="contact-buttons">
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="contact-btn call-btn"
              >
                <span className="btn-icon">📞</span>
                <div>
                  <strong>Call Us</strong>
                  <p>{phone}</p>
                </div>
              </a>
            )}

            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hello, I'm interested in your services`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn whatsapp-btn"
              >
                <span className="btn-icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>Chat with us</p>
                </div>
              </a>
            )}
          </div>

          <div className="clinic-hours">
            <h4>🕐 Working Hours</h4>
            <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
            <p>Sunday: By Appointment</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="clinic-footer">
        <p>&copy; {new Date().getFullYear()} {clinicName}. All rights reserved.</p>
        <p>Powered by AyurWebsites</p>
      </footer>
    </div>
  )
}

export default ClinicTemplate
