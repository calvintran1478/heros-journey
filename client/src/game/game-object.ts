import { Game } from "./game";
import { Sprite } from "./sprite";
import { GAME_TILE, HALF_GAME_TILE } from "./settings";

export class GameObject {
    readonly game: Game;
    readonly sprite: Sprite;
    readonly width: number;
    readonly height: number;
    readonly halfWidth: number;
    x: number;
    y: number;
    destinationX: number;
    destinationY: number;
    private _arrived: boolean;

    constructor(game: Game, sprite: Sprite, x: number = 0, y: number = 0, scale: number = 1) {
        this.game = game;
        this.sprite = sprite;
        this.width = this.sprite.width * scale;
        this.height = this.sprite.height * scale;
        this.halfWidth = this.width / 2;
        this.x = x;
        this.y = y;
        this.destinationX = this.x;
        this.destinationY = this.y;
        this._arrived = true;
    }

    get arrived() {
        return this._arrived;
    }

    moveTowards(destinationX: number, destinationY: number, movementDistance: number) {
        // Calculate distance to travel
        const distanceToTravelX = destinationX - this.x;
        const distanceToTravelY = destinationY - this.y;
        const distancetoTravel = Math.hypot(distanceToTravelX, distanceToTravelY);

        // If moved sufficient distance snap to destination position
        if (distancetoTravel <= movementDistance) {
            this.x = destinationX;
            this.y = destinationY;
            this._arrived = true;
            return;
        }

        // Otherwise take a step towards destination
        const stepX = distanceToTravelX / distancetoTravel;
        const stepY = distanceToTravelY / distancetoTravel;
        this.x += stepX * movementDistance;
        this.y += stepY * movementDistance;
        this._arrived = false;
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(
            this.sprite.image,
            this.sprite.frameX * this.sprite.width,
            this.sprite.frameY * this.sprite.height,
            this.sprite.width,
            this.sprite.height,
            this.x + HALF_GAME_TILE - this.halfWidth,
            this.y + GAME_TILE - this.height,
            this.width,
            this.height
        )
    }
}