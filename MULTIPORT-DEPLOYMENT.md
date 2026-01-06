# Team Portal - Multi-Port Deployment Guide
## For VPS Already Hosting Other Services

This guide helps you deploy the Team Portal on a custom port alongside your existing services.

---

## Quick Deployment (Recommended)

### Step 1: Upload Files
```bash
scp team-portal.html setup-portal-multiport.sh your-username@your-vps-ip:~
```

### Step 2: SSH into VPS
```bash
ssh your-username@your-vps-ip
```

### Step 3: Run Setup
```bash
chmod +x setup-portal-multiport.sh
sudo ./setup-portal-multiport.sh
```

When prompted:
- **Enter port number:** Choose an unused port (e.g., 8080, 3000, 5000, 8888)
- **Enter domain/IP:** Your VPS IP or domain name

**Done!** Access at: `http://your-ip:PORT`

---

## Common Port Recommendations

Choose a port that's not being used by your other services:

| Port | Common Use | Good for Team Portal? |
|------|------------|----------------------|
| 80 | HTTP (likely in use) | ❌ Probably occupied |
| 443 | HTTPS (likely in use) | ❌ Probably occupied |
| 3000 | Development servers | ✅ Good choice |
| 5000 | Flask/Python apps | ✅ Good choice |
| 8080 | Alternative HTTP | ✅ Good choice |
| 8888 | Alt web services | ✅ Good choice |
| 9000 | Various services | ✅ Good choice |

---

## Manual Setup Instructions

If you prefer manual setup or need more control:

### 1. Create Web Directory
```bash
sudo mkdir -p /var/www/team-portal
sudo cp team-portal.html /var/www/team-portal/index.html
sudo chown -R www-data:www-data /var/www/team-portal
sudo chmod -R 755 /var/www/team-portal
```

### 2. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/team-portal
```

Add this configuration (replace 8080 with your chosen port):
```nginx
server {
    listen 8080;
    server_name your-domain-or-ip;
    
    root /var/www/team-portal;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/team-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Configure Firewall
```bash
sudo ufw allow 8080/tcp
sudo ufw status
```

### 5. Check Your VPS Provider's Firewall

**Important:** Many VPS providers have additional firewalls:

#### **DigitalOcean**
- Go to Networking → Firewalls
- Add inbound rule for your port (e.g., 8080)

#### **AWS EC2**
- Go to Security Groups
- Edit inbound rules
- Add Custom TCP Rule for your port

#### **Linode**
- Go to Firewalls
- Add inbound rule for your port

#### **Vultr**
- Go to Firewall settings
- Add rule for your port

#### **Google Cloud**
- Go to VPC Network → Firewall Rules
- Create rule for your port

---

## Testing Your Setup

### Check if Nginx is listening on your port:
```bash
sudo netstat -tlnp | grep nginx
```

You should see your port listed.

### Test from the VPS itself:
```bash
curl http://localhost:8080
```

### Test from external network:
Open in browser: `http://your-vps-ip:8080`

---

## Subdomain Setup (Optional)

If you want a cleaner URL like `portal.yourdomain.com` instead of `yourdomain.com:8080`:

### 1. Create DNS Record
In your domain registrar:
- Type: A Record
- Name: portal
- Value: Your VPS IP
- TTL: 3600

### 2. Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/team-portal
```

Change:
```nginx
server {
    listen 80;  # Use standard port
    server_name portal.yourdomain.com;
    # ... rest of config
}
```

### 3. Set up SSL (Optional)
```bash
sudo certbot --nginx -d portal.yourdomain.com
```

Now access at: `https://portal.yourdomain.com`

---

## Reverse Proxy Setup (Advanced)

If you want to serve on a path like `yourdomain.com/portal`:

### 1. Add to Your Existing Nginx Config
```bash
sudo nano /etc/nginx/sites-available/your-existing-site
```

Add this location block:
```nginx
location /portal {
    proxy_pass http://localhost:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 2. Restart Nginx
```bash
sudo systemctl restart nginx
```

Now access at: `http://yourdomain.com/portal`

---

## Widget URLs for Dakboard

After setup, use these URLs:

**With Port:**
```
http://your-ip:8080/?widget=messages
http://your-ip:8080/?widget=updates
http://your-ip:8080/?widget=all
```

**With Subdomain:**
```
https://portal.yourdomain.com/?widget=messages
https://portal.yourdomain.com/?widget=updates
https://portal.yourdomain.com/?widget=all
```

**With Path:**
```
http://yourdomain.com/portal/?widget=messages
http://yourdomain.com/portal/?widget=updates
http://yourdomain.com/portal/?widget=all
```

---

## Troubleshooting

### Can't access the portal?

**1. Check Nginx is running:**
```bash
sudo systemctl status nginx
```

**2. Check port is listening:**
```bash
sudo netstat -tlnp | grep 8080
```

**3. Check firewall:**
```bash
sudo ufw status
```

**4. Check error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**5. Test locally first:**
```bash
curl http://localhost:8080
```

### Port already in use?

**Check what's using the port:**
```bash
sudo lsof -i :8080
```

**Choose a different port** and update your configuration.

### Still can't access from external network?

**Check your VPS provider's firewall/security groups** - this is the most common issue!

---

## Changing Port Later

### 1. Edit Nginx config:
```bash
sudo nano /etc/nginx/sites-available/team-portal
```

Change the `listen` line to your new port.

### 2. Update firewall:
```bash
sudo ufw allow NEW_PORT/tcp
sudo ufw delete allow OLD_PORT/tcp
```

### 3. Restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Uninstalling

To remove the Team Portal:

```bash
# Remove Nginx configuration
sudo rm /etc/nginx/sites-enabled/team-portal
sudo rm /etc/nginx/sites-available/team-portal

# Remove files
sudo rm -rf /var/www/team-portal

# Remove firewall rule
sudo ufw delete allow 8080/tcp

# Restart Nginx
sudo systemctl restart nginx
```

---

## Security Notes

1. **Change the default password** immediately after deployment
2. **Keep your system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. **Consider using SSL** even with custom ports
4. **Monitor your logs** regularly
5. **Only open necessary ports** in your firewall

---

## Questions?

- **Port won't open?** Check both UFW and your VPS provider's firewall
- **Nginx won't start?** Check logs: `sudo tail -f /var/log/nginx/error.log`
- **Can't connect externally?** Verify your VPS provider's security groups/firewall

---

**Your Team Portal is now running on a custom port without interfering with your existing services! 🎉**
