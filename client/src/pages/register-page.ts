import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";
import { NotificationMixin } from "../mixins/notification-mixin";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

@customElement("register-page")
export class RegisterPage extends NotificationMixin(LitElement) {

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

    private handleRegister(event: Event) {
        // Prevent refresh
        event.preventDefault();

        // Register user
        axios.post("http://localhost:8080/api/v1/users", {
            email: this.email,
            password: this.password
        })
        .then(response => {
            if (response.status === 201) {
                this._notification_box.display("Account created", () => Router.go("login"));
            }
        })
        .catch(error => {
            if (error.response.status === 409) {
                this._notification_box.display("Account with email already exists");
            }
        })
    }

    static styles = landingFormStyles;

    render() {
        return html`
            <div class="landing-form">
                <h1><u>Register</u></h1>
                <form @submit=${this.handleRegister}>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label style="margin-top: 0;" for="email">Email</label>
                        <input id="email" type="email" @change=${this.updateEmail} required>
                    </div>
                    <div style="align-items: start; margin-bottom: 1em;">
                        <label style="margin-top: 0.5em;" for="password">Password</label>
                        <input id="password" type="password" minlength="8" @change=${this.updatePassword} required>
                    </div>
                    <button>Create Account</button>
                    <hr>
                    <div style="flex-direction: row">
                        <span>Already have an account?</span>
                        <a href="login">Login</a>
                    </div>
                </form>
            </div>
            ${this.notification_template}
        `
    }
}