# Contributing to Team Portal

Thank you for your interest in contributing to Team Portal! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- System information (OS, Node.js version, browser)
- Screenshots if applicable

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues first
- Provide clear use case
- Explain why this would be useful
- Consider backward compatibility

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/team-portal.git
   cd team-portal
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Include screenshots for UI changes

## 📝 Coding Standards

### JavaScript Style
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await for asynchronous code
- Add JSDoc comments for functions
- Keep functions small and focused

### CSS Style
- Use CSS variables for colors
- Follow BEM naming convention where applicable
- Keep selectors simple
- Comment complex styling

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Provide detailed description if needed
- Reference issues: "Fixes #123"

## 🧪 Testing

Before submitting:
- Test all functionality manually
- Verify on different browsers
- Check responsive design
- Test API endpoints
- Ensure database operations work correctly

## 📚 Documentation

When adding features:
- Update README.md if needed
- Add API documentation for new endpoints
- Update DATABASE-DEPLOYMENT.md for deployment changes
- Include inline code comments

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 🎯 Priority Areas

We especially welcome contributions in:
- User authentication system
- Mobile responsiveness improvements
- Additional widget types
- Performance optimizations
- Security enhancements
- Documentation improvements
- Test coverage
- Accessibility features

## 💡 Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/team-portal.git
   cd team-portal
   npm install
   ```

2. **Run in development mode**
   ```bash
   npm run dev
   ```

3. **Access locally**
   ```
   http://localhost:3000
   ```

## 🐛 Debug Tips

- Use `console.log()` for backend debugging
- Check browser console for frontend errors
- View database: `sqlite3 team-portal.db`
- Monitor logs: `tail -f /var/log/team-portal.log`

## 📋 Checklist

Before submitting a PR:
- [ ] Code follows project style
- [ ] Tested locally
- [ ] No console errors
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

## 🚫 What Not to Do

- Don't commit node_modules
- Don't commit database files
- Don't include personal credentials
- Don't make unrelated changes
- Don't break existing functionality

## 📞 Getting Help

- Open an issue for questions
- Check existing documentation
- Review closed issues and PRs

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Thanked for their contributions

Thank you for making Team Portal better! 🎉
