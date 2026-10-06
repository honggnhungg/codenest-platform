require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const initDb = require('./src/database/initDb');

// Import Middleware
const { authenticate, requireAuth, requireAdmin } = require('./src/middleware/authMiddleware');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

/**
 * Port configuration:
 * Follows process.env.PORT || 3002.
 * (When PORT=3003 is specified in .env, process.env.PORT is used to match CloudPanel Nginx reverse proxy).
 */
const PORT = process.env.PORT || 3002;

// Core Middleware
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Assets
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Global Authenticate Middleware (attaches req.user if token is valid)
app.use(authenticate);

/* ==========================================================================
   Public Web Page Routes
   ========================================================================== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/course', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/course/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect(req.user.role === 'admin' ? '/admin' : '/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect(req.user.role === 'admin' ? '/admin' : '/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));
});

/* ==========================================================================
   Protected User Page Routes (Requires Login)
   ========================================================================== */
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/learning', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'learning.html'));
});

app.get('/my-learning', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'my-learning.html'));
});

app.get('/wishlist', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wishlist.html'));
});

app.get('/profile', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/settings', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

/* ==========================================================================
   Protected Admin Page Routes (Requires role = 'admin')
   ========================================================================== */
app.get('/admin', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/users', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-users.html'));
});

app.get('/admin/courses', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-courses.html'));
});

app.get('/admin/lessons', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-courses.html'));
});

app.get('/admin/analytics', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/settings', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-settings.html'));
});

/* ==========================================================================
   REST API Endpoints
   ========================================================================== */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CodeNest',
    database: 'MySQL (MariaDB 11.4)',
    auth: 'JWT HTTP-Only Cookie + bcrypt',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDb();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=================================================`);
      console.log(` CodeNest Platform is running on http://127.0.0.1:${PORT}`);
      console.log(` Port: ${PORT}`);
      console.log(` Database: Connected & Seeded`);
      console.log(` Real Auth: Active (Register, Login, Protected Routes)`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('[SERVER STARTUP ERROR]:', err);
    process.exit(1);
  }
}

startServer();
