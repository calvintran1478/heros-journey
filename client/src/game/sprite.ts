import { GAME_TILE } from "./settings";

export class Sprite {
    readonly image: HTMLImageElement;
    frameX: number;
    frameY: number;
    readonly width: number;
    readonly height: number;

    constructor(image: HTMLImageElement, frameX: number = 0, frameY: number = 0, width: number = GAME_TILE, height: number = GAME_TILE) {
        this.image = image;
        this.frameX = frameX;
        this.frameY = frameY;
        this.width = width;
        this.height = height;
    }
}