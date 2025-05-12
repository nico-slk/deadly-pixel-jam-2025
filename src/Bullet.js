const BULLET_SPEED = 800;

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    fire(x, y, angle) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.allowGravity = false;

        // Calculate velocity based on angle
        const speed = BULLET_SPEED;
        this.body.velocity.x = Math.cos(angle) * speed;
        this.body.velocity.y = Math.sin(angle) * speed;
    }

    update(time, delta) {
        // Get current game dimensions
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;
        
        // Deactivate bullet if it goes off screen
        if (this.x < -50 || this.x > gameWidth + 50 || 
            this.y < -50 || this.y > gameHeight + 50) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}

export default Bullet;