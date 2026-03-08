import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
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
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
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
