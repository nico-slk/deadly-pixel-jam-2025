export function hitZombie(bullet, zombie, scene) {
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

  scene.zombieSpawnDelay = Math.max(500, scene.zombieSpawnDelay * 0.5);
  if (scene.zombieTimer) {
    scene.zombieTimer.delay = scene.zombieSpawnDelay;
  }
}

export function zombieHitsHero(hero, zombies, scene) {
  hero.anims.play("hero-death", true);
  hero.setY(437);
  hero.setTint(0xff0000);
  hero.setVelocity(0);
  scene.gameOver = true;
  scene.gameOverText.setVisible(true);
  scene.physics.pause();

  scene.zombies.children.iterate((zombie) => {
    if (
      zombie.anims &&
      zombie.anims.isPlaying &&
      zombie.anims.currentAnim.key !== "hero-death"
    ) {
      zombie.anims.stop();
    }
  });

  // Show cursor again when game is over
  scene.input.setDefaultCursor("default");

  // Stop spawning new zombies
  if (scene.zombieTimer) {
    scene.zombieTimer.remove();
  }
}
