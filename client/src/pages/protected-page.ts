import { LitElement } from "lit";
import { Router } from "@vaadin/router";
import { NotificationMixin } from "../mixins/notification-mixin";
import { getToken } from "../utils/token";

export abstract class ProtectedPage extends NotificationMixin(LitElement) {

    protected token = "";

    protected async firstUpdated() {
        await this.refreshToken();
    }

    protected async refreshToken() {
        this.token = await getToken();
        if (this.token === "") {
            this._notification_box.display("Session has expired. Please login", () => Router.go("login"))
        }
    }
}