# AyurWebsites

AyurWebsites is a full-stack platform to create, publish, and manage Ayurvedic doctor/clinic websites with payment integration, template-based rendering, and custom-domain-ready routing.

## What This Project Does

- Lets a clinic owner create a website via a multi-step form.
- Supports doctor profile photo upload during creation.
- Integrates Razorpay order + payment verification flow.
- Publishes and manages websites from a dashboard.
- Renders doctor websites from DB data using multiple templates.
- Resolves clinic sites by domain/subdomain (including wildcard subdomain deployments).

## Current Feature Set (Latest)

### Core Product
- Multi-step website creation form (`/create`)
- Payment flow (`/payment` -> `/success`)
- Dashboard listing all created websites (`/dashboard`)
- Visit website action for each clinic
- Publish / unpublish endpoints

### Doctor Website Templates
Available template IDs:
- `classic`
- `modern`
- `minimal`
- `elegant`
- `wellness`
- `heritage`
- `zen`

The selected template is saved in MongoDB and applied in clinic rendering.

### Landing Page (Current)
- Hero section
- CTA section
- Footer

Note: The older "Why Choose" and pricing sections were removed.

### Domain and Routing
- API lookup by domain: `/api/websites/domain/:domainName`
- Domain resolver middleware maps hostname/subdomain to clinic data
- Root route (`/`) on backend:
  - Redirects to frontend clinic route when a clinic domain is resolved
  - Returns landing JSON when no clinic mapping is found

### Image Handling (Latest)
- Website create/update uses `multer.memoryStorage()`
- Profile photo is stored as data URL when uploaded via memory buffer
- This avoids many missing-image issues on serverless/stateless hosting

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Zustand
- Axios
- CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Multer
- Razorpay SDK
- CORS + dotenv

## Repository Structure

```text
frontend/
  src/
    pages/
    components/
    services/
    store/
    styles/
  vercel.json

backend/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  uploads/
  server.js
```

## Routes (Frontend)

- `/` -> HomePage
- `/landing` -> LandingPage
- `/create` -> CreateWebsitePage
- `/payment` -> PaymentPage
- `/success` -> SuccessPage
- `/dashboard` -> DashboardPage
- `/clinic` -> ClinicWebsitePage (`?domain=yourDomain`)

## API Endpoints (Backend)

Base path: `/api`

### Websites
- `POST /websites` (multipart form, supports `profilePhoto`)
- `GET /websites`
- `GET /websites/:id`
- `GET /websites/domain/:domainName`
- `PUT /websites/:id` (multipart supported)
- `DELETE /websites/:id`
- `POST /websites/:id/publish`
- `POST /websites/:id/unpublish`

### Payments (Razorpay)
- `POST /payment/create-order`
- `POST /payment/verify`
- `POST /payment/capture`
- `POST /payment/refund`
- `GET /payment/order/:orderId`
- `GET /payment/payment/:paymentId`
- `GET /payment/:paymentId`
- `GET /payment`

### Auth
- `/auth/*` routes available (register/login/profile pattern)

### Uploads
- `POST /uploads/image`
- `POST /uploads/document`

### Health
- `GET /api/health`

## Environment Variables

## Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ayurwebsites
JWT_SECRET=replace_this

# IMPORTANT: used by clinicWebsite redirect logic
FRONTEND_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

## Frontend (`frontend/.env` or `.env.local`)

```env
VITE_API_URL=http://localhost:5000

# Enable custom subdomain behavior in frontend links/resolution
VITE_ENABLE_CUSTOM_SUBDOMAINS=false
VITE_CLINIC_BASE_DOMAIN=ayurvedaclinicwebsite.com
```

## Local Development

## 1) Start backend

```bash
cd backend
npm install
npm run dev
```

## 2) Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Build Commands

### Frontend
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Backend
- `npm run dev`
- `npm start`

## Deployment Guide (Vercel + External DNS such as Cloudflare)

## 1) Add domains in Vercel project
Add all of these in **Project -> Settings -> Domains**:
- `ayurvedaclinicwebsite.com`
- `www.ayurvedaclinicwebsite.com`
- `*.ayurvedaclinicwebsite.com`

## 2) Configure DNS at your DNS provider
Use values shown by Vercel for your project. Typical records:
- `A` record: `@` -> `216.198.79.1` (or Vercel-provided A value)
- `CNAME` record: `www` -> Vercel-provided target (for example `...vercel-dns-017.com`)
- `CNAME` record: `*` -> `cname.vercel-dns.com`

For Cloudflare, keep these records as **DNS only** (not proxied) while verifying.

## 3) Do NOT mix DNS authority modes
Choose one:
- External DNS (Cloudflare/GoDaddy/etc) with DNS records matching Vercel requirements, OR
- Full Vercel DNS (change registrar nameservers to `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)

Do not configure both simultaneously.

## 4) Frontend env vars in Vercel

```env
VITE_API_URL=https://your-backend-domain
VITE_ENABLE_CUSTOM_SUBDOMAINS=true
VITE_CLINIC_BASE_DOMAIN=ayurvedaclinicwebsite.com
```

Redeploy after changing env vars.

## 5) Backend production settings
- Set `FRONTEND_URL` to deployed frontend URL
- Ensure CORS allows your frontend origin(s)
- Ensure backend is HTTPS and publicly reachable

## Troubleshooting

### Vercel shows "Invalid Configuration"
- DNS records do not yet match Vercel expected values, or
- DNS propagation is still in progress, or
- You added Vercel nameserver records as DNS entries instead of changing nameservers at registrar

### Custom subdomain opens NXDOMAIN
- Wildcard `CNAME *` is missing or wrong
- DNS not propagated yet
- Domain not added in Vercel with wildcard entry

### Doctor images sometimes missing
- Older records may still reference stale `/uploads/...` paths from previous deployments
- Re-upload image for those records so profile photo stores as current data URL format

### Visit Website opens JSON instead of clinic page
- Usually happens when hitting backend domain directly without correct frontend redirect context
- Confirm backend `FRONTEND_URL` is correct
- Confirm frontend `/clinic?domain=...` route is deployed and working

## Demo Checklist (HR Presentation)

1. Open `/landing`
2. Go to `/create`
3. Fill clinic details + upload doctor image
4. Pick different templates (including `wellness`, `heritage`, `zen`)
5. Complete payment
6. Open `/dashboard`
7. Click **Visit Website** and show domain-based rendering

## Notes for Maintainers

- Backend currently has CORS origin hardcoded in `backend/server.js` to `https://kerala-ayurveda.vercel.app`. If you move domains/environments, update this to env-driven configuration.
- `frontend/vercel.json` rewrites all routes to `/` for SPA routing.

## License

ISC
