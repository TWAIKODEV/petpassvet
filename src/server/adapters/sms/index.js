/**
 * SMS Adapter using Twilio
 * 
 * This adapter handles incoming webhooks from Twilio for SMS
 * and sends outgoing SMS messages through the Twilio API.
 */

const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const amqp = require('amqplib');
const config = require('../../config');

// RabbitMQ connection
let channel;

// Initialize Twilio client
const twilioClient = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
);

// Initialize RabbitMQ connection
async function initializeRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    
    // Ensure queues exist
    await channel.assertQueue('message.in', { durable: true });
    await channel.assertQueue('message.out.sms', { durable: true });
    
    // Consume outgoing messages
    channel.consume('message.out.sms', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendSmsMessage(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing outgoing SMS message:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('SMS adapter connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // Retry connection after delay
    setTimeout(initializeRabbitMQ, 5000);
  }
}

// Verify Twilio webhook signature
function verifyTwilioSignature(req) {
  const signature = req.headers['x-twilio-signature'];
  const url = `${config.baseUrl}/webhook/sms`;
  
  return twilio.validateRequest(
    config.twilio.authToken,
    signature,
    url,
    req.body
  );
}

// Send an SMS message through Twilio
async function sendSmsMessage(message) {
  try {
    const response = await twilioClient.messages.create({
      body: message.content.text,
      from: config.twilio.phoneNumber,
      to: message.to[0]
    });
    
    console.log('SMS message sent:', response.sid);
    return response;
  } catch (error) {
    console.error('Error sending SMS message:', error);
    throw error;
  }
}

// Webhook endpoint for SMS
router.post('/webhook', async (req, res) => {
  // Verify webhook signature in production
  if (process.env.NODE_ENV === 'production' && !verifyTwilioSignature(req)) {
    console.error('Invalid Twilio webhook signature');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    const { Body, From, To, MessageSid, DateCreated } = req.body;
    
    // Create unified message format
    const unifiedMessage = {
      channel: 'sms',
      externalId: MessageSid,
      threadId: From, // Use the sender's phone number as thread ID
      from: From,
      to: [To],
      timestamp: new Date(DateCreated || Date.now()),
      type: 'text',
      content: {
        text: Body
      },
      raw: req.body
    };
    
    // Publish to RabbitMQ
    channel.sendToQueue(
      'message.in',
      Buffer.from(JSON.stringify(unifiedMessage)),
      { persistent: true }
    );
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    res.sendStatus(500);
  }
});

// Initialize RabbitMQ connection
initializeRabbitMQ();

module.exports = router;