/* ===================================================
   SmartHome — app.js
   Dashboard Interactivity & Simulated Sensor Data
   =================================================== */

// ==================== NAVIGATION ====================
let currentPage = 'dashboard';
let sidebarOpen = true;

function setPage(name) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    target.classList.add('fade-in');
    setTimeout(() => target.classList.remove('fade-in'), 400);
  }
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItems = document.querySelectorAll('.nav-item');
  const pageIndex = ['dashboard','monitoring','control','history','settings'].indexOf(name);
  if (navItems[pageIndex]) navItems[pageIndex].classList.add('active');
  currentPage = name;

  // Close sidebar on mobile
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
  // Sync settings toggle
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
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
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

// ==================== SENSOR SIMULATION ====================
const sensorData = {
  gas: { val: 142, min: 80, max: 500, unit: 'ppm', warn: 300 },
  light: { val: 34, min: 0, max: 100, unit: '%', warn: 30 },
  rain: { val: 0, min: 0, max: 100, unit: '%', warn: 20 },
  ultra: { val: 85, min: 2, max: 400, unit: 'cm', warn: 30 },
};

function randomWalk(current, min, max, step) {
  const delta = (Math.random() - 0.45) * step;
  return Math.max(min, Math.min(max, Math.round((current + delta) * 10) / 10));
}

function updateSensors() {
  sensorData.gas.val = randomWalk(sensorData.gas.val, 80, 500, 18);
  sensorData.light.val = randomWalk(sensorData.light.val, 0, 100, 5);
  sensorData.rain.val = randomWalk(sensorData.rain.val, 0, 100, 8);
  sensorData.ultra.val = randomWalk(sensorData.ultra.val, 2, 400, 12);

  // Gas
  const gasEl = document.getElementById('gas-val');
  const gasMEl = document.getElementById('m-gas-val');
  const gasBar = document.getElementById('gas-bar');
  const gasBadge = document.getElementById('gas-badge');
  if (gasEl) gasEl.textContent = sensorData.gas.val;
  if (gasMEl) gasMEl.textContent = sensorData.gas.val;
  const gasPct = Math.min(100, (sensorData.gas.val / 500) * 100);
  if (gasBar) gasBar.style.width = gasPct + '%';
  if (gasBadge) {
    if (sensorData.gas.val > 400) {
      gasBadge.textContent = 'BAHAYA';
      gasBadge.className = 'sensor-badge badge-danger';
      showAlert('gas');
    } else if (sensorData.gas.val > 250) {
      gasBadge.textContent = 'Waspada';
      gasBadge.className = 'sensor-badge badge-warning';
    } else {
      gasBadge.textContent = 'Normal';
      gasBadge.className = 'sensor-badge badge-normal';
    }
  }

  // Light
  const lightEl = document.getElementById('light-val');
  const lightMEl = document.getElementById('m-light-val');
  const lightBar = document.getElementById('light-bar');
  const lightBadge = document.getElementById('light-badge');
  if (lightEl) lightEl.textContent = sensorData.light.val;
  if (lightMEl) lightMEl.textContent = sensorData.light.val;
  if (lightBar) lightBar.style.width = sensorData.light.val + '%';
  if (lightBadge) {
    if (sensorData.light.val < 20) {
      lightBadge.textContent = 'Gelap';
      lightBadge.className = 'sensor-badge badge-danger';
    } else if (sensorData.light.val < 50) {
      lightBadge.textContent = 'Redup';
      lightBadge.className = 'sensor-badge badge-warning';
    } else {
      lightBadge.textContent = 'Terang';
      lightBadge.className = 'sensor-badge badge-normal';
    }
  }

  // Rain
  const rainEl = document.getElementById('rain-val');
  const rainMEl = document.getElementById('m-rain-val');
  const rainBar = document.getElementById('rain-bar');
  const rainBadge = document.getElementById('rain-badge');
  if (rainEl) rainEl.textContent = sensorData.rain.val;
  if (rainMEl) rainMEl.textContent = sensorData.rain.val;
  if (rainBar) rainBar.style.width = sensorData.rain.val + '%';
  if (rainBadge) {
    if (sensorData.rain.val > 50) {
      rainBadge.textContent = 'Hujan Deras';
      rainBadge.className = 'sensor-badge badge-danger';
    } else if (sensorData.rain.val > 20) {
      rainBadge.textContent = 'Gerimis';
      rainBadge.className = 'sensor-badge badge-warning';
    } else {
      rainBadge.textContent = 'Tidak Hujan';
      rainBadge.className = 'sensor-badge badge-normal';
    }
  }

  // Ultrasonic
  const ultraEl = document.getElementById('ultra-val');
  const ultraMEl = document.getElementById('m-ultra-val');
  const ultraBar = document.getElementById('ultra-bar');
  const ultraBadge = document.getElementById('ultra-badge');
  if (ultraEl) ultraEl.textContent = sensorData.ultra.val;
  if (ultraMEl) ultraMEl.textContent = sensorData.ultra.val;
  const ultraPct = Math.max(0, 100 - (sensorData.ultra.val / 400 * 100));
  if (ultraBar) ultraBar.style.width = ultraPct + '%';
  if (ultraBadge) {
    if (sensorData.ultra.val < 15) {
      ultraBadge.textContent = 'Objek Dekat!';
      ultraBadge.className = 'sensor-badge badge-danger';
    } else if (sensorData.ultra.val < 30) {
      ultraBadge.textContent = 'Dekat';
      ultraBadge.className = 'sensor-badge badge-warning';
    } else {
      ultraBadge.textContent = 'Clear';
      ultraBadge.className = 'sensor-badge badge-info';
    }
  }
}

