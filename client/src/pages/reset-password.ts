import { LitElement, html, css } from "lit";
import { query } from "lit/decorators.js";
import { NotificationBox } from "../components/notification-box"; 
import { landingFormStyles } from "../styles/style";
import axios from "axios";

export class ResetPassword extends LitElement {

    private email: string = "";

    @query("notification-box")
    private _notification_box!: NotificationBox

    @query("form")
    private _form!: HTMLFormElement

    private updateEmail(event: Event) {
        const input = event.target as HTMLInputElement;
        this.email = input.value;
    }

    private sendRestPasswordEmail() {
        axios.post("http://localhost:8080/api/v1/users/reset-password-email", {
            email: this.email
        })
        .then(response => {
            if (response.status === 200) {
                this._notification_box.message = "Password recovery link was sent to your inbox";
            }
        })
        .catch(error => {
            if (error.response.status === 404) {
                this._notification_box.message = "Account not found";
            }
        })
        .finally(() => {
            this._notification_box.display = true;
            this._form.reset();
        })
    }

    static styles = [
        landingFormStyles,
        css`
        .landing-form {
            top: 50%;
            height: 38em;
        }

        button:hover {
            background-image: linear-gradient(rgb(0 0 0/10%) 0 0);
        }
    `];

    render() {
        return html`
            <div class="landing-form">
                <h1><u>Reset Password</u></h1>
                <form>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="email">Email</label>
                        <input id="email" type="textBox" @change=${this.updateEmail}>
                    </div>
                    <button type="button" @click=${this.sendRestPasswordEmail}>Next</button>
                    <a href="login">Return to Login</a>
                </form>
            </div>
            <notification-box></notification-box>
        `;
    }
}