/**
 * WhatsApp Business API Adapter
 * 
 * This adapter handles incoming webhooks from WhatsApp Business API
 * and sends outgoing messages through the WhatsApp Business API.
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
    await channel.assertQueue('message.out.whatsapp', { durable: true });
    
    // Consume outgoing messages
    channel.consume('message.out.whatsapp', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendWhatsAppMessage(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing outgoing WhatsApp message:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('WhatsApp adapter connected to RabbitMQ');
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
    .createHmac('sha256', config.whatsapp.appSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  return signatureHash === expectedHash;
}

// Send a message through the WhatsApp Business API
async function sendWhatsAppMessage(message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v15.0/${config.whatsapp.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: message.to[0],
        type: 'text',
        text: {
          body: message.content.text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.whatsapp.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('WhatsApp message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

// Webhook endpoint for WhatsApp
router.post('/webhook', async (req, res) => {
  // Verify webhook signature
  if (!verifySignature(req)) {
    console.error('Invalid WhatsApp webhook signature');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    const { object, entry } = req.body;
    
    // Verify this is a WhatsApp Business API event
    if (object !== 'whatsapp_business_account') {
      return res.sendStatus(400);
    }
    
    // Process each entry
    for (const entryItem of entry) {
      const { changes } = entryItem;
      
      for (const change of changes) {
        if (change.field === 'messages') {
          const { value } = change;
          
          // Process each message
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              // Only process text messages for now
              if (msg.type === 'text') {
                const unifiedMessage = {
                  channel: 'whatsapp',
                  externalId: msg.id,
                  threadId: value.contacts[0].wa_id, // Use the WhatsApp ID as thread ID
                  from: value.contacts[0].wa_id,
                  to: [config.whatsapp.phoneNumberId],
                  timestamp: new Date(parseInt(msg.timestamp) * 1000),
                  type: 'text',
                  content: {
                    text: msg.text.body
                  },
                  raw: msg
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
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    res.sendStatus(500);
  }
});

// Webhook verification for WhatsApp
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    console.error('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

// Initialize RabbitMQ connection
initializeRabbitMQ();

module.exports = router;