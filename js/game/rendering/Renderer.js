import { CANVAS_WIDTH, CANVAS_HEIGHT, SKY_TOP, SKY_BOTTOM } from '../data/constants.js';

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    // Sky gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, SKY_TOP);
    grad.addColorStop(1, SKY_BOTTOM);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  drawText(text, x, y, color, size = 8, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, Math.round(x), Math.round(y));
  }

  drawTextWithShadow(text, x, y, color, size = 8, align = 'left') {
    this.drawText(text, x + 1, y + 1, 'rgba(0,0,0,0.5)', size, align);
    this.drawText(text, x, y, color, size, align);
  }
}
