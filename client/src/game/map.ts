import { GAME_WIDTH, GAME_HEIGHT } from "./settings";
import { Layer } from "./layer";

export class Map {
    width: number = GAME_WIDTH;
    height: number = GAME_HEIGHT;
    layers: Layer[];

    constructor(layers: Layer[]) {
        this.layers = layers;
    }

    draw(context: CanvasRenderingContext2D) {
        for (const layer of this.layers) {
            layer.draw(context);
        }
    }
}