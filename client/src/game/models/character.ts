import { Game } from "../game";
import { State, IdleLeft, IdleRight, IdleUp, IdleDown, WalkingLeft, WalkingRight, WalkingUp, WalkingDown } from "../states/player-states";
import { GameObject } from "../game-object";
import { Sprite } from "../sprite";
import { StateEnum } from "../states/player-states";

export class Character extends GameObject {
    // Display attributes
    name: string = "";
    gender: string = "";
    hair_colour: string = "";
    eye_colour: string = "";

    // Movement speed
    walkingSpeed: number = 128;

    // States
    states: State[];
    currentState: State;

    // Animation speed
    fps: number = 20;
    frameInterval: number = 1/this.fps;
    frameTimer: number = 0;

    // Character stats
    level: number = 0;
    experience: number = 0;
    gold: number = 0;
    max_health: number = 0;
    health: number = 0;
    max_mana: number = 0;
    mana: number = 0;
    attack: number = 0;
    defense: number = 0;
    intelligence: number = 0;
    speed: number = 0;
    luck: number = 0;
    dexterity: number = 0;
    ability_points: number = 0;
    skill_points: number = 0;
    sword_proficiency: number = 0;
    axe_proficiency: number = 0;
    spear_proficiency: number = 0;
    dagger_proficiency: number = 0;
    staff_proficiency: number = 0;
    bow_proficiency: number = 0;

    // Declare index signature
    [key: string]: any

    constructor(game: Game, sprite: Sprite, x?: number, y?: number, scale?: number) {
        super(game, sprite, x, y, scale);
        this.states = [new IdleLeft(this), new IdleRight(this), new IdleUp(this), new IdleDown(this), new WalkingLeft(this), new WalkingRight(this), new WalkingUp(this), new WalkingDown(this)];
        this.currentState = this.states[StateEnum.IDLE_UP];
    }

    update(lastKey: string, deltaTime: number) {
        // Update player position
        this.currentState.handleUpdate(lastKey, deltaTime);

        // Change player state based on input
        this.currentState.handleState(lastKey);

        // Update frame timer and sprite frame
        if (this.frameTimer < this.frameInterval) {
            this.frameTimer += deltaTime;
        } else {
            this.frameTimer %= this.frameInterval;
            this.sprite.frameX = (this.sprite.frameX + 1) % this.currentState.numFrames;
        }
    }

    setState(stateIndex: number) {
        this.currentState = this.states[stateIndex];
        this.currentState.enter();
    }
}