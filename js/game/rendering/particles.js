import { GEM_BLUE, GEM_CYAN, GEM_WHITE } from '../data/constants.js';

const PARTICLE_COLORS = [GEM_BLUE, GEM_CYAN, GEM_WHITE, '#ffd700'];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 1;
    this.life = 1;
    this.decay = 0.02 + Math.random() * 0.03;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.size = 1 + Math.floor(Math.random() * 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // mini gravity
    this.life -= this.decay;
  }

  render(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

export default class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  /**
   * Emit a burst of particles at (x, y) in screen coords.
   */
  emit(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      p.render(ctx);
    }
  }

  clear() {
    this.particles = [];
  }
}
