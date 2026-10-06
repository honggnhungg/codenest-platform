/**
 * CodeNest - Courses Marketplace Controller
 * Handles Search, Multi-Filter, Sorting and Dynamic Grid Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  const coursesContainer = document.getElementById('courses-grid-container');
  if (!coursesContainer || !window.CodeNestData) return;

  const searchInput = document.getElementById('courses-search');
  const sortSelect = document.getElementById('courses-sort');
  const categoryFilters = document.querySelectorAll('.filter-category');
  const levelFilters = document.querySelectorAll('.filter-level');
  const resultsCount = document.getElementById('courses-count');

  // Check URL query param 'q' (e.g. /courses?q=python)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }

  const renderCourses = () => {
    let list = [...CodeNestData.courses];
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Search query filter
    if (searchTerm) {
      list = list.filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm) ||
        c.language.toLowerCase().includes(searchTerm) ||
        c.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    const selectedCategories = Array.from(categoryFilters)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    if (selectedCategories.length > 0) {
      list = list.filter(c => selectedCategories.includes(c.category));
    }

    // Level filter
    const selectedLevels = Array.from(levelFilters)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    if (selectedLevels.length > 0) {
      list = list.filter(c => selectedLevels.includes(c.level));
    }

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : 'popular';
    if (sortVal === 'popular') {
      list.sort((a, b) => b.studentsCount - a.studentsCount);
    } else if (sortVal === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'duration') {
      list.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
    }

    if (resultsCount) {
      resultsCount.textContent = `${list.length} khóa học`;
    }

    if (list.length === 0) {
      coursesContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h3 class="empty-state-title">Không tìm thấy khóa học phù hợp</h3>
          <p class="empty-state-desc">Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí lọc.</p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('courses-search').value=''; renderCourses();">
            Xóa bộ lọc
          </button>
        </div>
      `;
      return;
    }

    const user = CodeNestData.currentUser;

    coursesContainer.innerHTML = list.map(c => {
      const isWishlisted = user.wishlist.includes(c.id);
      const enrollment = user.enrolledCourses.find(e => e.courseId === c.id);

      let levelBadgeClass = 'badge-beginner';
      if (c.level === 'Intermediate') levelBadgeClass = 'badge-intermediate';
      if (c.level === 'Advanced') levelBadgeClass = 'badge-advanced';
      if (c.level === 'All Levels') levelBadgeClass = 'badge-all';

      return `
        <div class="course-card">
          <div class="course-card-thumb" style="background: ${c.thumbnailBg};">
            <i class="fa-brands ${c.iconClass}"></i>
            <button 
              class="course-card-wishlist wishlist-btn-${c.id} ${isWishlisted ? 'active' : ''}" 
              onclick="toggleWishlist('${c.id}', event)"
              title="Lưu vào yêu thích"
            >
              <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>

          <div class="course-card-body">
            <div class="course-card-meta-top">
              <span class="course-card-category">${c.category}</span>
              <span class="badge ${levelBadgeClass}">${c.level}</span>
            </div>

            <h3 class="course-card-title">
              <a href="/course?id=${c.id}">${c.title}</a>
            </h3>

            <p class="course-card-desc">${c.description}</p>

            ${enrollment ? `
              <div class="progress-container">
                <div class="progress-header">
                  <span>Tiến độ học</span>
                  <span>${enrollment.progress}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${enrollment.progress}%;"></div>
                </div>
              </div>
            ` : ''}

            <div class="course-card-stats">
              <span class="course-card-rating">⭐ ${c.rating}</span>
              <span><i class="fa-regular fa-clock"></i> ${c.duration}</span>
              <span><i class="fa-solid fa-book-open"></i> ${c.lessonsCount} bài</span>
            </div>
          </div>

          <div class="course-card-footer">
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              <i class="fa-solid fa-users"></i> ${c.studentsCount.toLocaleString()} học viên
            </span>
            ${enrollment ? `
              <a href="/learning?course=${c.id}" class="btn btn-secondary btn-sm">
                Vào học tiếp →
              </a>
            ` : `
              <a href="/course?id=${c.id}" class="btn btn-primary btn-sm">
                Xem khóa học
              </a>
            `}
          </div>
        </div>
      `;
    }).join('');
  };

  window.renderCourses = renderCourses;

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', renderCourses);
  if (sortSelect) sortSelect.addEventListener('change', renderCourses);
  categoryFilters.forEach(cb => cb.addEventListener('change', renderCourses));
  levelFilters.forEach(cb => cb.addEventListener('change', renderCourses));

  // Initial Run
  renderCourses();
});
