import { Character } from "./models/character";
import { InputHandler } from "./controller/input";
import { Map } from "./map";
import { Sprite } from "./sprite";

export class Game {
    readonly width: number;
    readonly height: number;
    player: Character;
    inputHandler: InputHandler;
    map: Map;

    constructor(width: number, height: number, inputHandler: InputHandler, map: Map) {
        this.width = width;
        this.height = height;
        this.player = new Character(this, new Sprite(document.getElementById("dark") as HTMLImageElement, 0, 0, 64, 64), 0, 0, 1.5);
        this.inputHandler = inputHandler;
        this.map = map;
    }

    update(deltaTime: number) {
        this.player.update(this.inputHandler.lastKey, deltaTime);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw map
        this.map.draw(context);

        // Draw character
        this.player.draw(context);
    }
}