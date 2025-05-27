/**
 * Core Message Service
 * 
 * This service handles the core messaging functionality:
 * - Consuming incoming messages from RabbitMQ
 * - Transforming messages to a unified format
 * - Storing messages in the database
 * - Publishing outgoing messages to RabbitMQ
 */

const amqp = require('amqplib');
const { Message, Thread, Contact } = require('../models');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const socketService = require('./socketService');

// RabbitMQ connection
let channel;

// Initialize RabbitMQ connection
async function initializeRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    
    // Ensure queues exist
    await channel.assertQueue('message.in', { durable: true });
    await channel.assertQueue('message.out', { durable: true });
    await channel.assertQueue('message.out.whatsapp', { durable: true });
    await channel.assertQueue('message.out.facebook', { durable: true });
    await channel.assertQueue('message.out.instagram', { durable: true });
    await channel.assertQueue('message.out.outlook', { durable: true });
    await channel.assertQueue('message.out.sms', { durable: true });
    
    // Consume incoming messages
    channel.consume('message.in', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await processIncomingMessage(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing incoming message:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('Core message service connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // Retry connection after delay
    setTimeout(initializeRabbitMQ, 5000);
  }
}

// Process incoming message
async function processIncomingMessage(message) {
  try {
    // Find or create contact
    let contact = await Contact.findOne({
      where: { 
        handle: message.from,
        channel: message.channel
      }
    });
    
    if (!contact) {
      contact = await Contact.create({
        id: uuidv4(),
        handle: message.from,
        channel: message.channel,
        name: message.from, // Default name is the handle
        isRegistered: false
      });
    }
    
    // Find or create thread
    let thread = await Thread.findOne({
      where: { id: message.threadId }
    });
    
    if (!thread) {
      thread = await Thread.create({
        id: message.threadId,
        channel: message.channel,
        contactId: contact.id
      });
    }
    
    // Create message
    const dbMessage = await Message.create({
      id: uuidv4(),
      externalId: message.externalId,
      threadId: thread.id,
      contactId: contact.id,
      direction: 'inbound',
      channel: message.channel,
      type: message.type,
      content: message.content,
      timestamp: message.timestamp,
      status: 'unread',
      raw: message.raw
    });
    
    // Update thread with last message
    await thread.update({
      lastMessageAt: message.timestamp,
      lastMessageContent: message.content.text,
      lastMessageDirection: 'inbound',
      unreadCount: thread.unreadCount + 1
    });
    
    // Emit socket event
    socketService.emitNewMessage(dbMessage);
    socketService.emitThreadsUpdated();
    
    console.log('Incoming message processed:', dbMessage.id);
  } catch (error) {
    console.error('Error processing incoming message:', error);
    throw error;
  }
}

// Send outgoing message
async function sendMessage(userId, threadId, channel, content) {
  try {
    // Find thread
    const thread = await Thread.findByPk(threadId, {
      include: [{ model: Contact }]
    });
    
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    // Create message in database
    const message = await Message.create({
      id: uuidv4(),
      threadId: thread.id,
      contactId: thread.contact.id,
      direction: 'outbound',
      channel: channel,
      type: 'text',
      content: content,
      timestamp: new Date(),
      status: 'sent',
      userId: userId
    });
    
    // Update thread with last message
    await thread.update({
      lastMessageAt: message.timestamp,
      lastMessageContent: content.text,
      lastMessageDirection: 'outbound'
    });
    
    // Prepare message for sending
    const outgoingMessage = {
      id: message.id,
      channel: channel,
      threadId: thread.id,
      from: 'me', // This will be replaced by the adapter
      to: [thread.contact.handle],
      timestamp: message.timestamp,
      type: 'text',
      content: content
    };
    
    // Publish to channel-specific queue
    channel.sendToQueue(
      `message.out.${channel}`,
      Buffer.from(JSON.stringify(outgoingMessage)),
      { persistent: true }
    );
    
    // Also publish to general outgoing queue
    channel.sendToQueue(
      'message.out',
      Buffer.from(JSON.stringify(outgoingMessage)),
      { persistent: true }
    );
    
    // Emit socket event
    socketService.emitNewMessage(message);
    socketService.emitThreadsUpdated();
    
    console.log('Outgoing message sent:', message.id);
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Mark thread as read
async function markThreadAsRead(threadId) {
  try {
    // Update thread
    const thread = await Thread.findByPk(threadId);
    
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    await thread.update({
      unreadCount: 0
    });
    
    // Update messages
    await Message.update(
      { status: 'read' },
      { 
        where: { 
          threadId: threadId,
          direction: 'inbound',
          status: 'unread'
        } 
      }
    );
    
    // Emit socket event
    socketService.emitThreadsUpdated();
    
    console.log('Thread marked as read:', threadId);
  } catch (error) {
    console.error('Error marking thread as read:', error);
    throw error;
  }
}

// Archive thread
async function archiveThread(threadId) {
  try {
    // Update thread
    const thread = await Thread.findByPk(threadId);
    
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }
    
    await thread.update({
      status: 'archived'
    });
    
    // Emit socket event
    socketService.emitThreadsUpdated();
    
    console.log('Thread archived:', threadId);
  } catch (error) {
    console.error('Error archiving thread:', error);
    throw error;
  }
}

// Initialize RabbitMQ connection
initializeRabbitMQ();

module.exports = {
  sendMessage,
  markThreadAsRead,
  archiveThread
};