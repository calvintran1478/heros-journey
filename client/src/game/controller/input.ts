
export class InputHandler {
    keys: string[] = [];
    possible_player_inputs: string[] = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    private handleKeyDown = (event: KeyboardEvent) => {
        if (this.possible_player_inputs.includes(event.key) && !this.keys.includes(event.key)) {
            this.keys.unshift(event.key);
        }
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        if (this.possible_player_inputs.includes(event.key)) {
            this.keys.splice(this.keys.indexOf(event.key), 1);
        }
    }

    constructor() {
        // Event listener to add player input to keys pressed
        window.addEventListener("keydown", this.handleKeyDown);

        // Event listener to remove player input from keys pressed
        window.addEventListener("keyup", this.handleKeyUp)
    }

    public removeEventListeners() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }
}