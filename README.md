# Unified Inbox - Messaging Integration

This project implements a unified inbox system that integrates multiple messaging channels into a single interface. It allows you to receive and send messages through WhatsApp, Facebook Messenger, Instagram, Email (Outlook), and SMS (Twilio).

## Architecture

The system is built with a microservices-inspired architecture:

1. **Frontend**: React application with WebSocket for real-time updates
2. **Backend**: Node.js with Express
3. **Message Bus**: RabbitMQ for asynchronous message processing
4. **Database**: PostgreSQL for storing messages and threads
5. **Channel Adapters**: Separate modules for each messaging channel

### Key Components

- **Adapters**: Handle incoming webhooks and outgoing messages for each channel
- **Core Service**: Processes messages and maintains the unified message format
- **API Gateway**: Provides REST and WebSocket interfaces for the frontend
- **Database Models**: Define the unified message schema

## Setup Instructions

### Prerequisites

- Node.js 16+
- PostgreSQL 14+
- RabbitMQ 3+
- Docker and Docker Compose (optional)

### Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### Running with Docker

The easiest way to run the entire stack is with Docker Compose:

```bash
docker-compose up -d
```

This will start the backend, frontend, PostgreSQL, and RabbitMQ services.

### Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## API Usage

### REST API

- `GET /threads` - Get all message threads
- `GET /threads/:id/messages` - Get messages for a specific thread
- `POST /send` - Send a message
- `PUT /threads/:id/read` - Mark a thread as read
- `PUT /threads/:id/archive` - Archive a thread

### WebSocket Events

- `new_message` - Emitted when a new message is received
- `threads_updated` - Emitted when threads are updated

## Channel Integration

### WhatsApp

Uses the WhatsApp Business API through Meta's Graph API. Requires:
- WhatsApp Business Account
- Phone Number ID
- Access Token

### Facebook & Instagram

Uses the Facebook Messenger API and Instagram Messaging API. Requires:
- Facebook Page
- Page Access Token
- App Secret

### Email (Outlook)

Uses Microsoft Graph API for sending and receiving emails. Requires:
- Microsoft Azure App Registration
- Client ID and Secret
- Tenant ID

### SMS (Twilio)

Uses Twilio API for sending and receiving SMS messages. Requires:
- Twilio Account SID
- Auth Token
- Twilio Phone Number

## Development

### Project Structure

```
├── backend/
│   ├── adapters/           # Channel-specific adapters
│   ├── api/                # REST API routes
│   ├── config/             # Configuration
│   ├── core/               # Core message processing
│   ├── models/             # Database models
│   └── index.js            # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/        # React context providers
│       ├── services/       # API services
│       └── pages/          # Page components
├── docker-compose.yml      # Docker Compose configuration
├── .env.example            # Example environment variables
└── README.md               # Documentation
```

### Adding a New Channel

To add a new messaging channel:

1. Create a new adapter in `backend/adapters/`
2. Add the channel to the enum in the database models
3. Create a new queue in RabbitMQ for the channel
4. Update the frontend to support the new channel

## Security Considerations

- All API routes are protected with JWT authentication
- Webhook endpoints validate signatures from the respective services
- CORS is configured to allow only specific origins
- Sensitive data is stored in environment variables

## License

This project is licensed under the MIT License.