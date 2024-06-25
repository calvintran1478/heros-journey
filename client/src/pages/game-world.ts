import { html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import { ProtectedPage } from "./protected-page";
import { Game } from "../game/game";
import { Character } from "../game/models/character";
import { InputHandler } from "../game/controller/input";
import { Map } from "../game/map";
import { Layer } from "../game/layer";
import { GAME_WIDTH, GAME_HEIGHT, IMAGE_TILE } from "../game/settings";
import axios from "axios";
import soldier from "../assets/sprites/characters/heroes/Soldier.png";
import grass from "../assets/sprites/world/TX Tileset Grass.png";

const LEVEL1: number[] = [
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
];

@customElement("game-world")
export class GameWorld extends ProtectedPage {

    game!: Game;
    inputHandler!: InputHandler;
    lastTime: number = 0;

    @query("canvas", true)
    private canvas!: HTMLCanvasElement;

    private ctx!: CanvasRenderingContext2D;

    private animateFrame = (timeStamp: number) => {
        // Compute delta time
        const deltaTime = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;

        // Clear previous screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw new game screen
        this.game.update(deltaTime);
        this.game.draw(this.ctx);

        requestAnimationFrame(this.animateFrame);
    }

    private async initializeCharacter(character: Character) {
        const characterName: string | null = sessionStorage.getItem("character_name")!;
        if (characterName === null) {
            console.log("Character name not found");
            return;
        }

        axios.get(`http://localhost:8080/api/v1/users/characters/${characterName}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                for (const key in response.data) {
                    character[key] = response.data[key];
                }
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                await this.refreshToken();
                await this.initializeCharacter(character);
            }
        })
    }

    connectedCallback() {
        super.connectedCallback();
        this.inputHandler = new InputHandler();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.inputHandler.removeEventListeners();
    }

    protected async firstUpdated() {
        // Get JWT
        await super.firstUpdated();

        // Set up canvas
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;

        // Set up context
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;

        // Load game assets
        const playerImage = this.renderRoot.querySelector("#soldier") as HTMLImageElement;
        const grassImage = this.renderRoot.querySelector("#grass") as HTMLImageElement;

        // Create map
        const layer1 = new Layer(grassImage, IMAGE_TILE, LEVEL1);
        const map = new Map([layer1]);

        // Set up game
        this.game = new Game(this.canvas.width, this.canvas.height, this.inputHandler, map, playerImage);
        await this.initializeCharacter(this.game.player);

        // Start game animation cycle
        this.animateFrame(0);
    }

    static styles = css`
        canvas {
            border: 1px solid black;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
        }

        img {
            display: none
        }
    `

    render() {
        return html`
            <canvas></canvas>
            <img id="soldier" src=${soldier} />
            <img id="grass" src=${grass} />
        `
    }
}