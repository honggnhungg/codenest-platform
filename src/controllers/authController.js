const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'CodeNest_Jwt_Secret_Key_98234710293847120938';

/**
 * Register a new user:
 * Validates data, enforces role='user', hashes password, saves to DB.
 */
async function register(req, res) {
  try {
    const full_name = req.body.full_name || req.body.fullName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword || req.body.confirm_password;

    // 1. Validate required fields
    if (!full_name || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
    }

    const trimmedFullName = full_name.trim();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedFullName.length < 2) {
      return res.status(400).json({ success: false, error: 'Họ và tên phải có tối thiểu 2 ký tự.' });
    }

    if (trimmedUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return res.status(400).json({ success: false, error: 'Tên đăng nhập tối thiểu 3 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, error: 'Địa chỉ email không đúng định dạng.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Mật khẩu xác nhận không khớp.' });
    }

    // 2. Check if email already exists
    const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [trimmedEmail]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ success: false, error: 'Địa chỉ email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.' });
    }

    // 3. Check if username already exists
    const [userCheck] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [trimmedUsername]);
    if (userCheck.length > 0) {
      return res.status(400).json({ success: false, error: 'Tên đăng nhập này đã tồn tại. Vui lòng chọn tên đăng nhập khác.' });
    }

    // 4. Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save to database: strictly role = 'user'
    const [result] = await pool.query(
      'INSERT INTO users (full_name, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [trimmedFullName, trimmedUsername, trimmedEmail, hashedPassword, 'user', 'active']
    );

    const newUserId = result.insertId;

    // Do NOT auto-login. Require user to log in with their newly created credentials.
    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập để bắt đầu học tập.',
      redirectUrl: '/login?registered=success',
      user: {
        id: newUserId,
        full_name: trimmedFullName,
        username: trimmedUsername,
        email: trimmedEmail,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR - REGISTER]:', err);
    return res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng ký tài khoản. Vui lòng thử lại.' });
  }
}

/**
 * Login user/admin:
 * Validates credentials against DB, issues JWT cookie, determines redirect path.
 */
async function login(req, res) {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' });
    }

    const trimmedIdentifier = email.trim().toLowerCase();

    // Query user by email OR username
    const [users] = await pool.query(
      'SELECT id, full_name, username, email, password, role, status FROM users WHERE email = ? OR username = ? LIMIT 1',
      [trimmedIdentifier, trimmedIdentifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const user = users[0];

    // Check account status
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên.' });
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Determine cookie expiration
    const expiresIn = remember ? '30d' : '1d';
    const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'lax',
      maxAge
    });

    // Determine destination redirect
    const redirectUrl = user.role === 'admin' ? '/admin' : '/dashboard';

    return res.json({
      success: true,
      message: 'Đăng nhập thành công! Đang chuyển hướng...',
      redirectUrl,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[AUTH ERROR - LOGIN]:', err);
    return res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng nhập. Vui lòng thử lại.' });
  }
}

/**
 * Logout:
 * Clears authentication token cookie.
 */
function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax'
  });
  return res.json({ success: true, message: 'Đăng xuất thành công.', redirectUrl: '/login' });
}

/**
 * Get current authenticated user profile
 */
function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, user: null });
  }
  return res.json({ success: true, user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  me
};
