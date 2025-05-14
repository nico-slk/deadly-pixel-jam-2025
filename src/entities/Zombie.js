const ZOMBIE_SPEED = 100;

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
        zombieGraphics.fillRect(0, 0, 18, 32); // Zombie size
        zombieGraphics.generateTexture('zombie', 18, 32);
        zombieGraphics.destroy();
    }

    update(time, hero) {
        if (this.x < hero.x) {
            // Zombie is on the left of hero, move right
            this.setVelocityX(ZOMBIE_SPEED);
        } else if (this.x > hero.x) {
            // Zombie is on the right of hero, move left
            this.setVelocityX(-ZOMBIE_SPEED);
        } else {
            // Zombie is exactly at hero's x position
            this.setVelocityX(0);
        }

        // Destroy zombies if they go way off screen
        if (this.y > this.game.config.height + 100) {
            this.destroy();
        }
    }
}

export default Zombie;