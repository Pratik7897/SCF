# She Can Foundation — Full-Stack Web Application

![She Can Foundation](https://img.shields.io/badge/She%20Can%20Foundation-Empowering%20Students-violet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

> A modern, professional, and responsive full-stack website for **She Can Foundation** — an NGO empowering students through technology and opportunities.

---

## 🌟 Features

### Frontend
- **Stunning Hero Section** with animated gradient background, floating orbs, and grid overlay
- **Contact Form** with:
  - Real-time client-side validation (name, email, message)
  - Email format validation using regex
  - Loading state with spinner animation
  - "Form Submitted Successfully" success message with clear form reset
  - Error notifications via toast
- **Impact Statistics** dashboard cards on the landing page
- **Admin Dashboard** with:
  - Statistics overview (total, new, read, replied)
  - Paginated submissions table with search & filter
  - Submission detail modal with status update
  - Delete functionality
- **Authentication** (JWT-based admin login)
- **Framer Motion** animations throughout
- **Responsive Design** — mobile-first, works on all screen sizes

### Backend
- **REST API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for admin routes
- **Rate Limiting** (5 form submissions / 15 min, 10 login attempts / 15 min)
- **Input Validation** using express-validator
- **Centralized Error Handling**
- **Pagination, Search & Filter** for submissions

---

## 📁 Project Structure

```
she-can-foundation/
├── frontend/                     # React.js frontend
│   ├── public/
│   │   └── index.html            # SEO-optimized HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm.jsx   # Feature-rich contact form
│   │   │   ├── Navbar.jsx        # Responsive navigation
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx # Route guard
│   │   ├── context/
│   │   │   └── AuthContext.js    # Global auth state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Landing page with hero
│   │   │   ├── AdminLoginPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API service
│   │   ├── App.js                # Router & providers
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Global styles + Tailwind
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                      # Node.js/Express backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── contactController.js  # Form CRUD logic
│   │   └── authController.js     # Admin auth logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── ContactSubmission.js  # Form submission schema
│   │   └── AdminUser.js          # Admin user schema (bcrypt)
│   ├── routes/
│   │   ├── contactRoutes.js      # /api/contact
│   │   └── authRoutes.js         # /api/auth
│   ├── server.js                 # Express server entry point
│   ├── .env.example              # Environment variable template
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** v9+

---

### 1️⃣ Clone the Project

```bash
# Navigate into the project directory
cd she-can-foundation
```

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env with your values:
#   MONGODB_URI=mongodb://localhost:27017/she-can-foundation
#   JWT_SECRET=your_very_strong_random_secret_here
#   PORT=5000

# Start development server
npm run dev
```

The backend will start at: `http://localhost:5000`

#### 🔑 Create First Admin Account

Once the backend is running, make a POST request to set up the admin:

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@shecafoundation.org", "password": "Admin@12345"}'
```

> **Note:** The `/setup` endpoint is disabled once an admin exists.

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Start development server
npm start
```

The frontend will start at: `http://localhost:3000`

---

## 🌐 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit a contact form |
| `GET`  | `/api/health` | Server health check |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login → returns JWT |
| `GET`  | `/api/auth/me` | Get current admin profile |
| `POST` | `/api/auth/setup` | One-time admin creation |

### Admin Endpoints (Requires Bearer Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/contact/stats` | Dashboard statistics |
| `GET`    | `/api/contact/submissions` | List submissions (paginated) |
| `GET`    | `/api/contact/submissions/:id` | Get single submission |
| `PATCH`  | `/api/contact/submissions/:id` | Update status & notes |
| `DELETE` | `/api/contact/submissions/:id` | Delete submission |

#### Query Parameters for `GET /submissions`:
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `status` — Filter by status (`new`, `read`, `replied`, `archived`)
- `search` — Search by name or email

---

## 🎨 Design System

| Property | Value |
|----------|-------|
| **Font (Headings)** | Outfit |
| **Font (Body)** | Inter |
| **Primary Color** | Violet (#7c3aed) |
| **Accent Color** | Fuchsia (#c026d3) |
| **Background** | Deep navy-purple (#0f0a1e) |
| **Card Style** | Glassmorphism |

---

## 🔐 Security Features

- JWT tokens for admin authentication (7-day expiry)
- Bcrypt password hashing (salt rounds: 12)
- Rate limiting on form submission and login endpoints
- Input sanitization with express-validator
- HTTP request body size limited to 10kb
- CORS configured for allowed origins only

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React.js 18 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Bcrypt |
| Validation | Express Validator |

---

## 🖥️ Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero & contact form |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Protected admin dashboard |

---

## 👨‍💻 Development Notes

- The frontend proxies API requests to `http://localhost:5000` via the `"proxy"` field in `package.json`
- Admin token is stored in `localStorage` and auto-attached to API requests via Axios interceptors
- The form auto-clears after successful submission
- The contact form has a 5-submission-per-15-min rate limit on the backend

---

*Built with ❤️ for She Can Foundation Internship Task*
