# Doctor & Pharmacist Signup Approval Workflow

## Overview
This feature adds an approval workflow for doctor and pharmacist signups. When a doctor or pharmacist signs up, their account is marked as "pending" and they cannot login until an admin approves their request.

---

## Database Changes

### New Column: `approval_status` in `users` table
- **Column Name**: `approval_status`
- **Type**: VARCHAR(20)
- **Default**: 'approved'
- **Values**:
  - `approved`: Account is approved and can login
  - `pending`: Account waiting for admin approval (cannot login)
  - `rejected`: Account was rejected (cannot login)

**Migration**: Run `node migrate.js` in the backend directory to add this column.

---

## Backend Implementation

### 1. Auth Controller (`authController.js`)
**Modified `signup()` function**:
- Patients: Automatically set to `approved` status (can login immediately)
- Doctors/Pharmacists: Set to `pending` status (cannot login until approved)
- Returns different responses based on role:
  - Patients: Returns token and allows login
  - Doctors/Pharmacists: Returns pending message without token

**Modified `login()` function**:
- Checks `approval_status` before allowing login
- Rejects login if status is `pending` with message: "Your account is pending admin approval"
- Rejects login if status is `rejected` with message: "Your account has been rejected"

### 2. Admin Controller (`adminController.js`)
Four new functions:

1. **`getPendingRequests()`**
   - GET `/api/admin/pending-requests`
   - Returns list of all pending doctor/pharmacist signup requests
   - Includes specialization info for doctors

2. **`approveRequest()`**
   - POST `/api/admin/approve-request`
   - Body: `{ userId }`
   - Updates approval_status to 'approved'
   - That user can now login

3. **`rejectRequest()`**
   - POST `/api/admin/reject-request`
   - Body: `{ userId, reason (optional) }`
   - Updates approval_status to 'rejected'
   - User cannot login

4. **`getAllUsers()`**
   - GET `/api/admin/users`
   - Returns all users with their approval status

### 3. Admin Routes (`adminRoutes.js`)
New routes registered at `/api/admin/`:
- Requires `verifyToken` middleware
- Requires admin role via `isAdmin` middleware
- Routes:
  - `GET /pending-requests` - Get pending approvals
  - `POST /approve-request` - Approve a request
  - `POST /reject-request` - Reject a request
  - `GET /users` - View all users

### 4. Server Configuration (`server.js`)
- Imported and registered admin routes
- Added: `app.use("/api/admin", adminRoutes);`

---

## Frontend Implementation

### 1. App.jsx (Signup Form)
**Modified `handleSignupSubmit()` function**:
- Checks if response includes `approval_status: 'pending'`
- If pending: Shows success message and closes form without logging in
- If approved: Logs user in and redirects to dashboard
- Users see message: "Account created! Waiting for admin approval..."

### 2. AdminModule.jsx
**New Menu Item**:
- Added "Pending Approvals" under "User Management" section
- Navigable via admin left sidebar

**New State Variables**:
- `pendingRequests`: List of pending approval requests
- `loadingPending`: Loading state for fetching requests

**New Functions**:
1. `fetchPendingRequests()`: Fetches pending requests from backend
2. `handleApproveRequest(userId)`: Approves a doctor/pharmacist
3. `handleRejectRequest(userId)`: Rejects a doctor/pharmacist

**New UI Section**:
- Displays table of pending requests
- Shows: Name, Email, Role, Specialization, Phone, Status
- Action buttons:
  - **Accept**: Approves the account
  - **Reject**: Rejects the account

---

## User Flow

### For Patients (No Change):
1. Patient signs up
2. Account created with `approval_status = 'approved'`
3. Token returned immediately
4. User can login and access dashboard

### For Doctors/Pharmacists (New Flow):
1. Doctor/Pharmacist signs up with specialization
2. Account created with `approval_status = 'pending'`
3. NO token returned
4. User sees: "Account created! Waiting for admin approval..."
5. Form closes, user redirected to login
6. Login attempt shows: "Your account is pending admin approval"

### For Admin:
1. Admin navigates to "Pending Approvals" section
2. Views all pending doctor/pharmacist requests
3. Can **Accept** or **Reject** each request
4. Once approved:
   - User can login successfully
   - Status changes to `approved`
5. Once rejected:
   - User cannot login
   - Status changes to `rejected`

---

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create new account (modified)
- POST `/api/auth/login` - Login (modified to check approval_status)

### Admin (requires auth + admin role)
- GET `/api/admin/pending-requests` - Get pending approvals
- POST `/api/admin/approve-request` - Approve request
- POST `/api/admin/reject-request` - Reject request
- GET `/api/admin/users` - View all users

---

## Testing Checklist

- [ ] Doctor/Pharmacist signup shows pending message
- [ ] Patient signup works immediately
- [ ] Admin can see pending approvals in dashboard
- [ ] Admin can approve a pending request
- [ ] Admin can reject a pending request
- [ ] Approved users can login
- [ ] Pending users cannot login (get pending message)
- [ ] Rejected users cannot login (get rejected message)
- [ ] Specialization field appears only for doctors
- [ ] All fields required for signup validation

---

## Files Modified/Created

**Backend**:
- ✅ `migrate.js` - Database migration script
- ✅ `controllers/authController.js` - Modified signup & login
- ✅ `controllers/adminController.js` - NEW admin approval functions
- ✅ `routes/adminRoutes.js` - NEW admin routes
- ✅ `server.js` - Registered admin routes

**Frontend**:
- ✅ `src/App.jsx` - Modified signup handler for pending status
- ✅ `src/modules/admin/AdminModule.jsx` - Added pending approvals UI

**Database**:
- ✅ `users.approval_status` - NEW column with default 'approved'

---
