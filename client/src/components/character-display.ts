import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class CharacterDisplay extends LitElement {

    @property()
    gender: string = "";

    @property()
    hair_colour: string = "";

    @property()
    skin_colour: string = "";

    @property()
    eye_colour: string = "";

    @property()
    width: number = 25;

    constructor(gender: string, hair_colour: string, skin_colour: string, eye_colour: string, width: number = 25) {
        super();
        this.gender = gender;
        this.hair_colour = hair_colour;
        this.skin_colour = skin_colour;
        this.eye_colour = eye_colour;
        this.width = width;
    }

    // Temporary placeholder style until character artwork is created
    static styles = css`
        div {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        p {
            margin: 2em;
        }

        .character {
            background-color: white;
            aspect-ratio: 9 / 16;
        }
    `

    render() {
        return html`
            <div class="character" style="width: ${this.width}em">
                <p>Gender: ${this.gender}</p>
                <p>Hair Colour: ${this.hair_colour}</p>
                <p>Skin colour: ${this.skin_colour}</p>
                <p>Eye colour: ${this.eye_colour}</p>
            </div>
        `;
    }
}