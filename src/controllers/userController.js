const pool = require('../database/db');

/**
 * Get current user dashboard statistics and real enrollments from database
 */
async function getDashboardData(req, res) {
  try {
    const userId = req.user.id;

    // Fetch user enrollments from database
    const [enrollments] = await pool.query(
      'SELECT id, course_id, progress, is_completed, last_lesson_id, enrolled_at, updated_at FROM enrollments WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );

    const enrolledCount = enrollments.length;
    const completedCount = enrollments.filter(e => e.is_completed).length;

    // For real users: If they just registered and have 0 enrollments, all stats are 0
    const totalHours = enrolledCount === 0 ? 0 : parseFloat((enrollments.reduce((acc, curr) => acc + (curr.progress * 0.15), 1.5)).toFixed(1));
    const currentStreak = enrolledCount === 0 ? 0 : 1;

    return res.json({
      success: true,
      stats: {
        enrolledCourses: enrolledCount,
        completedCourses: completedCount,
        totalHours,
        currentStreak
      },
      enrollments
    });
  } catch (err) {
    console.error('[USER ERROR - DASHBOARD DATA]:', err);
    return res.status(500).json({ success: false, error: 'Không thể tải dữ liệu bảng điều khiển.' });
  }
}

/**
 * Enroll user into a course
 */
async function enrollCourse(req, res) {
  try {
    const userId = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ success: false, error: 'Thiếu mã khóa học (course_id).' });
    }

    await pool.query(
      `INSERT INTO enrollments (user_id, course_id, progress, is_completed)
       VALUES (?, ?, 0, FALSE)
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
      [userId, course_id]
    );

    return res.json({
      success: true,
      message: 'Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.'
    });
  } catch (err) {
    console.error('[USER ERROR - ENROLL]:', err);
    return res.status(500).json({ success: false, error: 'Lỗi khi đăng ký khóa học.' });
  }
}

module.exports = {
  getDashboardData,
  enrollCourse
};
