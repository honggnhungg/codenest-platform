/**
 * CodeNest - Course Detail Controller
 * Renders Course Information, Instructor, Syllabus Accordion and Dynamic Enrollment
 */

document.addEventListener('DOMContentLoaded', async () => {
  const detailContainer = document.getElementById('course-detail-container');
  if (!detailContainer || !window.CodeNestData) return;

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id') || 'js-fundamentals';
  const course = CodeNestData.courses.find(c => c.id === courseId) || CodeNestData.courses[0];
  
  // Check real enrollment from database
  let enrollment = null;
  try {
    const res = await fetch('/api/user/dashboard-data');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.enrollments) {
        enrollment = data.enrollments.find(e => e.course_id === course.id);
      }
    }
  } catch (e) {
    enrollment = null;
  }

  const user = CodeNestData.currentUser;
  const isWishlisted = user && user.wishlist ? user.wishlist.includes(course.id) : false;

  let levelBadgeClass = 'badge-beginner';
  if (course.level === 'Intermediate') levelBadgeClass = 'badge-intermediate';
  if (course.level === 'Advanced') levelBadgeClass = 'badge-advanced';
  if (course.level === 'All Levels') levelBadgeClass = 'badge-all';

  detailContainer.innerHTML = `
    <!-- Top Hero Header -->
    <div class="course-detail-hero">
      <div class="container">
        <div class="course-hero-badge-wrap">
          <span class="badge ${levelBadgeClass}">${course.level}</span>
          <span style="color: var(--text-muted);">•</span>
          <span style="font-weight: 700; color: var(--primary); font-size: 0.88rem; text-transform: uppercase;">${course.category}</span>
          <span style="color: var(--text-muted);">•</span>
          <span style="font-size: 0.88rem; color: var(--text-secondary);"><i class="fa-solid fa-clock"></i> ${course.duration}</span>
        </div>

        <h1 class="course-detail-title">${course.title}</h1>
        <p class="course-detail-desc">${course.description}</p>

        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div class="course-instructor-inline" style="margin-bottom: 0;">
            <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="course-instructor-avatar">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem;">${course.instructor.name}</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">${course.instructor.title}</div>
            </div>
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary);">
            ⭐ <strong>${course.rating}</strong> (${course.reviewsCount.toLocaleString()} đánh giá)
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary);">
            👥 <strong>${course.studentsCount.toLocaleString()}</strong> học viên ghi danh
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content & Sidebar Layout -->
    <div class="container">
      <div class="course-detail-layout">
        <!-- Left: Course Details, Learning Outcomes, Curriculum -->
        <div>
          <!-- What You'll Learn -->
          <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 30px; margin-bottom: 32px;">
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 20px;">
              <i class="fa-solid fa-graduation-cap" style="color: var(--primary); margin-right: 8px;"></i>
              Bạn sẽ học được gì trong khóa học này?
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
              ${course.whatYouWillLearn.map(item => `
                <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
                  <i class="fa-solid fa-check" style="color: var(--success); margin-top: 4px;"></i>
                  <span>${item}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Requirements -->
          <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px 30px; margin-bottom: 32px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 12px;">Yêu cầu tiên quyết:</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: var(--text-secondary);">
              ${course.requirements.map(req => `
                <li style="display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-circle-dot" style="font-size: 0.6rem; color: var(--primary);"></i>
                  <span>${req}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Curriculum Accordion -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <h3 style="font-size: 1.35rem; font-weight: 800;">Giáo trình khóa học</h3>
              <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
                ${course.curriculum.length} Chương • ${course.lessonsCount} Bài học
              </span>
            </div>

            <div class="accordion" id="curriculum-accordion">
              ${course.curriculum.map((section, idx) => `
                <div class="accordion-item">
                  <div class="accordion-header" onclick="this.parentElement.querySelector('.accordion-content').classList.toggle('d-none');">
                    <span>${section.title}</span>
                    <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
                      ${section.lessons.length} bài học ▼
                    </span>
                  </div>
                  <div class="accordion-content ${idx > 1 ? 'd-none' : ''}">
                    ${section.lessons.map(lesson => {
                      const isDone = user.completedLessons.includes(lesson.id);
                      return `
                        <div class="lesson-list-item">
                          <div class="lesson-list-item-left">
                            <i class="fa-${isDone ? 'solid fa-circle-check' : 'regular fa-circle-play'}" 
                               style="color: ${isDone ? 'var(--success)' : 'var(--primary)'}; font-size: 1.1rem;"></i>
                            <span style="font-weight: 500;">${lesson.title}</span>
                          </div>
                          <div style="display: flex; align-items: center; gap: 12px;">
                            ${lesson.free ? '<span class="badge badge-all">Học thử</span>' : ''}
                            <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${lesson.duration}</span>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Action Card -->
        <div>
          <div class="course-sidebar-card">
            <div class="course-sidebar-thumb" style="background: ${course.thumbnailBg};">
              <i class="fa-brands ${course.iconClass}"></i>
            </div>
            <div class="course-sidebar-body">
              ${enrollment ? `
                <div style="margin-bottom: 20px;">
                  <span class="badge badge-intermediate">Đang theo học</span>
                  <div class="progress-container" style="margin-top: 14px;">
                    <div class="progress-header">
                      <span>Tiến độ cá nhân</span>
                      <strong style="color: var(--primary);">${enrollment.progress}%</strong>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-bar-fill" style="width: ${enrollment.progress}%;"></div>
                    </div>
                  </div>
                </div>

                <a href="/learning?course=${course.id}" class="btn btn-primary btn-block btn-lg" style="margin-bottom: 12px;">
                  <i class="fa-solid fa-play"></i> Tiếp tục học bài
                </a>
              ` : `
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                    Miễn phí 100%
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">
                    Đăng ký mở khóa toàn bộ bài học &amp; tài liệu thực hành.
                  </p>
                </div>

                <button class="btn btn-primary btn-block btn-lg" onclick="enrollCourse('${course.id}')" style="margin-bottom: 12px;">
                  <i class="fa-solid fa-graduation-cap"></i> Đăng ký khóa học ngay
                </button>
              `}

              <button 
                class="btn btn-outline btn-block wishlist-btn-${course.id} ${isWishlisted ? 'active' : ''}" 
                onclick="toggleWishlist('${course.id}', event)"
              >
                <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart" style="color: var(--danger);"></i>
                ${isWishlisted ? 'Đã lưu yêu thích' : 'Lưu vào danh sách yêu thích'}
              </button>

              <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem; color: var(--text-secondary);">
                <div><i class="fa-solid fa-infinity" style="color: var(--primary); margin-right: 8px;"></i> Quyền truy cập trọn đời</div>
                <div><i class="fa-solid fa-mobile-screen" style="color: var(--primary); margin-right: 8px;"></i> Học trên mọi thiết bị</div>
                <div><i class="fa-solid fa-certificate" style="color: var(--primary); margin-right: 8px;"></i> Chứng nhận hoàn thành khóa học</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});
