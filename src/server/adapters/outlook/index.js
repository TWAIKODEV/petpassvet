/**
 * Microsoft Outlook (Graph API) Adapter
 * 
 * This adapter handles incoming emails from Microsoft Graph API
 * and sends outgoing emails through the Microsoft Graph API.
 */

const express = require('express');
const router = express.Router();
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { ClientSecretCredential } = require('@azure/identity');
const amqp = require('amqplib');
const config = require('../../config');

// RabbitMQ connection
let channel;

// Microsoft Graph client
let graphClient;

// Initialize RabbitMQ connection
async function initializeRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();
    
    // Ensure queues exist
    await channel.assertQueue('message.in', { durable: true });
    await channel.assertQueue('message.out.outlook', { durable: true });
    
    // Consume outgoing messages
    channel.consume('message.out.outlook', async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          await sendEmail(message);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing outgoing email:', error);
          // Nack the message to requeue it
          channel.nack(msg);
        }
      }
    });
    
    console.log('Outlook adapter connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // Retry connection after delay
    setTimeout(initializeRabbitMQ, 5000);
  }
}

// Initialize Microsoft Graph client
function initializeGraphClient() {
  try {
    const credential = new ClientSecretCredential(
      config.microsoft.tenantId,
      config.microsoft.clientId,
      config.microsoft.clientSecret
    );
    
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default']
    });
    
    graphClient = Client.initWithMiddleware({
      authProvider
    });
    
    console.log('Microsoft Graph client initialized');
  } catch (error) {
    console.error('Failed to initialize Microsoft Graph client:', error);
    // Retry initialization after delay
    setTimeout(initializeGraphClient, 5000);
  }
}

// Send an email through Microsoft Graph API
async function sendEmail(message) {
  try {
    const email = {
      message: {
        subject: message.content.subject || 'Re: Consulta',
        body: {
          contentType: 'Text',
          content: message.content.text
        },
        toRecipients: message.to.map(recipient => ({
          emailAddress: {
            address: recipient
          }
        }))
      },
      saveToSentItems: true
    };
    
    await graphClient.api('/me/sendMail').post(email);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Subscribe to new emails
async function subscribeToEmails() {
  try {
    // Check if subscription already exists
    const subscriptions = await graphClient.api('/subscriptions').get();
    
    const existingSubscription = subscriptions.value.find(
      sub => sub.resource === '/me/messages' && sub.changeType === 'created'
    );
    
    if (existingSubscription) {
      console.log('Email subscription already exists');
      return;
    }
    
    // Create new subscription
    const subscription = {
      changeType: 'created',
      notificationUrl: `${config.baseUrl}/webhook/outlook`,
      resource: '/me/messages',
      expirationDateTime: new Date(Date.now() + 4230 * 60000).toISOString(), // Max 4230 minutes (3 days)
      clientState: config.microsoft.clientState
    };
    
    const result = await graphClient.api('/subscriptions').post(subscription);
    console.log('Email subscription created:', result.id);
  } catch (error) {
    console.error('Error subscribing to emails:', error);
    // Retry subscription after delay
    setTimeout(subscribeToEmails, 5000);
  }
}

// Process incoming email
async function processEmail(messageId) {
  try {
    // Get the email details
    const message = await graphClient.api(`/me/messages/${messageId}`).get();
    
    // Create unified message format
    const unifiedMessage = {
      channel: 'outlook',
      externalId: message.id,
      threadId: message.conversationId, // Use conversation ID as thread ID
      from: message.from.emailAddress.address,
      to: message.toRecipients.map(recipient => recipient.emailAddress.address),
      timestamp: new Date(message.receivedDateTime),
      type: 'email',
      content: {
        subject: message.subject,
        text: message.body.content
      },
      raw: message
    };
    
    // Publish to RabbitMQ
    channel.sendToQueue(
      'message.in',
      Buffer.from(JSON.stringify(unifiedMessage)),
      { persistent: true }
    );
    
    console.log('Email processed:', messageId);
  } catch (error) {
    console.error('Error processing email:', error);
  }
}

// Webhook endpoint for Outlook
router.post('/webhook', async (req, res) => {
  // Verify client state
  if (req.body.clientState !== config.microsoft.clientState) {
    console.error('Invalid client state in Outlook webhook');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    const { value } = req.body;
    
    // Process each notification
    for (const notification of value) {
      if (notification.changeType === 'created' && notification.resource.startsWith('/me/messages')) {
        // Extract message ID from resource
        const messageId = notification.resource.split('/').pop();
        
        // Process the email
        await processEmail(messageId);
      }
    }
    
    res.status(202).send('Accepted');
  } catch (error) {
    console.error('Error processing Outlook webhook:', error);
    res.sendStatus(500);
  }
});

// Webhook validation for Outlook
router.get('/webhook', (req, res) => {
  // Microsoft Graph API sends a validation token
  const validationToken = req.query.validationToken;
  
  if (validationToken) {
    console.log('Outlook webhook validated');
    res.status(200).send(validationToken);
  } else {
    console.error('Outlook webhook validation failed');
    res.sendStatus(400);
  }
});

// Initialize connections
initializeRabbitMQ();
initializeGraphClient();
// Subscribe to emails after a delay to ensure client is initialized
setTimeout(subscribeToEmails, 5000);

module.exports = router;