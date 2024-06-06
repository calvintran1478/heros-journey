import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import { Router } from "@vaadin/router";
import { NotificationMixin } from "../mixins/notification-mixin";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

@customElement("change-password")
export class ChangePassword extends NotificationMixin(LitElement) {

    private password: string = "";
    private retypedPassword: string = "";
    private token: string = "";

    @query("form", true)
    private _form!: HTMLFormElement

    private updatePassword(event: Event) {
        const input = event.target as HTMLInputElement;
        this.password = input.value;
    }

    private updateRetypedPassword(event: Event) {
        const input = event.target as HTMLInputElement;
        this.retypedPassword = input.value;
    }

    private changePassword(event: Event) {
        // Prevent refresh
        event.preventDefault();

        // Check that the password fields match
        if (this.password !== this.retypedPassword) {
            this._notification_box.display("Passwords must match");
            return;
        }

        // Update user password
        axios.patch("http://localhost:8080/api/v1/users/password", {
            password: this.password
        }, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
        .then(response => {
            if (response.status === 204) {
                this._notification_box.display("Password successfully changed", () => Router.go("login"));
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                this._notification_box.display("Recovery link has expired or is invalid");
                this._form.reset();
            }
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
                <form @submit=${this.changePassword}>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="password">New Password</label>
                        <input id="password" type="password" minlength="8" @change=${this.updatePassword} required>
                    </div>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="confirm-password">Confirm Password</label>
                        <input id="-confirm-password" type="password" @change=${this.updateRetypedPassword} required>
                    </div>
                    <button>Confirm</button>
                </form>
            </div>
            ${this.notification_template}
        `;
    }
}