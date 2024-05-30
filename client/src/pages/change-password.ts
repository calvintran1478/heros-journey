import { LitElement, html, css } from "lit";
import { query } from "lit/decorators.js";
import { NotificationBox } from "../components/notification-box"; 
import { landingFormStyles } from "../styles/style";
import axios from "axios";

export class ChangePassword extends LitElement {

    private password: string = "";
    private retypedPassword: string = "";
    private token: string = "";

    @query("notification-box")
    private _notification_box!: NotificationBox

    @query("form")
    private _form!: HTMLFormElement

    private updatePassword(event: Event) {
        const input = event.target as HTMLInputElement;
        this.password = input.value;
    }

    private updateRetypedPassword(event: Event) {
        const input = event.target as HTMLInputElement;
        this.retypedPassword = input.value;
    }

    private changePassword() {
        // Check that the password fields match
        if (this.password !== this.retypedPassword) {
            this._notification_box.message = "Passwords must match";
            this._notification_box.display = true;
            return;
        }

        axios.patch("http://localhost:8080/api/v1/users/password", {
            password: this.password
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                this._notification_box.message = "Password successfully changed";
                this._notification_box.close_action = () => location.pathname = "login";
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                this._notification_box.message = "Recovery link has expired or is invalid";
                this._form.reset()
            }
        })
        .finally(() => {
            this._notification_box.display = true;
        })
    }

    protected firstUpdated() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token")) {
            this.token = urlParams.get("token")!
        }
    }

    static styles = [
        landingFormStyles,
        css`
        .landing-form {
            top: 50%;
            height: 42em;
        }
    `];

    render() {
        return html`
            <div class="landing-form">
                <h1><u>Change Password</u></h1>
                <form>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="password">New Password</label>
                        <input id="password" type="password" @change=${this.updatePassword}>
                    </div>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="confirm-password">Confirm Password</label>
                        <input id="-confirm-password" type="password" @change=${this.updateRetypedPassword}>
                    </div>
                    <button type="button" @click=${this.changePassword}>Confirm</button>
                </form>
            </div>
            <notification-box></notification-box>
        `;
    }
}
