import { css } from 'lit'
import "../assets/fonts/stylesheet.css"

export const defaultStyles = css`
    /* Default font */
    * {
        font-family: 'solwayregular';
    }

    /* Default flex-box settings */
    div, form {
        display: flex;
        flex-direction: column;
    }

    /* Default cursor settings */
    button {
        cursor: pointer;
    }

    button:disabled {
        cursor: default;
    }
`;

export const buttonStyles = css`
    button {
        margin: 2em;
        cursor: pointer;
        border: none;
        border-radius: 1.5em;
        font-weight: bold;
    }
`;