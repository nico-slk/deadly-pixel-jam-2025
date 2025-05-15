export function hitZombie(bullet, zombie, scene) {
  // bullet.finalize();
  // zombie.destroy();

  // // Increase difficulty
  // scene.zombieSpawnDelay = Math.max(500, scene.zombieSpawnDelay * 0.98);

  // if (scene.zombieTimer) {
  //   scene.zombieTimer.delay = scene.zombieSpawnDelay;
  // }

  bullet.finalize();
  zombie.isDying = true;
  zombie.setVelocity(0);
  zombie.anims.play("zombie-death", true);
  zombie.once("animationcomplete-zombie-death", () => zombie.destroy());

  this.zombieSpawnDelay = Math.max(500, this.zombieSpawnDelay * 0.98);
  if (this.zombieTimer) {
    this.zombieTimer.delay = this.zombieSpawnDelay;
  }
}

export function zombieHitsHero(hero, zombies, scene) {
  hero.anims.play("hero-death", true);
  hero.setY(437);
  hero.setTint(0xff0000);
  // hero.anims.stop();
  hero.setVelocity(0);
  scene.gameOver = true;
  scene.gameOverText.setVisible(true);
  scene.physics.pause();

  // Show cursor again when game is over
  scene.input.setDefaultCursor("default");

  // Stop spawning new zombies
  if (scene.zombieTimer) {
    scene.zombieTimer.remove();
  }
}
