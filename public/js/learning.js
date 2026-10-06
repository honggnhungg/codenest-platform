/**
 * CodeNest - Interactive Learning Classroom Controller
 * Handles 3-Panel Classroom, Lesson Switching, Code Block Viewer, Progress Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  const learningRoot = document.getElementById('learning-root');
  if (!learningRoot || !window.CodeNestData) return;

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course') || 'js-fundamentals';
  const course = CodeNestData.courses.find(c => c.id === courseId) || CodeNestData.courses[0];
  const user = CodeNestData.currentUser;

  // Flatten lessons list
  const allLessons = [];
  course.curriculum.forEach(sec => {
    sec.lessons.forEach(les => {
      allLessons.push({ ...les, sectionTitle: sec.title });
    });
  });

  let activeLessonIndex = 0;
  const lessonParam = urlParams.get('lesson');
  if (lessonParam) {
    const idx = allLessons.findIndex(l => l.id === lessonParam);
    if (idx > -1) activeLessonIndex = idx;
  }

  // Pre-prepared lesson code & explanations
  const sampleLessons = {
    'js-les-01': {
      title: '01. Giới thiệu JavaScript & Chạy dòng lệnh đầu tiên',
      desc: 'JavaScript là ngôn ngữ lập trình kịch bản động chạy trực tiếp trên trình duyệt web và máy chủ (Node.js). Hãy cùng làm quen với cách xuất thông tin ra màn hình Console.',
      code: `// Xuất thông điệp đầu tiên ra console
console.log("Xin chào thế giới từ CodeNest!");

// Khởi tạo đối tượng ứng dụng
const appInfo = {
  name: "CodeNest Learning Platform",
  version: "1.0.0",
  status: "Ready"
};

console.table(appInfo);`,
      explanation: 'Hàm `console.log()` được sử dụng để in dữ liệu ra tab Console của công cụ phát triển Developer Tools. Phương thức `console.table()` giúp hiển thị dữ liệu dạng bảng có cấu trúc trực quan.'
    },
    'js-les-02': {
      title: '02. Biến và kiểu dữ liệu (var, let, const)',
      desc: 'Hiểu rõ sự khác biệt giữa các từ khóa khai báo biến trong chuẩn ECMAScript hiện đại.',
      code: `// Khai báo biến với const (hằng số không thể gán lại giá trị)
const platformName = "CodeNest";
const maxScore = 100;

// Khai báo biến với let (có phạm vi block-scope, cho phép gán lại)
let studentName = "Alex Morgan";
let currentLesson = 2;

// Thay đổi giá trị biến
currentLesson = currentLesson + 1;

console.log(\`Học viên \${studentName} đang học bài \${currentLesson} tại \${platformName}\`);`,
      explanation: 'Luôn ưu tiên sử dụng `const` cho các giá trị không thay đổi và `let` khi cần gán lại giá trị. Hạn chế sử dụng `var` để tránh lỗi hoisting và rò rỉ phạm vi biến (scope).'
    },
    'default': {
      title: 'Variables in JavaScript: Deep Dive into Hoisting',
      desc: 'Tìm hiểu cơ chế nâng biến (Hoisting) và Temporal Dead Zone (TDZ) trong JavaScript runtime.',
      code: `// Minh họa Temporal Dead Zone (TDZ) với let và const
function calculateTotal(price, quantity) {
  const taxRate = 0.1; // 10%
  const subtotal = price * quantity;
  const total = subtotal + (subtotal * taxRate);
  
  return total.toFixed(2);
}

const finalPrice = calculateTotal(49.99, 2);
console.log("Tổng thanh toán:", finalPrice);`,
      explanation: 'Trong giai đoạn biên dịch (Creation Phase), JavaScript engine phân bổ bộ nhớ cho các biến. Với `let` và `const`, biến được đưa vào Temporal Dead Zone và không thể truy cập trước dòng khai báo.'
    }
  };

  const renderClassroom = () => {
    const activeLesson = allLessons[activeLessonIndex] || allLessons[0];
    const lessonData = sampleLessons[activeLesson.id] || sampleLessons['default'];
    const isCompleted = user.completedLessons.includes(activeLesson.id);

    // Calculate course completion
    const completedCountInThisCourse = allLessons.filter(l => user.completedLessons.includes(l.id)).length;
    const progressPercent = Math.round((completedCountInThisCourse / allLessons.length) * 100);

    learningRoot.innerHTML = `
      <div class="learning-screen">
        <!-- LEFT PANEL: Curriculum Sidebar -->
        <div class="learning-curriculum-panel">
          <div style="padding: 20px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <a href="/course?id=${course.id}" style="font-size: 0.8rem; color: var(--primary); font-weight: 700; text-transform: uppercase;">
                ← ${course.category}
              </a>
              <h3 style="font-size: 1rem; font-weight: 800; margin-top: 4px;">${course.title}</h3>
            </div>
          </div>

          <div style="padding: 16px; flex-grow: 1; overflow-y: auto;">
            ${course.curriculum.map(sec => `
              <div style="margin-bottom: 18px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
                  ${sec.title}
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  ${sec.lessons.map(les => {
                    const isCur = les.id === activeLesson.id;
                    const isDone = user.completedLessons.includes(les.id);
                    const idx = allLessons.findIndex(l => l.id === les.id);
                    return `
                      <button 
                        class="btn-switch-lesson" 
                        onclick="switchLesson(${idx})"
                        style="
                          display: flex; align-items: center; justify-content: space-between;
                          padding: 10px 12px; border-radius: var(--radius-sm); border: none;
                          background: ${isCur ? 'var(--primary-light)' : 'transparent'};
                          color: ${isCur ? 'var(--primary)' : 'var(--text-secondary)'};
                          font-weight: ${isCur ? '700' : '500'};
                          font-size: 0.85rem; cursor: pointer; text-align: left; width: 100%; transition: var(--transition);
                        "
                      >
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <i class="fa-${isDone ? 'solid fa-circle-check' : 'regular fa-circle-play'}" 
                             style="color: ${isDone ? 'var(--success)' : 'inherit'};"></i>
                          <span>${les.title}</span>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${les.duration}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CENTER PANEL: Lesson Content & Code Editor Workspace -->
        <div class="learning-content-panel">
          <div style="max-width: 860px; margin: 0 auto;">
            <!-- Lesson Navigation Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
              <span class="badge badge-intermediate">Bài ${activeLessonIndex + 1} / ${allLessons.length}</span>
              <div style="display: flex; gap: 10px;">
                <button 
                  class="btn btn-outline btn-sm" 
                  onclick="prevLesson()" 
                  ${activeLessonIndex === 0 ? 'disabled' : ''}
                >
                  ← Bài trước
                </button>
                <button 
                  class="btn btn-outline btn-sm" 
                  onclick="nextLesson()" 
                  ${activeLessonIndex === allLessons.length - 1 ? 'disabled' : ''}
                >
                  Bài tiếp theo →
                </button>
              </div>
            </div>

            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 14px; color: var(--text-primary);">
              ${lessonData.title}
            </h1>

            <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">
              ${lessonData.desc}
            </p>

            <!-- Interactive Code Workspace Container -->
            <div class="code-editor-box">
              <div class="code-editor-top">
                <span><i class="fa-solid fa-code" style="color: var(--primary); margin-right: 6px;"></i> script.js (Interactive Preview)</span>
                <button class="btn btn-sm btn-secondary" onclick="runMockCode()" style="padding: 3px 10px; font-size: 0.75rem;">
                  ▶ Run Code
                </button>
              </div>
              <pre class="code-editor-pre"><code>${escapeHtml(lessonData.code)}</code></pre>
            </div>

            <!-- Detailed Explanation Section -->
            <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; margin-bottom: 30px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">
                <i class="fa-solid fa-lightbulb" style="color: var(--warning); margin-right: 8px;"></i>
                Giải thích chi tiết
              </h3>
              <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">
                ${lessonData.explanation}
              </p>
            </div>

            <!-- Bottom Actions -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 14px;">
              <button 
                class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} btn-lg" 
                onclick="markComplete('${activeLesson.id}')"
              >
                <i class="fa-solid ${isCompleted ? 'fa-check-double' : 'fa-check'}"></i>
                ${isCompleted ? 'Đã hoàn thành bài học này' : 'Mark as Complete (Đánh dấu hoàn thành)'}
              </button>

              <button 
                class="btn btn-primary btn-lg" 
                onclick="nextLesson()"
                ${activeLessonIndex === allLessons.length - 1 ? 'disabled' : ''}
              >
                Next Lesson (Bài kế tiếp) →
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Progress & Course Information -->
        <div class="learning-sidebar-panel">
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px;">
              Tiến độ của bạn
            </h4>
            <div class="progress-container">
              <div class="progress-header">
                <span>Hoàn thành</span>
                <strong>${progressPercent}%</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 6px;">
              Đã xong ${completedCountInThisCourse} / ${allLessons.length} bài học
            </div>
          </div>

          <div style="margin-bottom: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
            <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px;">
              Giảng viên hướng dẫn
            </h4>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
              <div>
                <div style="font-weight: 700; font-size: 0.9rem;">${course.instructor.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${course.instructor.title}</div>
              </div>
            </div>
          </div>

          <div style="padding-top: 20px; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 10px;">
            <a href="/dashboard" class="btn btn-outline btn-block btn-sm">
              <i class="fa-solid fa-house"></i> Về Dashboard cá nhân
            </a>
            <button class="btn btn-outline btn-block btn-sm" onclick="showToast('Tài liệu mã nguồn đã sẵn sàng!', 'success')">
              <i class="fa-solid fa-download"></i> Tải mã nguồn (.zip)
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Helper function to escape HTML
  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Global classroom functions
  window.switchLesson = (idx) => {
    activeLessonIndex = idx;
    renderClassroom();
  };

  window.nextLesson = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      activeLessonIndex++;
      renderClassroom();
    }
  };

  window.prevLesson = () => {
    if (activeLessonIndex > 0) {
      activeLessonIndex--;
      renderClassroom();
    }
  };

  window.markComplete = (lessonId) => {
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      showToast('Đã đánh dấu hoàn thành bài học! Tuyệt vời 🚀', 'success');
    } else {
      showToast('Bài học này đã được hoàn thành trước đó.', 'success');
    }
    renderClassroom();
  };

  window.runMockCode = () => {
    showToast('Code thực thi thành công! Output hiển thị trong Console.', 'success');
  };

  // Initial render
  renderClassroom();
});
