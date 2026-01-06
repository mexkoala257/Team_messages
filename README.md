# Team Portal

A comprehensive team collaboration platform with real-time messaging, photo sharing, status updates, document management, and Dakboard widget integration. Built with Node.js, Express, SQLite, and vanilla JavaScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Platform](https://img.shields.io/badge/platform-linux-lightgrey.svg)

## ✨ Features

- 💬 **Message Sharing** - Team communication with timestamps
- ⚡ **Quick Updates** - Status updates with availability indicators (Available, Busy, Away)
- 📸 **Photo Gallery** - Upload and share team photos with captions
- 📄 **Document Management** - PDF upload, viewing, and download
- 📊 **Dakboard Widgets** - Embeddable displays for digital signage
- 🔐 **Password Protection** - Secure access control
- 💾 **SQLite Database** - Persistent data storage
- 🔄 **Real-time Sync** - All devices stay synchronized
- 🎨 **Dark Theme** - Modern, minimalist interface
- 🌐 **REST API** - Full API for external integrations

## 🖼️ Screenshots

### Main Dashboard
Clean, dark-themed interface with all features accessible from one view.

### Dakboard Widget
Real-time updates displayed on digital signage.

## 🚀 Quick Start

### Prerequisites

- Linux server (Debian/Ubuntu recommended)
- Node.js 18+ 
- npm or yarn
- SQLite3

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/team-portal.git
cd team-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Access the portal**
```
http://localhost:3000
```

Default password: `TeamPortal2024`

### Automated VPS Deployment

For production deployment on a VPS:

```bash
chmod +x setup-database.sh
sudo ./setup-database.sh
```

This will:
- Install Node.js and dependencies
- Set up the database
- Create a systemd service
- Configure firewall
- Start the application

See [DATABASE-DEPLOYMENT.md](DATABASE-DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
team-portal/
├── server.js                 # Backend API server
├── package.json              # Dependencies and scripts
├── public/
│   └── index.html           # Frontend application
├── setup-database.sh        # Automated deployment script
├── DATABASE-DEPLOYMENT.md   # Deployment guide
├── MULTIPORT-DEPLOYMENT.md  # Multi-port setup guide
├── README.md                # This file
└── .gitignore              # Git ignore rules
```

## 🔧 Configuration

### Change Password

Edit `public/index.html` and modify:
```javascript
const PASSWORD = "YourSecurePassword";
```

### Change Port

Set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

Or edit the systemd service file:
```bash
sudo nano /etc/systemd/system/team-portal.service
```

### Database Location

By default, the SQLite database is created at `./team-portal.db`. Data persists between server restarts.

## 📊 API Endpoints

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create a message
- `DELETE /api/messages/:id` - Delete a message

### Updates
- `GET /api/updates` - Get all status updates
- `POST /api/updates` - Create an update
- `DELETE /api/updates/:id` - Delete an update

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload a photo
- `DELETE /api/photos/:id` - Delete a photo

### Documents
- `GET /api/pdfs` - Get all PDFs
- `POST /api/pdfs` - Upload a PDF
- `DELETE /api/pdfs/:id` - Delete a PDF

### Health Check
- `GET /api/health` - Server health status

## 🎨 Dakboard Integration

Access widgets by appending query parameters:

```
http://your-server:3000/?widget=messages
http://your-server:3000/?widget=updates
http://your-server:3000/?widget=all
```

Widgets automatically refresh every 30 seconds and bypass authentication.

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic reloading on file changes.

### Database Management

**View database contents:**
```bash
sqlite3 team-portal.db
.tables
SELECT * FROM messages;
.quit
```

**Backup database:**
```bash
cp team-portal.db backup-$(date +%Y%m%d).db
```

**Reset database:**
```bash
rm team-portal.db
npm start  # Database recreated automatically
```

## 🔒 Security

- Password-protected main interface
- Session-based authentication
- Input sanitization
- CORS enabled for API access
- No external authentication required for widgets (by design for Dakboard)

### Security Recommendations

1. Change the default password immediately
2. Use HTTPS in production (see Nginx setup below)
3. Keep Node.js and dependencies updated
4. Regular database backups
5. Restrict access using firewall rules if needed

## 🌐 Production Deployment

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📝 Common Tasks

### Check Service Status
```bash
sudo systemctl status team-portal
```

### View Logs
```bash
sudo journalctl -u team-portal -f
```

### Restart Service
```bash
sudo systemctl restart team-portal
```

### Update Application
```bash
git pull origin main
npm install
sudo systemctl restart team-portal
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
sudo lsof -i :3000
# Kill the process or choose a different port
```

### Database Locked
```bash
sudo systemctl restart team-portal
```

### Cannot Connect Externally
- Check firewall: `sudo ufw status`
- Check VPS provider's security groups/firewall
- Verify port is open: `sudo netstat -tlnp | grep 3000`

See [DATABASE-DEPLOYMENT.md](DATABASE-DEPLOYMENT.md) for comprehensive troubleshooting.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Use Cases

- **Remote Teams** - Keep distributed teams connected
- **Office Communication** - Internal messaging and updates
- **Digital Signage** - Display team status on screens
- **Event Coordination** - Share photos and documents
- **Project Collaboration** - Quick updates and file sharing
- **Team Building** - Photo galleries and celebrations

## 🔮 Roadmap

- [ ] User accounts with individual logins
- [ ] Email notifications
- [ ] Mobile app
- [ ] File upload limits and validation
- [ ] Search functionality
- [ ] Admin dashboard
- [ ] Export data functionality
- [ ] Multi-language support
- [ ] Threaded conversations
- [ ] @mentions and notifications

## 💡 Tech Stack

**Backend:**
- Node.js - JavaScript runtime
- Express.js - Web framework
- SQLite3 - Database
- CORS - Cross-origin resource sharing

**Frontend:**
- HTML5 - Structure
- CSS3 - Styling with dark theme
- Vanilla JavaScript - Interactivity
- Google Fonts - Typography

## 📞 Support

For issues and questions:
- Check the [troubleshooting guide](DATABASE-DEPLOYMENT.md#troubleshooting)
- Open an issue on GitHub
- Review closed issues for solutions

## 🌟 Acknowledgments

- Inspired by team collaboration needs
- Built for Dakboard integration
- Dark theme for modern interfaces

---

**Made with ❤️ for better team collaboration**
