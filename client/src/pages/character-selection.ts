import { html, css } from "lit"
import { state, query, queryAll } from 'lit/decorators.js';
import { ConfirmationBox } from "../components/confirmation-box";
import { SelectionSlot } from "../components/selection-slot";
import { CharacterDisplay } from "../components/character-display";
import { defaultStyles, buttonStyles } from "../styles/style";
import { ProtectedPage } from "./protected-page";
import axios from "axios";

export class CharacterSelection extends ProtectedPage {

    // Positional offsets of slots from horizontal center and bottom of the page
    private readonly slot_positions: [string, string][] = [
        ["-20em", "28%"], ["20em", "28%"],                  // Back row
        ["-45em", "20%"], ["0", "20%"], ["45em", "20%"]     // Front row
    ];

    @query("confirmation-box")
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
                    characters[character.slot_number] = character;
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
                return await this.getCharacters()
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
                const character: CharacterDisplay = selection_slot.character!;
                character.level = response.data.level;
                character.experience = response.data.experience;
                character.gold = response.data.gold;
                character.max_health = response.data.max_health;
                character.health = response.data.health;
                character.max_mana = response.data.max_mana;
                character.mana = response.data.mana;
                character.attack = response.data.attack;
                character.defense = response.data.defense;
                character.intelligence = response.data.intelligence;
                character.speed = response.data.speed;
                character.luck = response.data.luck;
                character.dexterity = response.data.dexterity;
                character.ability_points = response.data.ability_points;
                character.skill_points = response.data.skill_points;
                character.sword_proficiency = response.data.sword_proficiency;
                character.axe_proficiency = response.data.axe_proficiency;
                character.spear_proficiency = response.data.spear_proficiency;
                character.dagger_proficiency = response.data.dagger_proficiency;
                character.staff_proficiency = response.data.staff_proficiency;
                character.bow_proficiency = response.data.bow_proficiency;

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
                    this._confirmation_box.message = "Create new character?";
                    this._confirmation_box.confirm_action = () => {
                        location.pathname = "character-creation";
                        sessionStorage.setItem("slot_number", index.toString());
                    }
                    this._confirmation_box.display = true;
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
        this._confirmation_box.message = "Are you sure?";
        this._confirmation_box.confirm_action = () => {
            if (this._selected_character_slot !== null) {
                this.deleteCharacter()
            }
        }
        this._confirmation_box.display = true;
    }

    private handleEnter() {
        sessionStorage.setItem("character_name", this._selected_character_slot!.character!.character_name);
        location.pathname = "world";
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

        p {
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
                <form style="display: ${this._selected_character_slot ? "flex": "none"}" class="stat-box">
                    <h2>Character Name</h2>
                    <input type="textBox" class="character-name" disabled value=${this._selected_character_slot ? this._selected_character_slot.character!.character_name : ""}>
                    <div style="flex-direction: row">
                        <div>
                            <p>Level:</p>
                            <p>Attack:</p>
                            <p>Defense:</p>
                            <p>Intelligence:</p>
                            <p>Speed:</p>
                            <p>Luck:</p>
                            <p>Dexterity:</p>
                        </div>
                        <div>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.level : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.attack : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.defense : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.intelligence : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.speed : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.luck : 0} disabled>
                            <input value=${this._selected_character_slot ? this._selected_character_slot.character!.dexterity : 0} disabled>
                        </div>
                    </div>
                    <button style="background-color: var(--light-red)" type="button" @click=${this.handleDelete}>Delete</button>
                </form>
                <button class="enter" ?disabled=${this._selected_character_slot === null} @click=${this.handleEnter}>Enter</button>
            </div>
            <confirmation-box></confirmation-box>
            ${this.auth_template}
        `
    }
}