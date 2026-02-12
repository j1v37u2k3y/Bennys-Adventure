# CLAUDE.md - Benny's Adventure

## Project Overview
A pixel art platformer game built with vanilla JavaScript and HTML5 Canvas. No game engine or framework - all rendering is done directly on a 480x320 canvas (displayed at 2x scale with pixelated rendering).

## Quick Commands
- `npm install` - install dependencies (webpack only, no runtime deps)
- `npm start` - start dev server with hot reload (opens browser automatically)
- `npm run build` - production build to `dist/`
- No test suite exists (`npm test` is a placeholder)

## Architecture

### Entry Flow
`index.html` → `js/app.js` → `js/game/Game.js`

### Game Loop
`Game.js` runs a `requestAnimationFrame` loop. The game uses a **state pattern** - `currentState` is swapped between `MenuState`, `PreLevelState`, `PlayState`, `LevelCompleteState`, and `GameOverState`. Each state has `update(input)` and `render(renderer)` methods.

### Directory Layout
```
js/
  app.js                          # Entry point - creates canvas + Game
  game/
    Game.js                       # Main loop, state transitions
    data/
      constants.js                # ALL config: physics, colors, sizes, tile size
      SaveManager.js              # localStorage persistence for level progress
    entities/
      Player.js                   # Player movement, double jump, animation
      Gem.js                      # Collectible with bobbing + sparkle effect
      Platform.js                 # Static tile builder + renderer
    rendering/
      Renderer.js                 # Canvas wrapper (clear, fillRect, text)
      PixelSprites.js             # Sprite system - char arrays → pixel-by-pixel drawing
      particles.js                # Particle burst on gem collection
    systems/
      Input.js                    # Keyboard handler (arrows, WASD, space, escape)
      Physics.js                  # Gravity, AABB collision, tile→rect conversion
      Camera.js                   # Follow player, clamp to level bounds
    levels/
      levelData.js                # 5 levels as text grids (# = solid, . = empty)
    states/
      PreLevelState.js             # Pre-level leaderboard screen
      MenuState.js                # Level select screen (shows top leaderboard entry)
      PlayState.js                # Gameplay (player, gems, platforms, camera, timer)
      LevelCompleteState.js       # Victory screen with initials entry + leaderboard
      GameOverState.js            # Game over screen (retry or return to menu)
```

### Key Conventions
- **Tile size**: 16x16 pixels (`TILE` constant)
- **Sprites**: Defined as arrays of character strings in `PixelSprites.js`, drawn pixel-by-pixel. Each character maps to a color via palettes.
- **Levels**: Defined in `levelData.js` as text grids using `row()` helper. `#` = solid tile, `.` = empty. Levels also specify `playerStart` and `gems` positions in pixel coords.
- **Collision**: Separated-axis AABB resolution in `Physics.js` (X then Y).
- **All constants** (gravity, speed, jump force, colors, canvas size) live in `data/constants.js`. Tune gameplay by editing values there.
- **No delta time** - the game loop runs at requestAnimationFrame rate without frame-independent timing.
- **Lives**: Player starts with 5 hearts (`PLAYER_MAX_LIVES`). Falling off screen costs a life, resets gems, and respawns the player. Losing all lives triggers `GameOverState`.
- **Timer & Leaderboard**: `PlayState` tracks elapsed time via `performance.now()`. On level complete, players enter 3-character arcade-style initials if they qualify for the top-5 leaderboard. `SaveManager` stores a sorted leaderboard per level (up to `LEADERBOARD_SIZE` entries, each with `{initials, time}`). The leaderboard displays on the level complete screen and the #1 entry shows on the level select menu.

### Adding a New Level
1. Add a level object in `js/game/levels/levelData.js` following the existing format
2. Add it to the `LEVELS` array export
3. Update `TOTAL_LEVELS` in `js/game/data/constants.js`

### Adding a New Entity
1. Create a class in `js/game/entities/` with `update()` and `render(ctx, camera)` methods
2. If it needs a sprite, add the pixel art data + palette entry in `PixelSprites.js`
3. Instantiate and wire it up in `PlayState.js`