const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const PORTAL_PASSWORD = process.env.PORTAL_PASSWORD;
if (!PORTAL_PASSWORD) {
    console.error('FATAL: PORTAL_PASSWORD environment variable is not set.');
    console.error('Please set PORTAL_PASSWORD in your environment secrets.');
    process.exit(1);
}

const sessions = new Map();

const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

function isRateLimited(ip) {
    const attempt = loginAttempts.get(ip);
    if (!attempt) return false;
    if (Date.now() > attempt.lockedUntil) {
        loginAttempts.delete(ip);
        return false;
    }
    return attempt.count >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(ip, success) {
    if (success) {
        loginAttempts.delete(ip);
        return;
    }
    const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    attempt.count++;
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
        attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }
    loginAttempts.set(ip, attempt);
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function isValidSession(token) {
    if (!token) return false;
    const session = sessions.get(token);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
        sessions.delete(token);
        return false;
    }
    return true;
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;
    
    if (!isValidSession(token)) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }
    next();
}

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(express.static('public'));

const db = new sqlite3.Database('./team-portal.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            text TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            caption TEXT,
            timestamp TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS pdfs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            data TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('Database tables initialized');
    });
}

app.post('/api/login', (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ 
            error: 'Too many login attempts. Please try again in 15 minutes.' 
        });
    }
    
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    
    if (password !== PORTAL_PASSWORD) {
        recordLoginAttempt(clientIp, false);
        return res.status(401).json({ error: 'Invalid password' });
    }
    
    recordLoginAttempt(clientIp, true);
    
    const token = generateToken();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    
    sessions.set(token, { expiresAt });
    
    res.json({ token, expiresIn: 86400 });
});

app.post('/api/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;
    
    if (token) {
        sessions.delete(token);
    }
    
    res.json({ success: true });
});

app.get('/api/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;
    
    if (isValidSession(token)) {
        res.json({ valid: true });
    } else {
        res.status(401).json({ valid: false });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/messages', authMiddleware, (req, res) => {
    db.all('SELECT * FROM messages ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/messages', authMiddleware, (req, res) => {
    const { name, text, timestamp } = req.body;
    
    if (!name || !text) {
        res.status(400).json({ error: 'Name and text are required' });
        return;
    }

    db.run(
        'INSERT INTO messages (name, text, timestamp) VALUES (?, ?, ?)',
        [name, text, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, text, timestamp });
        }
    );
});

