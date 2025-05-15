export function hitZombie(bullet, zombie, scene) {
  bullet.finalize();
  zombie.destroy();

  // Increase difficulty
  scene.zombieSpawnDelay = Math.max(500, scene.zombieSpawnDelay * 0.98);

  if (scene.zombieTimer) {
    scene.zombieTimer.delay = scene.zombieSpawnDelay;
  }
}

export function zombieHitsHero(hero, zombie, scene) {
  
  hero.setTint(0xff0000);
  hero.anims.play("hero-death", true);
  
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
