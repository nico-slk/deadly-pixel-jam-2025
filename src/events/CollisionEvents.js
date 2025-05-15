 export function hitZombie(bullet, zombie, scene){
    bullet.finalize();
    zombie.destroy();

    // Increase difficulty
    scene.zombieSpawnDelay = Math.max(500, scene.zombieSpawnDelay * 0.98);

    if (scene.zombieTimer) {
        scene.zombieTimer.delay = scene.zombieSpawnDelay;
    }
}

export function zombieHitsHero (hero, zombie, scene) {
    scene.physics.pause();
    hero.setTint(0xff0000);
    hero.anims.stop();
    hero.setVelocity(0);
    scene.gameOver = true;
    scene.gameOverText.setVisible(true);

    // Show cursor again when game is over
    scene.input.setDefaultCursor('default');
    
    // Stop spawning new zombies
    if (scene.zombieTimer) {
        scene.zombieTimer.remove();
    }
};
