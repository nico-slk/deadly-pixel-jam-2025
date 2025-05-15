import Zombie from "./Zombie.js";
import { hitZombie } from "../events/CollisionEvents.js";

class Zombies extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.scene = scene;
    this.ground = null;

    // this.createMultiple({
    //   frameQuantity: 6,
    //   key: "zombie-walk",
    //   active: false,
    //   visible: false,
    //   classType: Zombie,
    // });
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

    // Colisión con balas
    this.scene.physics.add.overlap(
      this.scene.hero.bullets,
      this.zombies,
      (bullet, zombie) => hitZombie(bullet, zombie, this),
      null,
      this.scene
    );
  }
}

export default Zombies;
