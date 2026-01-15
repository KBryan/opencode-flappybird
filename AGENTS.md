# Agentic Development Guidelines for Flappy Bird Clone

This document provides context, commands, and coding standards for AI agents (and human developers) working on the Flappy Bird Clone codebase. This project is a lightweight, vanilla JavaScript implementation of the classic game, designed to run directly in the browser without complex build steps.

## 1. Project Overview & Architecture

### Technology Stack
- **HTML5 Canvas**: Primary rendering engine.
- **Vanilla JavaScript**: Game logic, state management, and rendering loop. No external libraries or frameworks are used.
- **CSS3**: Styling for the UI overlay (start screen, game over screen, score).

### Directory Structure
The project is contained within the `flappy-bird/` directory.
- `index.html`: Entry point and DOM structure.
- `script.js`: Contains the entire game engine, logic, entities, and main loop.
- `style.css`: Visual styling for the game container and UI elements.

## 2. Build, Run, and Test Commands

Since this is a static web project, there are no compilation or transpilation steps.

### Running the Project
The application requires a web environment.

**Option 1: Simple Static Server (Recommended)**
Use Python's built-in HTTP server or Node.js `serve` to avoid CORS issues with local assets (though currently none are used).

```bash
# From the root directory or flappy-bird directory:
cd flappy-bird
python3 -m http.server 8000
# OR
npx serve .
```
Access the game at `http://localhost:8000`.

**Option 2: Direct File Access**
You can simply open `index.html` in a modern web browser, though a local server is preferred for future-proofing.

### Testing
There are currently **no automated unit tests** (Jest/Mocha) set up for this project.
- **Manual Verification**: All changes must be verified by running the game in the browser.
- **Critical Paths to Test**:
  - Game start (transition from "Get Ready" to "Game").
  - Bird physics (jumping, gravity, rotation).
  - Pipe generation and movement.
  - Collision detection (bird vs. pipes, bird vs. ground).
  - Game Over state and Restart functionality.
  - Score updating.

### Linting
There is no configured linter (ESLint/Prettier). Agents should strictly follow the existing formatting patterns observed in the files.

## 3. Code Style & Conventions

Adhere to the following patterns to maintain consistency with the existing codebase.

### JavaScript (`script.js`)

**Formatting**
- **Indentation**: Use **4 spaces** for indentation. Do not use tabs.
- **Semicolons**: Always use semicolons at the end of statements.
- **Quotes**: Use single quotes `'` for strings, unless double quotes `"` are necessary to avoid escaping.

**Naming Conventions**
- **Variables & Functions**: `camelCase` (e.g., `initGame`, `scoreDisplay`, `handleInput`).
- **Constants**: `camelCase` for mutable/runtime objects (e.g., `bird`, `pipes`), but explicit configuration constants (if added) should use `UPPER_SNAKE_CASE`.
- **Classes/Objects**: The current pattern uses singleton objects for entities (e.g., `const bird = { ... }`). Maintain this pattern rather than introducing ES6 Classes unless a refactor is explicitly requested.

**Structure & Logic**
- **Game State**: Use the global `gameState` object to manage transitions (`getReady`, `game`, `over`).
- **Game Loop**: The `loop()` function drives the game, utilizing `requestAnimationFrame`.
- **Entities**: Entities (`bird`, `pipes`, `fg`, `bg`) should encapsulate their own `draw()` and `update()` methods.
- **DOM Interaction**: Cache DOM elements at the top of the file. Do not query the DOM inside the game loop.

**Example Pattern (Object Entity)**
```javascript
const entityName = {
    x: 0,
    y: 0,
    
    draw: function() {
        ctx.save();
        // Drawing logic
        ctx.restore();
    },
    
    update: function() {
        // Physics logic
    },
    
    reset: function() {
        // Reset state
    }
};
```

### CSS (`style.css`)

- **Indentation**: 4 spaces.
- **Selectors**: Use kebab-case for IDs and classes (e.g., `#game-container`, `.hidden`).
- **Grouping**: Group related styles (e.g., UI overlays together).
- **Z-Index**: Ensure UI layers (`#ui-layer`, `#score-display`) sit above the canvas.

### HTML (`index.html`)

- **Indentation**: 4 spaces.
- **Structure**: Keep the structure flat. The `canvas` and `ui-layer` should be siblings within the `game-container`.

## 4. Error Handling & Safety

- **Canvas Context**: Ensure `ctx` operations are valid. When using `ctx.save()` always pair it with `ctx.restore()`.
- **Event Listeners**: If adding new event listeners, consider if they need to be removed on restart (currently, global listeners are persistent, which is acceptable for this simple architecture).
- **Infinite Loops**: Be extremely careful within the `update()` methods and `while` loops. The game loop runs at 60fps; inefficient code will cause jank.

## 5. Future Development Rules

If an agent is asked to add features:

1.  **Refactoring**: If the code grows significantly, consider breaking `script.js` into modules (ESM). However, do not do this unless the file exceeds 500-600 lines or complexity demands it.
2.  **Assets**: If introducing images/sprites, create an `assets/` folder. Ensure all image loading is asynchronous and the game waits for assets to load before starting `initGame()`.
3.  **Responsiveness**: The game currently has a fixed logic size (320x480). If making it responsive, scale the canvas via CSS or `ctx.scale`, but keep the internal logical coordinate system consistent to preserve physics tuning.

## 6. AI Agent Specific Instructions

- **Context Window**: When reading files, always read `script.js` in its entirety if changing game logic, as state is global and tightly coupled.
- **Modification**: When modifying `script.js`, prefer using `edit` with `replaceAll: false` if the change is localized. For large logic rewrites, rewriting the specific function (e.g., `bird.update`) is safer.
- **Output**: When asked to implement a feature, provide the code within the existing architectural pattern (Object literal with draw/update methods).

---
*No .cursorrules or .github/copilot-instructions.md were found in the repository.*
