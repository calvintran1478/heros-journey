import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";
import { NotificationMixin } from "../mixins/notification-mixin";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

@customElement("login-page")
export class LoginPage extends NotificationMixin(LitElement) {

    private email: string = "";
    private password: string = "";

    private updateEmail(event: Event) {
        const input = event.target as HTMLInputElement;
        this.email = input.value;
    }

    private updatePassword(event: Event) {
        const input = event.target as HTMLInputElement;
        this.password = input.value;
    }

    private handleLogin(event: Event) {
        // Prevent refresh
        event.preventDefault();

        // Login user
        axios.post("http://localhost:8080/api/v1/users/login", {
            email: this.email,
            password: this.password,
        },{
            withCredentials: true
        })
        .then(response => {
            if (response.status === 200) {
                Router.go("character-selection");
            }
        })
        .catch(error => {
            if (error.response.status === 401) {
                this._notification_box.display("Incorrect password");
            }

            else if (error.response.status === 404) {
                this._notification_box.display("Email not found");
            }
        })
    }

    static styles = landingFormStyles;

    render() {
        return html`
            <div class="landing-form">
                <h1><u>Login</u></h1>
                <form @submit=${this.handleLogin}>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label style="margin-top: 0;" for="email">Email</label>
                        <input id="email" type="email" @change=${this.updateEmail} required>
                    </div>
                    <div style="align-items: start; margin-bottom: 1em;">
                        <label style="margin-top: 0.5em;" for="password">Password</label>
                        <input id="password" type="password" @change=${this.updatePassword} required>
                    </div>
                    <button>Login</button>
                    <hr>
                    <div style="flex-direction: row">
                        <span>Need an account?</span>
                        <a href="register">Register</a>
                    </div>
                    <a href="reset-password">Forgot Password?</a>
                </form>
            </div>
            ${this.notification_template}
        `
    }
}