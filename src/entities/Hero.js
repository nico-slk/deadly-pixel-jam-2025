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
    }

    static preload(scene) {
        let heroGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
        heroGraphics.fillStyle(0x0000ff, 1); // Blue
        heroGraphics.fillRect(0, 0, 32, 64); // Hero size
        heroGraphics.generateTexture('hero', 32, 64);
        heroGraphics.destroy();
    }

    update(time, cursors, keyA, keyD) {
        if (cursors.left.isDown || keyA.isDown) {
            this.setVelocityX(-this.speed);
            this.heroFacing = 'left';
        } else if (cursors.right.isDown || keyD.isDown) {
            this.setVelocityX(this.speed);
            this.heroFacing = 'right';
        } else {
            this.setVelocityX(0);
        }

        if (cursors.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-this.jumpSpeed); // Jump
        }

        // update bullets
        this.bullets.children.iterate((bullet) => {
            bullet.update(time);
        });
    }

    handleMouseClick(pointer) {
        if (pointer.isDown) {
            this.shootBullet(pointer.x, pointer.y);
        }
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