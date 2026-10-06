/**
 * CodeNest - Settings Page Controller
 * Handles Tab Switching for Account, Profile, Security, Notifications, Appearance, Privacy
 * Interactive switches, Theme selection, and Save Changes feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const settingsNavItems = document.querySelectorAll('.settings-nav-item');
  const settingsPanels = document.querySelectorAll('.settings-panel');

  if (settingsNavItems.length > 0) {
    settingsNavItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        settingsNavItems.forEach(b => b.classList.remove('active'));
        settingsPanels.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) {
          activePanel.style.display = 'block';
        }
      });
    });
  }

  // Radio cards (Appearance Theme)
  const themeCards = document.querySelectorAll('.theme-radio-card');
  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const theme = card.getAttribute('data-theme');
      showToast(`Đã chọn giao diện: ${theme}`, 'success');
    });
  });

  // Radio cards (Accent Color)
  const colorCards = document.querySelectorAll('.color-radio-card');
  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      colorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const color = card.getAttribute('data-color');
      showToast(`Đã đổi màu điểm nhấn sang: ${color}`, 'success');
    });
  });

  // Save Settings Forms
  const settingsForms = document.querySelectorAll('.settings-form');
  settingsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Cài đặt đã được lưu thành công! (Settings saved successfully)', 'success');
    });
  });
});
