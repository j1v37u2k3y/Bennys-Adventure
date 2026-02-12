import { TOTAL_LEVELS, LEADERBOARD_SIZE } from './constants.js';

const SAVE_KEY = 'bennys_adventure_save';

export default class SaveManager {
  constructor() {
    this.completedLevels = new Set();
    this.leaderboards = {};
    this.load();
  }

  load() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.completed)) {
          this.completedLevels = new Set(parsed.completed);
        }
        if (parsed.leaderboards && typeof parsed.leaderboards === 'object') {
          this.leaderboards = parsed.leaderboards;
        } else if (parsed.bestTimes && typeof parsed.bestTimes === 'object') {
          // Migrate old bestTimes format to leaderboards
          this.leaderboards = {};
          for (const [key, time] of Object.entries(parsed.bestTimes)) {
            this.leaderboards[key] = [{ initials: '---', time }];
          }
          this.save();
        }
      }
    } catch {
      this.completedLevels = new Set();
      this.leaderboards = {};
    }
  }

  save() {
    try {
      const data = {
        completed: Array.from(this.completedLevels),
        leaderboards: this.leaderboards,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable - silently fail
    }
  }

  completeLevel(levelIndex) {
    this.completedLevels.add(levelIndex);
    this.save();
  }

  isCompleted(levelIndex) {
    return this.completedLevels.has(levelIndex);
  }

  /**
   * A level is unlocked if it's level 0 or if the previous level is completed.
   */
  isUnlocked(levelIndex) {
    if (levelIndex === 0) return true;
    return this.completedLevels.has(levelIndex - 1);
  }

  addLeaderboardEntry(levelIndex, initials, time) {
    const key = String(levelIndex);
    if (!this.leaderboards[key]) {
      this.leaderboards[key] = [];
    }
    const board = this.leaderboards[key];
    const entry = { initials, time };

    // Insert in sorted position (ascending by time)
    let rank = board.length;
    for (let i = 0; i < board.length; i++) {
      if (time < board[i].time) {
        rank = i;
        break;
      }
    }
    board.splice(rank, 0, entry);

    // Trim to max size
    if (board.length > LEADERBOARD_SIZE) {
      board.length = LEADERBOARD_SIZE;
    }

    this.save();

    // Return rank if entry made it onto the board, -1 otherwise
    return rank < LEADERBOARD_SIZE ? rank : -1;
  }

  getLeaderboard(levelIndex) {
    const key = String(levelIndex);
    return this.leaderboards[key] || [];
  }

  qualifiesForLeaderboard(levelIndex, time) {
    const board = this.getLeaderboard(levelIndex);
    if (board.length < LEADERBOARD_SIZE) return true;
    return time < board[board.length - 1].time;
  }

  clearAll() {
    this.completedLevels = new Set();
    this.leaderboards = {};
    this.save();
  }
}
