# Virtual Medical System - Backend

Express.js backend for the Virtual Medical System using MySQL.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database credentials and JWT secret

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE virtual_medical_db;
   ```

4. **Create users table:**
   ```sql
   CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     username VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     fullname VARCHAR(255),
     phone VARCHAR(20),
     role ENUM('admin', 'doctor', 'patient', 'pharmacist'),
     specialization VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Run server:**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/role/:role` - Get users by role
- `PUT /api/users/:id` - Update user

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specialization/:specialization` - Get doctors by specialization
- `PUT /api/doctors/:id` - Update doctor

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient

### Pharmacists
- `GET /api/pharmacists` - Get all pharmacists
- `GET /api/pharmacists/:id` - Get pharmacist by ID
- `PUT /api/pharmacists/:id` - Update pharmacist

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
