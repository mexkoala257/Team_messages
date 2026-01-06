#!/bin/bash

##############################################
# GitHub Repository Setup Script
# Prepares Team Portal for GitHub publication
##############################################

echo "=========================================="
echo "Team Portal - GitHub Setup"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first:"
    echo "  sudo apt install git"
    exit 1
fi

echo "This script will help you set up your GitHub repository."
echo ""

# Get GitHub username
echo "Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "GitHub username is required"
    exit 1
fi

# Get repository name
echo ""
echo "Enter repository name (default: team-portal):"
read -r REPO_NAME
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="team-portal"
fi

echo ""
echo "Configuration:"
echo "  Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo ""
    echo "Initializing git repository..."
    git init
    echo "Git initialized ✓"
else
    echo ""
    echo "Git repository already initialized ✓"
fi

# Configure git if needed
echo ""
echo "Configuring git user (if not set)..."
git config user.name >/dev/null 2>&1 || {
    echo "Enter your name for git commits:"
    read -r GIT_NAME
    git config user.name "$GIT_NAME"
}
git config user.email >/dev/null 2>&1 || {
    echo "Enter your email for git commits:"
    read -r GIT_EMAIL
    git config user.email "$GIT_EMAIL"
}

# Copy README
if [ -f "GITHUB-README.md" ]; then
    cp GITHUB-README.md README.md
    echo "README.md updated ✓"
fi

# Add all files
echo ""
echo "Adding files to git..."
git add .

# Create initial commit
echo ""
echo "Creating initial commit..."
if git diff-index --quiet HEAD --; then
    git commit -m "Initial commit: Team Portal v1.0.0"
    echo "Initial commit created ✓"
else
    echo "No changes to commit"
fi

# Set main branch
echo ""
echo "Setting main branch..."
git branch -M main
echo "Main branch set ✓"

# Add remote
echo ""
echo "Adding GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "Remote added ✓"

# Instructions
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create the repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: Team collaboration platform with messaging and Dakboard integration"
echo "   - Visibility: Public or Private (your choice)"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2. Push your code:"
echo "   git push -u origin main"
echo ""
echo "3. If prompted for credentials:"
echo "   - Username: $GITHUB_USERNAME"
echo "   - Password: Use a Personal Access Token (not your GitHub password)"
echo "   - Create token at: https://github.com/settings/tokens"
echo ""
echo "4. View your repository:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "=========================================="
echo ""
echo "Optional: Create a release"
echo "  git tag -a v1.0.0 -m 'Release version 1.0.0'"
echo "  git push origin v1.0.0"
echo ""
echo "For detailed instructions, see GITHUB-SETUP.md"
echo "=========================================="
