import { LitElement, TemplateResult, html } from "lit";
import { query } from "lit/decorators.js";
import { NotificationBox } from "../components/notification-box";
import "../components/notification-box"

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class NotificationMixinInterface {
    _notification_box: NotificationBox;
    notification_template: TemplateResult;
}

export const NotificationMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class NotificationMixinClass extends superClass {
        @query("notification-box", true)
        protected _notification_box!: NotificationBox;

        protected notification_template = html`
            <notification-box></notification-box>
        `
    };
    return NotificationMixinClass as unknown as Constructor<NotificationMixinInterface> & T;
}