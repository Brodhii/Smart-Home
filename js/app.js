/* ===================================================
   SmartHome - app.js
   Firebase Realtime Database Integration
   Sensor monitoring, device control & activity logging
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
let notifCount = 0;
const notifications = [];

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  notifVisible = !notifVisible;
  panel.style.display = notifVisible ? 'block' : 'none';
}

function addNotification(text, type = 'info') {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  notifications.unshift({ text, type, time: timeStr });
  if (notifications.length > 50) notifications.pop();

  notifCount++;
  const badge = document.querySelector('.notif-badge');
  if (badge) badge.textContent = notifCount > 99 ? '99+' : notifCount;

  renderNotifications();
}

function renderNotifications() {
  const list = document.querySelector('.notif-list');
  if (!list) return;

  if (notifications.length === 0) {
    list.innerHTML = `
      <li class="notif-item">
        <span class="notif-dot" style="background:var(--text-muted)"></span>
        <p class="notif-text">Belum ada notifikasi.</p>
        <time class="notif-time">-</time>
      </li>`;
    return;
  }

  const dotColors = {
    info: '#3B82F6',
    warning: '#F59E0B',
    danger: '#EF4444',
    success: '#22C55E'
  };

  list.innerHTML = notifications.slice(0, 20).map(n => `
    <li class="notif-item">
      <span class="notif-dot" style="background:${dotColors[n.type] || '#3B82F6'}"></span>
      <p class="notif-text">${n.text}</p>
      <time class="notif-time">${n.time}</time>
    </li>
  `).join('');
}

// ==================== UTILITY FUNCTIONS ====================
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

function setProgress(id, percent) {
  const el = document.getElementById(id);
  if (el) {
    el.style.width = Math.min(100, Math.max(0, percent)) + '%';
    el.style.transition = 'width 0.6s ease';
  }
}

function getTimeStamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

// ==================== ACTIVITY LOG ====================
const activityLog = [];
const MAX_LOG = 100;

function addActivity(type, activity, value, status, statusText) {
  activityLog.unshift({
    time: getTimeStamp(),
    type,
    activity,
    value: String(value),
    status,
    statusText
  });
  if (activityLog.length > MAX_LOG) activityLog.pop();
  renderHistory(activityLog);
}

// ==================== SENSOR DATA TRACKING ====================
const sensorHistory = {
  gas: { min: Infinity, max: -Infinity, sum: 0, count: 0 },
  ldr: { min: Infinity, max: -Infinity, sum: 0, count: 0 },
  rain: { min: Infinity, max: -Infinity, sum: 0, count: 0 },
  ultrasonic: { min: Infinity, max: -Infinity, sum: 0, count: 0 }
};

function updateSensorStats(sensor, value) {
  const stats = sensorHistory[sensor];
  if (!stats) return;
  stats.min = Math.min(stats.min, value);
  stats.max = Math.max(stats.max, value);
  stats.sum += value;
  stats.count++;
}

function getSensorAvg(sensor) {
  const stats = sensorHistory[sensor];
  if (!stats || stats.count === 0) return 0;
  return (stats.sum / stats.count).toFixed(1);
}

// ==================== FIREBASE REALTIME LISTENERS ====================
let sensorsActive = 0;
let devicesActive = 0;
let lastGasValue = 0;
let lastRainValue = 0;
let lastLightValue = 0;

function initFirebaseListeners() {
  if (typeof firebase === 'undefined' || !db) {
    console.warn('⚠️ Firebase belum diinisialisasi');
    return;
  }

  console.log('🔄 Memulai Firebase Realtime listeners...');

  // ===== SENSOR: GAS MQ-135 =====
  db.ref('Smarthome/nilai_gas').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const gasValue = Number(val);
    lastGasValue = gasValue;
    sensorsActive = countActiveSensors();

    // Update dashboard & monitoring values
    setText('gas-val', gasValue.toFixed(0));
    setText('m-gas-val', gasValue.toFixed(0));

    // Progress bar (assume 0-4095 range for raw ADC)
    const gasPercent = (gasValue / 4095) * 100;
    setProgress('gas-bar', gasPercent);

    // Update monitoring progress bars
    updateMonitoringProgress('sensor-gas', gasPercent);

    // Update stats
    updateSensorStats('gas', gasValue);
    updateMonitoringStats('gas');

    // Badge status
    let gasBadgeClass, gasBadgeText;
    if (gasValue < 1500) {
      gasBadgeClass = 'sensor-badge badge-success';
      gasBadgeText = 'Aman';
    } else if (gasValue < 2800) {
      gasBadgeClass = 'sensor-badge badge-warning';
      gasBadgeText = 'Waspada';
    } else {
      gasBadgeClass = 'sensor-badge badge-danger';
      gasBadgeText = 'Bahaya!';
    }
    setBadge('gas-badge', gasBadgeText, gasBadgeClass);
    updateMonitoringBadge('sensor-gas', gasBadgeText, gasBadgeClass);

    // Update sensor description
    updateSensorDesc('sensor-gas', `Terakhir update: ${getTimeStamp()}`);

    // Gas alert
    const alertGas = document.getElementById('alert-gas');
    if (gasValue >= 2800 && alertGas) {
      alertGas.style.display = 'flex';
      addNotification(`⚠️ Gas tinggi terdeteksi: ${gasValue.toFixed(0)}`, 'danger');
    } else if (alertGas) {
      alertGas.style.display = 'none';
    }

    // Automation badge update
    updateAutomationBadge(2, gasValue >= 2800 ? 'Aktif' : 'Standby', gasValue >= 2800 ? 'danger' : 'success');

    addActivity('Sensor', 'Gas MQ-135', `${gasValue.toFixed(0)}`, gasValue < 1500 ? 'success' : gasValue < 2800 ? 'warning' : 'danger', gasBadgeText);
    updateDashboardStats();
  });

  // ===== SENSOR: LDR (CAHAYA) =====
  db.ref('Smarthome/persen_cahaya').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const lightValue = Number(val);
    lastLightValue = lightValue;
    sensorsActive = countActiveSensors();

    setText('light-val', lightValue.toFixed(0));
    setText('m-light-val', lightValue.toFixed(0));

    const lightPercent = Math.min(100, lightValue);
    setProgress('light-bar', lightPercent);
    updateMonitoringProgress('sensor-light', lightPercent);

    updateSensorStats('ldr', lightValue);

    let lightBadgeClass, lightBadgeText;
    if (lightValue > 70) {
      lightBadgeClass = 'sensor-badge badge-success';
      lightBadgeText = 'Terang';
    } else if (lightValue > 30) {
      lightBadgeClass = 'sensor-badge badge-warning';
      lightBadgeText = 'Redup';
    } else {
      lightBadgeClass = 'sensor-badge badge-info';
      lightBadgeText = 'Gelap';
    }
    setBadge('light-badge', lightBadgeText, lightBadgeClass);
    updateMonitoringBadge('sensor-light', lightBadgeText, lightBadgeClass);
    updateSensorDesc('sensor-light', `Terakhir update: ${getTimeStamp()}`);

    // Automation: auto-lamp
    updateAutomationBadge(1, lightValue <= 30 ? 'Aktif' : 'Standby', lightValue <= 30 ? 'success' : 'info');

    // Update monitoring auto status
    const lightAutoEl = document.querySelectorAll('#page-monitoring .sensor-light p[style*="12.5px"]');
    lightAutoEl.forEach(el => {
      el.textContent = lightValue <= 30 ? '💡 Otomasi aktif — Lampu ON' : '☀️ Cukup terang — Lampu otomatis OFF';
    });

    addActivity('Sensor', 'Cahaya LDR', `${lightValue.toFixed(0)}%`, lightValue > 30 ? 'success' : 'info', lightBadgeText);
    updateDashboardStats();
  });

  // ===== SENSOR: RAIN =====
  db.ref('Smarthome/persen_hujan').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const rainValue = Number(val);
    lastRainValue = rainValue;
    sensorsActive = countActiveSensors();

    setText('rain-val', rainValue.toFixed(0));
    setText('m-rain-val', rainValue.toFixed(0));

    const rainPercent = Math.min(100, rainValue);
    setProgress('rain-bar', rainPercent);
    updateMonitoringProgress('sensor-rain', rainPercent);

    updateSensorStats('rain', rainValue);

    let rainBadgeClass, rainBadgeText;
    if (rainValue < 30) {
      rainBadgeClass = 'sensor-badge badge-success';
      rainBadgeText = 'Cerah';
    } else if (rainValue < 70) {
      rainBadgeClass = 'sensor-badge badge-warning';
      rainBadgeText = 'Gerimis';
    } else {
      rainBadgeClass = 'sensor-badge badge-danger';
      rainBadgeText = 'Hujan Deras';
    }
    setBadge('rain-badge', rainBadgeText, rainBadgeClass);
    updateMonitoringBadge('sensor-rain', rainBadgeText, rainBadgeClass);
    updateSensorDesc('sensor-rain', `Terakhir update: ${getTimeStamp()}`);

    // Automation: auto-jemuran
    updateAutomationBadge(0, rainValue >= 30 ? 'Aktif' : 'Standby', rainValue >= 30 ? 'success' : 'info');

    // Update monitoring auto status
    const rainAutoEl = document.querySelectorAll('#page-monitoring .sensor-rain p[style*="12.5px"]');
    rainAutoEl.forEach(el => {
      el.textContent = rainValue >= 30 ? '🌧️ Hujan — Jemuran auto-masuk' : '☀️ Cuaca cerah — Aman dijemur';
    });

    // Update weather stat card
    const weatherStat = document.querySelectorAll('.stat-card.info .stat-val');
    weatherStat.forEach(el => {
      el.textContent = rainBadgeText;
      el.style.fontSize = '18px';
    });
    const weatherSub = document.querySelectorAll('.stat-card.info .stat-sub');
    weatherSub.forEach(el => {
      el.textContent = `Kelembapan hujan: ${rainValue.toFixed(0)}%`;
    });

    addActivity('Sensor', 'Sensor Hujan', `${rainValue.toFixed(0)}%`, rainValue < 30 ? 'success' : rainValue < 70 ? 'warning' : 'danger', rainBadgeText);
    updateDashboardStats();
  });

  // ===== SENSOR: ULTRASONIC HC-SR04 =====
  db.ref('Smarthome/jarak_air').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const ultraValue = Number(val);
    sensorsActive = countActiveSensors();

    setText('ultra-val', ultraValue.toFixed(1));
    setText('m-ultra-val', ultraValue.toFixed(1));

    // Progress (assume 0-400cm range)
    const ultraPercent = (ultraValue / 400) * 100;
    setProgress('ultra-bar', ultraPercent);
    updateMonitoringProgress('sensor-ultrasonic', ultraPercent);

    updateSensorStats('ultrasonic', ultraValue);

    let ultraBadgeClass, ultraBadgeText;
    if (ultraValue < 10) {
      ultraBadgeClass = 'sensor-badge badge-danger';
      ultraBadgeText = 'Sangat Dekat';
    } else if (ultraValue < 50) {
      ultraBadgeClass = 'sensor-badge badge-warning';
      ultraBadgeText = 'Dekat';
    } else {
      ultraBadgeClass = 'sensor-badge badge-success';
      ultraBadgeText = 'Jauh';
    }
    setBadge('ultra-badge', ultraBadgeText, ultraBadgeClass);
    updateMonitoringBadge('sensor-ultrasonic', ultraBadgeText, ultraBadgeClass);
    updateSensorDesc('sensor-ultrasonic', `Terakhir update: ${getTimeStamp()}`);

    // Update monitoring distance desc
    const ultraAutoEl = document.querySelectorAll('#page-monitoring .sensor-ultrasonic p[style*="12.5px"]');
    ultraAutoEl.forEach(el => {
      el.textContent = `Jarak terdeteksi: ${ultraValue.toFixed(1)} cm`;
    });

    addActivity('Sensor', 'Ultrasonik HC-SR04', `${ultraValue.toFixed(1)} cm`, ultraValue < 10 ? 'danger' : 'success', ultraBadgeText);
    updateDashboardStats();
  });

  // ===== SENSOR: RFID RC522 =====
  db.ref('Smarthome/status_rfid').on('value', (snapshot) => {
    const val = snapshot.val();
    if (!val) return;

    sensorsActive = countActiveSensors();

    const uid = '-';
    const access = val;
    const timestamp = getTimeStamp();

    // Update dashboard RFID card
    const rfidCard = document.querySelector('.sensor-rfid');
    if (rfidCard) {
      const rfidValue = rfidCard.querySelector('.sensor-value');
      if (rfidValue) rfidValue.textContent = 'Kartu';

      const rfidBadge = document.getElementById('rfid-badge');
      if (rfidBadge) {
        if (access === 'Akses Diterima') {
          rfidBadge.textContent = 'Akses Diberikan';
          rfidBadge.className = 'sensor-badge badge-success';
        } else if (access.includes('Ditolak')) {
          rfidBadge.textContent = 'Akses Ditolak';
          rfidBadge.className = 'sensor-badge badge-danger';
        } else {
          rfidBadge.textContent = access;
          rfidBadge.className = 'sensor-badge badge-info';
        }
      }
    }

    // Update monitoring page RFID details
    const rfidDetails = document.querySelector('#page-monitoring .sensor-rfid');
    if (rfidDetails) {
      const uidEl = rfidDetails.querySelector('dd[style*="24px"]');
      if (uidEl) uidEl.textContent = '-';

      const accessBadge = rfidDetails.querySelector('dd .sensor-badge');
      if (accessBadge) {
        if (access === 'Akses Diterima') {
          accessBadge.textContent = 'Akses Diberikan';
          accessBadge.className = 'sensor-badge badge-success';
          accessBadge.style.fontSize = '13px';
          accessBadge.style.padding = '5px 14px';
        } else if (access.includes('Ditolak')) {
          accessBadge.textContent = 'Akses Ditolak';
          accessBadge.className = 'sensor-badge badge-danger';
          accessBadge.style.fontSize = '13px';
          accessBadge.style.padding = '5px 14px';
        } else {
          accessBadge.textContent = access;
          accessBadge.className = 'sensor-badge badge-info';
          accessBadge.style.fontSize = '13px';
          accessBadge.style.padding = '5px 14px';
        }
      }

      const timeEl = rfidDetails.querySelector('dd[style*="14px"][style*="600"]');
      if (timeEl) timeEl.textContent = timestamp;

      // Monitoring RFID badge
      const monBadge = rfidDetails.querySelector('.sensor-card-header .sensor-badge');
      if (monBadge) {
        monBadge.textContent = access === 'Akses Diterima' ? 'Akses OK' : (access.includes('Ditolak') ? 'Akses Ditolak' : access);
        monBadge.className = access === 'Akses Diterima' ? 'sensor-badge badge-success' : (access.includes('Ditolak') ? 'sensor-badge badge-danger' : 'sensor-badge badge-info');
      }
    }

    // Update dashboard RFID desc
    updateSensorDesc('sensor-rfid', `Status: ${access}`);

    if (access === 'Akses Diterima' || access.includes('Ditolak')) {
      addNotification(`🔑 RFID: ${access}`, access === 'Akses Diterima' ? 'success' : 'warning');
      addActivity('RFID', 'Tap RFID', 'Kartu', access === 'Akses Diterima' ? 'success' : 'danger', access);
    }

    // Update security stat
    const secStat = document.querySelectorAll('.stat-card.warning .stat-val');
    secStat.forEach(el => {
      el.textContent = access === 'Akses Diterima' ? 'Aman' : (access.includes('Ditolak') ? 'Waspada' : 'Standby');
      el.style.fontSize = '18px';
    });
    const secSub = document.querySelectorAll('.stat-card.warning .stat-sub');
    secSub.forEach(el => {
      el.textContent = `Status: ${access}`;
    });

    updateDashboardStats();
  });

  // ===== RFID LOG =====
  db.ref('rfid_log').orderByKey().limitToLast(10).on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const logContainer = document.querySelector('#page-monitoring .sensor-rfid ul');
    if (!logContainer) return;

    const entries = Object.values(data).reverse();
    logContainer.innerHTML = entries.map(entry => {
      const isGranted = entry.access === 'granted' || entry.access === 'Akses Diberikan';
      return `
        <li style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;padding:10px 14px;background:var(--bg);border-radius:8px">
          <span>
            <span style="font-weight:600;font-family:monospace;letter-spacing:1px">${entry.uid || '-'}</span>
            <span class="sensor-badge ${isGranted ? 'badge-success' : 'badge-danger'}" style="font-size:10px;padding:2px 8px;margin-left:8px">${entry.access || '-'}</span>
          </span>
          <time style="color:var(--text-muted);font-size:11px">${entry.timestamp || '-'}</time>
        </li>
      `;
    }).join('');
  });

  // ===== ACTUATOR: STEPPER =====
  db.ref('Smarthome/jemuran_masuk').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const statusEl = document.getElementById('stepper-status');
    if (statusEl) {
      const isMasuk = val === true;
      statusEl.innerHTML = `
        <span class="status-dot ${!isMasuk ? 'active' : 'inactive'}"></span>
        ${!isMasuk ? 'Jemuran Keluar' : 'Jemuran Masuk'}
      `;
      statusEl.className = `status-indicator ${!isMasuk ? 'active' : 'inactive'}`;
    }

    devicesActive = countActiveDevices();
    updateDashboardStats();
  });

  // ===== ACTUATOR: SERVO (DOOR) =====
  db.ref('actuator/servo').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const statusEl = document.getElementById('servo-status');
    if (statusEl) {
      const isUnlocked = val === 'unlock' || val === 'buka' || val === true;
      statusEl.innerHTML = `
        <span class="status-dot ${isUnlocked ? 'active' : 'inactive'}"></span>
        ${isUnlocked ? '🔓 Pintu Terbuka' : '🔒 Pintu Terkunci'}
      `;
      statusEl.className = `status-indicator ${isUnlocked ? 'active' : 'inactive'}`;
    }

    devicesActive = countActiveDevices();
    updateDashboardStats();
    addActivity('Pintu', 'Servo SG90', val, val === 'unlock' ? 'success' : 'info', val === 'unlock' ? 'Terbuka' : 'Terkunci');
  });

  // ===== ACTUATOR: RELAYS =====
  for (let i = 1; i <= 2; i++) {
    db.ref(`Smarthome/relay${i}_nyala`).on('value', (snapshot) => {
      const val = snapshot.val();
      if (val === null) return;

      const isOn = val === true;

      // Update toggle switch state
      const toggles = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
      const relayIndex = i - 1;
      if (toggles[relayIndex]) {
        toggles[relayIndex].checked = isOn;
      }

      devicesActive = countActiveDevices();
      updateDashboardStats();
    });
  }

  // ===== SYSTEM STATUS =====
  db.ref('system/status').on('value', (snapshot) => {
    const val = snapshot.val();
    if (val === null) return;

    const sysCards = document.querySelectorAll('.sensor-card');
    sysCards.forEach(card => {
      const nameEl = card.querySelector('.sensor-name');
      if (nameEl && nameEl.textContent === 'Status Sistem') {
        const statusP = card.querySelector('p[style*="24px"]');
        if (statusP) statusP.textContent = `ESP32 — ${val}`;
      }
    });
  });

  addNotification('🔥 Firebase terhubung! Data realtime aktif.', 'success');
  console.log('✅ Semua Firebase listeners aktif');
}

// ==================== HELPER: UPDATE MONITORING PAGE ====================
function updateMonitoringProgress(cardClass, percent) {
  const cards = document.querySelectorAll(`#page-monitoring .${cardClass}`);
  cards.forEach(card => {
    const bar = card.querySelector('.sensor-progress-fill');
    if (bar) {
      bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
      bar.style.transition = 'width 0.6s ease';
    }
  });
}

function updateMonitoringBadge(cardClass, text, className) {
  const cards = document.querySelectorAll(`#page-monitoring .${cardClass}`);
  cards.forEach(card => {
    const badge = card.querySelector('.sensor-badge');
    if (badge) {
      badge.textContent = text;
      badge.className = className;
    }
  });
}

function updateSensorDesc(cardClass, text) {
  // Update both dashboard and monitoring sensor descriptions
  document.querySelectorAll(`.${cardClass} .sensor-desc`).forEach(el => {
    el.textContent = text;
  });
}

function updateMonitoringStats(sensor) {
  const stats = sensorHistory[sensor];
  if (!stats || stats.count === 0) return;

  const sensorClassMap = { gas: 'sensor-gas', ldr: 'sensor-light', rain: 'sensor-rain', ultrasonic: 'sensor-ultrasonic' };
  const cardClass = sensorClassMap[sensor];

  const cards = document.querySelectorAll(`#page-monitoring .${cardClass}`);
  cards.forEach(card => {
    const statSpans = card.querySelectorAll('span[style*="11.5px"]');
    if (statSpans.length >= 3) {
      statSpans[0].textContent = `Min: ${stats.min === Infinity ? '-' : stats.min.toFixed(1)}`;
      statSpans[1].textContent = `Max: ${stats.max === -Infinity ? '-' : stats.max.toFixed(1)}`;
      statSpans[2].textContent = `Avg: ${getSensorAvg(sensor)}`;
    }
  });
}

function updateAutomationBadge(index, text, type) {
  const rules = document.querySelectorAll('#page-control .history-card li');
  if (rules[index]) {
    const badge = rules[index].querySelector('.table-badge');
    if (badge) {
      badge.textContent = text;
      badge.className = `table-badge ${type}`;
    }
  }
}

// ==================== COUNT ACTIVE SENSORS & DEVICES ====================
function countActiveSensors() {
  let count = 0;
  if (sensorHistory.gas.count > 0) count++;
  if (sensorHistory.ldr.count > 0) count++;
  if (sensorHistory.rain.count > 0) count++;
  if (sensorHistory.ultrasonic.count > 0) count++;
  // RFID counts as a sensor too
  const rfidBadge = document.getElementById('rfid-badge');
  if (rfidBadge && rfidBadge.textContent !== 'Belum ada data') count++;
  return count;
}

function countActiveDevices() {
  let count = 0;
  const toggles = document.querySelectorAll('#page-control .toggle-switch input[type="checkbox"]');
  toggles.forEach(t => { if (t.checked) count++; });

  const stepperStatus = document.getElementById('stepper-status');
  if (stepperStatus && stepperStatus.textContent.includes('Terbuka')) count++;

  const servoStatus = document.getElementById('servo-status');
  if (servoStatus && servoStatus.textContent.includes('Terbuka')) count++;

  return count;
}

function updateDashboardStats() {
  // Total sensors
  const totalSensorEl = document.querySelectorAll('.stat-card.primary .stat-val');
  totalSensorEl.forEach(el => el.textContent = '5');
  const sensorSubEl = document.querySelectorAll('.stat-card.primary .stat-sub');
  sensorSubEl.forEach(el => el.textContent = `${sensorsActive} sensor aktif`);

  // Active devices
  const devEl = document.querySelectorAll('.stat-card.success .stat-val');
  devEl.forEach(el => el.textContent = devicesActive);
  const devSubEl = document.querySelectorAll('.stat-card.success .stat-sub');
  devSubEl.forEach(el => el.textContent = `dari 7 perangkat`);
}

// ==================== DEVICE CONTROL ====================
function controlDevice(device, action) {
  if (typeof firebase === 'undefined' || !db) {
    showToast('❌ Firebase belum terhubung!');
    return;
  }

  if (device === 'stepper') {
    db.ref('Smarthome/jemuran_masuk').set(action === 'tutup');
  } else if (device === 'servo') {
    db.ref('Smarthome/status_rfid').set(action === 'unlock' ? 'Akses Diterima' : 'Pintu Tertutup');
  } else {
    db.ref(`actuator/${device}`).set(action);
  }
  
  Promise.resolve()
    .then(() => {
      showToast(`✅ ${device === 'stepper' ? 'Jemuran' : 'Pintu'}: ${action}`);
      addNotification(`🎛️ ${device === 'stepper' ? 'Jemuran' : 'Pintu'} — ${action}`, 'success');
    })
    .catch((err) => {
      showToast(`❌ Gagal mengirim perintah: ${err.message}`);
      console.error('Control error:', err);
    });
}

function toggleRelay(relayNum, checkbox) {
  if (typeof firebase === 'undefined' || !db) {
    if (checkbox) checkbox.checked = !checkbox.checked;
    showToast('❌ Firebase belum terhubung!');
    return;
  }

  const isOn = checkbox ? checkbox.checked : false;

  db.ref(`Smarthome/relay${relayNum}_nyala`).set(isOn)
    .then(() => {
      const relayNames = ['Lampu Ruang Tamu', 'Lampu Kamar', 'Stop Kontak 1', 'Stop Kontak 2'];
      showToast(`✅ ${relayNames[relayNum - 1]}: ${isOn ? 'ON' : 'OFF'}`);
      addNotification(`💡 ${relayNames[relayNum - 1]} — ${isOn ? 'ON' : 'OFF'}`, isOn ? 'success' : 'info');
    })
    .catch((err) => {
      if (checkbox) checkbox.checked = !checkbox.checked;
      showToast(`❌ Gagal: ${err.message}`);
      console.error('Relay error:', err);
    });
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

  // Show max 20 entries per page
  const pageData = data.slice(0, 20);
  pageData.forEach((row, i) => {
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

  // Update footer
  const footer = document.querySelector('.table-footer span');
  if (footer) {
    footer.textContent = `Menampilkan ${pageData.length} dari ${data.length} aktivitas`;
  }
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
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
      });
    } else {
      window.location.href = 'index.html';
    }
  }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderHistory(activityLog);

  document.querySelectorAll('.card-animate').forEach((card, i) => {
    card.style.animationDelay = (0.05 + i * 0.06) + 's';
  });

  if (window.innerWidth < 900) {
    document.getElementById('sidebarOverlay').classList.add('hidden');
  }

  // Initialize Firebase listeners
  setTimeout(() => {
    initFirebaseListeners();
  }, 500);
});
