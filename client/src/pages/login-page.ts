import { LitElement, html } from "lit"
import { query } from "lit/decorators.js";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

export class LoginPage extends LitElement {

    @query("#email")
    private _email!: HTMLInputElement;

    @query("#password")
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
                location.pathname = "character-selection";
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
                        <input id="email" type="textBox">
                    </div>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="password">Password</label>
                        <input id="password" type="password">
                    </div>
                    <button type="button" @click=${this.handleLogin}>Login</button>
                    <a href="reset-password">Forgot Password?</a>
                </form>
            </div>
        `
    }
}
