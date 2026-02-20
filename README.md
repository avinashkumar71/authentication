# MERN Auth Backend Starter

This project contains a starter backend structure for the authentication module of a MERN stack application.

## Features
- Express server setup
- MongoDB connection with Mongoose
- Auth routes for register/login/profile
- JWT-based route protection
- Access + refresh token cookies (HttpOnly) with rotation support
- Request validation with `express-validator`
- Centralized error handling

## Project structure

```bash
src/
  app.js
  server.js
  config/
    db.js
    env.js
  controllers/
    authController.js
  middlewares/
    authMiddleware.js
    csrfMiddleware.js
    errorMiddleware.js
    validateRequest.js
  models/
    User.js
  routes/
    authRoutes.js
  utils/
    authCookies.js
    generateToken.js
  validators/
    authValidators.js
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment values:
   ```bash
   cp .env.example .env
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## API endpoints
- `GET /api/auth/csrf-token`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token` (requires `x-csrf-token`)
- `POST /api/auth/logout` (requires `x-csrf-token`)
- `GET /api/auth/me` (uses access-token cookie, Bearer fallback supported)
- `GET /api/health`

## Token architecture notes
- Login/register set both access + refresh tokens in `HttpOnly` cookies (`Secure` in production, configurable `SameSite`).
- Refresh token is stored as a SHA-256 hash in DB and rotated on refresh (cookie-first with body fallback).
- CSRF protection uses a double-submit token (`csrfToken` cookie + `x-csrf-token` header) for state-changing cookie-auth endpoints.
- Access token verification enforces issuer, audience, algorithm, and `tokenType=access`.
- If a reused/unknown refresh token is detected, all stored refresh tokens for that user are revoked.
