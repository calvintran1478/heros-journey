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