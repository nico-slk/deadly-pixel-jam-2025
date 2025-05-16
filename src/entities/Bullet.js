const BULLET_SPEED = 1200;

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(8, 8);
    this.setOrigin(0, -1.5);
    this.setDepth(1);
    this.setActive(false);
    this.setVisible(false);
  }

  static preload(scene) {
    let bulletGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
    bulletGraphics.fillStyle(0xffffff, 1); // White
    bulletGraphics.fillRect(0, 0, 8, 8); // Bullet size
    bulletGraphics.generateTexture("bullet", 8, 8);
    bulletGraphics.destroy();
  }

  fire(x, y, angle) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body.allowGravity = false;

    // Calculate velocity based oan angle
    this.body.velocity.x = Math.cos(angle) * BULLET_SPEED;
    this.body.velocity.y = Math.sin(angle) * BULLET_SPEED;
  }

  update(time, delta) {
    // Get current game dimensions
    const { width, height } = this.scene.scale;

    // Deactivate bullet if it goes off screen
    if (
      this.x < -50 ||
      this.x > width + 50 ||
      this.y < -50 ||
      this.y > height + 50
    ) {
      this.finalize();
    }
  }

  finalize() {
    this.destroy();
  }
}

export default Bullet;
