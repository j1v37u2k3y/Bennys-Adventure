export default class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this._downHandler = (e) => this._onKeyDown(e);
    this._upHandler = (e) => this._onKeyUp(e);
    window.addEventListener('keydown', this._downHandler);
    window.addEventListener('keyup', this._upHandler);
  }

  _onKeyDown(e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }
    if (!this.keys[e.key]) {
      this.justPressed[e.key] = true;
    }
    this.keys[e.key] = true;
  }

  _onKeyUp(e) {
    this.keys[e.key] = false;
  }

  isDown(key) {
    return !!this.keys[key];
  }

  wasPressed(key) {
    return !!this.justPressed[key];
  }

  // Call at end of each frame
  resetJustPressed() {
    this.justPressed = {};
  }

  // Convenience - movement
  get left() {
    return this.isDown('ArrowLeft') || this.isDown('a');
  }

  get right() {
    return this.isDown('ArrowRight') || this.isDown('d');
  }

  get jump() {
    return this.wasPressed(' ') || this.wasPressed('ArrowUp') || this.wasPressed('w');
  }

  get escape() {
    return this.wasPressed('Escape');
  }

  destroy() {
    window.removeEventListener('keydown', this._downHandler);
    window.removeEventListener('keyup', this._upHandler);
  }
}
