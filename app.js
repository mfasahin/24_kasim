/**
 * ==========================================================================
 * 24 KASIM ÖĞRETMENLER GÜNÜ - UYGULAMA MANTIĞI (APP.JS)
 * ==========================================================================
 * Bu dosya; palamut toplama oyununu, sincap animasyonlarını, modal kontrolünü,
 * karne & daktilo efektini ve konfeti yağmurunu yönetir.
 * Veriler sadece bellekte (in-memory) saklanır, localStorage kullanılmaz.
 */

// Oyun Durumu (In-Memory State)
const state = {
  collectedCount: 0,
  collectedIndices: new Set(),
  isTypewriterFinished: false,
  typewriterTimeout: null
};

// Palamut Inline SVG Şablonu
const ACORN_SVG = `
  <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Sap -->
    <path d="M40 8C40 8 39 16 35 22" stroke="#673E21" stroke-width="4.5" stroke-linecap="round"/>
    <!-- Palamut Şapkası (Kabuk) -->
    <path d="M16 28C16 23 26 20 40 20C54 20 64 23 64 28C64 34 56 38 40 38C24 38 16 34 16 28Z" fill="#8D5B36" stroke="#673E21" stroke-width="2.5"/>
    <!-- Şapka Dokusu -->
    <path d="M26 23C32 29 48 29 54 23" stroke="#673E21" stroke-width="2" stroke-linecap="round"/>
    <path d="M22 28C30 35 50 35 58 28" stroke="#673E21" stroke-width="2" stroke-linecap="round"/>
    <!-- Palamut Gövdesi -->
    <path d="M20 30C20 30 18 52 35 68C38 71 42 71 45 68C62 52 60 30 60 30C52 35 28 35 20 30Z" fill="url(#acornBodyGrad)" stroke="#B55B1E" stroke-width="2.5"/>
    <!-- Parlama Efekti -->
    <path d="M26 38C25 46 30 56 36 60" stroke="#FFF0D4" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <defs>
      <linearGradient id="acornBodyGrad" x1="20" y1="30" x2="60" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#F4A261"/>
        <stop offset="50%" stop-color="#D97736"/>
        <stop offset="100%" stop-color="#9C4311"/>
      </linearGradient>
    </defs>
  </svg>
`;

// DOM Elemanları Referansları
let heroTitleEl;
let teacherSquirrel;
let acornsGrid;
let progressFill;
let progressCountText;
let progressStatusHint;
let progressBar;
let lockedCard;
let unlockedCard;
let reportRecipientName;
let scoreList;
let letterText;
let skipTypewriterBtn;
let finalSection;
let btnSurprise;
let surpriseCard;
let surpriseTitle;
let surpriseText;
let surpriseDetails;
let btnReplay;
let noteModal;
let modalNoteIcon;
let modalNoteIndex;
let modalNoteTitle;
let modalNoteText;
let modalCloseBtn;

/**
 * Uygulamayı Başlat
 */
function initApp() {
  // DOM elementlerini al
  heroTitleEl = document.getElementById('heroTitle');
  teacherSquirrel = document.getElementById('teacherSquirrel');
  acornsGrid = document.getElementById('acornsGrid');
  progressFill = document.getElementById('progressFill');
  progressCountText = document.getElementById('progressCountText');
  progressStatusHint = document.getElementById('progressStatusHint');
  progressBar = document.getElementById('progressBar');

  lockedCard = document.getElementById('lockedCard');
  unlockedCard = document.getElementById('unlockedCard');
  reportRecipientName = document.getElementById('reportRecipientName');
  scoreList = document.getElementById('scoreList');
  letterText = document.getElementById('letterText');
  skipTypewriterBtn = document.getElementById('skipTypewriterBtn');

  finalSection = document.getElementById('finalSection');
  btnSurprise = document.getElementById('btnSurprise');
  surpriseCard = document.getElementById('surpriseCard');
  surpriseTitle = document.getElementById('surpriseTitle');
  surpriseText = document.getElementById('surpriseText');
  surpriseDetails = document.getElementById('surpriseDetails');
  btnReplay = document.getElementById('btnReplay');

  noteModal = document.getElementById('noteModal');
  modalNoteIcon = document.getElementById('modalNoteIcon');
  modalNoteIndex = document.getElementById('modalNoteIndex');
  modalNoteTitle = document.getElementById('modalNoteTitle');
  modalNoteText = document.getElementById('modalNoteText');
  modalCloseBtn = document.getElementById('modalCloseBtn');

  // 1. Hero başlığını CONFIG ile doldur
  const formattedTitle = CONFIG.heroTitle.replace('{name}', `<span class="highlight">${escapeHtml(CONFIG.name)}</span>`);
  heroTitleEl.innerHTML = formattedTitle;
  reportRecipientName.textContent = `Öğretmen: ${CONFIG.name}`;

  // 2. Palamut ızgarasını render et
  renderAcornSlots();

  // 3. Karnedeki not kriterlerini render et
  renderScorecard();

  // 4. Modal kapatma dinleyicileri
  modalCloseBtn.addEventListener('click', closeModal);
  noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && noteModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 5. Daktilo geçiş butonu
  skipTypewriterBtn.addEventListener('click', skipTypewriter);

  // 6. Sürpriz ve Tekrar Oyna Dinleyicileri
  btnSurprise.addEventListener('click', revealSurprise);
  btnReplay.addEventListener('click', restartGame);
}

