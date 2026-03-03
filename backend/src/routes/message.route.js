import express from 'express';
import {
  getChatPartners,
  getAllContacts,
  getMessagesByUserId,
  sendMessage,
  editMessage,
  deleteMessage,
} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createRateLimiter } from '../lib/limiter.js';

const router = express.Router();

// Messages routes: higher limit for chat
createRateLimiter(router, {
  limit: 10000,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests, slow down a bit!',
});
router.use(protectRoute);

// Order matters! Static routes first
router.get('/contacts', getAllContacts);
router.get('/chats', getChatPartners);

// Dynamic routes after
router.get('/:id', getMessagesByUserId);
router.post('/send/:id', sendMessage);

router.put('/:id', editMessage);
router.delete('/:id', deleteMessage);

router.get('/send', (req, res) => {
  // Send a message to the user
  res.json({ message: 'Message sent successfully' });
});

export default router;
