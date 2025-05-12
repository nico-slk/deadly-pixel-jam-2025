class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'zombie');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.setGravityY(300);
        this.setBounce(0.1);
    }

    static preload(scene) {
        let zombieGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
        zombieGraphics.fillStyle(0x006400, 1); // Dark Green
        zombieGraphics.fillRect(0, 0, 32, 64); // Zombie size
        zombieGraphics.generateTexture('zombie', 32, 64);
        zombieGraphics.destroy();
    }

    static createZombie(scene, x, y) {
        const zombie = new Zombie(scene, x, y);
        zombie.setVelocityX(-100); // Move left
        zombie.setCollideWorldBounds(false);
        zombie.setBounce(1); // Bounce off walls
        return zombie;
    }

    update() {
        // Check if the zombie is off-screen and reset its position
        if (this.x < -50) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}

export default Zombie;