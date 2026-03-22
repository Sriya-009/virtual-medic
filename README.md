# Virtual Medical System - Project Structure

```
virtual-medical-system/
│
├── backend/                          # Backend Server (Express.js + MySQL)
│   ├── config/
│   │   └── db.js                     # MySQL connection configuration
│   ├── routes/
│   │   ├── auth.js                   # Authentication endpoints
│   │   ├── users.js                  # User management
│   │   ├── doctors.js                # Doctor operations
│   │   ├── patients.js               # Patient operations
│   │   ├── pharmacists.js            # Pharmacist operations
│   │   ├── appointments.js           # Appointments management
│   │   ├── medicalRecords.js         # Medical records
│   │   ├── prescriptions.js          # Prescriptions
│   │   ├── payments.js               # Payment transactions
│   │   └── consultations.js          # Virtual consultations
│   ├── .env                          # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                     # Express server entry point
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.js                # API utility for backend communication
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   └── pharmacist/
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   ├── main.jsx                  # Entry point
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md                         # This file
```

---

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:5000`

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## Project Separation

### Backend Folder (`/backend`)
- **Purpose**: REST API server that handles all business logic and database operations
- **Technology**: Node.js, Express.js, MySQL
- **Port**: 5000
- **Database**: MySQL `virtual_medic`
- **Connects to**: Frontend via HTTP/REST API with CORS enabled

### Frontend Folder (`/frontend`)
- **Purpose**: User interface for the medical system
- **Technology**: React, Vite, CSS
- **Port**: 5173
- **API Communication**: Uses `src/lib/api.js` to connect with backend
- **No Design Changes**: All UI components preserved from original design

---

## Database Connection

**Credentials** (in `backend/.env`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Srii@773
DB_NAME=virtual_medic
PORT=5000
```

Ensure MySQL is running and the `virtual_medic` database exists.

---

## API Integration

Frontend communicates with backend through:
- **File**: `frontend/src/lib/api.js`
- **Library**: Axios
- **Base URL**: `http://localhost:5000/api`

Example API call in frontend:
```javascript
import { authAPI, doctorsAPI } from '@/lib/api';

// Login
const response = await authAPI.login({ username, password });

// Get doctors
const doctors = await doctorsAPI.getAll();
```

---

## Key Features

✅ User Authentication (JWT Tokens)  
✅ Role-based Access (Admin, Doctor, Patient, Pharmacist)  
✅ Appointment Management  
✅ Medical Records  
✅ Prescriptions  
✅ Payment Processing  
✅ Virtual Consultations  
✅ Complete MySQL Database Integration  

---

## Running Both Services Simultaneously

**Option 1: Two Terminal Windows**
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

**Option 2: Using Concurrently (from root)**
```bash
npm install -g concurrently
concurrently "cd backend && npm start" "cd frontend && npm run dev"
```

---

## Important Notes

⚠️ **Keep MySQL running** - Backend depends on it  
⚠️ **Start backend first** - Frontend won't work without it  
⚠️ **Frontend design preserved** - No UI changes made  
⚠️ **CORS enabled** - Only for localhost (change in production)  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MySQL is running, verify `.env` credentials |
| Frontend can't reach backend | Ensure backend is running on port 5000 |
| CORS errors | Check both servers are on correct ports |
| Port already in use | Change PORT in `.env` or use `--port` flag |

---

## File Structure Summary

```
✅ Backend and Frontend: Completely Separated
✅ Backend: Pure API server with database
✅ Frontend: React UI with API integration
✅ Database: MySQL with dedicated connection
✅ API Layer: Centralized in frontend/src/lib/api.js
```

---

For more details:
- Backend: See `backend/README.md`
- Frontend: Check individual module READMEs in `frontend/src/modules/`
