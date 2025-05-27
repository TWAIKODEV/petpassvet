/**
 * Configuration
 * 
 * Central configuration for the application.
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'unifiedinbox',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    logging: process.env.DB_LOGGING === 'true'
  },
  
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost'
  },
  
  whatsapp: {
    phoneNumberId: process.env.WA_PHONE_NUMBER_ID,
    accessToken: process.env.WA_TOKEN,
    appSecret: process.env.WA_APP_SECRET,
    verifyToken: process.env.WA_VERIFY_TOKEN || 'whatsapp-verify-token'
  },
  
  facebook: {
    pageId: process.env.FB_PAGE_ID,
    pageAccessToken: process.env.FB_PAGE_TOKEN,
    appSecret: process.env.FB_APP_SECRET,
    verifyToken: process.env.FB_VERIFY_TOKEN || 'facebook-verify-token'
  },
  
  instagram: {
    pageId: process.env.IG_PAGE_ID,
    accessToken: process.env.IG_ACCESS_TOKEN,
    appSecret: process.env.IG_APP_SECRET,
    verifyToken: process.env.IG_VERIFY_TOKEN || 'instagram-verify-token'
  },
  
  microsoft: {
    tenantId: process.env.MS_TENANT_ID,
    clientId: process.env.MS_CLIENT_ID,
    clientSecret: process.env.MS_CLIENT_SECRET,
    clientState: process.env.MS_CLIENT_STATE || 'outlook-webhook-state'
  },
  
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  
  typebot: {
    apiUrl: process.env.TYPEBOT_API_URL || 'https://api.typebot.io/v1',
    apiToken: process.env.TYPEBOT_API_TOKEN,
    webhookSecret: process.env.TYPEBOT_WEBHOOK_SECRET
  }
};