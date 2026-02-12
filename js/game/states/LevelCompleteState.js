import {
  CANVAS_WIDTH, CANVAS_HEIGHT, TOTAL_LEVELS, LEADERBOARD_SIZE,
  UI_WHITE, UI_GOLD, UI_GREEN, UI_GRAY, UI_DARK_GRAY, formatTime
} from '../data/constants.js';
import { drawSprite } from '../rendering/PixelSprites.js';

const PHASE_ENTRY = 0;
const PHASE_RESULTS = 1;

export default class LevelCompleteState {
  constructor(game, levelIndex, completionTime, qualifiesForLeaderboard) {
    this.game = game;
    this.levelIndex = levelIndex;
    this.completionTime = completionTime;
    this.hasNextLevel = levelIndex < TOTAL_LEVELS - 1;
    this.timer = 0;
    this.playerRank = -1;

    if (qualifiesForLeaderboard) {
      this.phase = PHASE_ENTRY;
      this.initials = ['A', 'A', 'A'];
      this.cursorPos = 0;
      this.cursorBlink = 0;
    } else {
      this.phase = PHASE_RESULTS;
    }

    this.selectedOption = 0;
  }

  update(input) {
    this.timer += 0.03;
    this.cursorBlink = (this.cursorBlink + 0.06) % (Math.PI * 2);

    if (this.timer < 0.5) return;

    if (this.phase === PHASE_ENTRY) {
      this._updateEntry(input);
    } else {
      this._updateResults(input);
    }
  }

  _updateEntry(input) {
    // Left/Right to move cursor
    if (input.wasPressed('ArrowLeft') || input.wasPressed('a')) {
      this.cursorPos = Math.max(0, this.cursorPos - 1);
    }
    if (input.wasPressed('ArrowRight') || input.wasPressed('d')) {
      this.cursorPos = Math.min(2, this.cursorPos + 1);
    }

    // Up/Down to cycle character
    if (input.wasPressed('ArrowUp') || input.wasPressed('w')) {
      this._cycleChar(1);
    }
    if (input.wasPressed('ArrowDown') || input.wasPressed('s')) {
      this._cycleChar(-1);
    }

    // Direct letter typing
    for (const key of Object.keys(input.justPressed)) {
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        this.initials[this.cursorPos] = key;
        if (this.cursorPos < 2) this.cursorPos++;
      } else if (key.length === 1 && key >= 'a' && key <= 'z') {
        this.initials[this.cursorPos] = key.toUpperCase();
        if (this.cursorPos < 2) this.cursorPos++;
      }
    }

    // Backspace
    if (input.wasPressed('Backspace')) {
      this.initials[this.cursorPos] = 'A';
      if (this.cursorPos > 0) this.cursorPos--;
    }

