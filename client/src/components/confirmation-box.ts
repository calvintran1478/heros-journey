import { html } from "lit";
import { PopupBox } from "./popup-box";

export class ConfirmationBox extends PopupBox {

    public confirm_action: () => void = function() { return };

    protected confirm() {
        this.confirm_action();
        this.display = false;
    }

    static styles = super.styles;

    render() {
        return html`
            <div style="display:${this.display? 'flex' : 'none'}" class="page">
                <div class="box">
                    <p>${this.message}</p>
                    <div style="flex-direction: row;">
                        <button type="button" @click=${this.close}>No</button>
                        <button type="button" @click=${this.confirm}>Yes</button>
                    </div>
                </div>
            </div>
        `;
    }
}