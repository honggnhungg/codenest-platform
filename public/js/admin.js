/**
 * CodeNest - Admin Management Console Controller (Real Database Integration)
 * Handles Real Users Management Table, Status Toggle, Real Stats & Courses
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Admin Dashboard Stats & Recent Users (/admin)
  // =========================================================================
  const statTotalUsers = document.getElementById('admin-stat-total-users');
  const statActiveUsers = document.getElementById('admin-stat-active-users');
  const recentUsersList = document.getElementById('admin-recent-users-list');

  const loadAdminDashboardData = async () => {
    try {
      // 1. Fetch real statistics
      if (statTotalUsers || statActiveUsers) {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            if (statTotalUsers) statTotalUsers.textContent = data.stats.totalUsers.toLocaleString();
            if (statActiveUsers) statActiveUsers.textContent = data.stats.activeUsers.toLocaleString();
          }
        }
      }

      // 2. Fetch recent users for dashboard preview
      if (recentUsersList) {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.users) {
            const users = data.users.slice(0, 5); // Take first 5
            if (users.length === 0) {
              recentUsersList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px;">Chưa có tài khoản người dùng nào trong database.</div>`;
            } else {
              recentUsersList.innerHTML = users.map(u => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                      ${(u.full_name || u.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 0.9rem;">${u.full_name} <span style="font-weight: 400; color: var(--text-muted); font-size: 0.8rem;">(@${u.username})</span></div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${u.email}</div>
                    </div>
                  </div>
                  <div>
                    <span class="badge ${u.role === 'admin' ? 'badge-purple' : 'badge-intermediate'}" style="font-size: 0.72rem; margin-right: 6px;">${u.role}</span>
                    <span class="badge ${u.status === 'active' ? 'badge-beginner' : 'badge-advanced'}" style="font-size: 0.72rem;">${u.status}</span>
                  </div>
                </div>
              `).join('');
            }
          }
        }
      }
    } catch (err) {
      console.error('[ADMIN JS ERROR]:', err);
    }
  };

  if (statTotalUsers || recentUsersList) {
    loadAdminDashboardData();
  }

  // =========================================================================
  // 2. Admin Users Table Controller (/admin/users)
  // =========================================================================
  const usersTableBody = document.getElementById('admin-users-tbody');
  const userSearchInput = document.getElementById('admin-user-search');
  const userRoleFilter = document.getElementById('admin-user-role-filter');

  if (usersTableBody) {
    const fetchAndRenderUsers = async () => {
      try {
        const term = userSearchInput ? userSearchInput.value.trim() : '';
        const role = userRoleFilter ? userRoleFilter.value : 'all';

        usersTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
              <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.2rem; color: var(--primary);"></i>
              <div style="margin-top: 8px;">Đang tải danh sách tài khoản từ database...</div>
            </td>
          </tr>
        `;

        const queryParams = new URLSearchParams();
        if (term) queryParams.append('search', term);
        if (role && role !== 'all') queryParams.append('role', role);

        const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error('Không thể kết nối đến máy chủ.');
        }

        const data = await res.json();
        if (!data.success || !data.users || data.users.length === 0) {
          usersTableBody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-user-slash" style="font-size: 1.8rem; margin-bottom: 8px; opacity: 0.5;"></i>
                <div>Không tìm thấy người dùng nào trong cơ sở dữ liệu.</div>
              </td>
            </tr>
          `;
          return;
        }

        usersTableBody.innerHTML = data.users.map(u => {
          const createdDate = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }) : '--';

          const roleBadgeClass = u.role === 'admin' ? 'badge-purple' : 'badge-intermediate';
          const statusBadgeClass = u.status === 'active' ? 'badge-beginner' : 'badge-advanced';

          return `
            <tr>
              <td><span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">#${u.id}</span></td>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                    ${(u.full_name || u.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style="color: var(--text-primary); font-size: 0.92rem;">${u.full_name}</strong>
                  </div>
                </div>
              </td>
              <td>
                <code style="background: var(--bg-surface-alt); padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; color: var(--primary);">@${u.username}</code>
              </td>
              <td style="font-size: 0.88rem; color: var(--text-secondary);">${u.email}</td>
              <td>
                <span class="badge ${roleBadgeClass}">
                  ${u.role}
                </span>
              </td>
              <td>
                <span class="badge ${statusBadgeClass}">
                  ${u.status}
                </span>
              </td>
              <td style="font-size: 0.85rem; color: var(--text-muted);">${createdDate}</td>
              <td style="text-align: right;">
                <div style="display: inline-flex; gap: 6px;">
                  <button class="btn btn-outline btn-sm" onclick="showToast('Xem thông tin: ${u.full_name} (@${u.username})', 'success')" title="Xem chi tiết">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="toggleUserStatus(${u.id}, '${u.status}')" title="${u.status === 'active' ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}">
                    <i class="fa-solid ${u.status === 'active' ? 'fa-ban' : 'fa-check'}" style="color: ${u.status === 'active' ? 'var(--warning)' : 'var(--success)'};"></i>
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="deleteUserAccount(${u.id}, '${u.username}')" title="Xóa tài khoản khỏi database">
                    <i class="fa-solid fa-trash" style="color: var(--danger);"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      } catch (err) {
        usersTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 30px; color: var(--danger);">
              <i class="fa-solid fa-triangle-exclamation"></i> Lỗi kết nối database khi tải danh sách người dùng.
            </td>
          </tr>
        `;
      }
    };

    // Toggle user status (active <-> disabled) via real API
    window.toggleUserStatus = async (userId, currentStatus) => {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      const actionName = newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa';
      if (!confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản #${userId}?`)) return;

      try {
        const res = await fetch(`/api/admin/users/${userId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Cập nhật trạng thái thành công!', 'success');
          fetchAndRenderUsers();
        } else {
          showToast(data.error || 'Không thể cập nhật trạng thái.', 'error');
        }
      } catch (err) {
        showToast('Lỗi mạng khi cập nhật trạng thái.', 'error');
      }
    };

    // Delete user via real API
    window.deleteUserAccount = async (userId, username) => {
      if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản @${username} (ID: ${userId}) khỏi database không? Hành động này không thể hoàn tác.`)) return;

      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã xóa người dùng!', 'warning');
          fetchAndRenderUsers();
        } else {
          showToast(data.error || 'Không thể xóa người dùng.', 'error');
        }
      } catch (err) {
        showToast('Lỗi mạng khi xóa người dùng.', 'error');
      }
    };

    // Debounce search input
    let searchTimeout = null;
    if (userSearchInput) {
      userSearchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(fetchAndRenderUsers, 300);
      });
    }

    if (userRoleFilter) {
      userRoleFilter.addEventListener('change', fetchAndRenderUsers);
    }

    fetchAndRenderUsers();
  }

  // =========================================================================
  // 3. Admin Courses Table Controller (/admin/courses)
  // =========================================================================
  const coursesTableBody = document.getElementById('admin-courses-tbody');
  const courseSearchInput = document.getElementById('admin-course-search');

  if (coursesTableBody && window.CodeNestData) {
    const renderAdminCourses = () => {
      let courses = [...CodeNestData.courses];
      const term = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : '';

      if (term) {
        courses = courses.filter(c => c.title.toLowerCase().includes(term) || c.category.toLowerCase().includes(term));
      }

      coursesTableBody.innerHTML = courses.map(c => `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${c.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${c.lessonsCount} bài học • ${c.duration}</div>
          </td>
          <td><span class="badge badge-all">${c.category}</span></td>
          <td><span class="badge badge-intermediate">${c.level}</span></td>
          <td><strong>${c.studentsCount.toLocaleString()}</strong></td>
          <td><span class="badge badge-beginner">Published</span></td>
          <td>${c.lastUpdated}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <a href="/course?id=${c.id}" class="btn btn-outline btn-sm" title="Xem trước">
                <i class="fa-solid fa-eye"></i>
              </a>
              <button class="btn btn-outline btn-sm" onclick="showToast('Mở trình chỉnh sửa khóa học: ${c.title}', 'success')" title="Chỉnh sửa">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-outline btn-sm" onclick="showToast('Khóa học đã chuyển sang trạng thái Unpublish', 'warning')" title="Gỡ xuất bản">
                <i class="fa-solid fa-eye-slash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    };

    if (courseSearchInput) courseSearchInput.addEventListener('input', renderAdminCourses);
    renderAdminCourses();
  }
});
