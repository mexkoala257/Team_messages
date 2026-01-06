# Team Portal - VPS Deployment Guide

## Quick Deploy

1. **Upload files to your VPS:**
   ```bash
   scp -r team-portal-complete root@YOUR_VPS_IP:~
   ```

2. **SSH into your VPS:**
   ```bash
   ssh root@YOUR_VPS_IP
   ```

3. **Run the deployment script:**
   ```bash
   cd ~/team-portal-complete
   chmod +x deploy-vps.sh
   sudo ./deploy-vps.sh
   ```

4. **Access your portal:**
   ```
   http://YOUR_VPS_IP:5000
   ```

## Manual Deployment

If you prefer to set things up manually:

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Set up the application
```bash
cd /opt
sudo mkdir team-portal
sudo cp -r ~/team-portal-complete/* /opt/team-portal/
cd /opt/team-portal
sudo npm install --production
```

### Set environment variables and run
```bash
export PORTAL_PASSWORD="your-secure-password"
export PORT=5000
node server.js
```

## Using a Reverse Proxy (Nginx)

To use a domain name with HTTPS:

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/team-portal`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/team-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `sudo systemctl status team-portal` | Check if running |
| `sudo systemctl restart team-portal` | Restart the app |
| `sudo systemctl stop team-portal` | Stop the app |
| `sudo journalctl -u team-portal -f` | View live logs |

## Updating

To update after pushing changes to GitHub:

```bash
cd /opt/team-portal
git pull
npm install --production
sudo systemctl restart team-portal
```
