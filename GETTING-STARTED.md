# Getting Started with Team Portal

Welcome! This guide will help you get Team Portal up and running quickly.

## 📦 What's in This Folder?

```
team-portal-complete/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions (auto-testing)
├── public/
│   └── index.html             # Frontend application
├── .gitignore                 # Git ignore rules
├── CHANGELOG.md               # Version history
├── CONTRIBUTING.md            # How to contribute
├── DATABASE-DEPLOYMENT.md     # Full deployment guide
├── GETTING-STARTED.md         # This file!
├── GITHUB-SETUP.md            # GitHub publishing guide
├── LICENSE                    # MIT License
├── MULTIPORT-DEPLOYMENT.md    # Multi-port setup
├── README.md                  # Main documentation
├── package.json               # Node.js dependencies
├── prepare-github.sh          # GitHub setup script
├── server.js                  # Backend API server
└── setup-database.sh          # VPS deployment script
```

## 🎯 Choose Your Path

### Path 1: Local Development (Test on Your Computer)
Best for: Testing, development, trying it out

### Path 2: VPS Deployment (Production Server)
Best for: Team use, accessible from anywhere

### Path 3: GitHub Repository (Share Your Code)
Best for: Open source, version control, collaboration

---

## 🖥️ Path 1: Local Development

### Requirements
- Node.js 18+ installed
- Any operating system (Windows, Mac, Linux)

### Steps

1. **Open terminal in this folder**
   ```bash
   cd team-portal-complete
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

5. **Login**
   - Default password: `TeamPortal2024`

**That's it!** 🎉

### Change Password
Edit `public/index.html` and find:
```javascript
const PASSWORD = "TeamPortal2024";
```

### Stop Server
Press `Ctrl+C` in the terminal

### Development Mode (auto-reload)
```bash
npm run dev
```

---

## 🌐 Path 2: VPS Deployment

### Requirements
- Debian/Ubuntu VPS
- SSH access
- Root or sudo privileges

### Quick Setup

1. **Upload this entire folder to your VPS**
   ```bash
   scp -r team-portal-complete root@your-vps-ip:~
   ```

2. **SSH into your VPS**
   ```bash
   ssh root@your-vps-ip
   ```

3. **Navigate to folder**
   ```bash
   cd team-portal-complete
   ```

4. **Run setup script**
   ```bash
   chmod +x setup-database.sh
   sudo ./setup-database.sh
   ```

5. **Follow prompts**
   - Choose a port (e.g., 3000, 8080)
   - Enter your domain or IP

6. **Access your portal**
   ```
   http://your-vps-ip:PORT
   ```

### Detailed Instructions
See [DATABASE-DEPLOYMENT.md](DATABASE-DEPLOYMENT.md) for:
- Nginx reverse proxy setup
- SSL/HTTPS configuration
- Troubleshooting
- Database management
- Security hardening

---

## 🐙 Path 3: GitHub Repository

### Requirements
- Git installed
- GitHub account

### Quick Setup

1. **Navigate to this folder**
   ```bash
   cd team-portal-complete
   ```

2. **Run GitHub setup script**
   ```bash
   chmod +x prepare-github.sh
   ./prepare-github.sh
   ```

3. **Follow the prompts**
   - Enter your GitHub username
   - Choose repository name

4. **Create repository on GitHub**
   - Go to github.com/new
   - Create repository (don't initialize with files)

5. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

### Detailed Instructions
See [GITHUB-SETUP.md](GITHUB-SETUP.md) for:
- Manual setup steps
- GitHub Desktop method
- Repository settings
- Creating releases
- Best practices

---

## ⚡ Quick Commands Reference

### Local Development
```bash
npm install              # Install dependencies
npm start               # Start server
npm run dev             # Development mode with auto-reload
```

### VPS Management
```bash
sudo systemctl status team-portal    # Check status
sudo systemctl restart team-portal   # Restart service
sudo journalctl -u team-portal -f    # View logs
```

### Database
```bash
cp team-portal.db backup.db          # Backup database
sqlite3 team-portal.db               # Access database
rm team-portal.db                    # Reset database
```

---

## 🔐 Security Checklist

Before going live:
- [ ] Change default password in `public/index.html`
- [ ] Set up HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Regular database backups
- [ ] Keep Node.js updated

---

## 📊 Features Overview

### Main Portal
- **Messages** - Team communication
- **Quick Updates** - Status indicators
- **Photos** - Image gallery
- **Documents** - PDF management

### Dakboard Widgets
Access at:
- `http://your-server:3000/?widget=messages`
- `http://your-server:3000/?widget=updates`
- `http://your-server:3000/?widget=all`

### API Endpoints
- `GET /api/messages` - Retrieve messages
- `POST /api/messages` - Create message
- `DELETE /api/messages/:id` - Delete message
- (Similar for updates, photos, pdfs)

---

## 🆘 Need Help?

### Documentation
- [README.md](README.md) - Complete overview
- [DATABASE-DEPLOYMENT.md](DATABASE-DEPLOYMENT.md) - Deployment guide
- [MULTIPORT-DEPLOYMENT.md](MULTIPORT-DEPLOYMENT.md) - Port configuration
- [GITHUB-SETUP.md](GITHUB-SETUP.md) - GitHub guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

### Common Issues

**Port already in use?**
```bash
sudo lsof -i :3000
# Kill process or choose different port
```

**Can't connect externally?**
- Check firewall: `sudo ufw status`
- Check VPS security groups
- Verify port is open

**Database errors?**
```bash
sudo systemctl restart team-portal
```

---

## 🎓 Next Steps

1. ✅ Get it running (choose a path above)
2. ✅ Change the default password
3. ✅ Test all features
4. ✅ Set up Dakboard widgets
5. ✅ Invite your team
6. ✅ Set up backups
7. ✅ (Optional) Publish to GitHub

---

## 📞 Support

- **Issues**: Open an issue on GitHub (if published)
- **Questions**: Check documentation first
- **Contributions**: See CONTRIBUTING.md

---

**Ready to start? Pick your path above and let's go! 🚀**
