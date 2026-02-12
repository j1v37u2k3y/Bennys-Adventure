import {
  CANVAS_WIDTH, CANVAS_HEIGHT, TOTAL_LEVELS,
  UI_WHITE, UI_GOLD, UI_GREEN, UI_GRAY, UI_DARK_GRAY, UI_LOCKED, UI_BLACK,
  formatTime
} from '../data/constants.js';
import { drawSprite } from '../rendering/PixelSprites.js';

const BOX_W = 60;
const BOX_H = 50;
const BOX_GAP = 12;
const GRID_Y = 140;

export default class MenuState {
  constructor(game) {
    this.game = game;
    this.selectedIndex = 0;
    this.titleBob = 0;
    // Find first unlocked-but-not-completed level, or default to 0
    for (let i = 0; i < TOTAL_LEVELS; i++) {
      if (this.game.saveManager.isUnlocked(i) && !this.game.saveManager.isCompleted(i)) {
        this.selectedIndex = i;
        break;
      }
    }
  }

  update(input) {
    this.titleBob += 0.04;

    // Navigate level select
    if (input.wasPressed('ArrowLeft') || input.wasPressed('a')) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    }
    if (input.wasPressed('ArrowRight') || input.wasPressed('d')) {
      this.selectedIndex = Math.min(TOTAL_LEVELS - 1, this.selectedIndex + 1);
    }

    // Select level
    if (input.wasPressed(' ') || input.wasPressed('Enter')) {
      if (this.game.saveManager.isUnlocked(this.selectedIndex)) {
        this.game.showPreLevel(this.selectedIndex);
      }
    }
  }

  render(renderer) {
    const ctx = renderer.ctx;

    // Background
    renderer.clear();

    // Title
    const titleY = 30 + Math.sin(this.titleBob) * 3;
    renderer.drawTextWithShadow("BENNY'S", CANVAS_WIDTH / 2, titleY, UI_GOLD, 24, 'center');
    renderer.drawTextWithShadow('ADVENTURE', CANVAS_WIDTH / 2, titleY + 28, UI_GOLD, 20, 'center');

    // Subtitle
    renderer.drawTextWithShadow('Select a Level', CANVAS_WIDTH / 2, 100, UI_WHITE, 10, 'center');

    // Level boxes
    const totalWidth = TOTAL_LEVELS * BOX_W + (TOTAL_LEVELS - 1) * BOX_GAP;
    const startX = (CANVAS_WIDTH - totalWidth) / 2;

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const bx = startX + i * (BOX_W + BOX_GAP);
      const by = GRID_Y;
      const unlocked = this.game.saveManager.isUnlocked(i);
      const completed = this.game.saveManager.isCompleted(i);
      const selected = i === this.selectedIndex;

      // Box background
      if (selected) {
        renderer.fillRect(bx - 2, by - 2, BOX_W + 4, BOX_H + 4, UI_GOLD);
      }
      renderer.fillRect(bx, by, BOX_W, BOX_H, unlocked ? '#2a4080' : '#1a1a2e');
      renderer.fillRect(bx + 1, by + 1, BOX_W - 2, BOX_H - 2, unlocked ? '#3050a0' : '#222244');

      // Level number
      const numColor = unlocked ? UI_WHITE : UI_LOCKED;
      renderer.drawText(`${i + 1}`, bx + BOX_W / 2, by + 6, numColor, 16, 'center');

      // Status icon
      if (completed) {
        drawSprite(ctx, 'star', bx + BOX_W / 2 - 3, by + 30);
      } else if (!unlocked) {
        drawSprite(ctx, 'lock', bx + BOX_W / 2 - 4, by + 28);
      }

      // Top leaderboard entry (below box for completed levels)
      if (completed) {
        const board = this.game.saveManager.getLeaderboard(i);
        if (board.length > 0) {
          const top = board[0];
          renderer.drawText(
            `${top.initials} ${formatTime(top.time)}`,
            bx + BOX_W / 2, by + BOX_H + 4, UI_GRAY, 6, 'center'
          );
        }
      }

      // Level name (below boxes)
      if (selected && unlocked) {
        const levelData = this.game.getLevelData(i);
        if (levelData) {
          renderer.drawTextWithShadow(levelData.name, CANVAS_WIDTH / 2, GRID_Y + BOX_H + 18, UI_WHITE, 8, 'center');
        }
      }
    }

    // Instructions
    renderer.drawTextWithShadow('Arrow Keys to Select, Space to Play', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40, UI_GRAY, 8, 'center');
    renderer.drawTextWithShadow('WASD / Arrows to Move, Space to Jump', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 24, UI_GRAY, 8, 'center');
  }
}
