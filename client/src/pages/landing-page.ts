import { LitElement, html, css } from "lit"
import { defaultStyles, buttonStyles } from "../styles/style"
import "../styles/styles.css";

export class LandingPage extends LitElement {

    private handleStartGame() {
        location.pathname = "login"
    }

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        h1 {
            font-size: 3em;
            margin: 1em;
        }

        div {
            align-items: center;
        }

        button {
            position: fixed;
            bottom: 35%;
            width: 12em;
            height: 3em;
            font-size: 2em;
            background-color: var(--light-blue);
            opacity: 0.95;
        }
    `];

    render() {
        return html`
            <h1>Hero's<br>Journey</h1>
            <div>
                <button @click=${this.handleStartGame}>Start Game</button>
            </div>
        `
    }
}