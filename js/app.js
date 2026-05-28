/* ===================================================
   SmartHome - app.js
   UI interactions only. Realtime data will be added
   after Firebase is configured.
   =================================================== */

// ==================== NAVIGATION ====================
let currentPage = 'dashboard';
let sidebarOpen = true;

function setPage(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    target.classList.add('fade-in');
    setTimeout(() => target.classList.remove('fade-in'), 400);
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItems = document.querySelectorAll('.nav-item');
  const pageIndex = ['dashboard', 'monitoring', 'control', 'history', 'settings'].indexOf(name);
  if (navItems[pageIndex]) navItems[pageIndex].classList.add('active');
  currentPage = name;

  if (window.innerWidth < 900) closeSidebar();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (window.innerWidth < 900) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('hidden');
  } else {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('collapsed', !sidebarOpen);
    document.getElementById('mainContent').style.marginLeft = sidebarOpen ? 'var(--sidebar-w)' : '0';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.add('hidden');
}

// ==================== THEME ====================
let isDark = false;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
  const icon = document.getElementById('theme-icon');
  if (isDark) {
    icon.innerHTML = '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>';
  } else {
    icon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
  }

  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) darkToggle.checked = isDark;
}

function toggleThemeFromSettings(checked) {
  if (checked !== isDark) toggleTheme();
}

// ==================== CLOCK ====================
function updateClock() {
  const el = document.getElementById('navbar-clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==================== NOTIFICATIONS ====================
let notifVisible = false;

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  notifVisible = !notifVisible;
  panel.style.display = notifVisible ? 'block' : 'none';
}

// ==================== EMPTY STATE ====================
const activityLog = [];

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setBadge(id, text, className = 'sensor-badge badge-info') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = className;
}

function clearProgressBars() {
  document.querySelectorAll('.sensor-progress-fill').forEach(bar => {
    bar.style.width = '0%';
  });
}

function showEmptySensorState() {
  ['gas-val', 'light-val', 'rain-val', 'ultra-val', 'm-gas-val', 'm-light-val', 'm-rain-val', 'm-ultra-val'].forEach(id => {
    setText(id, '-');
  });

  setBadge('gas-badge', 'Belum ada data');
  setBadge('light-badge', 'Belum ada data');
  setBadge('rain-badge', 'Belum ada data');
  setBadge('ultra-badge', 'Belum ada data');
  clearProgressBars();
}

// ==================== DEVICE CONTROL PLACEHOLDER ====================
function controlDevice() {
  showToast('Firebase belum dikonfigurasi. Perintah belum dikirim.');
}

function toggleRelay(_relay, checkboxOrState) {
  if (checkboxOrState && typeof checkboxOrState === 'object') {
    checkboxOrState.checked = false;
  }
  showToast('Firebase belum dikonfigurasi. Relay belum dikendalikan.');
}

// ==================== TOAST NOTIFICATION ====================
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: var(--primary); color: white;
    padding: 12px 20px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500;
    box-shadow: 0 8px 32px rgba(79,70,229,0.35);
    animation: slide-toast 0.3s ease;
    max-width: 320px;
    font-family: 'Poppins', sans-serif;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = '@keyframes slide-toast { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== HISTORY TABLE ====================
function renderHistory(data) {
  const tbody = document.getElementById('activity-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!data.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="td-muted" colspan="6" style="text-align:center;padding:24px">Belum ada data aktivitas.</td>';
    tbody.appendChild(tr);
    return;
  }

  data.forEach((row, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-muted">${i + 1}</td>
      <td class="td-muted">${row.time}</td>
      <td><span class="table-badge purple">${row.type}</span></td>
      <td>${row.activity}</td>
      <td class="td-muted" style="font-family:monospace">${row.value}</td>
      <td><span class="table-badge ${row.status}">${row.statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterTable(query) {
  const filtered = activityLog.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(query.toLowerCase()))
  );
  renderHistory(filtered);
}

// ==================== LOGOUT ====================
function logout() {
  if (confirm('Yakin ingin keluar dari sistem?')) {
    window.location.href = 'index.html';
  }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderHistory(activityLog);
  showEmptySensorState();

  document.querySelectorAll('.card-animate').forEach((card, i) => {
    card.style.animationDelay = (0.05 + i * 0.06) + 's';
  });

  if (window.innerWidth < 900) {
    document.getElementById('sidebarOverlay').classList.add('hidden');
  }
});
