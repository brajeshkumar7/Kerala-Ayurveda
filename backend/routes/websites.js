import express from 'express'
import multer from 'multer'
import {
  createWebsite,
  getWebsites,
  getWebsite,
  getWebsiteByDomain,
  updateWebsite,
  deleteWebsite,
  publishWebsite,
  unpublishWebsite
} from '../controllers/websiteController.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'))
    }
  }
})

// POST create website with file upload
router.post('/', upload.single('profilePhoto'), createWebsite)

// GET all websites
router.get('/', getWebsites)

// GET website by domain
router.get('/domain/:domainName', getWebsiteByDomain)

// GET single website by ID
router.get('/:id', getWebsite)

// PUT update website
router.put('/:id', upload.single('profilePhoto'), updateWebsite)

// DELETE website
router.delete('/:id', deleteWebsite)

// POST publish website
router.post('/:id/publish', publishWebsite)

// POST unpublish website
router.post('/:id/unpublish', unpublishWebsite)

export default router
