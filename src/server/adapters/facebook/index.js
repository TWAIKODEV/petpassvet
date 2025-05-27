/**
 * Facebook Messenger API Adapter
 * 
 * This adapter handles incoming webhooks from Facebook Messenger API
 * and sends outgoing messages through the Facebook Messenger API.
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
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
    await channel.assertQueue('message.out.facebook', { durable: true });
    
    // Consume outgoing messages
    channel.consume('message.out.facebook', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendFacebookMessage(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing outgoing Facebook message:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('Facebook adapter connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // Retry connection after delay
    setTimeout(initializeRabbitMQ, 5000);
  }
}

// Verify webhook signature from Meta
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }
  
  const elements = signature.split('=');
  const signatureHash = elements[1];
  
  const expectedHash = crypto
    .createHmac('sha256', config.facebook.appSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  return signatureHash === expectedHash;
}

// Send a message through the Facebook Messenger API
async function sendFacebookMessage(message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v15.0/me/messages`,
      {
        recipient: {
          id: message.to[0]
        },
        message: {
          text: message.content.text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.facebook.pageAccessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Facebook message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending Facebook message:', error.response?.data || error.message);
    throw error;
  }
}

// Webhook endpoint for Facebook
router.post('/webhook', async (req, res) => {
  // Verify webhook signature
  if (!verifySignature(req)) {
    console.error('Invalid Facebook webhook signature');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    const { object, entry } = req.body;
    
    // Verify this is a page subscription
    if (object !== 'page') {
      return res.sendStatus(400);
    }
    
    // Process each entry
    for (const entryItem of entry) {
      const { messaging } = entryItem;
      
      if (messaging) {
        for (const event of messaging) {
          // Only process messages with text
          if (event.message && event.message.text) {
            const unifiedMessage = {
              channel: 'facebook',
              externalId: event.message.mid,
              threadId: event.sender.id, // Use the sender's ID as thread ID
              from: event.sender.id,
              to: [event.recipient.id],
              timestamp: new Date(event.timestamp),
              type: 'text',
              content: {
                text: event.message.text
              },
              raw: event
            };
            
            // Publish to RabbitMQ
            channel.sendToQueue(
              'message.in',
              Buffer.from(JSON.stringify(unifiedMessage)),
              { persistent: true }
            );
          }
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing Facebook webhook:', error);
    res.sendStatus(500);
  }
});

// Webhook verification for Facebook
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === config.facebook.verifyToken) {
    console.log('Facebook webhook verified');
    res.status(200).send(challenge);
  } else {
    console.error('Facebook webhook verification failed');
    res.sendStatus(403);
  }
});

// Initialize RabbitMQ connection
initializeRabbitMQ();

module.exports = router;