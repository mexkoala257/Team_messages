# GitHub Repository Setup Guide

This guide will help you create and publish your Team Portal project to GitHub.

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- Team Portal files ready

## 🚀 Quick Setup (Command Line)

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd team-portal

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Team Portal v1.0.0"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in details:
   - **Repository name**: `team-portal`
   - **Description**: "Team collaboration platform with messaging, photo sharing, and Dakboard integration"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

### Step 3: Connect and Push

```bash
# Add remote repository (replace with your username)
git remote add origin https://github.com/YOUR-USERNAME/team-portal.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Done!** Your repository is now on GitHub! 🎉

## 🌐 Using GitHub Desktop (GUI Method)

### Step 1: Install GitHub Desktop
Download from [desktop.github.com](https://desktop.github.com)

### Step 2: Create Repository
1. Open GitHub Desktop
2. File → **Add Local Repository**
3. Choose your `team-portal` folder
4. Click **Create Repository**
5. Add initial commit message
6. Click **Publish repository**
7. Choose visibility (Public/Private)
8. Click **Publish**

## 📁 Repository Structure

Your GitHub repo should contain:

```
team-portal/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions
├── public/
│   └── index.html          # Frontend
├── .gitignore              # Git ignore rules
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Contribution guidelines
├── DATABASE-DEPLOYMENT.md  # Deployment guide
├── LICENSE                 # MIT License
├── MULTIPORT-DEPLOYMENT.md # Multi-port setup
├── README.md               # Main documentation
├── package.json            # Dependencies
├── server.js               # Backend server
└── setup-database.sh       # Setup script
```

## ⚙️ Repository Settings

### Enable Features

In your GitHub repository settings:

1. **Issues**: Enable for bug tracking
2. **Wiki**: Enable for additional docs (optional)
3. **Projects**: Enable for roadmap (optional)
4. **Discussions**: Enable for community (optional)

### Branch Protection (Recommended)

Settings → Branches → Add rule:
- Branch name: `main`
- ☑️ Require pull request reviews
- ☑️ Require status checks to pass

### Topics

Add topics for discoverability:
- `team-collaboration`
- `nodejs`
- `express`
- `sqlite`
- `dakboard`
- `team-portal`
- `dark-theme`

## 📝 Creating Releases

### Tag a Release

```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Create Release on GitHub

1. Go to your repository
2. Click **Releases** → **Create a new release**
3. Choose tag: `v1.0.0`
4. Release title: "Team Portal v1.0.0"
5. Description: Copy from CHANGELOG.md
6. Attach binaries (optional)
7. Click **Publish release**

## 🔒 Security

### Protect Sensitive Data

The `.gitignore` file already excludes:
- `node_modules/`
- `*.db` (database files)
- `.env` (environment variables)
- Log files

**Never commit:**
- Passwords
- API keys
- Database files
- Personal data

### GitHub Secrets

For CI/CD, add secrets in:
Settings → Secrets and variables → Actions

## 🤝 Collaboration

### Invite Collaborators

Settings → Collaborators → Add people

### Set Up Issues

Create issue templates:
1. Settings → Features → Set up templates
2. Add bug report template
3. Add feature request template

### Set Up Pull Requests

Create PR template:
`.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] No errors in console
- [ ] Database operations verified

## Screenshots (if applicable)
```

## 📊 GitHub Actions

CI/CD is already configured in `.github/workflows/ci.yml`

This will automatically:
- Test on push/PR
- Check for security vulnerabilities
- Verify server starts
- Check file structure

## 🎯 Best Practices

### Commit Messages
```bash
# Good
git commit -m "Add: user authentication feature"
git commit -m "Fix: database connection timeout"
git commit -m "Update: README with new API endpoints"

# Bad
git commit -m "updates"
git commit -m "fix stuff"
```

### Branch Naming
```bash
git checkout -b feature/user-auth
git checkout -b fix/database-lock
git checkout -b docs/api-guide
```

### Regular Commits
```bash
# Commit frequently
git add .
git commit -m "Add: message deletion endpoint"
git push origin feature-name
```

## 📱 Repository Badges

Add to your README.md:

```markdown
![GitHub release](https://img.shields.io/github/v/release/YOUR-USERNAME/team-portal)
![GitHub issues](https://img.shields.io/github/issues/YOUR-USERNAME/team-portal)
![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/team-portal)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

## 🌟 Promote Your Repository

1. **Write a good README** (already done! ✓)
2. **Add screenshots** to show the interface
3. **Create a demo video** or GIF
4. **Share on social media**
5. **Submit to awesome lists**
6. **Write a blog post** about it

## 🔄 Keeping Updated

### Update from Main
```bash
git checkout main
git pull origin main
```

### Sync Fork (if forked)
```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/team-portal.git
git fetch upstream
git merge upstream/main
```

## 📞 Common Issues

### Push Rejected
```bash
git pull origin main --rebase
git push origin main
```

### Forgot .gitignore
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

### Wrong Remote
```bash
git remote -v  # Check current remote
git remote set-url origin https://github.com/YOUR-USERNAME/team-portal.git
```

## 🎓 Learn More

- [GitHub Docs](https://docs.github.com)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Open Source Guide](https://opensource.guide/)

---

## ✅ Checklist

Before publishing:
- [ ] All sensitive data removed
- [ ] .gitignore configured
- [ ] README.md complete
- [ ] LICENSE added
- [ ] CONTRIBUTING.md added
- [ ] Repository description set
- [ ] Topics added
- [ ] Initial release created

**Your Team Portal is ready to share with the world! 🚀**
