import { Character } from "./models/character";
import { InputHandler } from "./controller/input";
import { Map } from "./map";

export class Game {
    readonly width: number;
    readonly height: number;
    player: Character;
    inputHandler: InputHandler;
    map: Map;

    constructor(width: number, height: number, inputHandler: InputHandler, map: Map) {
        this.width = width;
        this.height = height;
        this.player = new Character(this, document.getElementById("soldier") as HTMLImageElement);
        this.inputHandler = inputHandler;
        this.map = map;
    }

    update(deltaTime: number) {
        this.player.update(this.inputHandler.keys, deltaTime);
    }

    draw(context: CanvasRenderingContext2D) {
        // Draw map
        this.map.draw(context);

        // Draw character
        this.player.draw(context);
    }
}