const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'CodeNest_Jwt_Secret_Key_98234710293847120938';

/**
 * Optional authentication middleware:
 * Attaches user to req.user if a valid token is present.
 */
async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user exists and is active in database
    const [rows] = await pool.query(
      'SELECT id, full_name, username, email, role, status, created_at FROM users WHERE id = ? LIMIT 1',
      [decoded.userId]
    );

    if (rows.length === 0 || rows[0].status !== 'active') {
      req.user = null;
      res.clearCookie('token');
      return next();
    }

    req.user = rows[0];
    next();
  } catch (err) {
    req.user = null;
    res.clearCookie('token');
    next();
  }
}

/**
 * Require logged-in user:
 * Redirects to /login for page requests or returns 401 for API requests.
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    if (req.path.startsWith('/api/') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Vui lòng đăng nhập để tiếp tục.' });
    }
    return res.redirect('/login');
  }
  next();
}

/**
 * Require admin role:
 * Redirects to /dashboard or returns 403 Forbidden if user is not admin.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    if (req.path.startsWith('/api/') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Yêu cầu đăng nhập tài khoản quản trị.' });
    }
    return res.redirect('/login');
  }

  if (req.user.role !== 'admin') {
    if (req.path.startsWith('/api/') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(403).json({ success: false, error: 'Forbidden: Bạn không có quyền truy cập khu vực quản trị viên.' });
    }
    return res.redirect('/dashboard');
  }

  next();
}

module.exports = {
  authenticate,
  requireAuth,
  requireAdmin
};
