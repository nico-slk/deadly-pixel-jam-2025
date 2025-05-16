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

  spawn() {
    const x = Phaser.Math.Between(0, this.scene.game.config.width);
    const y = 0;
    const zombie = new Zombie(this.scene, x, y);

    this.add(zombie); // Agrega al grupo
    this.scene.physics.add.collider(zombie, this.ground);

    zombie.heroCollider = this.scene.physics.add.collider(
      this.scene.hero,
      zombie,
      () => zombieHitsHero(this.scene.hero, zombie, this.scene)
    );

    // Colisión con balas
    zombie.bulletOverlap = this.scene.physics.add.overlap(
      this.scene.hero.bullets,
      zombie,
      (bullet, zombie) => hitZombie(bullet, zombie, this.scene),
      null,
      this.scene
    );
  }
}

export default Zombies;
