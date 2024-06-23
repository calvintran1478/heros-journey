import { Character } from "../models/character";

enum StateEnum {
    IDLE,
    WALKING
}

export abstract class State {
    protected character: Character;
    protected abstract readonly frameY: number;
    public abstract readonly numFrames: number;

    constructor(character: Character) {
        this.character = character;
    }

    enter() {
        this.character.frameX = 0;
        this.character.frameY = this.frameY;
    }

    abstract handleState(input: string[]): void;
    abstract handleUpdate(input: string[], deltaTime: number): void;
}

export abstract class Wandering extends State {

    handleUpdate(input: string[]): void {
        // Update position
        this.character.x += this.character.vx;
        this.character.y += this.character.vy;

        // Update speed
        this.character.vx = 0;
            this.character.vy = 0;

        if (input.includes("ArrowLeft")) {
            this.character.orientation = "left";
            this.character.vx = -this.character.walkingSpeed;
        } else if (input.includes("ArrowRight")) {
            this.character.orientation = "right";
            this.character.vx = this.character.walkingSpeed;
        } else if (input.includes("ArrowUp")) {
            this.character.vy = -this.character.walkingSpeed;
        } else if (input.includes("ArrowDown")) {
            this.character.vy = this.character.walkingSpeed;
        }

        // Stop player from moving outside of the game
        if (this.character.x < 0) this.character.x = 0;
        if (this.character.x > this.character.game.width - this.character.width) this.character.x = this.character.game.width - this.character.width;
        if (this.character.y < 0) this.character.y = 0;
        if (this.character.y > this.character.game.height - this.character.height) this.character.y = this.character.game.height - this.character.height;
    }
}

export class Idle extends Wandering {
    protected readonly frameY: number = 0;
    public readonly numFrames: number = 6;

    handleState(input: string[]): void {
        if (input.includes("ArrowLeft") || input.includes("ArrowRight") || input.includes("ArrowUp") || input.includes("ArrowDown")) {
            this.character.setState(StateEnum.WALKING);
        }
    }
}

export class Walking extends Wandering {
    protected readonly frameY: number = 1;
    public readonly numFrames: number = 8;

    handleState(input: string[]): void {
        if (input.length === 0) {
            this.character.setState(StateEnum.IDLE);
        }
    }
}