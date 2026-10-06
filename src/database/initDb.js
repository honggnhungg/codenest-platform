const pool = require('./db');
const bcrypt = require('bcryptjs');

async function initDb() {
  try {
    const connection = await pool.getConnection();
    console.log('[DATABASE] MySQL connection established successfully.');

    // 1. Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        username VARCHAR(80) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createUsersTableQuery);
    console.log('[DATABASE] Table "users" checked/created successfully.');

    // 2. Create enrollments table
    const createEnrollmentsTableQuery = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id VARCHAR(100) NOT NULL,
        progress INT DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        last_lesson_id VARCHAR(100),
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_course (user_id, course_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await connection.query(createEnrollmentsTableQuery);
    console.log('[DATABASE] Table "enrollments" checked/created successfully.');

    // 2. Seed initial Admin account if none exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@codenest.dev';
    const [existingAdmins] = await connection.query(
      'SELECT id, username, email FROM users WHERE role = ? OR email = ? LIMIT 1',
      ['admin', adminEmail]
    );

    if (existingAdmins.length === 0) {
      const adminName = process.env.ADMIN_NAME || 'Platform Administrator';
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const rawAdminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawAdminPassword, salt);

      await connection.query(
        'INSERT INTO users (full_name, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [adminName, adminUsername, adminEmail, hashedPassword, 'admin', 'active']
      );
      console.log(`[DATABASE] Initial seed Admin account created for: ${adminEmail}`);
    } else {
      console.log('[DATABASE] Admin account already exists. Skipping seed.');
    }

    connection.release();
    return true;
  } catch (err) {
    console.error('[DATABASE ERROR] Failed to initialize database:', err.message);
    throw err;
  }
}

if (require.main === module) {
  require('dotenv').config();
  initDb()
    .then(() => {
      console.log('Database init complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = initDb;

