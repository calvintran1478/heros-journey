import { LandingPage } from "./pages/landing-page";
import { LoginPage } from "./pages/login-page";
import { ResetPassword } from "./pages/reset-password";
import { ChangePassword } from "./pages/change-password";
import { CharacterCreation } from "./pages/character-creation";
import { CharacterSelection } from "./pages/character-selection";
import { IterableSelector } from "./components/iterable-selector";
import { NotificationBox } from "./components/notification-box";
import { CharacterDisplay } from "./components/character-display";
import { SelectionSlot } from "./components/selection-slot";
import { ConfirmationBox } from "./components/confirmation-box";

/* Define custom lit elements */

// Page elements
customElements.define('landing-page', LandingPage);
customElements.define('login-page', LoginPage);
customElements.define('reset-password', ResetPassword);
customElements.define('change-password', ChangePassword)
customElements.define('character-creation', CharacterCreation);
customElements.define('character-selection', CharacterSelection);

// Component elements
customElements.define('iterable-selector', IterableSelector);
customElements.define('notification-box', NotificationBox);
customElements.define('character-display', CharacterDisplay);
customElements.define('selection-slot', SelectionSlot);
customElements.define('confirmation-box', ConfirmationBox);

declare global {
    interface HTMLElementTagNameMap {
        "iterable-selector": IterableSelector<string>
        "notification-box": NotificationBox
        "character-display": CharacterDisplay
        "selection-slot": SelectionSlot
        "confirmation-box": ConfirmationBox
    }
}