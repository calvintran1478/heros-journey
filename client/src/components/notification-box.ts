import { html } from "lit";
import { PopupBox } from "./popup-box";

export class NotificationBox extends PopupBox {

    static styles = super.styles;

    render() {
        return html`
            <div style="display:${this._display? 'flex' : 'none'}" class="page">
                <div class="box">
                    <p>${this.message}</p>
                    <button type="button" @click=${this.close}>Okay</button>
                </div>
            </div>
        `;
    }
}