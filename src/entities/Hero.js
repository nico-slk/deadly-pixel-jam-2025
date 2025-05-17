import Bullet from "../entities/Bullet.js";
import { createHeroSprites } from "../sprites.js/heroSprites.js";

class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setGravityY(300);
    this.body.setSize(10, 26);
    this.body.setOffset(20, 14);

    this.heroFacing = "right";

    this.speed = 250;
    this.jumpSpeed = 400;

    // state machine for animations
    this.moving = false;
    this.jumping = false;
    this.isShooting = false;
    this.isAttacking = false;

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
    if (this.scene.gameOver) return;

    if (this.body.onFloor() && this.jumping) this.jumping = false;

    if (this.isAttacking) return;

    if (this.isShooting) return;

    if (!this.moving) {
      this.setVelocityX(0);
      this.anims.play("hero-idle", true);
    }

    // movement
    if (this.body.onFloor()) {
      this.moving = true;

      if (this.jumping || this.isShooting || this.isAttacking) {
        this.anims.stop("hero-run");
        this.setVelocityX(0);
        this.moving = false;
        return;
      }
      if (inputManager.left()) {
        this.anims.play("hero-run", true);
        this.setVelocityX(-this.speed);
        this.heroFacing = "left";
      }

      if (inputManager.right()) {
        this.anims.play("hero-run", true);
        this.setVelocityX(this.speed);
        this.heroFacing = "right";
      }

      if (!inputManager.left() && !inputManager.right()) {
        this.setVelocityX(0);
        this.anims.play("hero-idle", true);
      }

      this.flipX = this.heroFacing !== "right";
    }

    // Jump
    if (inputManager.up() && this.body.onFloor()) {
      this.moving = true;
      this.anims.play("hero-jump", true);
      this.setVelocityY(-this.jumpSpeed);
      this.once("animationcomplete-hero-jump", () => {
        this.moving = false;
      });
    }

    // Animation on the air
    if (!this.body.onFloor()) {
      this.anims.play("hero-jump", true);
      this.moving = true;
      if (inputManager.right()) {
        this.setVelocityX(this.speed);
        this.flipX = false;
      }
      if (inputManager.left()) {
        this.setVelocityX(-this.speed);
        this.flipX = true;
      }
    }

    // shooting
    if (!this.isShooting) {
      if (inputManager.leftMouseButtonDown()) {
        this.moving = true;
        this.isShooting = true;

        this.setVelocityX(0);

        this.flipX = this.x > inputManager.pointer.x;
        this.anims.play("hero-shot");

        this.shootBullet(inputManager.pointer.x, inputManager.pointer.y);
        this.once("animationcomplete-hero-shot", () => {
          this.moving = false;
          this.isShooting = false;
        });
      }

      if (inputManager.shoot()) {
        this.shootBullet(20, 0);
      }
    }

    // attacking
    if (inputManager.EButtonDown()) {
      this.isAttacking = true;
      this.moving = true;
      // this.body.setSize(36, 36);
      // this.body.setOffset(25, 12);
      this.body.setSize(10, 26);
      this.body.setOffset(40, 20);

      this.flipX = this.heroFacing === "left";

      if (this.flipX) this.body.setOffset(35, 20);

      this.anims.play("hero-attack");

      this.setVelocityX(0);

      this.once("animationcomplete-hero-attack", () => {
        this.isAttacking = false;
        this.moving = false;
      });
    } else {
      this.body.setSize(10, 26);
      this.body.setOffset(20, 14);
    }

    // update bullets
    this.bullets.children.iterate((bullet) => {
      bullet.update(time);
    });
  }

  shootBullet(targetX, targetY) {
    const bullet = this.bullets.get();

    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      // Calculate angle to target
      const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);

      bullet.fire(this.x, this.y - 20, angle);

      this.heroFacing = targetX < this.x ? "left" : "right";
    }
  }
}

export default Hero;
