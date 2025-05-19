class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyShift = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
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

  shoot() {
    return this.keyShift.isDown;
  }

  leftMouseButtonDown() {
    return this.pointer.isDown;
  }

  EButtonDown() {
    return this.keyE.isDown;
  }

  // Métodos para obtener la posición del puntero en coordenadas de pantalla
  getPointerX() {
    return this.pointer.x;
  }

  getPointerY() {
    return this.pointer.y;
  }

  // Métodos para obtener la posición del puntero en coordenadas del mundo (ajustadas por cámara)
  getWorldPointerX() {
    const camera = this.scene.cameras.main;
    return camera.getWorldPoint(this.pointer.x, this.pointer.y).x;
  }

  getWorldPointerY() {
    const camera = this.scene.cameras.main;
    return camera.getWorldPoint(this.pointer.x, this.pointer.y).y;
  }
}

export default InputManager;