setInterval(updateSensors, 2500);

function showAlert(type) {
  if (type === 'gas') {
    const el = document.getElementById('alert-gas');
    if (el) el.style.display = 'flex';
  }
}

// ==================== DEVICE CONTROL ====================
function controlDevice(device, action) {
  const statusEl = document.getElementById(device + '-status');
  if (!statusEl) return;

  // Simulate sending to Firebase
  const dot = statusEl.querySelector('.status-dot');

  if (device === 'stepper') {
    if (action === 'buka') {
      statusEl.className = 'status-indicator active';
      statusEl.innerHTML = '<span class="status-dot active"></span> Jemuran Di Luar';
      addHistoryEntry('Jemuran', 'Buka jemuran', 'Manual', 'success');
    } else {
      statusEl.className = 'status-indicator inactive';
      statusEl.innerHTML = '<span class="status-dot inactive"></span> Jemuran Masuk';
      addHistoryEntry('Jemuran', 'Tutup jemuran', 'Manual', 'warning');
    }
  }

  if (device === 'servo') {
    if (action === 'unlock') {
      statusEl.className = 'status-indicator unlocked';
      statusEl.innerHTML = '<span class="status-dot unlocked"></span> Pintu Terbuka';
      addHistoryEntry('Pintu', 'Buka pintu', 'Manual', 'success');
      // Auto-lock after 5 seconds
      setTimeout(() => {
        if (statusEl) {
          statusEl.className = 'status-indicator locked';
          statusEl.innerHTML = '<span class="status-dot locked"></span> Pintu Terkunci';
          addHistoryEntry('Pintu', 'Auto-kunci pintu', 'Otomatis', 'info');
        }
      }, 5000);
    } else {
      statusEl.className = 'status-indicator locked';
      statusEl.innerHTML = '<span class="status-dot locked"></span> Pintu Terkunci';
      addHistoryEntry('Pintu', 'Kunci pintu', 'Manual', 'info');
    }
  }

  showToast(`Perintah "${action}" dikirim ke ${device} via Firebase`);
}

function toggleRelay(relay, state) {
  addHistoryEntry('Relay', `Relay ${relay} ${state ? 'ON' : 'OFF'}`, state ? '1' : '0', state ? 'success' : 'warning');
  showToast(`Relay ${relay} ${state ? 'dinyalakan' : 'dimatikan'}`);
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
  toast.innerHTML = `✅ ${msg}`;
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `@keyframes slide-toast { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== HISTORY TABLE ====================
const activityLog = [
  { time: '14:32:07', type: 'RFID', activity: 'Kartu ditap', value: 'UID: A4:B2:C9:D1', status: 'success', statusText: 'Berhasil' },
  { time: '14:18:44', type: 'RFID', activity: 'Kartu ditap', value: 'UID: FF:22:AB:09', status: 'danger', statusText: 'Ditolak' },
  { time: '14:05:12', type: 'Relay', activity: 'Lampu Ruang Tamu', value: 'ON', status: 'success', statusText: 'Aktif' },
  { time: '13:58:30', type: 'Pintu', activity: 'Pintu dibuka', value: 'Servo 90°', status: 'info', statusText: 'Berhasil' },
  { time: '13:45:22', type: 'Jemuran', activity: 'Jemuran masuk otomatis', value: 'Hujan 78%', status: 'warning', statusText: 'Otomatis' },
  { time: '13:40:01', type: 'Gas', activity: 'Gas normal', value: '142 ppm', status: 'success', statusText: 'Normal' },
  { time: '13:30:15', type: 'Relay', activity: 'Lampu Kamar', value: 'OFF', status: 'warning', statusText: 'Nonaktif' },
  { time: '13:10:55', type: 'RFID', activity: 'Kartu ditap', value: 'UID: A4:B2:C9:D1', status: 'success', statusText: 'Berhasil' },
  { time: '12:55:09', type: 'Jemuran', activity: 'Jemuran keluar manual', value: 'Cerah', status: 'success', statusText: 'Manual' },
  { time: '12:30:44', type: 'Gas', activity: 'Gas terdeteksi tinggi', value: '432 ppm', status: 'danger', statusText: 'Bahaya' },
];

function renderHistory(data) {
  const tbody = document.getElementById('activity-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
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
    Object.values(row).some(v => v.toLowerCase().includes(query.toLowerCase()))
  );
  renderHistory(filtered);
}

function addHistoryEntry(type, activity, value, status) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const statusMap = { success: 'Berhasil', warning: 'Otomatis', danger: 'Bahaya', info: 'Manual' };
  activityLog.unshift({ time, type, activity, value, status, statusText: statusMap[status] || status });
  if (activityLog.length > 50) activityLog.pop();
  renderHistory(activityLog);
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
  updateSensors();

  // Animate cards on load
  document.querySelectorAll('.card-animate').forEach((card, i) => {
    card.style.animationDelay = (0.05 + i * 0.06) + 's';
  });

  // Handle responsive sidebar
  if (window.innerWidth < 900) {
    document.getElementById('sidebarOverlay').classList.add('hidden');
  }
});