import { LitElement, html, css } from 'lit';
import { query } from 'lit/decorators.js';
import { IterableSelector } from '../components/iterable-selector';
import { defaultStyles, buttonStyles } from '../styles/style';
import axios from 'axios';
import "../styles/styles.css";

export class CharacterCreation extends LitElement {
    private readonly genders = ["Male", "Female"];
    private readonly hair_colour = ["Black", "Brown", "Blonde", "White", "Gray"];
    private readonly skin_colour = ["Pale", "Tan", "Dark"];
    private readonly eye_colour = ["Black", "Blue", "Green", "Silver"];
    private readonly token = ""; // TODO: Get from character selection page
    protected character_name: string = "";

    @query("#gender")
    private _gender!: IterableSelector<string>

    @query("#hair-colour")
    private _hair_colour!: IterableSelector<string>

    @query("#skin-colour")
    private _skin_colour!: IterableSelector<string>

    @query("#eye-colour")
    private _eye_colour!: IterableSelector<string>

    private handleCharacterName(event: Event) {
        const input = event.target as HTMLInputElement;
        this.character_name = input.value;
    }

    private handleGoBack() {
        // TODO: Route back to character selection
    }

    private handleSubmit() {
        axios.post("http://localhost:8080/api/v1/users/characters", {
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
        .then(res => {
            if (res.status === 201) {
                // TODO: Route back to characer selection
            } else {
                // TODO: Display error message to user
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        .selection {
            width: 28em;
            background-color: white;
            border-style: solid;
            border-color: #3b6593;
            border-width: 1em;
            border-radius: 1.5em;
        }

        div, form {
            display: flex;
            flex-direction: column;
        }

        input {
            text-align: center;
            font-size: 1em;
            width: 16em;
            height: 1.5em;
        }

        form {
            position: relative;
            top: 2.5em;
            margin: 1.5em;
            align-items: center;
        }

        button {
            width: 8em;
            height: 4em;
            font-weight: bold;
        }
    `];

    render() {
        return html`
            <div>
                <div style="align-items: center;">
                    <h1>Character Creation</h1>
                </div>
                <form class="selection">
                    <h2>Character Name</h2>
                    <input type="textBox" @input=${this.handleCharacterName} required/>
                    <h2>Gender</h2>
                    <iterable-selector id="gender" .options=${this.genders}></iterable-selector>
                    <h2>Hair Colour</h2>
                    <iterable-selector id="hair-colour" .options=${this.hair_colour}></iterable-selector>
                    <h2>Skin Colour</h2>
                    <iterable-selector id="skin-colour" .options=${this.skin_colour}></iterable-selector>
                    <h2>Eye Colour</h2>
                    <iterable-selector id="eye-colour" .options=${this.eye_colour}></iterable-selector>
                    <div style="flex-direction: row;">
                        <button style="background-color: #cacaca" type="button" @click=${this.handleGoBack}>Go back</button>
                        <button style="background-color: #b0eda0" type="button" @click=${this.handleSubmit}>Confirm</button>
                    </div>
                </form>
            </div>
        `;
    }
}