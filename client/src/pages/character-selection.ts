import { html, css, nothing } from "lit"
import { customElement, state, query, queryAll } from 'lit/decorators.js';
import { Router } from "@vaadin/router";
import { ConfirmationBox } from "../components/confirmation-box";
import { SelectionSlot } from "../components/selection-slot";
import { CharacterDisplay } from "../components/character-display";
import { defaultStyles, buttonStyles } from "../styles/style";
import { ProtectedPage } from "./protected-page";
import axios from "axios";
import "../components/confirmation-box"
import "../components/selection-slot"

@customElement("character-selection")
export class CharacterSelection extends ProtectedPage {

    // Positional offsets of slots from horizontal center and bottom of the page
    private readonly slot_positions: [string, string][] = [
        ["-20em", "28%"], ["20em", "28%"],                  // Back row
        ["-45em", "20%"], ["0", "20%"], ["45em", "20%"]     // Front row
    ];

    @query("confirmation-box", true)
    private _confirmation_box!: ConfirmationBox;

    @state()
    private _selected_character_slot: SelectionSlot | null = null;

    @queryAll("selection-slot")
    private _slots!: NodeListOf<SelectionSlot>;

    private async getCharacters() {
        axios.get("http://localhost:8080/api/v1/users/characters", {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                const characters = Array(5).fill(null)
                for (const character of response.data.characters) {
                    characters[character.slot_number - 1] = character;
                }

                // Store character information in each selection slot
                for (const [index, selection_slot] of this._slots.entries()) {
                    if (characters[index] !== null) {
                        selection_slot.character = new CharacterDisplay(
                            characters[index].character_name,
                            characters[index].gender,
                            characters[index].hair_colour,
                            characters[index].skin_colour,
                            characters[index].eye_colour,
                            12
                        );
                    }
                }
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                await this.refreshToken();
                return await this.getCharacters();
            }
        })
    }

    private async getCharacterStats(selection_slot: SelectionSlot) {
        axios.get(`http://localhost:8080/api/v1/users/characters/${selection_slot.character!.character_name}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                // Store character stats
                const character: CharacterDisplay = selection_slot.character!;
                for (const key in response.data) {
                    character[key] = response.data[key]
                }

                // Select new character slot
                this._selected_character_slot = selection_slot;
                this._selected_character_slot.selected = true;
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                await this.refreshToken();
                return await this.getCharacterStats(selection_slot);
            }
        })
    }

    private async deleteCharacter() {
        axios.delete(`http://localhost:8080/api/v1/users/characters/${this._selected_character_slot!.character!.character_name}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                this._selected_character_slot!.character = null;
                this._selected_character_slot!.selected = false;
                this._selected_character_slot = null;
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                await this.refreshToken();
                await this.deleteCharacter();
            }
        })
    }

    private setupSlots() {
        for (const [index, selection_slot] of this._slots.entries()) {
            selection_slot.click_action = async () => {
                // Prompt user to create a new character
                if (selection_slot.character === null) {
                    this._confirmation_box.display("Create new character?", undefined, () => {
                        Router.go("character-creation");
                        sessionStorage.setItem("slot_number", (index + 1).toString());
                    })
                }

                // Select character and display stats
                else if (this._selected_character_slot !== selection_slot) {
                    // Deselect current character slot if any
                    if (this._selected_character_slot !== null) {
                        this._selected_character_slot.selected = false;
                    }

                    // Make GET request for character stats (if necessary)
                    if (selection_slot.character!.level === 0) {
                        await this.getCharacterStats(selection_slot);
                    } else {
                        // Select new character slot
                        this._selected_character_slot = selection_slot;
                        this._selected_character_slot.selected = true;
                    }
                }

                // Deselect character and hide stats
                else {
                    this._selected_character_slot.selected = false;
                    this._selected_character_slot = null;
                }
            }
        }
    }

    protected async firstUpdated() {
        // Define slot click actions
        this.setupSlots();

        // Get JWT
        await super.firstUpdated();

        // Get user characters
        await this.getCharacters();
    }

    private handleDelete() {
        this._confirmation_box.display("Are you sure?", undefined, () => {
            if (this._selected_character_slot !== null) {
                this.deleteCharacter()
            }
        });
    }

    private handleEnter() {
        sessionStorage.setItem("character_name", this._selected_character_slot!.character!.character_name);
        Router.go("world");
    }

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        .title {
            position: fixed;
            top: 5%;
        }

        .enter {
            position: fixed;
            bottom: 2em;
            width: 10em;
            height: 5em;
            font-weight: bolder;
        }

        .stat-box {
            width: 25em;
            height: 32em;
            background-color: white;
            border-style: solid;
            border-color: var(--steel-blue);
            border-width: 1em;
            border-radius: 1.5em;
            position: fixed;
            top: 22%;
            right: 2.5em;
            align-items: center;
        }

        .character-name {
            width: 16em;
            height: 1.5em;
            margin-bottom: 0.8em;
        }

        div {
            align-items: center;
        }

        input {
            text-align: center;
            font-size: 1em;
            color: black;
            margin: 0.55em;
            width: 8.5em;
        }

        label {
            margin: 0.75em;
        }

        selection-slot {
            position: absolute;
        }

        button {
            width: 8em;
            height: 4em;
        }
    `];

    render() {
        return html`
            <div>
                <h1 class="title">Character Selection</h1>
                ${this.slot_positions.map((pos) =>
                    html`<selection-slot style="margin-left: ${pos[0]}; bottom: ${pos[1]}"></selection-slot>`
                )}
                ${this._selected_character_slot ? 
                    html`
                        <form class="stat-box">
                            <label for="character-name" style="font-size: 1.5em">Character Name</label>
                            <input id="character-name" class="character-name" value=${this._selected_character_slot.character!.character_name} disabled>
                            <div style="flex-direction: row">
                                <div>
                                    <label for="level">Level:</label>
                                    <label for="attack">Attack:</label>
                                    <label for="defense">Defense:</label>
                                    <label for="intelligence">Intelligence:</label>
                                    <label for="speed">Speed:</label>
                                    <label for="luck">Luck:</label>
                                    <label for="dexterity">Dexterity:</label>
                                </div>
                                <div>
                                    <input id="level" value=${this._selected_character_slot.character!.level} disabled>
                                    <input id="attck" value=${this._selected_character_slot.character!.attack} disabled>
                                    <input id="defense" value=${this._selected_character_slot.character!.defense} disabled>
                                    <input id="intelligence" value=${this._selected_character_slot.character!.intelligence} disabled>
                                    <input id="speed" value=${this._selected_character_slot.character!.speed} disabled>
                                    <input id="luck" value=${this._selected_character_slot.character!.luck} disabled>
                                    <input id="dexterity" value=${this._selected_character_slot.character!.dexterity} disabled>
                                </div>
                            </div>
                            <button style="background-color: var(--light-red)" type="button" @click=${this.handleDelete}>Delete</button>
                        </form>
                    ` : nothing
                }
                <button class="enter" ?disabled=${this._selected_character_slot === null} @click=${this.handleEnter}>Enter</button>
            </div>
            <confirmation-box></confirmation-box>
            ${this.notification_template}
        `
    }
}