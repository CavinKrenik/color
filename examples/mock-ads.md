# Mock Ad Components

`pages/mockindex.html` is a page that floods the screen with 14
intentionally annoying ads: banners, popups, tickers, fake video players, and more. They all share a simple show/hide pattern but each type uses different layout and animation technique.

Below are four examples. All 14 use the same base system. So if you want to spend a few hours creating your own!

---

## The Shared Pattern

Every ad follows the same lifecycle:

1. Start hidden (`opacity: 0; pointer-events: none`).
2. A timed schedule adds the `.visible` class.
3. The close button removes `.visible`.

```css
/* Base — all ads start invisible */
.mock-ad {
  position: fixed;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 9000;
}

/* Shown state */
.mock-ad.visible {
  opacity: 1;
  pointer-events: all;
}

/* Close button */
.ad-x {
  position: absolute;
  top: 6px;
  right: 10px;
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
}
```

```js
// Staggered reveal schedule
const adSchedule = [
  { id: 'ad-cookie',       delay: 600 },
  { id: 'ad-banner-top',   delay: 1500 },
  { id: 'ad-sidebar-right',delay: 2800 },
  // ...more ads at increasing delays...
  { id: 'ad-takeover',     delay: 10000 },
];

adSchedule.forEach(({ id, delay }) => {
  setTimeout(() => {
    document.getElementById(id)?.classList.add('visible');
  }, delay);
});

// Close buttons
document.querySelectorAll('.ad-x').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.mock-ad').classList.remove('visible');
  });
});
```

---

## 1. Banner Ad (Top)

A fixed bar pinned to the top of the viewport with a flashing animation.

```html
<div class="mock-ad" id="ad-banner-top">
  <button class="ad-x">&times;</button>
  <strong>FREE FIRE WOOD!!!</strong>
  <span>WE just need your CREDIT CARD number</span>
  <button class="ad-cta">BUY NOW!!!</button>
</div>
```

```css
#ad-banner-top {
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: yellow;
  border-bottom: 3px solid red;
  color: #000;
  text-align: center;
  font-weight: 900;
  z-index: 9999;
  animation: adFlash 0.7s infinite;   /* the annoying blink */
}

@keyframes adFlash {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
}
```

**Why it works:** `position: fixed` + `top: 0` + `width: 100%` makes it stick to the top edge. The `adFlash` keyframe alternates opacity to create ablink effect.

---

## 2. Popup Ad (Center)

A floating box in the middle of the screen: the classic popup.

```html
<div class="mock-ad" id="ad-popup-1">
  <button class="ad-x">&times;</button>
  <div class="ad-top-bar">SPECIAL OFFER</div>
  <div class="ad-icon">&#127793;</div>
  <div class="ad-body">
    <strong>Free Forest Tours!</strong>
    <p>Join 10,000+ HARDWOOD enthusiasts...</p>
  </div>
  <button class="ad-cta">CLAIM OFFER</button>
</div>
```

```css
#ad-popup-1 {
  top: 30%;
  left: 10%;
  width: 260px;
  background: #fff;
  color: #222;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  text-align: center;
  padding-bottom: 14px;
}
```

**Why it works:** Absolute `top`/`left` percentages place it wherever you want.
The `box-shadow` lifts it off the page. Since it's `position: fixed`, it stays put even when you scroll.

---

## 3. Scrolling Ticker

A horizontal marquee that continuously scrolls sponsor names across the screen.

```html
<div class="mock-ad" id="ad-ticker">
  <button class="ad-x">&times;</button>
  <div class="ticker-wrap">
    <div class="ticker-content">
      SPONSORED BY: HARDWOOD | FIREWOOD | SOFTWOOD | ...
      <!-- content is duplicated so the loop is seamless -->
      SPONSORED BY: HARDWOOD | FIREWOOD | SOFTWOOD | ...
    </div>
  </div>
</div>
```

```css
#ad-ticker {
  top: 46px;                        /* sits just below the top banner */
  left: 0;
  width: 100%;
  background: #111;
  color: #0f0;
  padding: 6px 0;
  overflow: hidden;
  font-family: monospace;
  font-size: 0.85rem;
}

.ticker-content {
  display: inline-block;
  white-space: nowrap;
  animation: tickerScroll 18s linear infinite;
}

@keyframes tickerScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

**Why it works:** The text is duplicated inside `.ticker-content` so when the animation shifts it left by 50%, the second copy seamlessly takes over where the
first began creating an infinite loop with no jump.

---

## 4. Fake Video Ad

A mock video player with a progress bar, skip button, and metadata but no actual video, just CSS illusion.

```html
<div class="mock-ad" id="ad-video">
  <button class="ad-x">&times;</button>
  <div class="vid-screen">
    <div class="vid-play">&#9654;</div>
  </div>
  <div class="vid-bar">
    <div class="vid-progress"></div>
  </div>
  <div class="vid-meta">
    <span>Ad &bull; 0:30</span>
    <button class="vid-skip">Skip in 5s &raquo;</button>
  </div>
</div>
```

```css
#ad-video {
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.vid-screen {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #1a1a1a, #333);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vid-progress {
  height: 100%;
  background: red;
  width: 0%;
  animation: vidProgress 30s linear forwards;
}

@keyframes vidProgress {
  from { width: 0%; }
  to   { width: 100%; }
}
```

**Why it works:** The "video" is just a gradient box with a play icon centered with a flexbox. The progress bar animates its `width` from 0% to 100% over 30 seconds using a simple
keyframe, no `<video>` element needed.

---

## All 14 Ad Types at a Glance

| Type | ID | Position | Notable Trick |
|------|----|----------|---------------|
| Top Banner | `ad-banner-top` | Fixed top | Flashing keyframe |
| Right Sidebar | `ad-sidebar-right` | Right edge | Revenue counter |
| Center Popup | `ad-popup-1` | Center-left | Review quote |
| Bottom Banner | `ad-banner-bottom` | Fixed bottom | Split layout |
| Left Sidebar | `ad-sidebar-left` | Left edge | Star rating |
| Congrats Popup | `ad-popup-2` | Center-right | Countdown timer, gold glow |
| Sponsor Ticker | `ad-ticker` | Below top banner | Infinite scroll marquee |
| Adblocker Warning | `ad-popup-3` | Center-bottom | Dual action buttons |
| Exit Intent | `ad-popup-4` | Bottom-left | Dark overlay |
| Full Takeover | `ad-takeover` | Full overlay | Pulsing icon |
| Cookie Consent | `ad-cookie` | Bottom-center | Accept/manage buttons |
| Download App | `ad-app` | Top-center | App store style |
| Video Ad | `ad-video` | Bottom-center | Fake progress bar |
| Live Chat | `ad-chat` | Bottom-right | Typing indicator dots |

---

## Key File

All the HTML, CSS, and JS for the mock ads live in a single file:
`pages/mockindex.html`

