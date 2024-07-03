import { Character } from "../models/character";
import { GAME_TILE, GAME_COLUMNS, GAME_ROWS } from "../settings";

export enum StateEnum {
    IDLE_LEFT,
    IDLE_RIGHT,
    IDLE_UP,
    IDLE_DOWN,
    WALKING_LEFT,
    WALKING_RIGHT,
    WALKING_UP,
    WALKING_DOWN
}

export abstract class State {
    protected character: Character;
    protected abstract readonly frameY: number;
    public abstract readonly numFrames: number;

    constructor(character: Character) {
        this.character = character;
    }

    enter() {
        this.character.sprite.frameX = 0;
        this.character.sprite.frameY = this.frameY;
    }

    abstract handleState(lastKey: string): void;
    abstract handleUpdate(lastKey: string, deltaTime: number): void;
}

export abstract class Wandering extends State {

    handleUpdate(lastKey: string, deltaTime: number): void {
        // Move character towards intended destination
        const movementDistance = this.character.walkingSpeed * deltaTime;
        this.character.moveTowards(this.character.destinationX, this.character.destinationY, movementDistance)

        // Determine new destination based on player input
        let nextX = this.character.destinationX;
        let nextY = this.character.destinationY;
        if (this.character.arrived) {
            switch(lastKey) {
                case "ArrowLeft":
                    nextX -= GAME_TILE;
                    break;
                case "ArrowRight":
                    nextX += GAME_TILE;
                    break;
                case "ArrowUp":
                    nextY -= GAME_TILE;
                    break;
                case "ArrowDown":
                    nextY += GAME_TILE;
                    break;
            }

            // Check if new destination is valid
            const nextCol = nextX / GAME_TILE;
            const nextRow = nextY / GAME_TILE;
            const withinGameScreen = (0 <= nextCol && nextCol < GAME_COLUMNS) && (0 <= nextRow && nextRow < GAME_ROWS);
            const noCollision = (this.character.game.map.collision_map[nextRow * GAME_COLUMNS + nextCol] !== 1)
            if (withinGameScreen && noCollision) {
                this.character.destinationX = nextX;
                this.character.destinationY = nextY;
            }
        }
    }

    handleState(lastKey: string): void {
        if (this.character.x === this.character.destinationX && this.character.y === this.character.destinationY) {
            switch (lastKey) {
                case "ArrowLeft":
                    this.character.setState(StateEnum.IDLE_LEFT);
                    break;
                case "ArrowRight":
                    this.character.setState(StateEnum.IDLE_RIGHT);
                    break;
                case "ArrowUp":
                    this.character.setState(StateEnum.IDLE_UP);
                    break;
                case "ArrowDown":
                    this.character.setState(StateEnum.IDLE_DOWN);
                    break;
            }
        } else if (this.character.arrived) {
            switch (lastKey) {
                case "ArrowLeft":
                    this.character.setState(StateEnum.WALKING_LEFT);
                    break;
                case "ArrowRight":
                    this.character.setState(StateEnum.WALKING_RIGHT);
                    break;
                case "ArrowUp":
                    this.character.setState(StateEnum.WALKING_UP);
                    break;
                case "ArrowDown":
                    this.character.setState(StateEnum.WALKING_DOWN);
                    break;
            }
        }
    }
}

export abstract class Idle extends Wandering {
    public readonly numFrames: number = 1;
}

export class IdleLeft extends Idle {
    protected frameY: number = 9;
}

export class IdleRight extends Idle {
    protected frameY: number = 11;
}

export class IdleUp extends Idle {
    protected frameY: number = 8;
}

export class IdleDown extends Idle {
    protected frameY: number = 10;
}

export abstract class Walking extends Wandering {
    public readonly numFrames: number = 9;
}

export class WalkingLeft extends Walking {
    protected readonly frameY: number = 9;

    handleState(lastKey: string): void {
        super.handleState(lastKey);
        if (this.character.arrived && lastKey === "") {
            this.character.setState(StateEnum.IDLE_LEFT);
        }
    }
}

export class WalkingRight extends Walking {
    protected readonly frameY: number = 11;

    handleState(lastKey: string): void {
        super.handleState(lastKey);
        if (this.character.arrived && lastKey === "") {
            this.character.setState(StateEnum.IDLE_RIGHT);
        }
    }
}

export class WalkingUp extends Walking {
    protected readonly frameY: number = 8;

    handleState(lastKey: string): void {
        super.handleState(lastKey);
        if (this.character.arrived && lastKey === "") {
            this.character.setState(StateEnum.IDLE_UP);
        }
    }
}

export class WalkingDown extends Walking {
    protected readonly frameY: number = 10;

    handleState(lastKey: string): void {
        super.handleState(lastKey);
        if (this.character.arrived && lastKey === "") {
            this.character.setState(StateEnum.IDLE_DOWN);
        }
    }
}