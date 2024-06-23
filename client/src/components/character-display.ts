import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("character-display")
export class CharacterDisplay extends LitElement {

    @property()
    character_name: string = "";

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

    constructor(character_name: string, gender: string, hair_colour: string, skin_colour: string, eye_colour: string, width: number = 25) {
        super();
        this.character_name = character_name;
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