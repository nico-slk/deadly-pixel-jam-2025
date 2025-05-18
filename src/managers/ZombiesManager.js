import Zombie from "../entities/Zombie.js";
import { hitZombie, zombieHitsHero, handleZombieGroundCollision } from "../events/CollisionEvents.js";

class ZombiesManager {
  constructor(scene) {
    this.scene = scene;
    this.zombieSpawnDelay = 2000;
    this.zombieTimer = {};
    this.zombies = [];
  }

  update(time, delta, hero) {
    this.zombies.forEach((zombie) => zombie.update(time, delta, hero));
  }

  spawn(hero, ground) {
    const x = Phaser.Math.Between(0, 1) === 0 ? -50 : this.scene.game.config.width + 50;
    const y = Math.floor(this.scene.game.config.height * 0.5) - 32; // Just above ground level

    let zombie = new Zombie(this.scene, x, y, this);

    this.groundCollider = this.scene.physics.add.collider(
      zombie,
      ground,
      handleZombieGroundCollision,
      null,
      this.scene
    );

    zombie.heroCollider = this.scene.physics.add.collider(hero, zombie, () =>
      zombieHitsHero(hero, zombie, this.scene)
    );

    zombie.bulletOverlap = this.scene.physics.add.overlap(
      hero.bullets,
      zombie,
      (bullet, zombie) => hitZombie(bullet, zombie, this.scene),
      null,
      this.scene
    );

    this.zombies.push(zombie);
  }

  startSpawningZombies(hero, ground) {
    this.zombieTimer = this.scene.time.addEvent({
      delay: this.zombieSpawnDelay,
      loop: true,
      callback: () => this.spawn(hero, ground),
      callbackScope: this,
    });
  }
}

export default ZombiesManager;
