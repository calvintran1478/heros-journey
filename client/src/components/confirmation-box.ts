import { html } from "lit";
import { PopupBox } from "./popup-box";

export class ConfirmationBox extends PopupBox {

    protected confirm_action: () => void = function() { return };

    protected confirm() {
        this.confirm_action();
        this._display = false;
    }

    public display(message?: string, close_action?: () => void, confirm_action?: () => void) {
        if (confirm_action !== undefined) {
            this.confirm_action = confirm_action;
        }
        super.display(message, close_action);
    }

    static styles = super.styles;

    render() {
        return html`
            <div style="display:${this._display? 'flex' : 'none'}" class="page">
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