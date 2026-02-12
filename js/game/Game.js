import { STATE_MENU, STATE_PLAYING, STATE_LEVEL_COMPLETE } from './data/constants.js';
import Renderer from './rendering/Renderer.js';
import Input from './systems/Input.js';
import SaveManager from './data/SaveManager.js';
import MenuState from './states/MenuState.js';
import PlayState from './states/PlayState.js';
import LevelCompleteState from './states/LevelCompleteState.js';
import GameOverState from './states/GameOverState.js';
import { LEVELS } from './levels/levelData.js';

export default class Game {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.saveManager = new SaveManager();
    this.currentState = null;
    this.running = false;
    this._boundLoop = this._loop.bind(this);
    this._lastTime = 0;

    // Start at menu
    this.goToMenu();
  }

  start() {
    this.running = true;
    this._lastTime = performance.now();
    requestAnimationFrame(this._boundLoop);
  }

  stop() {
    this.running = false;
  }

  _loop(timestamp) {
    if (!this.running) return;

    // Update
    if (this.currentState) {
      this.currentState.update(this.input);
      this.currentState.render(this.renderer);
    }

    // Reset per-frame input
    this.input.resetJustPressed();

    requestAnimationFrame(this._boundLoop);
  }

  // State transitions

  goToMenu() {
    this.currentState = new MenuState(this);
  }

  startLevel(levelIndex) {
    this.currentState = new PlayState(this, levelIndex);
  }

  gameOver(levelIndex) {
    this.currentState = new GameOverState(this, levelIndex);
  }

  completeLevel(levelIndex) {
    this.saveManager.completeLevel(levelIndex);
    this.currentState = new LevelCompleteState(this, levelIndex);
  }

  getLevelData(index) {
    return LEVELS[index] || null;
  }
}
