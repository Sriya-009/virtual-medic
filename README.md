# Virtual Medical System - Monorepo

A full-stack medical management system with React frontend and Express backend.

## 📁 Structure

```
virtual-medic/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js REST API
│   ├── config/        # Database and env config
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Auth and other middleware
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MySQL credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`
Backend API at `http://localhost:5000/api`

## 📋 Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- React Router

**Backend:**
- Express.js
- MySQL
- JWT Authentication
- Bcrypt for password hashing

## 🔐 Authentication

- Login/signup via `/api/auth` endpoints
- JWT tokens stored in localStorage on frontend
- Tokens included in Authorization headers for protected endpoints

## 📝 Environment Variables

Backend requires `.env` file in `/backend` directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=virtual_medical_db
PORT=5000
JWT_SECRET=your-secret-key
```
