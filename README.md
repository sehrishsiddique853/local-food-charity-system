# FoodBridge

FoodBridge is a full stack food donation coordination platform that connects donors with verified NGOs and gives administrators a clear workflow for managing users, donation requests, and collection status.

The project is built as a practical MERN-style application with role-based dashboards for donors, NGOs, and admins. It focuses on reducing food waste by making surplus food easier to post, request, approve, collect, and distribute.

## Features

- Donor registration, login, profile management, and donation posting
- NGO registration with document upload and admin approval workflow
- Admin dashboard for users, NGOs, donations, requests, reports, and notifications
- Email OTP verification for registration
- Donation request lifecycle: available, requested, booked, collected, expired, cancelled
- Role-based API access control for donor, NGO, and admin routes
- Cloudinary uploads for NGO documents and donation images
- Notification system for key donation and request events
- Responsive React UI with separate dashboards for each role

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- CSS modules/files by page and section

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication with HTTP-only cookies
- Multer and Cloudinary for uploads
- Nodemailer for email delivery

## Project Structure

```text
FoodBridge/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    scripts/
    server.js
  frontend/
    public/
    src/
      components/
      context/
      hooks/
      pages/
      sections/
      services/
      styles/
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd local-food-distribution-system
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_SERVICE=gmail
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
SMTP_FROM=FoodBridge <your_email@example.com>
SMTP_SECURE=false

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_PHONE=3001234567
ADMIN_ADDRESS=Admin Office

EMAIL_DEBUG_OTP=false
DONATION_EXPIRY_INTERVAL_MINUTES=15
```

Optional frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Do not commit real `.env` secrets to GitHub.

### 4. Seed the admin account

From the `backend` folder:

```bash
npm run seed:admin
```

### 5. Run the application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Main User Roles

**Donor**
- Creates an account
- Posts surplus food donations
- Views donation status and donation history
- Updates profile and pickup address details

**NGO**
- Registers with verification details
- Waits for admin approval
- Requests available donations
- Views approved/booked donations
- Marks booked donations as collected

**Admin**
- Reviews and approves NGOs
- Manages users
- Reviews donation requests
- Approves or rejects requests
- Monitors donation and request reports

## API Overview

The backend routes are grouped by role and responsibility:

```text
/api/auth          Authentication, registration, profile, refresh, logout
/api/donations     Donor-only donation APIs
/api/ngo           NGO-only donation request APIs
/api/admin         Admin-only management and reporting APIs
/api/notifications Notifications for authenticated users
/api/contact       Public contact form
```

Role access is enforced with authentication and authorization middleware.

## Quality and Security Notes

- Passwords are hashed with bcrypt.
- JWTs are stored in HTTP-only cookies.
- Admin, donor, and NGO APIs are role-restricted.
- NGO access is restricted until admin approval.
- Read-heavy backend APIs use `.lean()` where appropriate.
- Sensitive fields such as passwords are excluded from read responses.
- File uploads are validated and sent to Cloudinary.

## Available Scripts

Backend:

```bash
npm run dev
npm start
npm run seed:admin
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Build Check

To verify the frontend production build:

```bash
cd frontend
npm run build
```

## Project Status

FoodBridge is a portfolio-ready full-stack application demonstrating authentication, authorization, role-based dashboards, file uploads, email verification, and donation workflow management.
