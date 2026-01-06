#!/bin/bash

echo "=========================================="
echo "Team Portal - VPS Deployment Script"
echo "=========================================="
echo ""

if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

read -p "Enter your portal password: " -s PORTAL_PWD
echo ""

if [ -z "$PORTAL_PWD" ]; then
    echo "Error: Password cannot be empty"
    exit 1
fi

echo "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

APP_DIR="/opt/team-portal"
echo "Setting up application in $APP_DIR..."

mkdir -p $APP_DIR
cp -r ./* $APP_DIR/
cd $APP_DIR

echo "Installing dependencies..."
npm install --production

echo "Creating systemd service..."
cat > /etc/systemd/system/team-portal.service << EOF
[Unit]
Description=Team Portal
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=5000
Environment=PORTAL_PASSWORD=$PORTAL_PWD
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "Starting service..."
systemctl daemon-reload
systemctl enable team-portal
systemctl restart team-portal

sleep 2

if systemctl is-active --quiet team-portal; then
    echo ""
    echo "=========================================="
    echo "Deployment successful!"
    echo "=========================================="
    echo ""
    echo "Your Team Portal is running at:"
    echo "  http://YOUR_SERVER_IP:5000"
    echo ""
    echo "Useful commands:"
    echo "  Check status:  sudo systemctl status team-portal"
    echo "  View logs:     sudo journalctl -u team-portal -f"
    echo "  Restart:       sudo systemctl restart team-portal"
    echo "  Stop:          sudo systemctl stop team-portal"
    echo ""
else
    echo "Error: Service failed to start"
    echo "Check logs with: journalctl -u team-portal -n 50"
    exit 1
fi
