# FitConnect — Demo Credentials & Pitch Guide

This document contains credentials and live walkthrough instructions for the gym-owner pitch demonstration.

---

## 1. Demo User Accounts

| Persona / Name | Email | Password | Role | State & Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Gym Owner**<br>(Demo Gym Owner) | `demo@gym.com` | `password123` | `gymOwner` | Owner of **Iron Paradise Gym**.<br>• Branded with logo & theme color (`#4F46E5`).<br>• Can view member list, approve pending requests, edit workouts/diet. |
| **Active Member**<br>(Rahul Sharma) | `rahul@demo.com` | `password123` | `member` | Active enrolled member at Iron Paradise Gym.<br>• Active 1-month plan (`Monthly Standard`).<br>• Logged biometric measurements.<br>• Full Monday–Saturday workout routine (catalog verified).<br>• Daily diet plan with macro targets. |
| **Candidate 1**<br>(Alex Turner) | `dummy1@demo.com` | `password123` | `member` | **Pending Join Request** to Iron Paradise Gym.<br>• Used to demo **Quick Approve** live. |
| **Candidate 2**<br>(Sarah Connor) | `dummy2@demo.com` | `password123` | `member` | **Pending Join Request** to Iron Paradise Gym.<br>• Secondary applicant for live approval. |
| **Candidate 3**<br>(David Miller) | `dummy3@demo.com` | `password123` | `member` | **Pending Join Request** to Iron Paradise Gym.<br>• Tertiary applicant for live approval. |

---

## 2. Seed Script Management

### Re-run Seed (Idempotent Upsert)
To refresh data without deleting existing documents:
```bash
npm run seed:demo
```

### Full Clean & Reset
To purge and cleanly recreate only the demo-tagged records:
```bash
npm run seed:demo -- --reset
```

> [!NOTE]
> The seed script automatically detects the database host and refuses execution against production unless `--force-prod` is explicitly supplied.

---

## 3. Demo Walkthrough Steps

### Step 1: Login as Gym Owner
- **Endpoint**: `POST /auth/login`
- **Body**: `{ "email": "demo@gym.com", "password": "password123" }`
- **Result**: Returns JWT token, user profile, and branded gym details (`themeColor: "#4F46E5"`, `gymLogo: "https://..."`).

### Step 2: Review Pending Requests
- **Endpoint**: `GET /join/requests` (with Bearer token)
- **Result**: Lists candidates Alex Turner, Sarah Connor, and David Miller in `"pending"` status.

### Step 3: Quick Approve a Member
- **Endpoint**: `POST /join/quick-approve` (with Bearer token)
- **Body**: `{ "joinRequestId": "<Alex Turner's request ID>" }`
- **Result**:
  - Atomically marks Join status as `"approved"`.
  - Instantly creates an active `Member` document with the gym's first membership plan (`Monthly Standard`, 1-month clamped validity).
  - Assigns `gymId` to candidate user.
  - Returns `{ join, member }`.

### Step 4: Inspect Existing Member Details (Rahul Sharma)
- **Endpoint**: `GET /members/gym-members?gymId=<Iron Paradise Gym ID>`
- **Result**: Displays Rahul's enrolled membership, biometrics, Monday–Saturday workouts, and meal plans.
