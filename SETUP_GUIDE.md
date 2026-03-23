# Approval Workflow - Quick Setup Guide

## What's Been Implemented

### ✅ Feature: Doctor & Pharmacist Approval Workflow

When a **doctor** or **pharmacist** signs up:
1. Their account is created with status `"pending"`
2. They receive a message: **"Account created! Waiting for admin approval..."**
3. **They cannot login** until approved
4. Their request appears in the **Admin Dashboard** → **User Management** → **Pending Approvals**

**Admin** can then:
- **Accept**: Approve the account (user can now login)
- **Reject**: Reject the account (user cannot login)

---

## Step-by-Step Setup

### 1. Run Database Migration
```bash
cd backend
node migrate.js
```
✓ Adds `approval_status` column to `users` table

### 2. Start Backend (with new admin routes)
```bash
npm start
```
New endpoints:
- GET `/api/admin/pending-requests`
- POST `/api/admin/approve-request`
- POST `/api/admin/reject-request`

### 3. Start Frontend
```bash
npm run dev
```
New Admin section: **Pending Approvals** visible in sidebar

---

## How to Test

### Test 1: Doctor Signup (Pending)
1. Go to signup form
2. Fill in details, select **"Doctor"**
3. Enter specialization (e.g., "Cardiology")
4. Sign up
5. ✓ See message: "Account created! Waiting for admin approval..."
6. Try to login
7. ✓ See message: "Your account is pending admin approval"

### Test 2: Patient Signup (Auto-Approved)
1. Go to signup form
2. Select **"Patient"** role
3. Sign up
4. ✓ Immediately login and access dashboard (no approval needed)

### Test 3: Admin Approval
1. Login as admin
2. Go to **Admin Dashboard** → **User Management** → **Pending Approvals**
3. See pending doctor/pharmacist requests
4. Click **Accept** → Doctor status changes to "approved"
5. Doctor can now login
6. Click **Reject** → Pharmacist status changes to "rejected"
7. Pharmacist cannot login

---

## API Reference

### Get Pending Requests
```
GET /api/admin/pending-requests
Headers: Authorization: Bearer {token}
Response: { data: [...pending requests] }
```

### Approve Request
```
POST /api/admin/approve-request
Headers: Authorization: Bearer {token}
Body: { userId: 123 }
Response: { message: "Doctor account approved successfully" }
```

### Reject Request
```
POST /api/admin/reject-request
Headers: Authorization: Bearer {token}
Body: { userId: 123, reason: "Not qualified" }
Response: { message: "Pharmacist account rejected successfully" }
```

---

## User Flows

### Patient Flow (No Change):
Signup → ✓ Auto-approved → Login → Dashboard

### Doctor/Pharmacist Flow (New):
Signup → Pending → Admin Approval → Login → Dashboard

### Rejected Flow:
Cannot login → See "Account rejected" message

---

## Database Schema

### users table - New Column
```
approval_status VARCHAR(20) DEFAULT 'approved'
```

**Values**:
- `approved` - Account can login
- `pending` - Waiting for admin decision
- `rejected` - Account cannot login

---

## Files Changed

✅ **Backend**:
- `controllers/authController.js` - Signup & login updated
- `controllers/adminController.js` - NEW approval functions
- `routes/adminRoutes.js` - NEW admin routes
- `server.js` - Registered admin routes
- `migrate.js` - Database migration script

✅ **Frontend**:
- `src/App.jsx` - Signup handler updated
- `src/modules/admin/AdminModule.jsx` - Pending approvals UI added

✅ **Database**:
- `users.approval_status` - NEW column

---

## Important Notes

1. **Admin Role Required**: Only users with `role = "admin"` can access approval endpoints
2. **Token Required**: All admin endpoints require valid JWT token
3. **Default Status**: Existing accounts (before this feature) will have `approval_status = 'approved'`
4. **Immediate Approval**: Patient signups are always auto-approved (no admin needed)
5. **Specialization**: Only required for doctor signups, optional for pharmacists

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Error: "Column already exists" | Migration already ran, that's fine |
| Pending approvals page is blank | Admin needs to login first |
| Can't see pending requests | Make sure you're logged in as admin |
| Doctor can login without approval | Check if they had existing account (pre-feature) |

---
