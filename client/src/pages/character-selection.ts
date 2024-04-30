import { LitElement, html, css } from "lit"
import { state, query, queryAll } from 'lit/decorators.js';
import { ConfirmationBox } from "../components/confirmation-box";
import { SelectionSlot } from "../components/selection-slot";
import { CharacterDisplay } from "../components/character-display";
import axios from "axios";

export class CharacterSelection extends LitElement {

    private readonly token = ""

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

    protected firstUpdated() {
        // Get user characters
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
                        selection_slot.character_name = characters[index].character_name;
                        selection_slot.character = new CharacterDisplay(
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

        // Define actions for when selection slots are clicked
        for (const [index, selection_slot] of this._slots.entries()) {
            selection_slot.click_action = () => {
                // Prompt user to create a new character
                if (selection_slot.character === null) {
                    this._confirmation_box.message = "Create new character?";
                    this._confirmation_box.action = () => {
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
                    this._selected_character_slot = selection_slot;
                    this._selected_character_slot.selected = true;
                }

                // Deselect character and hide stats
                else {
                    this._selected_character_slot.selected = false;
                    this._selected_character_slot = null;
                }
            }
        }
    }

    static styles = css`
        div {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        selection-slot {
            position: absolute;
        }
    `

    render() {
        return html`
            <div>
                ${this.slot_positions.map((pos) =>
                    html`<selection-slot style="margin-left: ${pos[0]}; bottom: ${pos[1]}"></selection-slot>`
                )}
            </div>
            <confirmation-box></confirmation-box>
        `
    }
}