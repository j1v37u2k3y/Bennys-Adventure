import { TILE } from '../data/constants.js';
import { drawGrassTile } from '../rendering/PixelSprites.js';

export default class Platform {
  /**
   * Build renderable platform data from a tile grid.
   * @param {number[][]} tileGrid - 2D array, 1=solid, 0=empty
   * @returns {object[]} Array of { col, row, isTop }
   */
  static buildTiles(tileGrid) {
    const tiles = [];
    for (let row = 0; row < tileGrid.length; row++) {
      for (let col = 0; col < tileGrid[row].length; col++) {
        if (tileGrid[row][col] !== 0) {
          // isTop = true if there's no solid tile directly above
          const isTop = row === 0 || tileGrid[row - 1][col] === 0;
          tiles.push({ col, row, isTop });
        }
      }
    }
    return tiles;
  }

  /**
   * Render all platform tiles.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object[]} tiles - from buildTiles
   * @param {Camera} camera
   */
  static render(ctx, tiles, camera) {
    for (const tile of tiles) {
      const screenX = tile.col * TILE - camera.x;
      const screenY = tile.row * TILE - camera.y;
      // Cull off-screen tiles
      if (screenX > -TILE && screenX < 496 && screenY > -TILE && screenY < 336) {
        drawGrassTile(ctx, screenX, screenY, tile.isTop);
      }
    }
  }
}
