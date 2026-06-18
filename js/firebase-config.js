/* ===================================================
   SmartHome - Firebase Configuration & Initialization
   Firebase Realtime Database Integration
   =================================================== */

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ9yhVcWEndxoSFUBqDHXeFgNYRiN96XM",
  authDomain: "smarthome-33d1e.firebaseapp.com",
  databaseURL: "https://smarthome-33d1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smarthome-33d1e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const db = firebase.database();

// ==================== CONNECTION STATUS ====================
const connRef = db.ref('.info/connected');

connRef.on('value', (snap) => {
  const connected = snap.val() === true;
  updateConnectionStatus(connected);
});

function updateConnectionStatus(isConnected) {
  const espStatus = document.querySelector('.esp-status');
  const espDot = document.querySelector('.esp-dot');
  const espText = espStatus ? espStatus.querySelector('span:last-child') : null;
  const welcomeStatus = document.querySelector('.welcome-status');

  if (isConnected) {
    if (espDot) espDot.style.background = '#22C55E';
    if (espText) espText.textContent = 'Firebase Terhubung';
    if (welcomeStatus) {
      welcomeStatus.innerHTML = '<span class="welcome-status-dot" style="background:#22C55E"></span> Sistem aktif — Data realtime';
    }
    // Update system status card
    const sysCards = document.querySelectorAll('.sensor-card');
    sysCards.forEach(card => {
      const nameEl = card.querySelector('.sensor-name');
      if (nameEl && nameEl.textContent === 'Status Sistem') {
        const badge = card.querySelector('.sensor-badge');
        if (badge) {
          badge.textContent = 'Online';
          badge.style.background = 'rgba(34,197,94,0.2)';
          badge.style.color = '#22C55E';
        }
        const desc = card.querySelector('p[style*="12px"]');
        if (desc) desc.textContent = 'Firebase Realtime Database aktif';
        const bar = card.querySelector('.sensor-progress-fill');
        if (bar) bar.style.width = '100%';
      }
    });
  } else {
    if (espDot) espDot.style.background = '#EF4444';
    if (espText) espText.textContent = 'Firebase Terputus';
    if (welcomeStatus) {
      welcomeStatus.innerHTML = '<span class="welcome-status-dot" style="background:#EF4444"></span> Koneksi terputus';
    }
  }
}

console.log('🔥 Firebase initialized successfully');
console.log('📡 Database URL:', firebaseConfig.databaseURL);
