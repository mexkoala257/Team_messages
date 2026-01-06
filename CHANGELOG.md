# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-06

### Added
- Initial release of Team Portal
- Message sharing with timestamps
- Quick status updates (Available, Busy, Away)
- Photo gallery with upload and display
- PDF document management
- Password protection for main portal
- SQLite database for persistent storage
- REST API for all operations
- Dakboard widget integration (messages, updates, all)
- Dark theme UI
- Real-time data synchronization across devices
- Automated VPS deployment script
- System service configuration for auto-start
- Health check endpoint
- Responsive design for mobile and desktop

### Features
- **Backend**: Node.js + Express + SQLite3
- **Frontend**: Vanilla JavaScript with dark theme
- **Security**: Password authentication, session management
- **Deployment**: Automated setup script for Debian/Ubuntu
- **Integration**: Dakboard widgets with 30-second refresh

### Documentation
- Comprehensive README
- Deployment guide (DATABASE-DEPLOYMENT.md)
- Multi-port setup guide (MULTIPORT-DEPLOYMENT.md)
- Contributing guidelines
- MIT License

## [Unreleased]

### Planned
- User accounts with individual authentication
- Email notifications for new messages
- Search functionality across messages and documents
- File upload size limits and validation
- Admin dashboard for management
- Export data functionality
- Multi-language support
- Mobile application
- Enhanced security features
- Performance optimizations

---

## Version History

### Version 1.0.0 (2026-01-06)
- First stable release
- Complete feature set for team collaboration
- Production-ready deployment scripts
- Comprehensive documentation

---

## Notes

- Database schema is stable and backward compatible
- API endpoints follow RESTful conventions
- All dates in ISO 8601 format
- Base64 encoding for photos and PDFs

For upgrade instructions, see [DATABASE-DEPLOYMENT.md](DATABASE-DEPLOYMENT.md)
