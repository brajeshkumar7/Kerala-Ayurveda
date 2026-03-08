import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Website API endpoints
export const websiteApi = {
  create: (data) => api.post('/websites', data),
  getAll: () => api.get('/websites'),
  getById: (id) => api.get(`/websites/${id}`),
  update: (id, data) => api.put(`/websites/${id}`, data),
  delete: (id) => api.delete(`/websites/${id}`),
  publish: (id) => api.post(`/websites/${id}/publish`, {})
}

// Payment API endpoints
export const paymentApi = {
  processPayment: (data) => api.post('/payments', data),
  getPaymentStatus: (id) => api.get(`/payments/${id}`),
  verifyPayment: (id, data) => api.post(`/payments/${id}/verify`, data)
}

// User API endpoints
export const userApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
}

// Upload API endpoints
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  uploadDocument: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/uploads/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default api
