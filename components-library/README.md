# Work2U Components Library

3 production-ready React Bits components, ported to **pure HTML/CSS/JavaScript** (no React, no build step).

## Components

### 1. `liquid-chrome.html` — LiquidChrome Background
WebGL animated liquid metal background with mouse interaction.
- **Tech**: ogl.js + custom GLSL shader
- **Use for**: Hero sections, login pages, landing pages
- **Configurable**: baseColor, speed, amplitude, frequencyX/Y, interactive

```html
<div class="liquidChrome-container" id="liquid-bg"></div>
```

### 2. `magic-bento.html` — MagicBento Grid
Responsive feature grid with mouse-tracking effects.
- **Tech**: Vanilla JS (no GSAP, no React)
- **Features**:
  - Global cursor spotlight (follows mouse)
  - Border glow on hover
  - 3D perspective tilt
  - Click ripple
  - Responsive 1→2→4 columns
- **Use for**: Feature showcases, dashboard tiles, portfolio grids

```html
<div class="card-grid">
  <div class="magic-bento-card magic-bento-card--border-glow">...</div>
</div>
```

### 3. `glass-surface.html` — GlassSurface
SVG-filter glass effect with chromatic aberration.
- **Tech**: SVG feDisplacementMap + backdrop-filter
- **Use for**: Modals, floating panels, navigation, hero overlays
- **Configurable**: brightness, opacity, blur, displacement, blend mode

```html
<div class="glass-surface" data-glass>
  <div class="glass-surface__content">
    <p>Your content</p>
  </div>
</div>
```

## Usage

### Quick Start
1. Open `index.html` in browser to see all demos
2. Copy any individual `.html` file to your project
3. Paste the `<style>` and `<script>` sections into your page

### Integration Options

**Option A: Drop in entire file**
```bash
cp magic-bento.html myproject/components/
# Open in browser or serve via HTTP
```

**Option B: Embed into existing page**
1. Copy `<style>` block from component HTML
2. Copy HTML markup pattern
3. Copy `<script>` block (rename IIFE if needed)

**Option C: Inline in React/Vue**
The vanilla JS uses simple patterns — easy to wrap:
```jsx
useEffect(() => {
  // paste script content
}, []);
```

## Browser Support

| Component | Chrome | Safari | Firefox |
|-----------|--------|--------|---------|
| LiquidChrome | ✓ | ✓ | ✓ |
| MagicBento | ✓ | ✓ | ✓ |
| GlassSurface | ✓ | ✗* | ✗* |

*GlassSurface falls back to standard backdrop-filter blur on Safari/Firefox.

## Performance Notes

- **LiquidChrome**: ~60fps. Uses one draw call per frame.
- **MagicBento**: Negligible cost. Throttled mousemove.
- **GlassSurface**: GPU-accelerated via SVG filter. Devs should test on low-end devices.

## Customization Examples

### LiquidChrome — Gold Theme
```js
const config = {
  baseColor: [1.0, 0.85, 0.4],  // gold
  speed: 0.3,
  amplitude: 0.8,
  ...
};
```

### MagicBento — Different Glow Color
```css
:root {
  --glow-color: 0, 200, 255;  /* cyan */
}
```

### GlassSurface — Frosted Look
```js
const config = {
  brightness: 80,
  opacity: 0.7,
  blur: 20,
  distortionScale: -100,
};
```

## Source

Originally from [reactbits.dev](https://reactbits.dev) by David Haz.
These are vanilla JS ports — no React/Next.js/Bundler needed.
