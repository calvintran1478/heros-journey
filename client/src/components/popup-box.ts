import { LitElement, css } from "lit";
import { property } from "lit/decorators.js";
import { defaultStyles, buttonStyles } from "../styles/style";

export abstract class PopupBox extends LitElement {
    @property()
    public message: string = "";

    @property()
    public display: boolean = false;

    public close_action: () => void = function() { return };

    protected close() {
        this.close_action();
        this.display = false;
    }

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        .page {
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
        }
    `];
}