import express from 'express';
import {
  signup,
  login,
  logout,
  updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createRateLimiter } from '../lib/limiter.js';

const router = express.Router();

//apply bot + rate limiting middleware to all auth routes
createRateLimiter(router, {
  limit: 50,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

// routes/auth.routes.js
router.get('/check', protectRoute, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
