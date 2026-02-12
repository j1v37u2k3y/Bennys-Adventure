import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  UI_WHITE, UI_GOLD, UI_GRAY
} from '../data/constants.js';
import { drawSprite } from '../rendering/PixelSprites.js';

export default class GameOverState {
  constructor(game, levelIndex) {
    this.game = game;
    this.levelIndex = levelIndex;
    this.timer = 0;
    this.selectedOption = 0; // 0 = retry, 1 = level select
  }

  update(input) {
    this.timer += 0.03;

    // Wait a moment before accepting input
    if (this.timer < 0.5) return;

    if (input.wasPressed('ArrowUp') || input.wasPressed('ArrowDown') ||
        input.wasPressed('w') || input.wasPressed('s')) {
      this.selectedOption = this.selectedOption === 0 ? 1 : 0;
    }

    if (input.wasPressed(' ') || input.wasPressed('Enter')) {
      if (this.selectedOption === 0) {
        this.game.startLevel(this.levelIndex);
      } else {
        this.game.goToMenu();
      }
    }

    if (input.escape) {
      this.game.goToMenu();
    }
  }

  render(renderer) {
    const ctx = renderer.ctx;

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Bouncing empty hearts
    const heartY = 60 + Math.sin(this.timer * 2) * 3;
    for (let i = -1; i <= 1; i++) {
      drawSprite(ctx, 'heartEmpty', CANVAS_WIDTH / 2 - 4 + i * 20, heartY);
    }

    // Title
    renderer.drawTextWithShadow('YOU DIED!', CANVAS_WIDTH / 2, 90, '#e03030', 16, 'center');

    // Level name
    const levelData = this.game.getLevelData(this.levelIndex);
    renderer.drawTextWithShadow(
      levelData.name, CANVAS_WIDTH / 2, 115, UI_WHITE, 10, 'center'
    );

    // Options
    const optionY = 160;
    const retryColor = this.selectedOption === 0 ? UI_GOLD : UI_WHITE;
    const menuColor = this.selectedOption === 1 ? UI_GOLD : UI_WHITE;
    const retryPrefix = this.selectedOption === 0 ? '> ' : '  ';
    const menuPrefix = this.selectedOption === 1 ? '> ' : '  ';
    renderer.drawTextWithShadow(retryPrefix + 'Retry', CANVAS_WIDTH / 2, optionY, retryColor, 10, 'center');
    renderer.drawTextWithShadow(menuPrefix + 'Level Select', CANVAS_WIDTH / 2, optionY + 20, menuColor, 10, 'center');

    renderer.drawTextWithShadow(
      'Space to Continue',
      CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30, UI_GRAY, 8, 'center'
    );
  }
}
