import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import websiteRoutes from './routes/websites.js'
import paymentRoutes from './routes/payments.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/uploads.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/websites', websiteRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)

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
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
