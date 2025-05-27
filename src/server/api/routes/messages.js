/**
 * Message Routes
 * 
 * API endpoints for sending and managing messages.
 */

const express = require('express');
const router = express.Router();
const messageService = require('../../core/messageService');
const { authenticateJWT } = require('../middleware/auth');

// Send a message
router.post('/send', authenticateJWT, async (req, res) => {
  try {
    const { threadId, channel, content } = req.body;
    
    if (!threadId || !channel || !content || !content.text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const message = await messageService.sendMessage(
      req.user.id,
      threadId,
      channel,
      content
    );
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;