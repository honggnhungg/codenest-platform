/**
 * CodeNest - Global Application Controller (Real Database & Auth Integration)
 * Handles Real Session State, Header Dropdowns, Logout, Toast Notifications
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Toast Notification Utility
  window.showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'error') icon = 'fa-times-circle';

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color: var(--${type === 'error' ? 'danger' : type}); font-size: 1.1rem;"></i>
      <span style="flex-grow: 1;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // 2. Real Logout Action
  window.handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      showToast('Đăng xuất thành công!', 'success');
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/login';
      }, 600);
    } catch (err) {
      window.location.href = '/login';
    }
  };

  // Real Enroll Course Action (Saves to database)
  window.enrollCourse = async (courseId) => {
    try {
      const res = await fetch('/api/user/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId })
      });

      if (res.status === 401) {
        showToast('Vui lòng đăng nhập để ghi danh khóa học!', 'warning');
        setTimeout(() => { window.location.href = '/login'; }, 1000);
        return;
      }

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đăng ký khóa học thành công!', 'success');
        setTimeout(() => {
          window.location.href = `/learning?course=${courseId}`;
        }, 800);
      } else {
        showToast(data.error || 'Không thể đăng ký khóa học.', 'error');
      }
    } catch (err) {
      showToast('Lỗi mạng khi kết nối máy chủ.', 'error');
    }
  };

  // 3. Real Auth State Check (/api/auth/me)
  let currentUser = null;
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        currentUser = data.user;
        window.CURRENT_AUTH_USER = currentUser;
      }
    }
  } catch (err) {
    currentUser = null;
  }

  // Update Header based on Auth State
  const headerActions = document.querySelector('.header-actions');
  const userMenuName = document.querySelector('.user-menu-name');
  const userMenuEmail = document.querySelector('.user-menu-email');
  const adminNavLinks = document.querySelectorAll('.nav-link[href="/admin"], .user-menu-item[href="/admin"]');

  if (currentUser) {
    if (window.CodeNestData && window.CodeNestData.currentUser) {
      window.CodeNestData.currentUser.name = currentUser.full_name;
      window.CodeNestData.currentUser.email = currentUser.email;
      window.CodeNestData.currentUser.username = currentUser.username;
    }

    // Authenticated user
    if (userMenuName) userMenuName.textContent = currentUser.full_name;
    if (userMenuEmail) userMenuEmail.textContent = currentUser.email;

    // Show/hide admin links
    adminNavLinks.forEach(link => {
      link.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
    });

    // Update greeting and name across pages
    document.querySelectorAll('.user-greeting-name, .hero-gradient-text').forEach(el => {
      if (el.textContent.includes('Alex') || el.closest('#dashboard-root') || el.classList.contains('user-greeting-name')) {
        el.textContent = currentUser.full_name;
      }
    });

    // Update profile page elements if present
    const profileFullName = document.getElementById('profile-full-name');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileRoleBadge = document.getElementById('profile-role-badge');
    const profileJoinedDate = document.getElementById('profile-joined-date');
    const profileAvatarCircle = document.getElementById('profile-avatar-circle');

    const initialLetter = (currentUser.full_name || currentUser.username || 'U').charAt(0).toUpperCase();

    if (profileFullName) profileFullName.textContent = currentUser.full_name;
    if (profileUsername) profileUsername.textContent = '@' + currentUser.username;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileRoleBadge) {
      profileRoleBadge.textContent = currentUser.role === 'admin' ? 'Quản trị viên (Admin)' : 'Học viên (User)';
      profileRoleBadge.className = `badge ${currentUser.role === 'admin' ? 'badge-purple' : 'badge-intermediate'}`;
    }
    if (profileAvatarCircle) profileAvatarCircle.textContent = initialLetter;

    // Format real joined date from database
    if (profileJoinedDate && currentUser.created_at) {
      const createdDate = new Date(currentUser.created_at);
      const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
      profileJoinedDate.textContent = `${monthNames[createdDate.getMonth()]}, ${createdDate.getFullYear()}`;
    }

    // Update Profile statistics from real database (/api/user/dashboard-data)
    const profileStatEnrolled = document.getElementById('profile-stat-enrolled');
    const profileStatCompleted = document.getElementById('profile-stat-completed');
    const profileStatHours = document.getElementById('profile-stat-hours');
    const profileStatStreak = document.getElementById('profile-stat-streak');

    if (profileStatEnrolled || profileStatCompleted) {
      fetch('/api/user/dashboard-data')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.stats) {
            if (profileStatEnrolled) profileStatEnrolled.textContent = data.stats.enrolledCourses;
            if (profileStatCompleted) profileStatCompleted.textContent = data.stats.completedCourses;
            if (profileStatHours) profileStatHours.textContent = `${data.stats.totalHours}h`;
            if (profileStatStreak) profileStatStreak.textContent = `${data.stats.currentStreak} ngày`;
          }
        })
        .catch(() => {});
    }

    // Replace header avatar image with personalized user letter badge
    const headerAvatarImg = document.querySelector('.user-avatar-btn .user-avatar-img');
    if (headerAvatarImg) {
      const avatarBadge = document.createElement('div');
      avatarBadge.style.width = '34px';
      avatarBadge.style.height = '34px';
      avatarBadge.style.borderRadius = '50%';
      avatarBadge.style.background = 'linear-gradient(135deg, var(--primary), var(--cyan))';
      avatarBadge.style.color = '#ffffff';
      avatarBadge.style.display = 'flex';
      avatarBadge.style.alignItems = 'center';
      avatarBadge.style.justifyContent = 'center';
      avatarBadge.style.fontWeight = '700';
      avatarBadge.style.fontSize = '0.9rem';
      avatarBadge.textContent = initialLetter;
      headerAvatarImg.replaceWith(avatarBadge);
    }

    // Populate Settings page form inputs if present
    const settingsEmail = document.getElementById('settings-email');
    const settingsUsername = document.getElementById('settings-username');
    const settingsFullName = document.getElementById('settings-fullname');
    const settingsAvatarCircle = document.getElementById('settings-avatar-circle');

    if (settingsEmail) settingsEmail.value = currentUser.email;
    if (settingsUsername) settingsUsername.value = currentUser.username;
    if (settingsFullName) settingsFullName.value = currentUser.full_name;
    if (settingsAvatarCircle) settingsAvatarCircle.textContent = initialLetter;
  } else {
    // Guest / Not logged in: Show Login / Register if user menu exists on public page
    const userMenuWrapper = document.querySelector('.user-menu-wrapper');
    if (userMenuWrapper && window.location.pathname === '/' || window.location.pathname === '/courses') {
      userMenuWrapper.innerHTML = `
        <div style="display: flex; gap: 8px;">
          <a href="/login" class="btn btn-outline btn-sm">Đăng nhập</a>
          <a href="/register" class="btn btn-primary btn-sm">Đăng ký</a>
        </div>
      `;
    }
    adminNavLinks.forEach(link => link.style.display = 'none');
  }

  // Bind logout buttons
  document.querySelectorAll('a[href="/login"]').forEach(btn => {
    if (btn.textContent.includes('Logout') || btn.textContent.includes('Đăng xuất')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.handleLogout();
      });
    }
  });

  // 4. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 5. Mobile Hamburger Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // 6. Notification Dropdown Toggle
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  const notifClearBtn = document.getElementById('notif-clear-btn');
  const notifList = document.getElementById('notif-list');
  const notifBadge = document.getElementById('notif-badge');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('show');
      const userDropdown = document.getElementById('user-menu-dropdown');
      if (userDropdown) userDropdown.classList.remove('show');
    });

    if (notifClearBtn && notifList) {
      notifClearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const unreadItems = notifList.querySelectorAll('.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        if (notifBadge) notifBadge.style.display = 'none';
        showToast('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
      });
    }
  }

  // 7. User Profile Menu Dropdown Toggle
  const userAvatarBtn = document.getElementById('user-avatar-btn');
  const userMenuDropdown = document.getElementById('user-menu-dropdown');

  if (userAvatarBtn && userMenuDropdown) {
    userAvatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenuDropdown.classList.toggle('show');
      if (notifDropdown) notifDropdown.classList.remove('show');
    });
  }

  // Global click outside to close dropdowns
  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.classList.remove('show');
    if (userMenuDropdown) userMenuDropdown.classList.remove('show');
  });

  // 8. Render Notifications from Data Store
  if (notifList && window.CodeNestData) {
    const notifs = CodeNestData.notifications;
    notifList.innerHTML = notifs.map(n => `
      <li class="notif-item ${!n.read ? 'unread' : ''}" onclick="this.classList.remove('unread');">
        <div class="notif-item-icon" style="background-color: ${n.color};">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div class="notif-item-content">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
          <div class="notif-item-time">${n.time}</div>
        </div>
      </li>
    `).join('');
  }
});
