import { createZombieSprites } from "../sprites.js/zombieSprites.js";

const ZOMBIE_SPEED = 100;

class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, manager) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.manager = manager;

    this.setCollideWorldBounds(false);
    this.body.setGravityY(300);
    this.body.setSize(10, 26);
    this.body.setOffset(20, 14);
    this.setBounce(0.1);

    this.setTint(0x008800);

    this.isDying = false;
    this.heroCollider = null;
    this.hasPlayedDeath = false;
  }

  static preload(scene) {
    createZombieSprites(scene);
  }

  update(time, delta, hero) {
    if (this.isDying) {
      if (!this.hasPlayedDeath) {
<<<<<<< HEAD
        this.setVelocity(0);
=======
        this.hasPlayedDeath = true;
>>>>>>> 009d7e846766983c15c47627d3065b43b9d54d0d
        this.anims.play("zombie-death", true);
        this.once("animationcomplete-zombie-death", () => {
          this.hasPlayedDeath = true;
          this.destroy();
        });
      }
      return;
    }

    this.anims.play("zombie-walk", true);

    if (this.x < hero.x) {
      // Zombie is on the left of hero, move right
      this.setVelocityX(ZOMBIE_SPEED);
      this.flipX = false;
    } else if (this.x > hero.x) {
      // Zombie is on the right of hero, move left
      this.setVelocityX(-ZOMBIE_SPEED);
      this.flipX = true;
    } else {
      // Zombie is exactly at hero's x position
      this.setVelocityX(0);
    }

    // Destroy zombies if they go way off screen
    if (this.y > 2000) {
      this.destroy();
    }
  }
}

export default Zombie;
