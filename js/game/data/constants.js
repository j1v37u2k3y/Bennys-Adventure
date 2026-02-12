// Canvas dimensions (native resolution)
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 320;

// Tile / grid size
export const TILE = 16;

// Physics
export const GRAVITY = 0.55;
export const MAX_FALL_SPEED = 10;
export const PLAYER_SPEED = 2.2;
export const PLAYER_JUMP = -8.5;
export const PLAYER_WIDTH = 12;
export const PLAYER_HEIGHT = 16;

// Gem
export const GEM_SIZE = 10;
export const GEM_BOB_SPEED = 0.05;
export const GEM_BOB_RANGE = 3;

// Colors - sky gradient
export const SKY_TOP = '#5c94fc';
export const SKY_BOTTOM = '#a0c4ff';

// Colors - platforms
export const GRASS_GREEN = '#4abe30';
export const GRASS_DARK = '#2d8a1e';
export const DIRT_BROWN = '#8b5e3c';
export const DIRT_DARK = '#6b3f22';
export const DIRT_LIGHT = '#a07050';

// Colors - player
export const PLAYER_SKIN = '#fcb880';
export const PLAYER_HAIR = '#6a3420';
export const PLAYER_SHIRT = '#e03030';
export const PLAYER_PANTS = '#3050c0';
export const PLAYER_SHOES = '#4a2810';
export const PLAYER_EYE = '#222222';
export const PLAYER_WHITE = '#ffffff';

// Colors - gem
export const GEM_BLUE = '#40c0ff';
export const GEM_CYAN = '#80e0ff';
export const GEM_WHITE = '#ffffff';
export const GEM_DARK = '#2080b0';

// Colors - UI
export const UI_WHITE = '#ffffff';
export const UI_BLACK = '#000000';
export const UI_SHADOW = 'rgba(0,0,0,0.5)';
export const UI_GOLD = '#ffd700';
export const UI_GREEN = '#4abe30';
export const UI_GRAY = '#888888';
export const UI_DARK_GRAY = '#444444';
export const UI_LOCKED = '#666666';

// Game states
export const STATE_MENU = 'menu';
export const STATE_PLAYING = 'playing';
export const STATE_LEVEL_COMPLETE = 'levelComplete';

// Level count
export const TOTAL_LEVELS = 5;

// Leaderboard
export const LEADERBOARD_SIZE = 5;

// Lives
export const PLAYER_MAX_LIVES = 5;

// Respawn
export const RESPAWN_Y_THRESHOLD = 50; // pixels below canvas bottom to trigger respawn

// Time formatting helper
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const whole = Math.floor(secs);
  const centis = Math.floor((secs - whole) * 100);
  return `${mins}:${String(whole).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}
