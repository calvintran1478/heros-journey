import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { CharacterDisplay } from "./character-display";

export class SelectionSlot extends LitElement {

    @property()
    public character: CharacterDisplay | null = null;

    @property()
    public selected: boolean = false;

    public click_action: () => void = function() { return; };

    static styles = css`
        button {
            cursor: pointer;
        }

        div {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .ellipse {
            height: 4em;
            width: 12em;
            border-radius: 50%;
        }
    `;

    render() {
        return html`
            <div>
                ${this.character}
                <button style="background-color: ${this.selected ? "var(--selection-highlight)" : "white"}" class="ellipse" type="button" @click=${this.click_action}></button>
            <div>
        `;
    }
}