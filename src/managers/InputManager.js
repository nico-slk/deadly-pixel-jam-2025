class InputManager {
    constructor(scene) {
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.pointer = scene.input.activePointer;
    }

    left() {
        return this.cursors.left.isDown || this.keyA.isDown;
    }
    
    right() {
        return this.cursors.right.isDown || this.keyD.isDown;
    }

    up() {
        return this.cursors.up.isDown || this.keyW.isDown;
    }

    leftMouseButtonDown() {
        return this.pointer.isDown;
    }
}

export default InputManager;