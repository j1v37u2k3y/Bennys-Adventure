import { TOTAL_LEVELS } from './constants.js';

const SAVE_KEY = 'bennys_adventure_save';

export default class SaveManager {
  constructor() {
    this.completedLevels = new Set();
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
      }
    } catch {
      this.completedLevels = new Set();
    }
  }

  save() {
    try {
      const data = {
        completed: Array.from(this.completedLevels),
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

  clearAll() {
    this.completedLevels = new Set();
    this.save();
  }
}
