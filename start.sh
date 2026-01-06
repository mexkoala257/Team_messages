#!/bin/bash

##############################################
# Team Portal - Quick Start Script
# For local development and testing
##############################################

echo "=========================================="
echo "Team Portal - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js 18+ from:"
    echo "  https://nodejs.org/"
    echo ""
    echo "Or use a package manager:"
    echo "  macOS:   brew install node"
    echo "  Ubuntu:  sudo apt install nodejs npm"
    echo "  Windows: Download from nodejs.org"
    echo ""
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo "✓ npm found: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "=========================================="
echo "Starting Team Portal..."
echo "=========================================="
echo ""
echo "Portal will be available at:"
echo "  http://localhost:3000"
echo ""
echo "Default password: TeamPortal2024"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=========================================="
echo ""

# Start the server
npm start
