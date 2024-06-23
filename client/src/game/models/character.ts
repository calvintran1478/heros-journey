import { Game } from "../game";
import { State, Idle, Walking } from "../states/player-states";

const frameWidth: number = 100;
const frameHeight: number = 100;

export class Character {
    // Display attributes
    name: string = "";
    gender: string = "";
    hair_colour: string = "";
    eye_colour: string = "";

    // Game instance character belongs to
    game: Game;

    // Display values
    image: HTMLImageElement;
    orientation: "left" | "right" = "right";
    width: number = 250;
    height: number = 250;
    walkingSpeed: number = 2;
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;

    // States
    states: State[];
    currentState: State;

    // Sprite frame
    frameX: number = 0;
    frameY: number = 0;

    // Animation speed
    fps: number = 20;
    frameInterval: number = 1000/this.fps;
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

    constructor(game: Game, playerImage: HTMLImageElement) {
        this.game = game;
        this.image = playerImage;
        this.states = [new Idle(this), new Walking(this)];
        this.currentState = this.states[0];
    }

    update(input: string[], deltaTime: number) {
        // Change player state based on input
        this.currentState.handleState(input);

        // Update player position
        this.currentState.handleUpdate(input, deltaTime);

        // Update frame timer and sprite frame
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = (this.frameX + 1) % this.currentState.numFrames;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context: CanvasRenderingContext2D) { 
        if (this.orientation === "left") {
            context.scale(-1, 1);
            context.drawImage(this.image, this.frameX * frameWidth, this.frameY * frameHeight, frameWidth, frameHeight, -this.x - this.width, this.y, this.width, this.height);
            context.scale(-1, 1);
        } else if (this.orientation === "right") {
            context.drawImage(this.image, this.frameX * frameWidth, this.frameY * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
        }
    }

    setState(stateIndex: number) {
        this.currentState = this.states[stateIndex];
        this.currentState.enter();
    }
}