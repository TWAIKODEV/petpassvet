/**
 * Typebot.io Adapter
 * 
 * This adapter handles incoming webhooks from Typebot.io
 * and sends outgoing messages through the Typebot.io API.
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const amqp = require('amqplib');
const config = require('../../config');

// RabbitMQ connection
let channel;

// Initialize RabbitMQ connection
async function initializeRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    
    // Ensure queues exist
    await channel.assertQueue('message.in', { durable: true });
    await channel.assertQueue('message.out.typebot', { durable: true });
    
    // Consume outgoing messages
    channel.consume('message.out.typebot', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendTypebotMessage(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing outgoing Typebot message:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('Typebot adapter connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // Retry connection after delay
    setTimeout(initializeRabbitMQ, 5000);
  }
}

// Verify webhook signature from Typebot
function verifyTypebotSignature(req) {
  const signature = req.headers['typebot-signature'];
  
  if (!signature || !config.typebot.webhookSecret) {
    return process.env.NODE_ENV !== 'production'; // Skip verification in development
  }
  
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', config.typebot.webhookSecret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  
  return signature === digest;
}

// Send a message to Typebot
async function sendTypebotMessage(message) {
  try {
    // Extract the session ID from the thread ID
    // Format: typebot-{typebotId}-{sessionId}
    const parts = message.threadId.split('-');
    const typebotId = parts[1];
    const sessionId = parts.slice(2).join('-');
    
    // Send message to Typebot API
    const response = await axios.post(
      `${config.typebot.apiUrl}/typebots/${typebotId}/sessions/${sessionId}/continueChat`,
      {
        message: message.content.text
      },
      {
        headers: {
          'Authorization': `Bearer ${config.typebot.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Process the response from Typebot
    if (response.data && response.data.messages) {
      // For each message in the response, create a new incoming message
      for (const botMessage of response.data.messages) {
        const unifiedMessage = {
          channel: 'typebot',
          externalId: `typebot-${Date.now()}`,
          threadId: message.threadId,
          from: {
            id: 'typebot',
            name: 'Asistente Virtual',
            handle: 'bot'
          },
          to: [message.from.id],
          timestamp: new Date(),
          type: 'bot',
          content: {
            text: botMessage.content,
            botActions: response.data.input ? [{
              type: botMessage.type,
              label: botMessage.content,
              options: botMessage.options
            }] : []
          }
        };
        
        // Publish to RabbitMQ
        channel.sendToQueue(
          'message.in',
          Buffer.from(JSON.stringify(unifiedMessage)),
          { persistent: true }
        );
      }
    }
    
    console.log('Typebot message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending Typebot message:', error.response?.data || error.message);
    throw error;
  }
}

// Webhook endpoint for Typebot
router.post('/webhook', async (req, res) => {
  // Verify webhook signature
  if (!verifyTypebotSignature(req)) {
    console.error('Invalid Typebot webhook signature');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    const { sessionId, typebotId, message, resultId } = req.body;
    
    if (!sessionId || !typebotId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create thread ID from typebot ID and session ID
    const threadId = `typebot-${typebotId}-${sessionId}`;
    
    // Create unified message format
    const unifiedMessage = {
      channel: 'typebot',
      externalId: resultId || `typebot-${Date.now()}`,
      threadId: threadId,
      from: {
        id: sessionId,
        name: 'Usuario',
        handle: sessionId
      },
      to: ['typebot'],
      timestamp: new Date(),
      type: 'text',
      content: {
        text: message
      },
      raw: req.body
    };
    
    // Publish to RabbitMQ
    channel.sendToQueue(
      'message.in',
      Buffer.from(JSON.stringify(unifiedMessage)),
      { persistent: true }
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing Typebot webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize RabbitMQ connection
initializeRabbitMQ();

module.exports = router;