#!/bin/bash

##############################################
# Team Portal with Database - Setup Script
# For Debian-based VPS
##############################################

set -e

echo "=========================================="
echo "Team Portal with Database - Setup"
echo "=========================================="
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)" 
   exit 1
fi

# Get port number
echo "Enter the port number for Team Portal (e.g., 3000, 8080, 5000):"
read -r PORT

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
    echo "Invalid port. Please use a port between 1024 and 65535"
    exit 1
fi

# Get domain/IP
echo ""
echo "Enter your domain or VPS IP address:"
read -r DOMAIN
if [ -z "$DOMAIN" ]; then
    DOMAIN=$(curl -s ifconfig.me)
    echo "Using server IP: $DOMAIN"
fi

echo ""
echo "Configuration:"
echo "  Domain/IP: $DOMAIN"
echo "  Port: $PORT"
echo "  URL: http://$DOMAIN:$PORT"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo ""
echo "Step 1: Updating system..."
apt update

echo ""
echo "Step 2: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo "Node.js installed: $(node --version)"
else
    echo "Node.js already installed: $(node --version)"
fi

echo ""
echo "Step 3: Installing build essentials for SQLite..."
apt install -y build-essential python3

echo ""
echo "Step 4: Creating application directory..."
mkdir -p /opt/team-portal
cd /opt/team-portal

echo ""
echo "Step 5: Copying application files..."
if [ -f "$HOME/server.js" ]; then
    cp "$HOME/server.js" ./
else
    echo "ERROR: server.js not found!"
    exit 1
fi

if [ -f "$HOME/package.json" ]; then
    cp "$HOME/package.json" ./
else
    echo "ERROR: package.json not found!"
    exit 1
fi

if [ -d "$HOME/public" ]; then
    cp -r "$HOME/public" ./
else
    echo "ERROR: public directory not found!"
    exit 1
fi

echo ""
echo "Step 6: Installing Node.js dependencies..."
npm install

echo ""
echo "Step 7: Creating systemd service..."
cat > /etc/systemd/system/team-portal.service << EOF
[Unit]
Description=Team Portal Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/team-portal
Environment="PORT=$PORT"
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "Step 8: Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow $PORT/tcp
    echo "Firewall rule added for port $PORT"
else
    echo "UFW not found. Please manually configure firewall."
fi

echo ""
echo "Step 9: Starting Team Portal service..."
systemctl daemon-reload
systemctl enable team-portal
systemctl start team-portal

# Wait a moment for service to start
sleep 3

# Check if service is running
if systemctl is-active --quiet team-portal; then
    echo "✓ Team Portal service is running"
else
    echo "✗ Team Portal service failed to start. Check logs:"
    echo "  sudo journalctl -u team-portal -n 50"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Your Team Portal is now accessible at:"
echo "  http://$DOMAIN:$PORT"
echo ""
echo "Widget URLs for Dakboard:"
echo "  http://$DOMAIN:$PORT/?widget=messages"
echo "  http://$DOMAIN:$PORT/?widget=updates"
echo "  http://$DOMAIN:$PORT/?widget=all"
echo ""
echo "Default Password: TeamPortal2024"
echo ""
echo "IMPORTANT: Change the password by editing:"
echo "  /opt/team-portal/public/index.html"
echo "  Then restart: sudo systemctl restart team-portal"
echo ""
echo "Database location: /opt/team-portal/team-portal.db"
echo ""
echo "=========================================="
echo "Useful Commands:"
echo "=========================================="
echo "Check status:       sudo systemctl status team-portal"
echo "View logs:          sudo journalctl -u team-portal -f"
echo "Restart service:    sudo systemctl restart team-portal"
echo "Stop service:       sudo systemctl stop team-portal"
echo "Backup database:    sudo cp /opt/team-portal/team-portal.db ~/backup.db"
echo ""
echo "Application files:  /opt/team-portal/"
echo "Service logs:       sudo journalctl -u team-portal"
echo ""
echo "=========================================="
echo ""
echo "Remember to open port $PORT in your VPS provider's"
echo "firewall/security groups if needed!"
echo ""
echo "=========================================="
