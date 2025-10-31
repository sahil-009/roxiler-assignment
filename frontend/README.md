# Roxiler Frontend (Vite + React)

This folder contains a Vite + React frontend scaffold for the Roxiler ratings platform.

## Overview
- React + Vite app with routes for Login, Signup, Stores, Admin dashboard and Owner dashboard.
- Uses `axios` in `src/services/api.js` to communicate with the backend. The default base is `/api`.
- Basic auth context in `src/context/AuthContext.jsx` storing token & user in `localStorage`.
- Validation utilities in `src/utils/validators.js` implement the rules you specified.

## Run locally
1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

Vite will start and open at `http://localhost:5173` by default.

## Environment
You can set the backend base URL via Vite env: create a `.env` file in `frontend/` with:

```
VITE_API_BASE=http://localhost:3000/api
```

If not set, the app will call relative `/api/*` endpoints, which is convenient if you proxy from your server.

## Expected backend endpoints
The frontend assumes the following endpoints (adjust backend to match or update `src/services/api.js`):

- POST `/api/auth/signup` -> register user. Payload: { name, email, address, password }
- POST `/api/auth/login` -> login. Payload: { email, password }. Response: { token, user }
- POST `/api/auth/update-password` -> update password after auth. Payload: { oldPassword, newPassword }

- GET `/api/stores` -> list stores. Each store: { id, name, address, averageRating, userRating }
- POST `/api/stores/:storeId/rating` -> user submits or modifies rating. Payload: { rating }

- Admin endpoints (example):
  - GET `/api/admin/dashboard` -> { totalUsers, totalStores, totalRatings }
  - GET `/api/admin/users` -> array of users
  - GET `/api/admin/stores` -> array of stores

- Owner endpoints (example):
  - GET `/api/owner/store` -> { store, raters }

Adjust the endpoints as needed to match your backend.

## Notes & next steps
- This is a frontend scaffold implementing form validations and UI flows per requirements. It expects the Express backend to provide the described API contracts and JWT token auth.
- Recommended next steps: wire the backend endpoints to match expected routes, implement server-side validation for the same rules, and add sorting support for tables (server or client-side) as needed.

