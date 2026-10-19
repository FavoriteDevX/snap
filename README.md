# ⚡ snap.js

> Production-grade, microelement anchoring and viewpoint collision mitigation engine in under 100 lines of pure vanilla JavaScript.

`snap` calculates coordinates to attach floating elements (tooltips, overlays, dropdown menus) to target trigger elements without dragging heavy third-party framework bundles (`Floating UI`, `Popper`). It monitors document viewports to enforce responsive layout protection.

## 🔥 Key Technical Superpowers
*   **Viewport Edge Clamping:** Elements detect window limits and dynamically constrain horizontal axes to prevent edge clippings.
*   **Contextual Structural Fallbacks:** Automatically flips from `top` to `bottom` modes if local boundaries compress layout breathing space.
*   **Zero Layout Repaints:** Leverages explicit rounding logic to lock positions accurately without micro-pixel blur anomalies.
*   **Passive Hardware Listeners:** Event listeners deploy via `{ passive: true }` matrices ensuring high-performance frame rendering speeds during heavy scrolling.

## 🚀 API and Usage Specifications

### Programmatic Implementation
```javascript
import { snap, autoSnap } from './snap.js';

const anchorNode = document.querySelector('#action-button');
const targetFloat = document.querySelector('#floating-menu');

// Single instant rendering pass
snap(anchorNode, targetFloat, {
  position: 'top',  // Expected placement: 'top' | 'bottom' | 'left' | 'right'
  offset: 12,       // Pixel gap between elements
  boundaryGap: 16   // Safety pad threshold from screen border
});

// Dynamic responsive window tracking
const destroy = autoSnap(anchorNode, targetFloat, { position: 'bottom' });

// Kill active layout listeners when interface unmounts
destroy();
```
