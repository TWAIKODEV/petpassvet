/**
 * Thread Routes
 * 
 * API endpoints for managing message threads.
 */

const express = require('express');
const router = express.Router();
const { Thread, Message, Contact } = require('../../models');
const messageService = require('../../core/messageService');
const { authenticateJWT } = require('../middleware/auth');

// Get all threads
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const threads = await Thread.findAll({
      where: { status: 'active' },
      include: [
        { model: Contact },
        { 
          model: Message,
          limit: 1,
          order: [['timestamp', 'DESC']]
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });
    
    // Transform to client format
    const formattedThreads = threads.map(thread => ({
      id: thread.id,
      channel: thread.channel,
      contact: {
        id: thread.contact.id,
        name: thread.contact.name,
        handle: thread.contact.handle,
        avatar: thread.contact.avatar,
        isRegistered: thread.contact.isRegistered
      },
      lastMessage: {
        content: thread.lastMessageContent,
        timestamp: thread.lastMessageAt,
        isOutbound: thread.lastMessageDirection === 'outbound'
      },
      unreadCount: thread.unreadCount
    }));
    
    res.json(formattedThreads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Get messages for a thread
router.get('/:id/messages', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const messages = await Message.findAll({
      where: { threadId: id },
      include: [{ model: Contact }],
      order: [['timestamp', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Transform to client format
    const formattedMessages = messages.map(message => ({
      id: message.id,
      channel: message.channel,
      threadId: message.threadId,
      externalId: message.externalId,
      from: {
        id: message.direction === 'outbound' ? 'me' : message.contact.id,
        name: message.direction === 'outbound' ? 'Me' : message.contact.name,
        handle: message.direction === 'outbound' ? '' : message.contact.handle,
        avatar: message.direction === 'outbound' ? null : message.contact.avatar
      },
      to: message.direction === 'outbound' ? [message.contact.handle] : ['me'],
      timestamp: message.timestamp,
      type: message.type,
      content: message.content,
      status: message.status
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark thread as read
router.put('/:id/read', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    await messageService.markThreadAsRead(id);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error marking thread as read:', error);
    res.status(500).json({ error: 'Failed to mark thread as read' });
  }
});

// Archive thread
router.put('/:id/archive', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    await messageService.archiveThread(id);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error archiving thread:', error);
    res.status(500).json({ error: 'Failed to archive thread' });
  }
});

module.exports = router;