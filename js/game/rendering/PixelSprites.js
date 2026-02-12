import {
  PLAYER_SKIN, PLAYER_HAIR, PLAYER_SHIRT, PLAYER_PANTS,
  PLAYER_SHOES, PLAYER_EYE, PLAYER_WHITE,
  GEM_BLUE, GEM_CYAN, GEM_WHITE, GEM_DARK,
  GRASS_GREEN, GRASS_DARK, DIRT_BROWN, DIRT_DARK, DIRT_LIGHT,
  UI_GOLD, UI_LOCKED
} from '../data/constants.js';

// Color key: each character maps to a color
// '.' = transparent
const PALETTES = {
  player: {
    'S': PLAYER_SKIN,
    'H': PLAYER_HAIR,
    'R': PLAYER_SHIRT,
    'P': PLAYER_PANTS,
    'B': PLAYER_SHOES,
    'E': PLAYER_EYE,
    'W': PLAYER_WHITE,
  },
  gem: {
    'B': GEM_BLUE,
    'C': GEM_CYAN,
    'W': GEM_WHITE,
    'D': GEM_DARK,
  },
  star: {
    'G': UI_GOLD,
    'W': '#fff8e0',
  },
  lock: {
    'L': UI_LOCKED,
    'D': '#444444',
    'K': '#888888',
  }
};

// Player idle sprite (12x16)
const PLAYER_IDLE = [
  '....HHHH....',
  '...HHHHHH...',
  '...HHSSHH...',
  '...HSESSEH..',
  '...SSSSSS...',
  '....SSSS....',
  '...RRRRRR...',
  '..RRRRRRRR..',
  '..RSRRRRS...',
  '..SSRRRRS...',
  '....RRRR....',
  '...PP..PP...',
  '...PP..PP...',
  '..PPP..PPP..',
  '..BB....BB..',
  '..BBB..BBB..',
];

// Player run frame 1 (12x16)
const PLAYER_RUN1 = [
  '....HHHH....',
  '...HHHHHH...',
  '...HHSSHH...',
  '...HSESSEH..',
  '...SSSSSS...',
  '....SSSS....',
  '...RRRRRR...',
  '..RRRRRRRR..',
  '..RSRRRRS...',
  '..SSRRRRS...',
  '....RRRR....',
  '....PP.PP...',
  '...PP...PP..',
  '..PP.....P..',
  '..BB....BB..',
  '.BBB........',
];

// Player run frame 2 (12x16)
const PLAYER_RUN2 = [
  '....HHHH....',
  '...HHHHHH...',
  '...HHSSHH...',
  '...HSESSEH..',
  '...SSSSSS...',
  '....SSSS....',
  '...RRRRRR...',
  '..RRRRRRRR..',
  '..RSRRRRS...',
  '..SSRRRRS...',
  '....RRRR....',
  '...PP.PP....',
  '..PP...PP...',
  '..P.....PP..',
  '..BB....BB..',
  '........BBB.',
];

// Player jump sprite (12x16)
const PLAYER_JUMP = [
  '....HHHH....',
  '...HHHHHH...',
  '...HHSSHH...',
  '...HSESSEH..',
  '...SSSSSS...',
  '..SSSSSSSS..',
  '..SRRRRRRR..',
  '..RRRRRRRR..',
  '...RRRRRR...',
  '...SRRRRS...',
  '....RRRR....',
  '...PP..PP...',
  '..PP....PP..',
  '..PP....PP..',
  '.BB......BB.',
  '.BB......BB.',
];

// Gem sprite (10x10)
const GEM_SPRITE = [
  '....WW....',
  '...WCCW...',
  '..WCCBBW..',
  '.WCCCBBBW.',
  'WCCCCBBBBW',
  'DCCCBBBBBD',
  '.DCCBBBD..',
  '..DCBBD...',
  '...DDDD...',
  '....DD....',
];

// Star (for completed levels) 7x7
const STAR_SPRITE = [
  '...G...',
  '..GWG..',
  '.GGWGG.',
  'GGGGGGG',
  '.GGGGG.',
  '..GGG..',
  '.GG.GG.',
];

// Lock (for locked levels) 8x8
const LOCK_SPRITE = [
  '..KKKK..',
  '.K....K.',
  '.K....K.',
  'LLLLLLLL',
  'LDDLLDLL',
  'LDDDDDDL',
  'LDDDDDLL',
  'LLLLLLLL',
];

export const SPRITES = {
  playerIdle: { data: PLAYER_IDLE, palette: 'player', w: 12, h: 16 },
  playerRun1: { data: PLAYER_RUN1, palette: 'player', w: 12, h: 16 },
  playerRun2: { data: PLAYER_RUN2, palette: 'player', w: 12, h: 16 },
  playerJump: { data: PLAYER_JUMP, palette: 'player', w: 12, h: 16 },
  gem: { data: GEM_SPRITE, palette: 'gem', w: 10, h: 10 },
  star: { data: STAR_SPRITE, palette: 'star', w: 7, h: 7 },
  lock: { data: LOCK_SPRITE, palette: 'lock', w: 8, h: 8 },
};

/**
 * Draw a pixel sprite to the canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} spriteName - key in SPRITES
 * @param {number} x - draw position x
 * @param {number} y - draw position y
 * @param {boolean} flipX - mirror horizontally
 */
export function drawSprite(ctx, spriteName, x, y, flipX = false) {
  const sprite = SPRITES[spriteName];
  if (!sprite) return;

  const palette = PALETTES[sprite.palette];
  const rows = sprite.data;
  const px = Math.round(x);
  const py = Math.round(y);

  for (let row = 0; row < rows.length; row++) {
    const line = rows[row];
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === '.') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      const drawCol = flipX ? (sprite.w - 1 - col) : col;
      ctx.fillRect(px + drawCol, py + row, 1, 1);
    }
  }
}

/**
 * Draw a grass/dirt tile at position.
 */
export function drawGrassTile(ctx, x, y, isTop) {
  const px = Math.round(x);
  const py = Math.round(y);

  if (isTop) {
    // Grass top (3px grass layer)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 16; col++) {
        const noise = ((col * 7 + row * 13) % 5);
        ctx.fillStyle = noise < 2 ? GRASS_DARK : GRASS_GREEN;
        ctx.fillRect(px + col, py + row, 1, 1);
      }
    }
    // Dirt below grass
    for (let row = 3; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        const noise = ((col * 11 + row * 7) % 7);
        ctx.fillStyle = noise < 2 ? DIRT_DARK : noise < 3 ? DIRT_LIGHT : DIRT_BROWN;
        ctx.fillRect(px + col, py + row, 1, 1);
      }
    }
  } else {
    // All dirt
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        const noise = ((col * 11 + row * 7) % 7);
        ctx.fillStyle = noise < 2 ? DIRT_DARK : noise < 3 ? DIRT_LIGHT : DIRT_BROWN;
        ctx.fillRect(px + col, py + row, 1, 1);
      }
    }
  }
}
