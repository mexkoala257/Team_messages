# Team Portal

## Overview

Team Portal is a team collaboration platform that provides real-time messaging, photo sharing, status updates, and document management. It features Dakboard widget integration for digital signage displays. The application uses a Node.js/Express backend with SQLite for data persistence and a vanilla JavaScript frontend with a dark theme UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: SQLite3 for persistent storage - chosen for simplicity and zero-configuration deployment
- **Authentication**: Custom session-based authentication using crypto-generated tokens stored in memory (Map)
- **Security Features**: 
  - Server-side password authentication with Bearer token sessions (24-hour expiry)
  - Password stored via `PORTAL_PASSWORD` environment secret (required - server fails fast if not set)
  - Rate limiting on login (5 attempts max per IP, 15-minute lockout)
  - All API endpoints protected by authentication middleware
  - CORS enabled for cross-origin requests

### Frontend Architecture
- **Technology**: Vanilla JavaScript with no framework dependencies
- **Styling**: Custom CSS with CSS variables for theming
- **Fonts**: Google Fonts (Space Mono, Work Sans)
- **Design**: Dark theme with responsive layout

### API Structure
- RESTful API endpoints for all operations
- Endpoints for messages, status updates, photos, and documents
- Health check endpoint for monitoring
- Dakboard-specific widget endpoints with 30-second refresh capability

### File Upload Handling
- Base64 encoding for photos and PDFs (stored in SQLite)
- Supports photo uploads with captions
- PDF document management

### Deployment Model
- Designed for VPS deployment on Debian/Ubuntu
- Runs as a systemd service for auto-start on boot
- Configurable port via `PORT` environment variable (default: 5000)
- Includes automated setup scripts for deployment

## External Dependencies

### NPM Packages
- `express` (^4.21.0) - Web framework
- `sqlite3` (^5.1.7) - SQLite database driver
- `cors` (^2.8.5) - Cross-origin resource sharing
- `nodemon` (dev) - Development auto-restart

### Environment Variables
- `PORTAL_PASSWORD` - Required for authentication (must be set as secret)
- `PORT` - Server port (optional, defaults to 5000)

### External Services
- **Dakboard Integration** - Widget endpoints designed for embedding in Dakboard digital signage displays
- **Google Fonts CDN** - Font loading for the frontend

### Database
- SQLite3 file-based database stored locally
- No external database service required