/* config */
const pageUrls = [
  'index.html',
  'explore.html',
  'stability.html',
  'harmony.html',
  'growth.html',
  'about.html',
];

const section = document.querySelector('.page');
const pageIndex = section ? parseInt(section.dataset.pageIndex || '0', 10) : 0;

function goToPage(index) {
  if (index >= 0 && index < pageUrls.length) {
    window.location.href = pageUrls[index];
  }
}

/* animation */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.page');
  if (page && !page.classList.contains('active')) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        page.classList.add('active');
      });
    });
  }
});

/* menu */
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');
const navClose = document.getElementById('nav-close');

if (hamburger && navOverlay) {
  hamburger.addEventListener('click', () => {
    const isOpen = navOverlay.classList.contains('open');
    navOverlay.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    navOverlay.setAttribute('aria-hidden', String(isOpen));
  });

  navClose?.addEventListener('click', () => {
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
  });

  navOverlay.addEventListener('click', (e) => {
    if (e.target === navOverlay) {
      navOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* progress */
function createProgressBar() {
  const track = document.createElement('div');
  track.className = 'progress-track';
  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.id = 'progress-fill';
  track.appendChild(fill);
  document.body.appendChild(track);
  const pct = ((pageIndex + 1) / pageUrls.length) * 100;
  fill.style.width = pct + '%';
}

createProgressBar();

/* keyboard */
document.addEventListener('keydown', (e) => {
  if (navOverlay?.classList.contains('open')) {
    if (e.key === 'Escape') {
      navOverlay.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    if (pageIndex < pageUrls.length - 1) goToPage(pageIndex + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (pageIndex > 0) goToPage(pageIndex - 1);
  } else if (e.key === 'Escape') {
    if (pageIndex !== 0) goToPage(0);
  }
});

/* touch */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (navOverlay?.classList.contains('open')) return;
  const diffX = touchStartX - e.changedTouches[0].screenX;
  const diffY = touchStartY - e.changedTouches[0].screenY;
  const threshold = 60;
  if (Math.abs(diffX) < threshold || Math.abs(diffX) < Math.abs(diffY)) return;
  if (diffX > 0 && pageIndex < pageUrls.length - 1) goToPage(pageIndex + 1);
  else if (diffX < 0 && pageIndex > 0) goToPage(pageIndex - 1);
}, { passive: true });


/* parallax */
if (window.matchMedia('(min-width: 768px)').matches) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('.page-bg, .theme-card-bg').forEach(bg => {
      bg.style.transform = `scale(1.05) translate(${x * -8}px, ${y * -8}px)`;
    });
  });

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.page-bg, .theme-card-bg').forEach(bg => {
      bg.style.transform = 'scale(1.05) translate(0, 0)';
    });
  });
}

/* cards */
const dynamicCard = document.getElementById('dynamic-card');

if (dynamicCard) {
  dynamicCard.addEventListener('click', () => {
    dynamicCard.classList.toggle('flipped');
    if (navigator.vibrate) navigator.vibrate(10);
  });
  dynamicCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dynamicCard.classList.toggle('flipped');
    }
  });

  function selectColor(btn) {
    const { hex, r, g, b, name, psych, traits, desc, history } = btn.dataset;

    dynamicCard.classList.remove('flipped');
    dynamicCard.style.opacity = '0';

    /* reset drawer */
    const drawer = document.getElementById('history-drawer');
    if (drawer) drawer.classList.remove('active');

    setTimeout(() => {
      /* front */
      document.getElementById('dynamic-ring').style.borderColor = `rgba(${r},${g},${b},0.45)`;
      document.getElementById('dynamic-swatch').style.background = hex;
      document.getElementById('dynamic-name').textContent = name;
      document.getElementById('dynamic-hex').textContent = hex;

      /* back */
      document.getElementById('dynamic-back-title').textContent = psych;
      document.getElementById('dynamic-traits').innerHTML = traits.split('|').map(t => `<li>${t}</li>`).join('');
      document.getElementById('dynamic-desc').textContent = desc;

      /* history */
      const historyEl = document.getElementById('dynamic-history');
      if (historyEl) historyEl.textContent = history || '';

      document.querySelectorAll('.color-selector').forEach(s => s.classList.remove('cs-active'));
      btn.classList.add('cs-active');

      dynamicCard.style.opacity = '1';
    }, 150);
  }

  document.querySelectorAll('.color-selector').forEach(btn => {
    btn.addEventListener('click', () => selectColor(btn));
  });

  /* history drawer events */
  document.getElementById('open-history')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('history-drawer')?.classList.add('active');
  });

  document.getElementById('close-history')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('history-drawer')?.classList.remove('active');
  });

  document.getElementById('history-drawer')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

/* video */
const video = document.querySelector('.video-bg video');
if (video) {
  video.play().catch(() => { });
}
