# Benny's Adventure

A pixel art platformer game built with vanilla JavaScript and HTML5 Canvas.

## How to Play

### Controls
| Action | Keys |
|--------|------|
| Move left/right | Arrow keys or A/D |
| Jump | Space, Up arrow, or W |
| Double jump | Press jump again mid-air |
| Select level | Arrow keys on menu, Space/Enter to confirm |
| Return to menu | Escape |

### Goal
Collect all gems in each level to complete it. Levels unlock sequentially - beat one to unlock the next.

You have **5 hearts** - falling off the screen costs one heart and resets all gems. Lose all hearts and it's game over!

A **speedrun timer** tracks your completion time. When you finish a level with a top-5 time, you'll enter 3-character arcade-style initials for the **leaderboard**. The top entry for each level is shown on the level select screen. Try to climb the ranks!

## Running the Game

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### Install & Run
```bash
# Install dependencies
npm install

# Start the dev server (opens in browser automatically)
npm start
```

The game will open at `http://localhost:8080` (or the next available port). The dev server supports **hot reload** - changes to source files are reflected immediately in the browser.

### Production Build
```bash
npm run build
```

Output goes to the `dist/` directory. Serve it with any static file server.

## Making Changes

### Tweaking Gameplay
All physics and gameplay constants are in `js/game/data/constants.js`:
- `GRAVITY` / `MAX_FALL_SPEED` - fall speed
- `PLAYER_SPEED` - horizontal movement speed
- `PLAYER_JUMP` - jump force (negative = upward)
- `GEM_BOB_SPEED` / `GEM_BOB_RANGE` - gem floating animation

Edit a value, save, and the dev server will hot reload.

### Adding a Level
Edit `js/game/levels/levelData.js`:
1. Create a new level object with `tiles`, `playerStart`, `gems`, and `name`
2. Tiles use `row('..##..')` syntax where `#` = solid ground and `.` = empty space
3. Add the level to the `LEVELS` array
4. Bump `TOTAL_LEVELS` in `js/game/data/constants.js`

### Editing Sprites
Sprites are defined as character arrays in `js/game/rendering/PixelSprites.js`. Each character maps to a color in a palette. `.` is transparent. Edit the arrays directly to change how characters and objects look.

## Project Structure
```
index.html                  HTML shell with canvas element
css/style.css               Styling (canvas scaling, background)
js/
  app.js                    Entry point
  game/
    Game.js                 Game loop and state management
    data/
      constants.js          All configuration values
      SaveManager.js        Level progress (localStorage)
    entities/               Game objects (Player, Gem, Platform)
    rendering/              Canvas drawing (Renderer, sprites, particles)
    systems/                Input, Physics, Camera
    levels/                 Level definitions (tile grids)
    states/                 Game screens (Menu, Play, LevelComplete, GameOver)
```

## Technical Details
- **No game engine** - pure HTML5 Canvas 2D
- **No runtime dependencies** - only webpack for bundling
- **Native resolution**: 480x320, displayed at 2x (960x640) with CSS `image-rendering: pixelated`
- **Pixel art sprites**: Defined inline as character grids, drawn pixel-by-pixel to canvas
- **Physics**: AABB collision with separated-axis resolution
- **Save data**: Stored in `localStorage` under the key `bennys_adventure_save` (level progress + per-level leaderboards)