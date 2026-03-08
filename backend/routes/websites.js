import express from 'express'
import { validateRequest } from '../middlewares/validation.js'

const router = express.Router()

// TODO: Implement website controllers
// GET all websites
router.get('/', (req, res) => {
  res.json({ message: 'Get all websites' })
})

// GET single website
router.get('/:id', (req, res) => {
  res.json({ message: 'Get website by ID', id: req.params.id })
})

// POST create website
router.post('/', (req, res) => {
  res.json({ message: 'Create website', data: req.body })
})

// PUT update website
router.put('/:id', (req, res) => {
  res.json({ message: 'Update website', id: req.params.id, data: req.body })
})

// DELETE website
router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete website', id: req.params.id })
})

// POST publish website
router.post('/:id/publish', (req, res) => {
  res.json({ message: 'Publish website', id: req.params.id })
})

export default router
