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

export const landingFormStyles = [
        defaultStyles,
        buttonStyles,
        css`
        h1 {
            font-size: 2.5em;
            margin: 1em;
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

        .landing-form {
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

        a {
            margin: 0.5em;
            font-size: 1.5em;
            font-weight: bold;
            color: black;
            opacity: 0.5;
        }

        a:hover {
            text-decoration: none;
        }

        hr {
            border: 1px solid silver;
            margin: 1em;
            margin-bottom: 2em;
            width: 100%;
        }

        span {
            margin: 0.5em;
            font-size: 1.5em;
            color: black;
        }
    `];
