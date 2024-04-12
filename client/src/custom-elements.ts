import { CharacterCreation } from "./pages/character-creation";
import { IterableSelector } from "./components/iterable-selector";
import { NotificationBox } from "./components/notification-box";
import { CharacterDisplay } from "./components/character-display";

/* Define custom lit elements */

// Page elements
customElements.define('character-creation', CharacterCreation);

// Component elements
customElements.define('iterable-selector', IterableSelector);
customElements.define('notification-box', NotificationBox);
customElements.define('character-display', CharacterDisplay);

declare global {
    interface HTMLElementTagNameMap {
        "iterable-selector": IterableSelector<string>
        "notification-box": NotificationBox
        "character-display": CharacterDisplay
    }
}