app.delete('/api/messages/:id', authMiddleware, (req, res) => {
    db.run('DELETE FROM messages WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

const MAX_UPDATES = 10;
const UPDATE_EXPIRY_HOURS = 48;

function cleanupOldUpdates() {
    const expiryTime = new Date(Date.now() - UPDATE_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();
    db.run('DELETE FROM updates WHERE timestamp < ?', [expiryTime], function(err) {
        if (err) {
            console.error('Error cleaning up old updates:', err);
        } else if (this.changes > 0) {
            console.log(`Cleaned up ${this.changes} expired updates`);
        }
    });
}

function enforceMaxUpdates() {
    db.run(`DELETE FROM updates WHERE id NOT IN (SELECT id FROM updates ORDER BY id DESC LIMIT ?)`, [MAX_UPDATES], function(err) {
        if (err) {
            console.error('Error enforcing max updates:', err);
        } else if (this.changes > 0) {
            console.log(`Removed ${this.changes} old updates to maintain limit of ${MAX_UPDATES}`);
        }
    });
}

setInterval(() => {
    cleanupOldUpdates();
}, 60 * 60 * 1000);

app.get('/api/updates', authMiddleware, (req, res) => {
    cleanupOldUpdates();
    db.all('SELECT * FROM updates ORDER BY id DESC LIMIT ?', [MAX_UPDATES], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/updates', authMiddleware, (req, res) => {
    const { name, status, text, timestamp } = req.body;
    
    if (!name || !status || !text) {
        res.status(400).json({ error: 'Name, status, and text are required' });
        return;
    }

    db.run(
        'INSERT INTO updates (name, status, text, timestamp) VALUES (?, ?, ?, ?)',
        [name, status, text, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            enforceMaxUpdates();
            res.json({ id: this.lastID, name, status, text, timestamp });
        }
    );
});

app.delete('/api/updates/:id', authMiddleware, (req, res) => {
    db.run('DELETE FROM updates WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.get('/api/photos', authMiddleware, (req, res) => {
    db.all('SELECT * FROM photos ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/photos', authMiddleware, (req, res) => {
    const { data, caption, timestamp } = req.body;
    
    if (!data) {
        res.status(400).json({ error: 'Photo data is required' });
        return;
    }

    db.run(
        'INSERT INTO photos (data, caption, timestamp) VALUES (?, ?, ?)',
        [data, caption || '', timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, data, caption, timestamp });
        }
    );
});

app.delete('/api/photos/:id', authMiddleware, (req, res) => {
    db.run('DELETE FROM photos WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.get('/api/pdfs', authMiddleware, (req, res) => {
    db.all('SELECT * FROM pdfs ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/pdfs', authMiddleware, (req, res) => {
    const { name, data, timestamp } = req.body;
    
    if (!name || !data) {
        res.status(400).json({ error: 'Name and data are required' });
        return;
    }

    db.run(
        'INSERT INTO pdfs (name, data, timestamp) VALUES (?, ?, ?)',
        [name, data, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, data, timestamp });
        }
    );
});

app.delete('/api/pdfs/:id', authMiddleware, (req, res) => {
    db.run('DELETE FROM pdfs WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

// Public widget endpoints (no auth required for Dakboard)
app.get('/widget/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/widget/updates', (req, res) => {
    cleanupOldUpdates();
    db.all('SELECT * FROM updates ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/widget/all', (req, res) => {
    const result = { messages: [], updates: [] };
    db.all('SELECT * FROM messages ORDER BY created_at DESC LIMIT 10', [], (err, messages) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        result.messages = messages;
        db.all('SELECT * FROM updates ORDER BY created_at DESC LIMIT 10', [], (err, updates) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            result.updates = updates;
            res.json(result);
        });
    });
});

// HTML Widget for Quick Updates (formatted display)
app.get('/widget/updates/html', (req, res) => {
    cleanupOldUpdates();
    db.all('SELECT * FROM updates ORDER BY created_at DESC LIMIT 10', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error loading updates');
            return;
        }
        
        // Sort by priority: critical > urgent > notice
        const priorityOrder = { critical: 0, urgent: 1, notice: 2 };
        const sortedUpdates = rows.sort((a, b) => {
            const priorityA = priorityOrder[a.status] ?? 3;
            const priorityB = priorityOrder[b.status] ?? 3;
            if (priorityA !== priorityB) return priorityA - priorityB;
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        };
        
        const getUrgencyStyles = (status) => {
            switch(status) {
                case 'critical':
                    return {
                        bg: '#FF1744',
                        border: '#FF5252',
                        text: '#FFFFFF',
                        badge: '#FFFFFF',
                        badgeBg: '#B71C1C',
                        glow: '0 0 20px rgba(255, 23, 68, 0.6), 0 0 40px rgba(255, 23, 68, 0.3)'
                    };
                case 'urgent':
                    return {
                        bg: '#FF9100',
                        border: '#FFB74D',
                        text: '#000000',
                        badge: '#000000',
                        badgeBg: '#FF6D00',
                        glow: 'none'
                    };
                case 'notice':
                default:
                    return {
                        bg: '#2E7D32',
                        border: '#4CAF50',
                        text: '#FFFFFF',
                        badge: '#FFFFFF',
                        badgeBg: '#1B5E20',
                        glow: 'none'
                    };
            }
        };
        
        let updatesHtml = '';
        sortedUpdates.forEach(update => {
            const styles = getUrgencyStyles(update.status);
            const isCritical = update.status === 'critical';
            updatesHtml += `
                <div class="update-card ${isCritical ? 'critical-pulse' : ''}" style="
                    background: ${styles.bg};
                    border: 2px solid ${styles.border};
                    border-radius: 12px;
                    padding: 1.25rem;
                    margin-bottom: 1rem;
                    box-shadow: ${styles.glow};
                    ${isCritical ? 'animation: pulse 1.5s infinite;' : ''}
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <span style="
                            font-weight: 700;
                            font-size: 1.1rem;
                            color: ${styles.text};
                        ">${update.name}</span>
                        <span style="
                            background: ${styles.badgeBg};
                            color: ${styles.badge};
                            padding: 0.3rem 0.75rem;
                            border-radius: 20px;
                            font-size: 0.8rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">${update.status}</span>
                    </div>
                    <div style="
                        color: ${styles.text};
                        font-size: 1.15rem;
                        line-height: 1.5;
                        margin-bottom: 0.5rem;
                    ">${update.text}</div>
                    <div style="
                        color: ${styles.text};
                        opacity: 0.8;
                        font-size: 0.85rem;
                    ">${formatTime(update.timestamp || update.created_at)}</div>
                </div>
            `;
        });
        
        if (sortedUpdates.length === 0) {
            updatesHtml = `
                <div style="
                    text-align: center;
                    padding: 3rem;
                    color: #9CA3AF;
                    font-size: 1.2rem;
                ">No updates to display</div>
            `;
        }
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="30">
    <title>Quick Updates Widget</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: #111827;
            min-height: 100vh;
            padding: 1.5rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #F3F4F6;
        }
        .header h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        .header p {
            color: #9CA3AF;
            font-size: 0.9rem;
        }
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.9;
                transform: scale(1.01);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Team Updates</h1>
            <p>Auto-refreshes every 30 seconds</p>
        </div>
        ${updatesHtml}
    </div>
</body>
</html>
        `;
        
        res.send(html);
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Team Portal server running on port ${PORT}`);
    console.log(`Access the portal at: http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
