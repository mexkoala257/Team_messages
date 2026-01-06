# Team Portal with Database - Deployment Guide

## 🎉 What's New with Database Backend

Your Team Portal now includes:
- ✅ **SQLite Database** - Reliable data storage
- ✅ **REST API Backend** - Node.js + Express server
- ✅ **Real-time Sync** - All devices see the same data
- ✅ **Persistent Storage** - Data survives server restarts
- ✅ **Better Performance** - Faster loading and updates
- ✅ **System Service** - Runs automatically on startup

---

## 🚀 Quick Deployment (3 Steps)

### Step 1: Upload All Files
```bash
# Upload the entire team-portal directory
scp -r server.js package.json public/ setup-database.sh root@your-vps-ip:~
```

### Step 2: SSH and Run Setup
```bash
ssh root@your-vps-ip
chmod +x setup-database.sh
sudo ./setup-database.sh
```

### Step 3: Choose Your Port
When prompted, enter a port (e.g., 3000, 8080, 5000)

**Done!** Your portal is live at `http://your-ip:PORT`

---

## 📦 What Gets Installed

1. **Node.js 20.x** - JavaScript runtime
2. **NPM packages** - Express, SQLite3, CORS, Multer
3. **System service** - Runs automatically on boot
4. **SQLite database** - Stores all your data

---

## 🗂️ File Structure

After deployment:
```
/opt/team-portal/
├── server.js           # Backend API server
├── package.json        # Dependencies
├── team-portal.db      # SQLite database (auto-created)
├── public/
│   └── index.html      # Frontend application
└── node_modules/       # Installed packages
```

---

## 🔧 Managing the Service

### Check Status
```bash
sudo systemctl status team-portal
```

### View Live Logs
```bash
sudo journalctl -u team-portal -f
```

### Restart Service
```bash
sudo systemctl restart team-portal
```

### Stop Service
```bash
sudo systemctl stop team-portal
```

### Start Service
```bash
sudo systemctl start team-portal
```

### Enable Auto-Start on Boot
```bash
sudo systemctl enable team-portal
```

---

## 💾 Database Management

### Backup Database
```bash
sudo cp /opt/team-portal/team-portal.db ~/team-portal-backup-$(date +%Y%m%d).db
```

### Restore Database
```bash
sudo systemctl stop team-portal
sudo cp ~/team-portal-backup.db /opt/team-portal/team-portal.db
sudo systemctl start team-portal
```

### View Database Contents (Advanced)
```bash
sudo apt install sqlite3
sudo sqlite3 /opt/team-portal/team-portal.db
# In SQLite prompt:
.tables                    # List tables
SELECT * FROM messages;    # View messages
SELECT * FROM updates;     # View updates
.quit                      # Exit
```

### Reset All Data
```bash
sudo systemctl stop team-portal
sudo rm /opt/team-portal/team-portal.db
sudo systemctl start team-portal
# Database will be recreated empty
```

---

## 🔐 Change Password

Edit the frontend file:
```bash
sudo nano /opt/team-portal/public/index.html
```

Find this line:
```javascript
const PASSWORD = "TeamPortal2024";
```

Change to your password:
```javascript
const PASSWORD = "YourSecurePassword123";
```

Save and restart:
```bash
sudo systemctl restart team-portal
```

---

## 🌐 Widget URLs for Dakboard

After deployment, use these URLs in Dakboard:
```
http://your-domain:PORT/?widget=messages
http://your-domain:PORT/?widget=updates
http://your-domain:PORT/?widget=all
```

Widgets automatically refresh every 30 seconds.

---

## 🔄 Updating the Portal

### Update Frontend
```bash
# Upload new index.html
scp public/index.html root@your-vps-ip:/opt/team-portal/public/
sudo systemctl restart team-portal
```

### Update Backend
```bash
# Upload new server.js
scp server.js root@your-vps-ip:/opt/team-portal/
sudo systemctl restart team-portal
```

