/**
 * Database Models
 * 
 * Sequelize models for the application.
 */

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

// Initialize Sequelize
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'postgres',
    logging: config.database.logging
  }
);

// Define models
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  externalId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  threadId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  direction: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM('whatsapp', 'facebook', 'instagram', 'outlook', 'sms', 'typebot'),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'unread', 'failed'),
    allowNull: false
  },
  raw: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

const Thread = sequelize.define('Thread', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  contactId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM('whatsapp', 'facebook', 'instagram', 'outlook', 'sms', 'typebot'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active'
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastMessageContent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastMessageDirection: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    allowNull: true
  },
  unreadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  handle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  channel: {
    type: DataTypes.ENUM('whatsapp', 'facebook', 'instagram', 'outlook', 'sms', 'typebot'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isRegistered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

// Define associations
Thread.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasMany(Thread, { foreignKey: 'contactId' });

Message.belongsTo(Thread, { foreignKey: 'threadId' });
Thread.hasMany(Message, { foreignKey: 'threadId' });

Message.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasMany(Message, { foreignKey: 'contactId' });

// Sync models with database
async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

module.exports = {
  sequelize,
  Message,
  Thread,
  Contact,
  syncDatabase
};