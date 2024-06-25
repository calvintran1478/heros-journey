import { GAME_ROWS, GAME_COLUMNS, GAME_TILE } from "./settings";

export class Layer {
    readonly tileset: HTMLImageElement;
    readonly tileSize: number;
    readonly tilemap: number[];

    constructor(tileset: HTMLImageElement, tileSize: number, tilemap: number[]) {
        this.tileset = tileset;
        this.tileSize = tileSize;
        this.tilemap = tilemap;
    }

    draw(context: CanvasRenderingContext2D) {
        const tilesetCols = this.tileset.width / this.tileSize;
        for (let row = 0; row < GAME_ROWS; row++) {
            for (let col = 0; col < GAME_COLUMNS; col++) {
                // Draw tile
                const tile: number = this.tilemap[row * GAME_COLUMNS + col];
                context.drawImage(
                    this.tileset,
                    ((tile - 1) * this.tileSize) % this.tileset.width,
                    Math.floor((tile - 1) / tilesetCols) * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    col * GAME_TILE,
                    row * GAME_TILE,
                    GAME_TILE,
                    GAME_TILE
                )

                // Draw grid lines
                context.strokeRect(col * GAME_TILE, row * GAME_TILE, GAME_TILE, GAME_TILE);
            }
        }
    }
}