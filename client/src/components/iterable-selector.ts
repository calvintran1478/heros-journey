import {LitElement, html, css} from 'lit';
import { state, property } from 'lit/decorators.js';
import left_selector from '../assets/images/components/left_selector.png'
import right_selector from '../assets/images/components/right_selector.png'
import { defaultStyles } from '../styles/style';

export class IterableSelector<T> extends LitElement {
    @state()
    private index: number = 0;

    @property()
    private readonly options: T[] = [];

    get curr() {
        return this.options[this.index];
    }

    private next() {
        this.index += 1;
        this.index %= this.options.length;
    }

    private prev() {
        this.index -= 1;
        if (this.index < 0) {
            this.index += this.options.length;
        }
    }

    static styles = [
        defaultStyles,
        css`
        input {
            color: black;
            text-align: center;
            margin: 1em;
        }

        button {
            border: 0;
            background: transparent;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.75;
        }

        img {
            width: 70px;
        }
    `];

    render() {
        return html`
            <div style="display: flex; flex-direction: row;">
                <button @click="${this.prev}">
                    <img src=${left_selector} />
                </button>
                <input type="textBox" disabled value=${this.options[this.index]} />
                <button @click="${this.next}">
                    <img src=${right_selector} />
                </button>
            </div>
        `;
    }
}