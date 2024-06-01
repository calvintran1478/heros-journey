import { LitElement, html } from "lit"
import { customElement, query } from "lit/decorators.js";
import { Router } from "@vaadin/router";
import { NotificationMixin } from "../mixins/notification-mixin";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

@customElement("login-page")
export class LoginPage extends NotificationMixin(LitElement) {

    @query("#email", true)
    private _email!: HTMLInputElement;

    @query("#password", true)
    private _password!: HTMLInputElement;

    private handleLogin() {
        axios.post("http://localhost:8080/api/v1/users/login", {
            email: this._email.value,
            password: this._password.value,
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
                <form>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="email">Email</label>
                        <input id="email">
                    </div>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="password">Password</label>
                        <input id="password" type="password">
                    </div>
                    <button type="button" @click=${this.handleLogin}>Login</button>
                    <a href="reset-password">Forgot Password?</a>
                </form>
            </div>
            ${this.notification_template}
        `
    }
}
