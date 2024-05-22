import { LitElement, html, css } from "lit"
import { query } from "lit/decorators.js";
import { defaultStyles, buttonStyles } from "../styles/style";
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

    static styles = [
        defaultStyles,
        buttonStyles,
        css`
        h1 {
            font-size: 2.5em;
        }

        div, form {
            align-items: center;
        }

        label {
            font-size: 2em;
            margin: 1em 0;
        }

        input {
            height: 1.5em;
            width: 18em;
            font-size: 2em;
        }

        button {
            width: 10em;
            height: 3em;
            font-size: 1.5em;
            background-color: var(--ocean-blue);
            opacity: 0.85;
        }

        .login-form {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 45em;
            height: 50em;
            background-color: white;
            opacity: 0.95;
            border-radius: 1em;
        }
    `];

    render() {
        return html`
            <div class="login-form">
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
                </form>
            </div>
        `
    }
}