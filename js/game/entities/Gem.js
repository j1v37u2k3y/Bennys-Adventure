import { GEM_SIZE, GEM_BOB_SPEED, GEM_BOB_RANGE } from '../data/constants.js';
import { drawSprite } from '../rendering/PixelSprites.js';
import { aabbOverlap } from '../systems/Physics.js';

export default class Gem {
  constructor(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.w = GEM_SIZE;
    this.h = GEM_SIZE;
    this.collected = false;
    this.bobPhase = Math.random() * Math.PI * 2;
    this.sparkleTimer = 0;
  }

  update() {
    if (this.collected) return;
    this.bobPhase += GEM_BOB_SPEED;
    this.y = this.baseY + Math.sin(this.bobPhase) * GEM_BOB_RANGE;
    this.sparkleTimer += 0.1;
  }

  /**
   * Check collision with player and collect if overlapping.
   * Returns true if just collected.
   */
  checkCollect(player) {
    if (this.collected) return false;
    if (aabbOverlap(player, this)) {
      this.collected = true;
      return true;
    }
    return false;
  }

  render(ctx, camera) {
    if (this.collected) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    drawSprite(ctx, 'gem', screenX, screenY);

    // Sparkle effect - small white pixel that orbits
    const sparkleAngle = this.sparkleTimer * 2;
    const sx = screenX + 5 + Math.cos(sparkleAngle) * 7;
    const sy = screenY + 5 + Math.sin(sparkleAngle) * 7;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.5 + Math.sin(this.sparkleTimer * 3) * 0.5;
    ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
    ctx.globalAlpha = 1;
  }
}
