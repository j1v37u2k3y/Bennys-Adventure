import { GRAVITY, MAX_FALL_SPEED, TILE } from '../data/constants.js';

/**
 * Apply gravity to an entity with { vy } property.
 */
export function applyGravity(entity) {
  entity.vy += GRAVITY;
  if (entity.vy > MAX_FALL_SPEED) {
    entity.vy = MAX_FALL_SPEED;
  }
}

/**
 * AABB overlap check.
 */
export function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Resolve collisions between an entity and platform tiles.
 * Uses separated axis resolution (X then Y).
 * Entity must have { x, y, w, h, vx, vy, onGround }.
 * Platforms is an array of { x, y, w, h } rects.
 */
export function resolveCollisions(entity, platforms) {
  entity.onGround = false;

  // Move on X axis
  entity.x += entity.vx;
  for (const plat of platforms) {
    if (aabbOverlap(entity, plat)) {
      if (entity.vx > 0) {
        entity.x = plat.x - entity.w;
      } else if (entity.vx < 0) {
        entity.x = plat.x + plat.w;
      }
      entity.vx = 0;
    }
  }

  // Move on Y axis
  entity.y += entity.vy;
  for (const plat of platforms) {
    if (aabbOverlap(entity, plat)) {
      if (entity.vy > 0) {
        entity.y = plat.y - entity.h;
        entity.onGround = true;
      } else if (entity.vy < 0) {
        entity.y = plat.y + plat.h;
      }
      entity.vy = 0;
    }
  }
}

/**
 * Convert tile grid data into collision rectangles.
 * tileGrid is a 2D array where 1 = solid tile, 0 = empty.
 * Returns array of { x, y, w, h } in pixel coords.
 */
export function buildCollisionRects(tileGrid) {
  const rects = [];
  for (let row = 0; row < tileGrid.length; row++) {
    for (let col = 0; col < tileGrid[row].length; col++) {
      if (tileGrid[row][col] !== 0) {
        rects.push({
          x: col * TILE,
          y: row * TILE,
          w: TILE,
          h: TILE,
        });
      }
    }
  }
  return rects;
}
