import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import { NotificationMixin } from "../mixins/notification-mixin";
import { landingFormStyles } from "../styles/style";
import axios from "axios";

@customElement("reset-password")
export class ResetPassword extends NotificationMixin(LitElement) {

    private email: string = "";

    @query("form", true)
    private _form!: HTMLFormElement

    private updateEmail(event: Event) {
        const input = event.target as HTMLInputElement;
        this.email = input.value;
    }

    private sendRestPasswordEmail(event: Event) {
        // Prevent refresh
        event.preventDefault();

        // Send email to recover user password
        axios.post("http://localhost:8080/api/v1/users/reset-password-email", {
            email: this.email
        })
        .then(response => {
            if (response.status === 200) {
                this._notification_box.display("Password recovery link was sent to your inbox");
            }
        })
        .catch(error => {
            if (error.response.status === 404) {
                this._notification_box.display("Account not found");
            }
        })
        .finally(() => {
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
                <form @submit=${this.sendRestPasswordEmail}>
                    <div style="align-items: start; margin-bottom: 2em;">
                        <label for="email">Email</label>
                        <input id="email" type="email" @change=${this.updateEmail} required>
                    </div>
                    <button>Next</button>
                    <a href="login">Return to Login</a>
                </form>
            </div>
            ${this.notification_template}
        `;
    }
}