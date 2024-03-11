import {LitElement, html} from 'lit';
import { customElement } from 'lit/decorators.js';
import { CharacterCreation } from './pages/character-creation';
import { IterableSelector } from './components/iterable-selector';

@customElement('main-element')
export class MainElement extends LitElement {

    render() {
        return html`
            <character-creation></character-creation>
        `;
    }
}

customElements.define('character-creation', CharacterCreation);
customElements.define('iterable-selector', IterableSelector);