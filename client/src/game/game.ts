import { Character } from "./models/character";
import { InputHandler } from "./controller/input";

export class Game {
    readonly width: number;
    readonly height: number;
    player: Character;
    inputHandler: InputHandler;

    constructor(width: number, height: number, inputHandler: InputHandler, playerImage: HTMLImageElement) {
        this.width = width;
        this.height = height;
        this.player = new Character(this, playerImage);
        this.inputHandler = inputHandler;
    }

    update(deltaTime: number) {
        this.player.update(this.inputHandler.keys, deltaTime);
    }

    draw(context: CanvasRenderingContext2D) {
        this.player.draw(context);
    }
}