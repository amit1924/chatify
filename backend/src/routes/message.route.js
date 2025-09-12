import express from 'express';

const router = express.Router();

router.get('/send', (req, res) => {
  // Send a message to the user
  res.json({ message: 'Message sent successfully' });
});

export default router;
