const dotenv = require('dotenv');

dotenv.config();

const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
