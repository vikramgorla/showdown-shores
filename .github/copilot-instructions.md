# Showdown Shores - AI Coding Assistant Guide

## Project Overview
**Showdown Shores** is a browser-based multiplayer arcade game prototype built for JOM School Challenge 2025. It's a pure vanilla JavaScript HTML5 Canvas game with no build tools or dependencies - everything runs directly in the browser.

## Architecture

### File Structure & Responsibilities
- **`index.html`** - Main lobby interface with character customization, currency system, and navigation
- **`game.js`** - Core gameplay engine: canvas rendering, physics, enemy AI, collision detection, and game state
- **`script.js`** - Lobby UI logic: tab management, modal controls, cooldown system, and game launcher
- **`styles.css`** - Main styling with CSS animations, gradients, and responsive layouts
- **`credits.html/css/js`** - Team credits page with confetti effects and interactive animations

### Key Design Patterns

**Dual-Screen Architecture**: The app toggles between lobby (`.container`) and game (`.game-screen`) by adding/removing `.active` class. State persists via `gameState` object in `script.js`.

**Attack Cooldown System**: Implemented twice (lobby preview + in-game). Uses `Date.now()` for precise timing with `requestAnimationFrame()` for smooth progress bar updates. See `startCooldown()` in `script.js` and `updateCooldownUI()` in `game.js`.

**Canvas Game Loop**: Classic pattern in `game.js` - `update()` for logic, `draw()` for rendering, `gameLoop()` with `requestAnimationFrame()`. Timer uses `setInterval` for 60-second countdown.

**Enemy Spawning**: Enemies spawn from random canvas edges (4 sides) and pathfind toward player using normalized vectors. Initial spawn + periodic interval (`enemySpawnInterval`).

**Particle System**: Explosion/attack effects use simple physics arrays with lifetime counters. Updated and rendered each frame, removed when `lifetime <= 0`.

**Touch Controls**: Virtual joystick on left side of canvas for movement, right side tap for attacks. Uses `touchstart`/`touchmove`/`touchend` events with vector normalization. Joystick visually rendered with semi-transparent circles during touch.

## Developer Workflows

### Testing the Game
1. Open `index.html` directly in browser (no server needed)
2. Click "▶️ READY TO PLAY" to launch game canvas
3. **Desktop**: Use WASD/Arrows to move, click/space to attack
4. **Mobile/Touch**: Touch left side of screen for virtual joystick movement, touch right side to attack
5. Exit with "❌ Exit" button to return to lobby

### Adding New Customization Items
Edit the `panels` object in `updateCustomizationPanel()` in `script.js`. Format:
```javascript
{ icon: '🎮', name: 'ItemName', locked: false/true, req: 'Requirement' }
```

### Modifying Game Mechanics
- **Player stats**: Edit `this.player` object in `Game` constructor (`game.js`)
- **Enemy behavior**: Modify `spawnEnemy()` and enemy update loop in `update()` method
- **Cooldowns**: Change `maxCooldown` value (milliseconds) in both `gameState` and `Game` class

## Project Conventions

### Emoji-First Design
This project uses emojis extensively for visual elements instead of images:
- Character preview: `🏄‍♂️`
- Enemies: `🦀 🦞 🐙 🦑 🐡`
- UI buttons and icons throughout

When adding features, maintain this emoji-based aesthetic.

### Color System
CSS variables in `styles.css` define the tropical theme:
```css
--tropical-orange: #FF6B35
--ocean-blue: #4ECDC4
--palm-green: #95E1D3
--sunset-pink: #FF9ECD
--sandy-beige: #F9F7F3
```
Always reference these instead of hardcoding colors.

### Animation Philosophy
Animations use CSS `@keyframes` for static effects (waves, bounce) and JavaScript `element.animate()` Web Animations API for dynamic/interactive effects (confetti, particles). No animation libraries.

### No Build Step
This is intentional - keep dependencies zero. Use vanilla JS features supported in modern browsers. No npm, webpack, or transpilation.

## Common Tasks

### Adding a New Enemy Type
1. Add emoji to `enemyTypes` array in `spawnEnemy()` method
2. Optionally adjust `speed` or `health` ranges in enemy object

### Creating New Modals
1. Add HTML structure in `index.html` following `.modal` > `.modal-content` pattern
2. Add open/close logic in `script.js` event listeners
3. Style with rounded corners, backdrop, and slide-down animation (see existing modals)

### Implementing New Attacks
1. Modify `attack()` method in `game.js` to create different projectile types
2. Update collision detection in `update()` method's projectile loop
3. Adjust `maxCooldown` if needed for balance

### Credits Page Interactions
`credits.js` demonstrates the animation patterns:
- Click team members to trigger celebration particles
- Confetti uses staggered timeouts for cascade effect
- Messages use Web Animations API with multi-keyframe sequences

## Technical Notes

- Canvas size dynamically adjusts to viewport: `window.innerHeight - 150` (accounts for header/footer)
- Character rotation uses CSS `rotateY()` transform, incremented by 90° on click
- Notifications slide in from right using dynamically injected animations
- Game timer and enemy spawner use `setInterval`, both cleared on `game.stop()`

## Team Context
Created by Vedika, Navya, Ayan, Akshaj, Melvin, Midhun for JOM School Challenge (Nov 13, 2025). Maintain the fun, playful tone and beach/tropical theme in all additions.
