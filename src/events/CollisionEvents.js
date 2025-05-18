export function hitZombie(zombie, bullet, scene) {
  // por alguna razón phaser invierte la asignación de los parámetros
  if (zombie.isDying) return;
  zombie.isDying = true;
  zombie.setVelocity(0);
  zombie.body.checkCollision.none = true;
  zombie.body.setAllowGravity(false);
  zombie.anims.play("zombie-death", true);
  bullet.finalize();

  if (zombie.heroCollider) {
    zombie.heroCollider.destroy();
    zombie.heroCollider = null;
  }

  if (zombie.bulletOverlap) {
    zombie.bulletOverlap.destroy();
    zombie.bulletOverlap = null;
  }

  zombie.once("animationcomplete-zombie-death", () => zombie.destroy());

  zombie.manager.zombieSpawnDelay = Math.max(
    500,
    zombie.manager.zombieSpawnDelay * 0.5
  );

  if (zombie.manager.zombieTimer) {
    zombie.manager.zombieTimer.delay = zombie.manager.zombieSpawnDelay;
  }
  zombie.manager.zombies = zombie.manager.zombies.filter((z) => z !== zombie);
}

export function zombieHitsHero(hero, zombie, scene) {
  if (hero.anims.currentAnim.key === "hero-attack") {
    if (zombie.heroCollider) {
      zombie.heroCollider.destroy();
      zombie.heroCollider = null;
    }
    zombie.isDying = true;
    zombie.setVelocity(0);
    zombie.body.checkCollision.none = true;
    zombie.body.setAllowGravity(false);
    zombie.anims.play("zombie-death", true);
    zombie.once("animationcomplete-zombie-death", () => zombie.destroy());
    return;
  }
  hero.anims.play("hero-death", true);
  hero.setY(437);
  hero.setTint(0xff0000);
  hero.setVelocity(0);

  scene.gameOver = true;
  scene.gameOverText.setVisible(true);
  scene.physics.pause();

  zombie.manager.zombies.forEach((z) => {
    if (
      z.anims &&
      z.anims.isPlaying &&
      z.anims.currentAnim.key !== "hero-death"
    ) {
      z.anims.stop();
    }
  });

  // Show cursor again when game is over
  scene.input.setDefaultCursor("default");

  // Stop spawning new zombies
  if (zombie.manager.zombieTimer) {
    zombie.manager.zombieTimer.remove();
  }
}
