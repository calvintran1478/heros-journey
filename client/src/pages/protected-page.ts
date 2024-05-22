import { LitElement, html } from "lit"
import { query } from 'lit/decorators.js';
import { NotificationBox } from "../components/notification-box";
import { getToken } from "../utils/token";

export abstract class ProtectedPage extends LitElement {

    protected token = "";

    protected auth_template = html`
        <notification-box id="auth-notification"></notification-box>
    `

    @query('#auth-notification')
    private _auth_notification!: NotificationBox;

    protected async firstUpdated() {
        this._auth_notification.message = "Session has expired. Please login";
        this._auth_notification.close_action = () => location.pathname = "login";
        await this.refreshToken();
    }

    protected async refreshToken() {
        this.token = await getToken();
        if (this.token === "") {
            this._auth_notification.display = true;
        }
    }
}