    // Confirm
    if (input.wasPressed('Enter') || input.wasPressed(' ')) {
      const initialsStr = this.initials.join('');
      this.playerRank = this.game.saveLeaderboardEntry(
        this.levelIndex, initialsStr, this.completionTime
      );
      this.phase = PHASE_RESULTS;
      this.timer = 0;
    }
  }

  _cycleChar(direction) {
    const code = this.initials[this.cursorPos].charCodeAt(0);
    let next = code + direction;
    if (next > 90) next = 65; // Z -> A
    if (next < 65) next = 90; // A -> Z
    this.initials[this.cursorPos] = String.fromCharCode(next);
  }

  _updateResults(input) {
    if (this.timer < 0.5) return;

    if (this.hasNextLevel) {
      if (input.wasPressed('ArrowUp') || input.wasPressed('ArrowDown') ||
          input.wasPressed('w') || input.wasPressed('s')) {
        this.selectedOption = this.selectedOption === 0 ? 1 : 0;
      }
    }

    if (input.wasPressed(' ') || input.wasPressed('Enter')) {
      if (this.selectedOption === 0 && this.hasNextLevel) {
        this.game.showPreLevel(this.levelIndex + 1);
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

    if (this.phase === PHASE_ENTRY) {
      this._renderEntry(renderer);
    } else {
      this._renderResults(renderer);
    }
  }

  _renderEntry(renderer) {
    const cx = CANVAS_WIDTH / 2;

    // Title
    renderer.drawTextWithShadow('NEW HIGH SCORE!', cx, 50, UI_GOLD, 16, 'center');

    // Time
    renderer.drawTextWithShadow(
      `Time: ${formatTime(this.completionTime)}`, cx, 80, UI_WHITE, 10, 'center'
    );

    // Instructions
    renderer.drawTextWithShadow('Enter Your Initials', cx, 110, UI_GRAY, 8, 'center');

    // Character slots
    const slotW = 24;
    const slotGap = 8;
    const totalW = slotW * 3 + slotGap * 2;
    const slotStartX = cx - totalW / 2;
    const slotY = 135;

    for (let i = 0; i < 3; i++) {
      const sx = slotStartX + i * (slotW + slotGap);
      const isActive = i === this.cursorPos;

      // Slot background
      renderer.fillRect(sx, slotY, slotW, 30, isActive ? '#3a3a00' : '#1a1a2e');
      renderer.fillRect(sx + 1, slotY + 1, slotW - 2, 28, isActive ? '#2a2a00' : '#222244');

      // Character
      const charColor = isActive ? UI_GOLD : UI_WHITE;
      renderer.drawTextWithShadow(
        this.initials[i], sx + slotW / 2, slotY + 5, charColor, 18, 'center'
      );

      // Cursor underline (blinking)
      if (isActive && Math.sin(this.cursorBlink) > -0.3) {
        renderer.fillRect(sx + 4, slotY + 25, slotW - 8, 2, UI_GOLD);
      }

      // Up/Down arrows for active slot
      if (isActive) {
        renderer.drawText('\u25B2', sx + slotW / 2, slotY - 12, UI_GRAY, 8, 'center');
        renderer.drawText('\u25BC', sx + slotW / 2, slotY + 32, UI_GRAY, 8, 'center');
      }
    }

    // Controls hint
    renderer.drawTextWithShadow(
      'Type / \u2191\u2193 to change, \u2190\u2192 to move', cx, 200, UI_GRAY, 7, 'center'
    );
    renderer.drawTextWithShadow(
      'Enter to Confirm', cx, 215, UI_WHITE, 8, 'center'
    );
  }

  _renderResults(renderer) {
    const ctx = renderer.ctx;
    const cx = CANVAS_WIDTH / 2;

    // Stars
    const starY = 30 + Math.sin(this.timer * 2) * 3;
    for (let i = -1; i <= 1; i++) {
      drawSprite(ctx, 'star', cx - 4 + i * 20, starY);
    }

    // Title
    renderer.drawTextWithShadow('LEVEL COMPLETE!', cx, 52, UI_GOLD, 14, 'center');

    // Level name + time
    const levelData = this.game.getLevelData(this.levelIndex);
    renderer.drawTextWithShadow(levelData.name, cx, 72, UI_WHITE, 8, 'center');
    renderer.drawTextWithShadow(
      `Time: ${formatTime(this.completionTime)}`, cx, 85, UI_WHITE, 8, 'center'
    );

    // Leaderboard table
    const board = this.game.saveManager.getLeaderboard(this.levelIndex);
    const tableY = 105;

    renderer.drawTextWithShadow('- LEADERBOARD -', cx, tableY - 14, UI_GRAY, 7, 'center');

    for (let i = 0; i < LEADERBOARD_SIZE; i++) {
      const rowY = tableY + i * 14;
      const entry = board[i];
      const isPlayerEntry = i === this.playerRank;
      const color = isPlayerEntry ? UI_GOLD : UI_WHITE;
      const dimColor = isPlayerEntry ? UI_GOLD : UI_GRAY;

      const rankStr = `${i + 1}.`;
      if (entry) {
        renderer.drawTextWithShadow(rankStr, cx - 60, rowY, dimColor, 8, 'left');
        renderer.drawTextWithShadow(entry.initials, cx - 20, rowY, color, 8, 'center');
        renderer.drawTextWithShadow(formatTime(entry.time), cx + 25, rowY, color, 8, 'left');
      } else {
        renderer.drawTextWithShadow(rankStr, cx - 60, rowY, UI_DARK_GRAY, 8, 'left');
        renderer.drawTextWithShadow('---', cx - 20, rowY, UI_DARK_GRAY, 8, 'center');
        renderer.drawTextWithShadow('--:--.--', cx + 25, rowY, UI_DARK_GRAY, 8, 'left');
      }
    }

    // Options
    const optionY = tableY + LEADERBOARD_SIZE * 14 + 14;
    if (this.hasNextLevel) {
      const nextColor = this.selectedOption === 0 ? UI_GOLD : UI_WHITE;
      const menuColor = this.selectedOption === 1 ? UI_GOLD : UI_WHITE;
      const nextPrefix = this.selectedOption === 0 ? '> ' : '  ';
      const menuPrefix = this.selectedOption === 1 ? '> ' : '  ';
      renderer.drawTextWithShadow(nextPrefix + 'Next Level', cx, optionY, nextColor, 10, 'center');
      renderer.drawTextWithShadow(menuPrefix + 'Level Select', cx, optionY + 18, menuColor, 10, 'center');
    } else {
      renderer.drawTextWithShadow('ALL LEVELS COMPLETE!', cx, optionY, UI_GOLD, 12, 'center');
      renderer.drawTextWithShadow('Congratulations!', cx, optionY + 18, UI_GREEN, 10, 'center');
      renderer.drawTextWithShadow('> Level Select', cx, optionY + 40, UI_WHITE, 10, 'center');
    }

    renderer.drawTextWithShadow(
      'Space to Continue', cx, CANVAS_HEIGHT - 20, UI_GRAY, 8, 'center'
    );
  }
}
