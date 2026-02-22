# Flip Card Component

How 3D Flipcards work and how to implement them.

---

## How It Works

The trick is three CSS properties working together:

1. **`transform-style: preserve-3d`** — tells the browser to render children in 3D
   space instead of flattening them.
2. **`backface-visibility: hidden`** — hides whichever face is turned away from you.
3. **`rotateY(180deg)`** — spins the card around its vertical axis when a class is
   toggled.

The back face starts pre rotated 180 degrees so it's hidden, similar to creating them in XD. When the card flips,
the front rotates away and the back rotates into view.

---

## Minimal HTML

```html
<div class="flip-card" tabindex="0" role="button" aria-label="Flip card">
  <div class="flip-card-inner">

    <!-- Front -->
    <div class="flip-card-front">
      <div class="swatch" style="background: #0E550A;"></div>
      <span>Deep Forest Green</span>
      <span>#0E550A</span>
    </div>

    <!-- Back (starts pre rotated so it's hidden) -->
    <div class="flip-card-back">
      <h4>Ancient Strength</h4>
      <ul>
        <li>Grounded</li>
        <li>Enduring</li>
      </ul>
      <p>The quiet permanence of an ancient forest floor.</p>
    </div>

  </div>
</div>
```

---

## Minimal CSS

```css
.flip-card {
  width: 200px;
  height: 280px;
  perspective: 800px;   /* gives depth to the 3D effect */
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;              /* key: keep children in 3D */
  transition: transform 0.7s ease;
}

/* When .flipped is added, rotate the inner wrapper */
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

/* Both faces share these rules */
.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;               /* key: hide the far side */
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  background: #111;
  color: #fff;
}

/* The back starts rotated so it faces away on load */
.flip-card-back {
  transform: rotateY(180deg);
}
```

---

## Minimal JavaScript

```js
const card = document.querySelector('.flip-card');

// Click to flip
card.addEventListener('click', () => {
  card.classList.toggle('flipped');
});

// Keyboard accessible (Enter or Space)
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    card.classList.toggle('flipped');
  }
});
```

That's it! toggling the `.flipped` class is the only JS needed. Everything else
is CSS.

---

## What the Real Version Adds

The color pages build on this with a few extras:

- **Dynamic content** — clicking a color selector swaps the swatch, name, hex,
  traits, and description via `dataset` attributes on the selector buttons.
- **Glow ring** — the swatch sits inside a ring whose `border-color` updates to
  match the selected color at reduced opacity.
- **History drawer** — a slide-up panel triggered from the card back that shows
  historical context for the color.
- **Haptic feedback** — `navigator.vibrate(10)` gives a subtle buzz on supported
  devices.
- **Hover scale** — `transform: scale(1.03)` on hover (disabled once flipped).

---

## Key Files

| What            | Where                                        |
|-----------------|----------------------------------------------|
| Card HTML       | `pages/stability.html` (and harmony, growth) |
| Card CSS        | `css/color-page.css`                         |
| Demo card CSS   | `css/design.css`                             |
| Flip JS         | `script.js`                                  |

## ENJOY!