/**
 * Palamut Izgarasını Oluştur
 */
function renderAcornSlots() {
  acornsGrid.innerHTML = '';
  CONFIG.notes.forEach((note, index) => {
    const slot = document.createElement('div');
    slot.className = 'acorn-slot';
    slot.id = `acorn-slot-${index}`;

    slot.innerHTML = `
      <button class="acorn-btn" aria-label="${index + 1}. Meşe Palamudunu Topla: ${escapeHtml(note.title)}" data-index="${index}">
        <div class="acorn-svg-wrapper">
          ${ACORN_SVG}
        </div>
        <span class="acorn-hint">Palamut #${index + 1}</span>
      </button>
      <button class="acorn-checked-badge" aria-label="${escapeHtml(note.title)} notunu tekrar oku" data-index="${index}">
        <span class="collected-sparkle-icon" aria-hidden="true">✨</span>
        <span class="collected-label">${escapeHtml(note.title)}</span>
        <span class="collected-reread-pill">Tekrar Oku 📖</span>
      </button>
    `;

    // İlk toplama butonu
    const btn = slot.querySelector('.acorn-btn');
    btn.addEventListener('click', () => handleAcornClick(index));

    // Toplandıktan sonra tekrar okuma butonu
    const badgeBtn = slot.querySelector('.acorn-checked-badge');
    badgeBtn.addEventListener('click', () => openNoteModal(index));

    acornsGrid.appendChild(slot);
  });
}

/**
 * Palamut Tıklama Mantığı
 */
function handleAcornClick(index) {
  if (state.collectedIndices.has(index)) return;

  // Duruma ekle
  state.collectedIndices.add(index);
  state.collectedCount = state.collectedIndices.size;

  const slot = document.getElementById(`acorn-slot-${index}`);
  if (slot) {
    slot.classList.add('collected');
  }

  // Sincap neşeli zıplama animasyonu
  triggerSquirrelJump();

  // İlerleme çubuğunu güncelle
  updateProgress();

  // Not kartı modalını aç
  openNoteModal(index);

  // Eğer 6 palamudun hepsi toplandıysa karne bölümünü aç
  if (state.collectedCount === CONFIG.notes.length) {
    setTimeout(unlockReportCard, 650);
  }
}

/**
 * Sincap Sevinç Zıplaması Tetikleyici
 */
function triggerSquirrelJump() {
  if (!teacherSquirrel) return;
  teacherSquirrel.classList.remove('jump');
  void teacherSquirrel.offsetWidth; // Reflow
  teacherSquirrel.classList.add('jump');
}

/**
 * İlerleme Çubuğu Güncellemesi
 */
function updateProgress() {
  const percentage = (state.collectedCount / CONFIG.notes.length) * 100;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', state.collectedCount);
  progressCountText.textContent = `${state.collectedCount} / ${CONFIG.notes.length} palamut toplandı`;

  if (state.collectedCount === CONFIG.notes.length) {
    progressStatusHint.textContent = "Tebrikler! Karnen Hazır! 🎓";
  } else {
    progressStatusHint.textContent = `${CONFIG.notes.length - state.collectedCount} tane kaldı! 🍂`;
  }
}

/**
 * Not Kartı Modalını Aç
 */
function openNoteModal(index) {
  const note = CONFIG.notes[index];
  if (!note) return;

  modalNoteIcon.textContent = note.icon || "🌰";
  modalNoteIndex.textContent = `Palamut ${index + 1} / ${CONFIG.notes.length}`;
  modalNoteTitle.textContent = note.title;
  modalNoteText.textContent = note.text;

  noteModal.classList.add('active');
  modalCloseBtn.focus();
}

function closeModal() {
  noteModal.classList.remove('active');
}

/**
 * Karne ve Kriterleri Render Et
 */
function renderScorecard() {
  scoreList.innerHTML = '';
  CONFIG.scorecard.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'score-item';
    itemEl.innerHTML = `
      <div class="score-info">
        <span class="score-label">${escapeHtml(item.label)}</span>
        <span class="score-value" id="scoreVal-${index}">0</span>
      </div>
      <div class="score-bar-bg" aria-hidden="true">
        <div class="score-bar-fill" id="scoreBar-${index}"></div>
      </div>
    `;
    scoreList.appendChild(itemEl);
  });
}

/**
 * Karne Kilidini Aç
 */
function unlockReportCard() {
  lockedCard.style.display = 'none';
  unlockedCard.style.display = 'block';
  finalSection.style.display = 'block';

  // Karneye yumuşakça kaydır
  unlockedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Puan barlarını canlandır
  animateScores();

  // Mektubu daktilo efektiyle yazmaya başla
  startTypewriter(CONFIG.letter);
}

