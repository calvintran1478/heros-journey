import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { defaultStyles, buttonStyles } from '../styles/style';

export class CharacterCreation extends LitElement {
    @state()
    private readonly genders = ["Male", "Female"];
    private readonly hair_colour = ["Black", "Brown", "Blonde", "White", "Gray"];
    private readonly skin_colour = ["Pale", "Tan", "Dark"];
    private readonly eye_colour = ["Black", "Blue", "Green", "Silver"];

    private handleSubmit() {
        // TODO;
    }

    @property()
    character_name: string = "";

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
                <form class="selection" onSubmit=${this.handleSubmit}>
                    <h2>Character Name</h2>
                    <input type="textBox"/>
                    <h2>Gender</h2>
                    <iterable-selector .options=${this.genders}></iterable-selector>
                    <h2>Hair Colour</h2>
                    <iterable-selector .options=${this.hair_colour}></iterable-selector>
                    <h2>Skin Colour</h2>
                    <iterable-selector .options=${this.skin_colour}></iterable-selector>
                    <h2>Eye Colour</h2>
                    <iterable-selector .options=${this.eye_colour}></iterable-selector>
                    <div style="flex-direction: row;">
                        <button style="background-color: #cacaca">Go back</button>
                        <button style="background-color: #b0eda0" type="submit">Confirm</button>
                    </div>
                </form>
                <character-display></character-display>
            </div>
        `;
    }
}