// ===== PAGE NAVIGATION =====
const pages = ['landing', 'stability', 'harmony', 'growth'];
let currentPage = 'landing';
let isTransitioning = false;

function navigateTo(pageId) {
  if (isTransitioning || pageId === currentPage) return;
  isTransitioning = true;

  const current = document.getElementById(currentPage);
  const next = document.getElementById(pageId);

  // Reset any flipped cards on the page we're leaving
  const flippedCards = current.querySelectorAll('.flip-card.flipped');
  flippedCards.forEach(card => card.classList.remove('flipped'));

  // Transition out
  current.classList.remove('active');

  // Transition in
  requestAnimationFrame(() => {
    next.classList.add('active');
    currentPage = pageId;
    updateNavDots();
    updateProgress();

    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  });
}

// ===== NAV DOTS =====
function updateNavDots() {
  document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.page === currentPage);
  });
}

// Click handlers for nav dots
document.addEventListener('click', (e) => {
  const dot = e.target.closest('.nav-dot');
  if (dot && dot.dataset.page) {
    navigateTo(dot.dataset.page);
  }
});

// ===== PROGRESS BAR =====
function createProgressBar() {
  const track = document.createElement('div');
  track.className = 'progress-track';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.id = 'progress-fill';
  track.appendChild(fill);
  document.body.appendChild(track);
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  if (!fill) return;
  const index = pages.indexOf(currentPage);
  const pct = ((index + 1) / pages.length) * 100;
  fill.style.width = pct + '%';
}

createProgressBar();
updateProgress();

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  const idx = pages.indexOf(currentPage);

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (idx < pages.length - 1) navigateTo(pages[idx + 1]);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (idx > 0) navigateTo(pages[idx - 1]);
  } else if (e.key === 'Escape') {
    // Close overlay or go home
    const overlay = document.getElementById('color-wheel-overlay');
    if (!overlay.classList.contains('hidden')) {
      toggleOverlay();
    } else if (currentPage !== 'landing') {
      navigateTo('landing');
    }
  }
});

// ===== TOUCH SWIPE =====
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  const threshold = 60;

  // Only trigger if horizontal swipe is dominant
  if (Math.abs(diffX) < threshold || Math.abs(diffX) < Math.abs(diffY)) return;

  const idx = pages.indexOf(currentPage);

  if (diffX > 0 && idx < pages.length - 1) {
    // Swipe left -> next page
    navigateTo(pages[idx + 1]);
  } else if (diffX < 0 && idx > 0) {
    // Swipe right -> prev page
    navigateTo(pages[idx - 1]);
  }
}

// ===== MOUSE WHEEL NAVIGATION =====
let wheelTimeout = null;
document.addEventListener('wheel', (e) => {
  if (wheelTimeout) return;

  const idx = pages.indexOf(currentPage);

  if (e.deltaY > 30 && idx < pages.length - 1) {
    navigateTo(pages[idx + 1]);
  } else if (e.deltaY < -30 && idx > 0) {
    navigateTo(pages[idx - 1]);
  }

  wheelTimeout = setTimeout(() => {
    wheelTimeout = null;
  }, 800);
}, { passive: true });

// ===== OVERLAY =====
function toggleOverlay() {
  const overlay = document.getElementById('color-wheel-overlay');
  overlay.classList.toggle('hidden');
}

// ===== CARD FLIP SOUND/HAPTIC FEEDBACK =====
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    // Subtle haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });
});

// ===== PARALLAX ON DESKTOP (background only) =====
if (window.matchMedia('(min-width: 768px)').matches) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll('.page-bg').forEach(bg => {
      bg.style.transform = `scale(1.05) translate(${x * -8}px, ${y * -8}px)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.page-bg').forEach(bg => {
      bg.style.transform = 'scale(1.05) translate(0, 0)';
    });
  });
}

// ===== INTERSECTION OBSERVER FOR VIDEO =====
const video = document.querySelector('.video-bg video');
if (video) {
  // Pause video when not on landing page
  const observer = new MutationObserver(() => {
    if (currentPage === 'landing') {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  // Watch for page changes
  const landing = document.getElementById('landing');
  observer.observe(landing, { attributes: true, attributeFilter: ['class'] });
}
