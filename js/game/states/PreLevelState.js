import {
  CANVAS_WIDTH, CANVAS_HEIGHT, LEADERBOARD_SIZE,
  UI_WHITE, UI_GOLD, UI_GRAY, UI_DARK_GRAY, formatTime
} from '../data/constants.js';

export default class PreLevelState {
  constructor(game, levelIndex) {
    this.game = game;
    this.levelIndex = levelIndex;
    this.timer = 0;
  }

  update(input) {
    this.timer += 0.03;

    if (this.timer < 0.3) return;

    if (input.wasPressed(' ') || input.wasPressed('Enter')) {
      this.game.startLevel(this.levelIndex);
    }

    if (input.escape) {
      this.game.goToMenu();
    }
  }

  render(renderer) {
    const ctx = renderer.ctx;
    const cx = CANVAS_WIDTH / 2;

    // Background
    renderer.clear();

    // Level name
    const levelData = this.game.getLevelData(this.levelIndex);
    renderer.drawTextWithShadow(levelData.name, cx, 40, UI_GOLD, 16, 'center');
    renderer.drawTextWithShadow(`Level ${this.levelIndex + 1}`, cx, 62, UI_WHITE, 8, 'center');

    // Leaderboard
    const board = this.game.saveManager.getLeaderboard(this.levelIndex);
    const tableY = 95;

    renderer.drawTextWithShadow('- LEADERBOARD -', cx, tableY - 16, UI_GRAY, 8, 'center');

    for (let i = 0; i < LEADERBOARD_SIZE; i++) {
      const rowY = tableY + i * 16;
      const entry = board[i];
      const rankStr = `${i + 1}.`;

      if (entry) {
        renderer.drawTextWithShadow(rankStr, cx - 65, rowY, UI_GRAY, 10, 'left');
        renderer.drawTextWithShadow(entry.initials, cx - 20, rowY, UI_WHITE, 10, 'center');
        renderer.drawTextWithShadow(formatTime(entry.time), cx + 20, rowY, UI_WHITE, 10, 'left');
      } else {
        renderer.drawTextWithShadow(rankStr, cx - 65, rowY, UI_DARK_GRAY, 10, 'left');
        renderer.drawTextWithShadow('---', cx - 20, rowY, UI_DARK_GRAY, 10, 'center');
        renderer.drawTextWithShadow('--:--.--', cx + 20, rowY, UI_DARK_GRAY, 10, 'left');
      }
    }

    // Prompt
    const promptY = tableY + LEADERBOARD_SIZE * 16 + 30;
    renderer.drawTextWithShadow('Press Space to Start', cx, promptY, UI_WHITE, 10, 'center');
    renderer.drawTextWithShadow('Esc to go back', cx, promptY + 18, UI_GRAY, 7, 'center');
  }
}
