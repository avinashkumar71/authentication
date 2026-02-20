# MERN Auth Backend Starter

This project contains a starter backend structure for the authentication module of a MERN stack application.

## Features
- Express server setup
- MongoDB connection with Mongoose
- Auth routes for register/login/profile
- JWT-based route protection
- Access + refresh token architecture with rotation support
- Secure token storage using HttpOnly cookies
- Request validation with `express-validator`
- Basic hardening: secure headers, CORS allowlist, auth rate limiting
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
    generateToken.js
    tokenCookies.js
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
- `GET /api/auth/me` (reads `accessToken` cookie; `Authorization: Bearer <access_token>` also supported)
- `GET /api/health`

## Token architecture notes
- Login/register issue an **access token + refresh token** pair and store them in HttpOnly cookies.
- Refresh token is stored as SHA-256 hash in DB and rotated on refresh.
- Access token verification enforces issuer, audience, algorithm, and `tokenType=access`.
- If a reused/unknown refresh token is detected, all stored refresh tokens for that user are revoked.

## Token storage notes
- Cookies are `HttpOnly` and use `SameSite=lax` in development, `SameSite=strict` in production.
- Cookies are marked `Secure` automatically in production (`NODE_ENV=production`).
- For cross-origin frontend calls, set `CORS_ORIGINS` and send credentials from client requests.
