# Aggregate Messengers 

## Project Overview
Aggregate Messengers is a modern web application that integrates multiple messaging platforms, providing a unified communication experience with advanced features like AI-powered text variations and cross-platform messaging.

## System Architecture

### Core Components
- **Frontend**: React-based user interface
- **Backend Services**:
  - Spring Boot application for core messaging logic
  - Spring Boot application for AI text variations
  - Node.js service for Telegram conversation and authorization
- **Database**: PostgreSQL
- **External Services**: 
  - AWS S3 for file storage
  - WebSocket for real-time communication

## Key Features

### Authentication
- JWT-based authentication for standard users
- Google OAuth2 integration
- Telegram authentication with optional 2FA

### Messaging Capabilities
- Real-time messaging across platforms
- Cross-platform conversation management
- File upload with AWS S3 integration
- Contact search and selection

### AI Text Variation
- Magic icon for generating text variations using promt engineering
- Multiple tone options:
  - Professional
  - Casual
  - Friendly
  - Formal

## Technical Stack

### Frontend
- React
- WebSocket for real-time updates

### Backend
- Spring Boot
- Node.js
- WebSocket (SockJS)
- JWT Authentication

### AI Integration
- Microsoft Phi-3-mini-4k-instruct model
- Hugging Face Langchain
- Spring AI support

### Database
- PostgreSQL
- Supports:
  - User management
  - Conversation storage
  - Message tracking
  - Telegram conversation state management

## Testing Results

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | Complete | JWT & OAuth implementation successful |
| Real-time Messaging | Complete | WebSocket integration stable |
| File Upload | Complete | AWS S3 integration working |
| Contact Management | Complete | Search and selection functional |
| Telegram Integration | Complete | Real-time cross-application messaging |
| AI Integration | Complete | Basic responses generated |

## Getting Started

### Prerequisites
- Node.js
- Java 11+
- PostgreSQL
- AWS S3 Account

### Installation
1. Clone the repository
2. Set up backend services
3. Configure database connections
4. Set up environment variables
5. Install frontend dependencies
6. Run the application

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
