import { create } from 'zustand'

const useStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Website data state
  websiteData: {
    name: '',
    description: '',
    template: '',
    services: [],
    contact: {
      email: '',
      phone: '',
      address: ''
    }
  },
  setWebsiteData: (data) => set((state) => ({
    websiteData: { ...state.websiteData, ...data }
  })),
  updateWebsiteField: (field, value) => set((state) => ({
    websiteData: { ...state.websiteData, [field]: value }
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
      name: '',
      description: '',
      template: '',
      services: [],
      contact: {
        email: '',
        phone: '',
        address: ''
      }
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
