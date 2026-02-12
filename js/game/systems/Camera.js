import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE } from '../data/constants.js';

export default class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  /**
   * Follow a target entity, clamped to level bounds.
   * @param {object} target - { x, y, w, h }
   * @param {number} levelWidth - in tiles
   * @param {number} levelHeight - in tiles
   */
  follow(target, levelWidth, levelHeight) {
    // Center camera on target
    let targetX = target.x + target.w / 2 - CANVAS_WIDTH / 2;
    let targetY = target.y + target.h / 2 - CANVAS_HEIGHT / 2;

    // Clamp to level bounds
    const maxX = levelWidth * TILE - CANVAS_WIDTH;
    const maxY = levelHeight * TILE - CANVAS_HEIGHT;

    this.x = Math.max(0, Math.min(targetX, maxX));
    this.y = Math.max(0, Math.min(targetY, maxY));
  }

  /**
   * Reset camera position.
   */
  reset() {
    this.x = 0;
    this.y = 0;
  }
}
