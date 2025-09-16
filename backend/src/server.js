import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import {
  RateLimiter,
  botDetector,
} from './middleware/rateLimiter.middleware.js';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: ENV.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
};

dotenv.config();
const app = express();
app.use(cors(corsOptions));

const PORT = ENV.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// --- Bot Detector ---
app.use(botDetector);

// --- Global Rate Limiter ---
const globalLimiter = new RateLimiter({
  limit: 200,
  windowMs: 15 * 60 * 1000,
}).getMiddleware();
app.use(globalLimiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Production: Serve frontend
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

//test its bot or human
app.get('/test-bot', botDetector, (req, res) => {
  if (!req.isBot) {
    return res
      .status(200)
      .json({ message: 'This is the test route for humans' });
  } else {
    return res.status(403).json({ error: 'Bots are not allowed' });
  }
});

// Catch-all route for SPA
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server & connect DB
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
  connectDB();
});
