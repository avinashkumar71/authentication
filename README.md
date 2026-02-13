# MERN Auth Backend Starter

This project contains a starter backend structure for the authentication module of a MERN stack application.

## Features
- Express server setup
- MongoDB connection with Mongoose
- Auth routes for register/login/profile
- JWT-based route protection
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
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)
- `GET /api/health`
