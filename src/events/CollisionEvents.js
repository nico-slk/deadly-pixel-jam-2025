export function hitZombie(zombie, bullet, scene) {
  if (zombie.isDying) {
    return;
  }
  zombie.isDying = true;

  // knockback
  const knockbackDirection = bullet.body.velocity.x < 0 ? -1 : 1; // Direction based on bullet
  const knockbackX = knockbackDirection * 40;
  const knockbackY = -100;
  zombie.body.setVelocity(knockbackX, knockbackY);

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

    // knockback
    const knockbackDirection = hero.x - zombie.x < 0 ? 1 : -1; // Direction based on hero
    const knockbackX = knockbackDirection * 40;
    const knockbackY = -100;
    zombie.setVelocity(knockbackX, knockbackY);

    zombie.anims.play("zombie-death", true);
    zombie.once("animationcomplete-zombie-death", () => zombie.destroy());
    return;
  }

  hero.anims.play("hero-death", true);
  hero.setY(440);
  //hero.setTint(0xff0000);
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
  setTimeout(() => {
    scene.gameOver = false;
    scene.gameOverText.setVisible(false);
    scene.physics.resume();
    scene.scene.restart();
  }, 2000);
}

export function handleZombieGroundCollision(zombie, ground) {
  if (zombie.isDying && zombie.body.touching.down) {
    zombie.body.setVelocity(0);
    zombie.body.setFriction(1);
    zombie.body.setDragX(1000);
  }
}
