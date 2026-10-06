/**
 * CodeNest - Student Dashboard Controller (Real Database Integration)
 * Renders Real User Enrollments, Real Statistics, Dynamic Welcome/Continue Learning
 */

document.addEventListener('DOMContentLoaded', async () => {
  const dashRoot = document.getElementById('dashboard-root');
  if (!dashRoot || !window.CodeNestData) return;

  // 1. Fetch real user dashboard data from database
  let dbStats = { enrolledCourses: 0, completedCourses: 0, totalHours: 0, currentStreak: 0 };
  let enrollments = [];

  try {
    const res = await fetch('/api/user/dashboard-data');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        dbStats = data.stats;
        enrollments = data.enrollments || [];
      }
    }
  } catch (err) {
    console.warn('[DASHBOARD] Could not fetch real dashboard data:', err);
  }

  // Determine user display name
  const currentUser = window.CURRENT_AUTH_USER;
  const displayName = (currentUser && currentUser.full_name) ? currentUser.full_name : 'Học viên';

  // 2. Prepare Continue Learning Banner
  let continueBannerHtml = '';
  if (enrollments.length > 0) {
    // User has real enrolled courses
    const latestEnrollment = enrollments[0];
    const course = CodeNestData.courses.find(c => c.id === latestEnrollment.course_id) || {
      title: latestEnrollment.course_id,
      category: 'Lập trình',
      duration: 'Tự học'
    };

    continueBannerHtml = `
      <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-sm); margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          <span class="badge badge-intermediate" style="margin-bottom: 10px;">Đang học gần nhất</span>
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">${course.title}</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 16px;">
            Tiếp tục bài học dở để hoàn thành mục tiêu học tập của bạn.
          </p>
          <div class="progress-container" style="max-width: 460px;">
            <div class="progress-header">
              <span>Tiến độ hoàn thành</span>
              <strong>${latestEnrollment.progress}%</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width: ${latestEnrollment.progress}%;"></div>
            </div>
          </div>
        </div>
        <div>
          <a href="/learning?course=${latestEnrollment.course_id}" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-play"></i> Tiếp tục học bài
          </a>
        </div>
      </div>
    `;
  } else {
    // New user with 0 enrollments: Show welcome onboarding banner
    continueBannerHtml = `
      <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(6, 182, 212, 0.05)); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 36px; box-shadow: var(--shadow-sm); margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          <span class="badge badge-beginner" style="margin-bottom: 10px;"><i class="fa-solid fa-sparkles"></i> Tài khoản mới sẵn sàng</span>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary);">
            Chào mừng bạn đến với CodeNest!
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.98rem; margin-bottom: 18px; line-height: 1.6; max-width: 600px;">
            Bạn chưa đăng ký khóa học nào. Hãy bắt đầu chọn khóa học đầu tiên để kích hoạt lộ trình học tập, thực hành code và nhận chứng nhận!
          </p>
          <div style="display: flex; gap: 16px; font-size: 0.88rem; color: var(--text-muted); flex-wrap: wrap;">
            <span><i class="fa-solid fa-circle-check" style="color: var(--success); margin-right: 6px;"></i>100% Miễn phí</span>
            <span><i class="fa-solid fa-circle-check" style="color: var(--success); margin-right: 6px;"></i>Lộ trình thực chiến</span>
            <span><i class="fa-solid fa-circle-check" style="color: var(--success); margin-right: 6px;"></i>Cấp chứng nhận hoàn thành</span>
          </div>
        </div>
        <div>
          <a href="/courses" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
            <i class="fa-solid fa-compass"></i> Khám phá khóa học ngay
          </a>
        </div>
      </div>
    `;
  }

  // 3. Prepare Enrolled Courses Grid
  let enrolledCardsHtml = '';
  if (enrollments.length > 0) {
    enrolledCardsHtml = enrollments.map(item => {
      const course = CodeNestData.courses.find(c => c.id === item.course_id) || {
        id: item.course_id,
        title: item.course_id,
        category: 'Development',
        level: 'All Levels',
        duration: 'Tự học',
        thumbnailBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
        iconClass: 'fa-code'
      };

      return `
        <div class="course-card">
          <div class="course-card-thumb" style="background: ${course.thumbnailBg}; height: 140px;">
            <i class="fa-brands ${course.iconClass}" style="font-size: 2.8rem;"></i>
          </div>
          <div class="course-card-body">
            <div class="course-card-meta-top">
              <span class="course-card-category">${course.category}</span>
              <span class="badge badge-intermediate">${course.level}</span>
            </div>
            <h3 class="course-card-title">
              <a href="/learning?course=${course.id}">${course.title}</a>
            </h3>
            <div class="progress-container">
              <div class="progress-header">
                <span>Tiến độ</span>
                <strong>${item.progress}%</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${item.progress}%;"></div>
              </div>
            </div>
          </div>
          <div class="course-card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              <i class="fa-regular fa-clock"></i> ${course.duration}
            </span>
            <a href="/learning?course=${course.id}" class="btn btn-primary btn-sm">
              Học tiếp →
            </a>
          </div>
        </div>
      `;
    }).join('');
  } else {
    enrolledCardsHtml = `
      <div style="text-align: center; padding: 50px 24px; background: #ffffff; border: 1px dashed var(--border-subtle); border-radius: var(--radius-xl); grid-column: 1 / -1;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 16px;">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">Chưa có khóa học nào được ghi danh</h4>
        <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 480px; margin: 0 auto 20px;">
          Các khóa học bạn đăng ký sẽ hiển thị tại đây để bạn có thể tiếp tục bài học bất cứ khi nào.
        </p>
        <a href="/courses" class="btn btn-outline btn-sm">
          <i class="fa-solid fa-magnifying-glass"></i> Chọn khóa học bắt đầu học
        </a>
      </div>
    `;
  }

  // 4. Render Whole Dashboard
  dashRoot.innerHTML = `
    <!-- Welcome Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-primary);">
          Welcome back, <span class="hero-gradient-text">${displayName}</span> 👋
        </h1>
        <p style="color: var(--text-secondary); font-size: 1.05rem; margin-top: 4px;">
          Hôm nay là một ngày tuyệt vời để tiếp tục xây dựng sự nghiệp lập trình của bạn!
        </p>
      </div>
      <div>
        <a href="/courses" class="btn btn-outline">
          <i class="fa-solid fa-magnifying-glass"></i> Khám phá thêm khóa học
        </a>
      </div>
    </div>

    <!-- Statistics Row (Real Database Values) -->
    <div class="dash-stats-row">
      <div class="dash-stat-box">
        <div class="dash-stat-icon-wrap" style="background: var(--primary-light); color: var(--primary);">
          <i class="fa-solid fa-book-open-reader"></i>
        </div>
        <div>
          <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-mono);">${dbStats.enrolledCourses}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Khóa học đã đăng ký</div>
        </div>
      </div>

      <div class="dash-stat-box">
        <div class="dash-stat-icon-wrap" style="background: var(--success-light); color: var(--success);">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div>
          <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-mono);">${dbStats.completedCourses}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Khóa học hoàn thành</div>
        </div>
      </div>

      <div class="dash-stat-box">
        <div class="dash-stat-icon-wrap" style="background: var(--cyan-light); color: var(--cyan);">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div>
          <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-mono);">${dbStats.totalHours}h</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Thời lượng học tập</div>
        </div>
      </div>

      <div class="dash-stat-box">
        <div class="dash-stat-icon-wrap" style="background: var(--warning-light); color: var(--warning);">
          <i class="fa-solid fa-fire"></i>
        </div>
        <div>
          <div style="font-size: 1.6rem; font-weight: 800; font-family: var(--font-mono);">${dbStats.currentStreak} ngày</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Chuỗi học tập liên tục</div>
        </div>
      </div>
    </div>

    <!-- Continue Learning Banner Card (Dynamic) -->
    ${continueBannerHtml}

    <!-- Enrolled Courses Grid -->
    <div style="margin-bottom: 48px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <h3 style="font-size: 1.4rem; font-weight: 800;">Khóa học đang học (Enrolled Courses)</h3>
        <a href="/my-learning" style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">Xem tất cả →</a>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
        ${enrolledCardsHtml}
      </div>
    </div>

    <!-- Recent Activity Timeline & Recommended Courses -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
      <!-- Recent Activity -->
      <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 26px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 20px;">
          <i class="fa-solid fa-clock-rotate-left" style="color: var(--primary); margin-right: 8px;"></i>
          Hoạt động gần đây (Recent Activity)
        </h3>
        ${enrollments.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${enrollments.slice(0, 3).map(e => `
              <div style="display: flex; gap: 12px; font-size: 0.9rem;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 6px;"></div>
                <div>
                  <div style="font-weight: 600;">Đã ghi danh khóa học: ${e.course_id}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${new Date(e.enrolled_at || Date.now()).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align: center; padding: 20px 0; color: var(--text-muted); font-size: 0.88rem;">
            <i class="fa-regular fa-clock" style="font-size: 1.4rem; margin-bottom: 8px; opacity: 0.5;"></i>
            <div>Chưa có hoạt động học tập nào.</div>
          </div>
        `}
      </div>

      <!-- Recommended Courses -->
      <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 26px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 20px;">
          <i class="fa-solid fa-compass" style="color: var(--cyan); margin-right: 8px;"></i>
          Gợi ý dành cho bạn (Recommended)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">JavaScript Fundamentals: From Zero to Modern Hero</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Web Development • Beginner</div>
            </div>
            <a href="/course?id=js-fundamentals" class="btn btn-outline btn-sm">Xem khóa học</a>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">Python for Beginners: Data Structures &amp; Automation</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Python • Beginner</div>
            </div>
            <a href="/course?id=python-beginners" class="btn btn-outline btn-sm">Xem khóa học</a>
          </div>
        </div>
      </div>
    </div>
  `;
});
