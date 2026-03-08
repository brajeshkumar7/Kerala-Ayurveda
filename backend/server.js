import dotenv from 'dotenv'

// Load environment variables FIRST, before any other imports
dotenv.config()

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import websiteRoutes from './routes/websites.js'
import paymentRoutes from './routes/payments.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/uploads.js'
import clinicWebsiteRoutes from './routes/clinicWebsite.js'
import { domainResolver } from './middlewares/domainResolver.js'

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/websites', websiteRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)

// Clinic website routes with domain resolver (for custom domains)
app.use(domainResolver)
app.use(clinicWebsiteRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
