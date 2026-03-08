import express from 'express'

const router = express.Router()

// TODO: Implement auth controllers
// POST register
router.post('/register', (req, res) => {
  res.json({ message: 'User registered', data: req.body })
})

// POST login
router.post('/login', (req, res) => {
  res.json({ message: 'User logged in', token: 'jwt-token-here' })
})

// POST logout
router.post('/logout', (req, res) => {
  res.json({ message: 'User logged out' })
})

// GET profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' })
})

// PUT update profile
router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile', data: req.body })
})

export default router