### Update Dependencies
```bash
cd /opt/team-portal
sudo npm install
sudo systemctl restart team-portal
```

---

## 🐛 Troubleshooting

### Portal Not Loading

**Check if service is running:**
```bash
sudo systemctl status team-portal
```

**View error logs:**
```bash
sudo journalctl -u team-portal -n 50
```

**Check if port is listening:**
```bash
sudo netstat -tlnp | grep 3000
```

### Can't Connect from External Network

**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 3000/tcp
```

**Check VPS provider's firewall** (Security Groups, Cloud Firewall, etc.)

### Database Errors

**Check database permissions:**
```bash
ls -la /opt/team-portal/team-portal.db
```

**Fix permissions:**
```bash
sudo chown root:root /opt/team-portal/team-portal.db
sudo chmod 644 /opt/team-portal/team-portal.db
```

### Service Won't Start

**Check Node.js installation:**
```bash
node --version
npm --version
```

**Check dependencies:**
```bash
cd /opt/team-portal
sudo npm install
```

**Check service logs:**
```bash
sudo journalctl -u team-portal -n 100 --no-pager
```

---

## 🔒 Security Best Practices

1. **Change the default password immediately**
2. **Keep Node.js updated:**
   ```bash
   sudo npm install -g npm
   sudo npm update
   ```
3. **Regular database backups**
4. **Monitor service logs**
5. **Use HTTPS with Nginx reverse proxy (recommended)**

---

## 🌐 Setting Up Nginx Reverse Proxy (Optional)

For cleaner URLs without port numbers:

### 1. Install Nginx
```bash
sudo apt install nginx -y
```

### 2. Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/team-portal
```

Add:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable and Restart
```bash
sudo ln -s /etc/nginx/sites-available/team-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Add SSL (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

Now access at: `https://your-domain.com`

---

## 📊 API Endpoints (For Developers)

Your portal exposes these REST API endpoints:

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Add message
- `DELETE /api/messages/:id` - Delete message

### Updates
- `GET /api/updates` - Get all updates
- `POST /api/updates` - Add update
- `DELETE /api/updates/:id` - Delete update

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Add photo
- `DELETE /api/photos/:id` - Delete photo

### PDFs
- `GET /api/pdfs` - Get all PDFs
- `POST /api/pdfs` - Add PDF
- `DELETE /api/pdfs/:id` - Delete PDF

### Health Check
- `GET /api/health` - Check server status

---

## 📈 Monitoring

### Check Resource Usage
```bash
# CPU and memory
htop

# Disk space
df -h

# Database size
du -h /opt/team-portal/team-portal.db
```

### Service Logs
```bash
# Last 50 lines
sudo journalctl -u team-portal -n 50

# Follow live
sudo journalctl -u team-portal -f

# Today's logs
sudo journalctl -u team-portal --since today
```

---

## 🗑️ Uninstalling

To completely remove the Team Portal:

```bash
# Stop and disable service
sudo systemctl stop team-portal
sudo systemctl disable team-portal
sudo rm /etc/systemd/system/team-portal.service

# Remove files
sudo rm -rf /opt/team-portal

# Remove firewall rule
sudo ufw delete allow 3000/tcp

# Reload systemd
sudo systemctl daemon-reload
```

---

## 💡 Tips

1. **Regular Backups**: Set up automated daily database backups
2. **Monitor Logs**: Check logs weekly for errors
3. **Update Regularly**: Keep Node.js and packages updated
4. **Use HTTPS**: Set up SSL for secure connections
5. **Resource Monitoring**: Watch disk space as database grows

---

## 📞 Support

### Common Issues

**"Cannot find module"**
```bash
cd /opt/team-portal
sudo npm install
sudo systemctl restart team-portal
```

**"Port already in use"**
```bash
sudo lsof -i :3000
# Kill process or choose different port
```

**"Database is locked"**
```bash
sudo systemctl restart team-portal
```

---

**Your Team Portal with database backend is now running! 🎉**

All data is safely stored in SQLite and accessible from any device!
