# MERN Auth Backend Starter

This project contains a starter backend structure for the authentication module of a MERN stack application.

## Features
- Express server setup
- MongoDB connection with Mongoose
- Auth routes for register/login/profile
- JWT-based route protection
- Access + refresh token architecture with rotation support
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
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET /api/auth/me` (requires `Authorization: Bearer <access_token>`)
- `GET /api/health`

## Token architecture notes
- Login/register issue an access token in the response body and set refresh token in an `HttpOnly` cookie.
- Refresh token is stored as a SHA-256 hash in DB and rotated on refresh (cookie or body token accepted for compatibility).
- Access token verification enforces issuer, audience, algorithm, and `tokenType=access`.
- If a reused/unknown refresh token is detected, all stored refresh tokens for that user are revoked.
