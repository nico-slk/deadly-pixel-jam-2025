import Zombie from "./Zombie.js";
import { hitZombie, zombieHitsHero } from "../events/CollisionEvents.js";

class Zombies extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.scene = scene;
    this.ground = null;
  }

  setGround(ground) {
    this.ground = ground;
  }

  spawn(hero) {
    const x = Phaser.Math.Between(0, 1) === 0 ? -50 : this.scene.game.config.width + 50;
    const y = Math.floor(this.scene.game.config.height * 0.5) - 32; // Just above ground level
    const zombie = new Zombie(this.scene, x, y);

    this.add(zombie);

    this.scene.physics.add.collider(zombie, this.ground);

    zombie.heroCollider = this.scene.physics.add.collider(
      hero,
      zombie,
      () => zombieHitsHero(hero, zombie, this.scene)
    );

    // Colisión con balas
    zombie.bulletOverlap = this.scene.physics.add.overlap(
      hero.bullets,
      zombie,
      (bullet, zombie) => hitZombie(bullet, zombie, this.scene),
      null,
      this.scene
    );
  }
}

export default Zombies;
