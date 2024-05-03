import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { buttonStyles } from "../styles/style";

export class ConfirmationBox extends LitElement {
    @property()
    public message: string = "";

    @property()
    public display: boolean = false;

    public action: () => void = function() { return };

    private handleConfirm() {
        this.action();
        this.display = false;
    }

    private handleCancel() {
        this.display = false;
    }

    static styles = [
        buttonStyles,
        css`
        .page {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .box {
            position: absolute;
            top: 30%;
            bottom: 40%;
            width: 42em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-style: solid;
            border-color: var(--steel-blue);
            border-width: 1em;
            border-radius: 1.5em;
        }

        p {
            font-size: 1.5em;
        }

        button {
            width: 7em;
            height: 3.5em;
            font-weight: bold;
        }
    `];

    render() {
        return html`
            <div style="display:${this.display? 'flex' : 'none'}" class="page">
                <div class="box">
                    <p>${this.message}</p>
                    <div style="display: flex; flex-direction: row;">
                        <button type="button" @click=${this.handleCancel}>No</button>
                        <button type="button" @click=${this.handleConfirm}>Yes</button>
                    </div>
                </div>
            </div>
        `;
    }
}