function animateScores() {
  CONFIG.scorecard.forEach((item, index) => {
    const bar = document.getElementById(`scoreBar-${index}`);
    const valEl = document.getElementById(`scoreVal-${index}`);
    const target = item.value || 100;

    setTimeout(() => {
      if (bar) bar.style.width = `${Math.min(target, 100)}%`;

      let current = 0;
      const duration = 1200;
      const stepTime = Math.max(10, Math.floor(duration / target));
      const timer = setInterval(() => {
        current += 1;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          valEl.textContent = `${current} (Pekiyi ★)`;
        } else {
          valEl.textContent = current;
        }
      }, stepTime);
    }, index * 140);
  });
}

/**
 * Daktilo Efekti
 */
function startTypewriter(text) {
  letterText.textContent = '';
  state.isTypewriterFinished = false;
  skipTypewriterBtn.style.display = 'inline-block';

  let charIndex = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  letterText.appendChild(cursor);

  function typeChar() {
    if (state.isTypewriterFinished) return;

    if (charIndex < text.length) {
      const char = text.charAt(charIndex);
      cursor.insertAdjacentText('beforebegin', char);
      charIndex++;

      let delay = 22;
      if (char === '.' || char === '!' || char === '?') delay = 200;
      else if (char === ',') delay = 110;
      else if (char === '\n') delay = 160;

      state.typewriterTimeout = setTimeout(typeChar, delay);
    } else {
      finishTypewriter();
    }
  }

  typeChar();
}

function skipTypewriter() {
  if (state.typewriterTimeout) clearTimeout(state.typewriterTimeout);
  finishTypewriter();
}

function finishTypewriter() {
  state.isTypewriterFinished = true;
  letterText.textContent = CONFIG.letter;
  skipTypewriterBtn.style.display = 'none';
}

/**
 * Günün Sürprizini Aç
 */
function revealSurprise() {
  surpriseTitle.textContent = CONFIG.surprise.title;
  surpriseText.textContent = CONFIG.surprise.text;
  surpriseDetails.innerHTML = CONFIG.surprise.details.replace(/\n/g, '<br>');

  surpriseCard.style.display = 'block';
  surpriseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Konfeti ve yaprak yağmuru
  startConfettiShower();
}

/**
 * Canvas Konfeti & Sonbahar Yaprakları Yağmuru (Yüksek Performanslı)
 */
function startConfettiShower() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#D97736', '#EAB308', '#C84B31', '#2D4739', '#F4A261', '#E76F51', '#FF6B6B'];
  const particles = [];
  const particleCount = 70;
  let isSpawning = true;

  // 4 saniye sonra yeni parçacık üretimi durur
  setTimeout(() => {
    isSpawning = false;
  }, 3800);

  function createParticle() {
    return {
      x: Math.random() * width,
      y: -20,
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      type: Math.random() > 0.4 ? 'leaf' : (Math.random() > 0.5 ? 'heart' : 'star'),
      opacity: 1
    };
  }

  for (let i = 0; i < particleCount; i++) {
    const p = createParticle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function drawLeaf(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function drawHeart(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    const s = p.size * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.3, s * 0.3, 0, s * 1.2);
    ctx.bezierCurveTo(s * 1.3, s * 0.3, s, -s * 0.6, 0, s * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function drawStar(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * p.size * 0.6,
                 -Math.sin((18 + i * 72) * Math.PI / 180) * p.size * 0.6);
      ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * p.size * 0.3,
                 -Math.sin((54 + i * 72) * Math.PI / 180) * p.size * 0.3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let animationId;
  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      if (p.type === 'leaf') drawLeaf(ctx, p);
      else if (p.type === 'heart') drawHeart(ctx, p);
      else drawStar(ctx, p);

      if (p.y > height + 20) {
        if (isSpawning) {
          particles[i] = createParticle();
        } else {
          p.opacity -= 0.025;
        }
      }
    }

    const activeParticles = particles.filter(p => p.opacity > 0 && p.y <= height + 20);
    if (isSpawning || activeParticles.length > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationId);
    }
  }

  render();
}

/**
 * Oyunu Sıfırla ve Yeniden Başlat
 */
function restartGame() {
  state.collectedCount = 0;
  state.collectedIndices.clear();
  state.isTypewriterFinished = false;
  if (state.typewriterTimeout) clearTimeout(state.typewriterTimeout);

  updateProgress();
  renderAcornSlots();
  renderScorecard();

  lockedCard.style.display = 'block';
  unlockedCard.style.display = 'none';
  finalSection.style.display = 'none';
  surpriseCard.style.display = 'none';

  document.getElementById('chalkboardGame').scrollIntoView({ behavior: 'smooth' });
}

/**
 * XSS Koruması için HTML Escape
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sayfa yüklendiğinde başlat
window.addEventListener('DOMContentLoaded', initApp);

