import { html, css } from 'lit';
import { query } from 'lit/decorators.js';
import { IterableSelector } from '../components/iterable-selector';
import { NotificationBox } from '../components/notification-box';
import { CharacterDisplay } from '../components/character-display';
import { defaultStyles, buttonStyles } from '../styles/style';
import { ProtectedPage } from './protected-page';
import axios from 'axios';

export class CharacterCreation extends ProtectedPage {
    private readonly genders = ["Male", "Female"];
    private readonly hair_colour = ["Black", "Brown", "Blonde", "White", "Gray"];
    private readonly skin_colour = ["Pale", "Tan", "Dark"];
    private readonly eye_colour = ["Black", "Blue", "Green", "Silver"];

    protected character_name: string = "";

    @query("#gender")
    private _gender!: IterableSelector<string>

    @query("#hair-colour")
    private _hair_colour!: IterableSelector<string>

    @query("#skin-colour")
    private _skin_colour!: IterableSelector<string>

    @query("#eye-colour")
    private _eye_colour!: IterableSelector<string>

    @query("notification-box")
    private _notification_box!: NotificationBox

    @query("character-display")
    private _character_display!: CharacterDisplay

    protected async firstUpdated() {
        this._gender.update_action = () => {
            this._character_display.gender = this._gender.curr.toLowerCase();
        }
        this._hair_colour.update_action = () => {
            this._character_display.hair_colour = this._hair_colour.curr.toLowerCase();
        }
        this._skin_colour.update_action = () => {
            this._character_display.skin_colour = this._skin_colour.curr.toLowerCase();
        }
        this._eye_colour.update_action = () => {
            this._character_display.eye_colour = this._eye_colour.curr.toLowerCase();
        }

        await super.firstUpdated();
    }

    private handleCharacterName(event: Event) {
        const input = event.target as HTMLInputElement;
        this.character_name = input.value;
    }

    private handleGoBack() {
        location.pathname = "character-selection";
    }

    private handleSubmit() {
        axios.post("http://localhost:8080/api/v1/users/characters", {
            slot_number: parseInt(sessionStorage.getItem("slot_number")!),
            character_name: this.character_name,
            gender: this._gender.curr.toLowerCase(),
            hair_colour: this._hair_colour.curr.toLowerCase(),
            skin_colour: this._skin_colour.curr.toLowerCase(),
            eye_colour: this._eye_colour.curr.toLowerCase()
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 201) {
                this._notification_box.message = "Character successfully created!";
                this._notification_box.close_action = () => location.pathname = "character-selection";
                this._notification_box.display = true;
            }
        })
        .catch(async error => {
            if (error.response.status === 401) {
                await this.refreshToken();
                this.handleSubmit();
            }
            else if (error.response.status === 409) {
                this._notification_box.message = "Character with the given name already exists";
                this._notification_box.display = true;
            }
        });
    };

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        character-display {
            position: absolute;
            bottom: 15%;
            left: 50%;
        }

        input {
            text-align: center;
            font-size: 1em;
            width: 16em;
            height: 1.5em;
        }

        form {
            position: relative;
            align-items: center;
            top: 2.5em;
            margin: 1.5em;
            width: 28em;
            background-color: white;
            border-style: solid;
            border-color: var(--steel-blue);
            border-width: 1em;
            border-radius: 1.5em;
        }

        label {
            margin: 1em;
            font-size: 1.5em;
            font-weight: bold;
        }

        button {
            width: 8em;
            height: 4em;
        }
    `];

    render() {
        return html`
            <div style="align-items: center;">
                <h1>Character Creation</h1>
            </div>
            <form>
                <label for="character-name">Character Name</label>
                <input id="character-name" type="textBox" @change=${this.handleCharacterName} required/>
                <label>Gender</label>
                <iterable-selector id="gender" .options=${this.genders}></iterable-selector>
                <label>Hair Colour</label>
                <iterable-selector id="hair-colour" .options=${this.hair_colour}></iterable-selector>
                <label>Skin Colour</label>
                <iterable-selector id="skin-colour" .options=${this.skin_colour}></iterable-selector>
                <label>Eye Colour</label>
                <iterable-selector id="eye-colour" .options=${this.eye_colour}></iterable-selector>
                <div style="flex-direction: row;">
                    <button style="background-color: var(--dark-gray)" type="button" @click=${this.handleGoBack}>Go back</button>
                    <button style="background-color: var(--light-green)" type="button" @click=${this.handleSubmit}>Confirm</button>
                </div>
            </form>
            <character-display></character-display>
            <notification-box></notification-box>
            ${this.auth_template}
        `;
    }
}