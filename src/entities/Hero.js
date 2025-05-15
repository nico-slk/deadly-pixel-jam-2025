import { createHeroAnimation } from "../animations/hero.js";
import Bullet from "../entities/Bullet.js";
import { createHeroSprites } from "../sprites.js/hero.js";

class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setGravityY(300);
    this.body.setSize(18, 32);
    this.body.setOffset(14, 9);

    this.heroFacing = "right";

    this.speed = 60;
    this.jumpSpeed = 400;

    // state machine for animations
    this.moving = false;
    this.jumping = false;

    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
      maxSize: 30,
    });
  }

  static preload(scene) {
    createHeroSprites(scene);
  }

  update(time, delta, inputManager) {
    let moving = false;

    if(this.body.onFloor() && this.jumping) {
        this.jumping = false;
    }

    // movement
    if (inputManager.left()) {
        if (!this.jumping) {
            this.anims.play("hero-walk", true);
        }
        this.setVelocityX(-this.speed);
        this.flipX = true;
        this.heroFacing = "left";
        moving = true;
    } else if (inputManager.right()) {
        if (!this.jumping) {
            this.anims.play("hero-walk", true);
        }
        this.setVelocityX(this.speed);
        this.heroFacing = "right";
        this.flipX = false;
        moving = true;
    }

    // jump
    if (!this.jumping && inputManager.up() && this.body.onFloor()) {
        this.jumping = true;
        this.anims.play("hero-jump", true);
        this.setVelocityY(-this.jumpSpeed);
    }

    // idle when not jumping
    if (!this.jumping) {
        if (!moving) {
            this.setVelocityX(0);
            this.anims.play("hero-idle", true);
        }
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
    const bullet = this.bullets.get(this.x, this.y);

    if (bullet) {
      // Calculate angle to target
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y - 20,
        targetX,
        targetY
      );

      bullet.fire(this.x, this.y, angle);

      this.heroFacing = targetX < this.x ? "left" : "right";
    }
  }
}

export default Hero;
