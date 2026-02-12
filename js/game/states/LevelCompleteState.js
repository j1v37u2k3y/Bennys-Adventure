import {
  CANVAS_WIDTH, CANVAS_HEIGHT, TOTAL_LEVELS,
  UI_WHITE, UI_GOLD, UI_GREEN, UI_GRAY
} from '../data/constants.js';
import { drawSprite } from '../rendering/PixelSprites.js';

export default class LevelCompleteState {
  constructor(game, levelIndex) {
    this.game = game;
    this.levelIndex = levelIndex;
    this.timer = 0;
    this.hasNextLevel = levelIndex < TOTAL_LEVELS - 1;
    this.selectedOption = 0; // 0 = next level (if available), 1 = menu
  }

  update(input) {
    this.timer += 0.03;

    // Wait a moment before accepting input
    if (this.timer < 0.5) return;

    if (this.hasNextLevel) {
      if (input.wasPressed('ArrowUp') || input.wasPressed('ArrowDown') ||
          input.wasPressed('w') || input.wasPressed('s')) {
        this.selectedOption = this.selectedOption === 0 ? 1 : 0;
      }
    }

    if (input.wasPressed(' ') || input.wasPressed('Enter')) {
      if (this.selectedOption === 0 && this.hasNextLevel) {
        this.game.startLevel(this.levelIndex + 1);
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Star
    const starY = 60 + Math.sin(this.timer * 2) * 3;
    for (let i = -1; i <= 1; i++) {
      drawSprite(ctx, 'star', CANVAS_WIDTH / 2 - 4 + i * 20, starY);
    }

    // Title
    renderer.drawTextWithShadow('LEVEL COMPLETE!', CANVAS_WIDTH / 2, 90, UI_GOLD, 16, 'center');

    // Level name
    const levelData = this.game.getLevelData(this.levelIndex);
    renderer.drawTextWithShadow(
      levelData.name, CANVAS_WIDTH / 2, 115, UI_WHITE, 10, 'center'
    );

    // Options
    const optionY = 160;
    if (this.hasNextLevel) {
      const nextColor = this.selectedOption === 0 ? UI_GOLD : UI_WHITE;
      const menuColor = this.selectedOption === 1 ? UI_GOLD : UI_WHITE;
      const nextPrefix = this.selectedOption === 0 ? '> ' : '  ';
      const menuPrefix = this.selectedOption === 1 ? '> ' : '  ';
      renderer.drawTextWithShadow(nextPrefix + 'Next Level', CANVAS_WIDTH / 2, optionY, nextColor, 10, 'center');
      renderer.drawTextWithShadow(menuPrefix + 'Level Select', CANVAS_WIDTH / 2, optionY + 20, menuColor, 10, 'center');
    } else {
      // All levels complete!
      renderer.drawTextWithShadow('ALL LEVELS COMPLETE!', CANVAS_WIDTH / 2, optionY, UI_GOLD, 12, 'center');
      renderer.drawTextWithShadow('Congratulations!', CANVAS_WIDTH / 2, optionY + 20, UI_GREEN, 10, 'center');
      const menuColor = UI_WHITE;
      renderer.drawTextWithShadow('> Level Select', CANVAS_WIDTH / 2, optionY + 46, menuColor, 10, 'center');
    }

    renderer.drawTextWithShadow(
      'Space to Continue',
      CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30, UI_GRAY, 8, 'center'
    );
  }
}
