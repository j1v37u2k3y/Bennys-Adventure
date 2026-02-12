import {
  CANVAS_WIDTH, CANVAS_HEIGHT, TILE,
  RESPAWN_Y_THRESHOLD, UI_WHITE, UI_GOLD, GEM_BLUE
} from '../data/constants.js';
import Player from '../entities/Player.js';
import Gem from '../entities/Gem.js';
import Platform from '../entities/Platform.js';
import Camera from '../systems/Camera.js';
import ParticleSystem from '../rendering/particles.js';
import { buildCollisionRects } from '../systems/Physics.js';
import { drawSprite } from '../rendering/PixelSprites.js';

export default class PlayState {
  constructor(game, levelIndex) {
    this.game = game;
    this.levelIndex = levelIndex;
    this.levelData = game.getLevelData(levelIndex);

    // Build world
    this.collisionRects = buildCollisionRects(this.levelData.tiles);
    this.platformTiles = Platform.buildTiles(this.levelData.tiles);
    this.levelWidth = this.levelData.tiles[0].length;
    this.levelHeight = this.levelData.tiles.length;

    // Create player
    const sp = this.levelData.playerStart;
    this.player = new Player(sp.x, sp.y);

    // Create gems
    this.gems = this.levelData.gems.map(g => new Gem(g.x, g.y));
    this.gemsCollected = 0;
    this.totalGems = this.gems.length;

    // Camera
    this.camera = new Camera();

    // Particles
    this.particles = new ParticleSystem();
  }

  update(input) {
    // Escape to menu
    if (input.escape) {
      this.game.goToMenu();
      return;
    }

    // Update player
    this.player.update(input, this.collisionRects);

    // Check gem collection
    for (const gem of this.gems) {
      gem.update();
      if (gem.checkCollect(this.player)) {
        this.gemsCollected++;
        // Emit particles at gem screen position
        const sx = gem.baseX - this.camera.x + 5;
        const sy = gem.baseY - this.camera.y + 5;
        this.particles.emit(sx, sy, 15);

        // Check level complete
        if (this.gemsCollected >= this.totalGems) {
          this.game.completeLevel(this.levelIndex);
          return;
        }
      }
    }

    // Update particles
    this.particles.update();

    // Camera follow
    this.camera.follow(this.player, this.levelWidth, this.levelHeight);

    // Fall off screen respawn
    if (this.player.y > this.levelHeight * TILE + RESPAWN_Y_THRESHOLD) {
      this.player.respawn();
      this.camera.reset();
    }
  }

  render(renderer) {
    const ctx = renderer.ctx;

    renderer.clear();

    // Draw platforms
    Platform.render(ctx, this.platformTiles, this.camera);

    // Draw gems
    for (const gem of this.gems) {
      gem.render(ctx, this.camera);
    }

    // Draw player
    this.player.render(ctx, this.camera);

    // Draw particles (screen space)
    this.particles.render(ctx);

    // HUD
    this._renderHUD(renderer);
  }

  _renderHUD(renderer) {
    // Gem counter - top left
    const hudY = 6;
    drawSprite(renderer.ctx, 'gem', 6, hudY);
    renderer.drawTextWithShadow(
      `${this.gemsCollected} / ${this.totalGems}`,
      20, hudY + 1, UI_WHITE, 8
    );

    // Level name - top center
    renderer.drawTextWithShadow(
      this.levelData.name,
      CANVAS_WIDTH / 2, hudY + 1, UI_GOLD, 8, 'center'
    );

    // ESC hint - top right
    renderer.drawTextWithShadow(
      'ESC: Menu', CANVAS_WIDTH - 6, hudY + 1, '#888888', 7, 'right'
    );
  }
}
