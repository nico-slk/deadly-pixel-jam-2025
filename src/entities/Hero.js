import Bullet from '../entities/Bullet.js';

class Hero extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'hero');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setGravityY(300);

        this.heroFacing = 'right';
        this.speed = 250;
        this.jumpSpeed = 400;
        this.bullets = scene.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: 30
        });
    }

    static preload(scene) {
        let heroGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
        heroGraphics.fillStyle(0x0000ff, 1); // Blue
        heroGraphics.fillRect(0, 0, 32, 64); // Hero size
        heroGraphics.generateTexture('hero', 32, 64);
        heroGraphics.destroy();
    }

    update(time, delta, inputManager) {
        // movement
        if (inputManager.left()) {
            this.setVelocityX(-this.speed);
            this.heroFacing = 'left';
        } else if (inputManager.right()) {
            this.setVelocityX(this.speed);
            this.heroFacing = 'right';
        } else {
            this.setVelocityX(0);
        }

        // Jump
        if (inputManager.up() && this.body.onFloor()) {
            this.setVelocityY(-this.jumpSpeed); 
        }

        // shooting
        if (inputManager.leftMouseButtonDown()) {
            this.shootBullet(inputManager.pointer.x, inputManager.pointer.y);
        }
        
        // update bullets
        this.bullets.children.iterate((bullet) => {
            bullet.update(time);
        });        
    }

    shootBullet(targetX, targetY) {
        const bullet = this.bullets.get(this.x, this.y - 20);

        if (bullet) {
            // Calculate angle to target
            const angle = Phaser.Math.Angle.Between(this.x, this.y - 20, targetX, targetY);
            
            bullet.fire(this.x, this.y - 20, angle);
            
            this.heroFacing = targetX < this.x ? 'left' : 'right';
        }
    }
}

export default Hero;