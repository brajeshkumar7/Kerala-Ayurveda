import { create } from 'zustand'

const useStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Website data state
  websiteData: {
    // Basic Info
    domainName: '',
    template: 'classic',
    
    // Doctor Information
    doctorName: '',
    doctorQualification: '',
    doctorExperience: '',
    
    // Clinic Information
    clinicName: '',
    clinicDescription: '',
    address: '',
    city: '',
    googleMapsLink: '',
    services: '',
    
    // Doctor Bio
    bio: '',
    
    // Contact
    contact: {
      email: '',
      phone: '',
      whatsapp: ''
    },
    
    // Profile Photo
    profilePhoto: null,
    profilePhotoUrl: ''
  },
  setWebsiteData: (data) => set((state) => ({
    websiteData: { ...state.websiteData, ...data }
  })),
  updateWebsiteField: (field, value) => set((state) => ({
    websiteData: { ...state.websiteData, [field]: value }
  })),
  updateContactField: (field, value) => set((state) => ({
    websiteData: {
      ...state.websiteData,
      contact: { ...state.websiteData.contact, [field]: value }
    }
  })),
  
  // Payment state
  payment: {
    amount: 0,
    status: 'pending',
    transactionId: null
  },
  setPayment: (payment) => set({ payment }),
  
  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Clear all state
  reset: () => set({
    user: null,
    websiteData: {
      domainName: '',
      template: 'classic',
      doctorName: '',
      doctorQualification: '',
      doctorExperience: '',
      clinicName: '',
      clinicDescription: '',
      address: '',
      city: '',
      googleMapsLink: '',
      services: '',
      bio: '',
      contact: {
        email: '',
        phone: '',
        whatsapp: ''
      },
      profilePhoto: null,
      profilePhotoUrl: ''
    },
    payment: {
      amount: 0,
      status: 'pending',
      transactionId: null
    },
    loading: false,
    error: null
  })
}))

export default useStore
