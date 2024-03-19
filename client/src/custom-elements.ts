import { CharacterCreation } from "./pages/character-creation";
import { IterableSelector } from "./components/iterable-selector";

/* Define custom lit elements */

// Page elements
customElements.define('character-creation', CharacterCreation);

// Component elements
customElements.define('iterable-selector', IterableSelector);

declare global {
    interface HTMLElementTagNameMap {
        "iterable-selector": IterableSelector<string>
    }
}