import { GAME_WIDTH, GAME_HEIGHT } from "./settings";
import { Layer } from "./layer";

export class Map {
    width: number = GAME_WIDTH;
    height: number = GAME_HEIGHT;
    layers: Layer[];
    collision_map: number[];

    constructor(layers: Layer[], collision_map: number[]) {
        this.layers = layers;
        this.collision_map = collision_map;
    }

    draw(context: CanvasRenderingContext2D) {
        for (const layer of this.layers) {
            layer.draw(context);
        }
    }
}