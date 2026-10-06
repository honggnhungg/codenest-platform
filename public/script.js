// CodeNest Client-side Interactivity (Frontend Skeleton Stage)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Reusable Toast Notification
  const showToast = (message, icon = 'ℹ️') => {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };

  // 4. Mock Login Form Handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Đang ở giai đoạn Frontend Skeleton (Chưa kích hoạt Authentication thật). Đang chuyển hướng sang Dashboard...', '🚀');
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1200);
    });

    const demoStudentBtn = document.getElementById('fill-demo-student');
    if (demoStudentBtn) {
      demoStudentBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        if (emailInput) emailInput.value = 'student@codenest.dev';
        if (passInput) passInput.value = 'password123';
        showToast('Đã điền tài khoản mẫu Student!', '✨');
      });
    }

    const demoAdminBtn = document.getElementById('fill-demo-admin');
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        if (emailInput) emailInput.value = 'admin@codenest.dev';
        if (passInput) passInput.value = 'admin123';
        showToast('Đã điền tài khoản mẫu Admin!', '🔑');
      });
    }
  }

  // 5. Mock Register Form Handling
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('reg-password')?.value;
      const confirmPass = document.getElementById('reg-confirm-password')?.value;

      if (pass && confirmPass && pass !== confirmPass) {
        showToast('Mật khẩu xác nhận không khớp!', '⚠️');
        return;
      }

      showToast('Đăng ký mô phỏng thành công! Chuyển hướng về trang Đăng nhập...', '🎉');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1400);
    });
  }

  // 6. Admin Dashboard Tabs Switching
  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabPanels = document.querySelectorAll('.admin-tab-panel');

  if (adminTabBtns.length > 0) {
    adminTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminTabPanels.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) {
          activePanel.style.display = 'block';
        }
      });
    });
  }

  // 7. Course Curriculum Accordion Toggle
  const curriculumHeaders = document.querySelectorAll('.curriculum-section-header');
  curriculumHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      const list = section.querySelector('.curriculum-lessons-list');
      if (list) {
        if (list.style.display === 'none') {
          list.style.display = 'block';
          header.querySelector('.accordion-arrow').textContent = '▼';
        } else {
          list.style.display = 'none';
          header.querySelector('.accordion-arrow').textContent = '▶';
        }
      }
    });
  });

  // 8. Server Health Check API
  fetch('/api/health')
    .then(res => res.json())
    .then(data => {
      const serverStatusEl = document.getElementById('server-status-pill');
      if (serverStatusEl) {
        serverStatusEl.textContent = `Online (${data.platform} v1.0)`;
      }
    })
    .catch(() => {
      // silently fail if local preview
    });
});
