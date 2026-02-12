import {
  PLAYER_SPEED, PLAYER_JUMP, PLAYER_WIDTH, PLAYER_HEIGHT
} from '../data/constants.js';
import { applyGravity, resolveCollisions } from '../systems/Physics.js';
import { drawSprite } from '../rendering/PixelSprites.js';

export default class Player {
  constructor(startX, startY) {
    this.spawnX = startX;
    this.spawnY = startY;
    this.x = startX;
    this.y = startY;
    this.w = PLAYER_WIDTH;
    this.h = PLAYER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facingRight = true;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
    this.animTimer = 0;
    this.animFrame = 0;
  }

  update(input, collisionRects) {
    // Horizontal movement
    this.vx = 0;
    if (input.left) {
      this.vx = -PLAYER_SPEED;
      this.facingRight = false;
    }
    if (input.right) {
      this.vx = PLAYER_SPEED;
      this.facingRight = true;
    }

    // Jump / double jump
    if (input.jump) {
      if (this.onGround) {
        this.vy = PLAYER_JUMP;
        this.onGround = false;
        this.canDoubleJump = true;
        this.hasDoubleJumped = false;
      } else if (this.canDoubleJump && !this.hasDoubleJumped) {
        this.vy = PLAYER_JUMP * 0.85;
        this.hasDoubleJumped = true;
      }
    }

    // Gravity
    applyGravity(this);

    // Collision resolution
    resolveCollisions(this, collisionRects);

    // Reset double jump on landing
    if (this.onGround) {
      this.canDoubleJump = false;
      this.hasDoubleJumped = false;
    }

    // Animation
    if (!this.onGround) {
      this.animFrame = 0; // jump frame
    } else if (this.vx !== 0) {
      this.animTimer += 0.15;
      this.animFrame = Math.floor(this.animTimer) % 2 + 1; // run 1 or 2
    } else {
      this.animTimer = 0;
      this.animFrame = 0;
    }
  }

  /**
   * Reset to spawn position (called on fall off screen).
   */
  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.canDoubleJump = false;
    this.hasDoubleJumped = false;
  }

  render(ctx, camera) {
    let spriteName;
    if (!this.onGround) {
      spriteName = 'playerJump';
    } else if (this.vx !== 0) {
      spriteName = this.animFrame === 1 ? 'playerRun1' : 'playerRun2';
    } else {
      spriteName = 'playerIdle';
    }

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;
    drawSprite(ctx, spriteName, screenX, screenY, !this.facingRight);
  }
}
