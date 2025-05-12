import Bullet from '../entities/Bullet.js';
import Hero from '../entities/Hero.js';
import Zombie from '../entities/Zombie.js';
import Crosshair from '../entities/Crosshair.js';

// --- Global Variables ---
let hero;
let ground;
let zombies;

let cursors;
let keyA;
let keyD;
let crosshair;
let pointer;

let score = 0;
let scoreText;
let gameOverText;
let gameOver = false;
let lastShotTime = 0;
const shotDelay = 100; // Reduced delay for faster shooting

const ZOMBIE_SPEED = 100;
const ZOMBIE_SPAWN_DELAY_INITIAL = 2000;
let zombieSpawnDelay = ZOMBIE_SPAWN_DELAY_INITIAL;
let zombieTimer;

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        Hero.preload(this);
        Zombie.preload(this);
        Crosshair.preload(this);
        Bullet.preload(this);

        // Ground (Very Dark Brown Rectangle)
        let groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0x3d2d1b, 1); // Very Dark Brown
        groundGraphics.fillRect(0, 0, 1024, 300); // Ground size (wider)
        groundGraphics.generateTexture('ground', 1024, 300);
        groundGraphics.destroy();
    }

    create() {
        this.cameras.main.setBackgroundColor('#808080');

        // Ground
        const groundY = Math.floor(this.game.config.height * 0.6);
        ground = this.physics.add.staticImage(this.game.config.width / 2, groundY, 'ground');
        
        ground.setDisplaySize(this.game.config.width, 50);
        
        ground.body.setSize(this.game.config.width, 50);
        ground.body.updateFromGameObject();

        // Hero
        hero = new Hero(this, this.game.config.width / 2, groundY - 70);
        hero.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            maxSize: 30
        });

        // Zombies
        zombies = this.physics.add.group();

        // Collisions
        this.physics.add.collider(hero, ground);
        this.physics.add.collider(zombies, ground);
        this.physics.add.collider(hero, zombies, this.zombieHitsHero, null, this);
        this.physics.add.overlap(hero.bullets, zombies, this.hitZombie, null, this);

        // Input
        cursors = this.input.keyboard.createCursorKeys();
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        pointer = this.input.activePointer;
        
        // Crosshair
        crosshair = new Crosshair(this, 0, 0);

        // Hide default cursor
        this.input.setDefaultCursor('none');
        
        // Shooting (mouse click)
        this.input.on('pointerdown', function(pointer) {
            if (!gameOver) {
                hero.handleMouseClick(pointer);
            }
        }, this);

        // UI - Score Text
        scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fontFamily: '"Arial Black", Gadget, sans-serif',
            fill: '#FFF'
        });

        // UI - Game Over Text (initially invisible)
        gameOverText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'GAME OVER', {
            fontSize: '64px',
            fontFamily: '"Arial Black", Gadget, sans-serif',
            fill: '#ff0000'
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setVisible(false);

        // Handle window resizing
        this.scale.on('resize', function (gameSize) {
            // Update game boundaries
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
            
            // Update ground position and scale
            ground.setPosition(gameSize.width / 2, Math.floor(gameSize.height * 0.8));
            ground.setDisplaySize(gameSize.width, 400);
            ground.body.setSize(gameSize.width, 400);
            ground.body.updateFromGameObject();
            
            // Update game over text position
            gameOverText.setPosition(gameSize.width / 2, gameSize.height / 2);
        }, this);

        // Start spawning zombies
        this.startSpawningZombies(this);
    }

    update(time) {
        if (gameOver) {
            return;
        }

        // Update crosshair
        crosshair.update(pointer.x, pointer.y);

        // Hero Movement
        hero.update(cursors, keyA, keyD);

        // Zombie Movement
        zombies.children.iterate(function (zombie) {
            if (zombie.x < hero.x) {
                // Zombie is on the left of hero, move right
                zombie.setVelocityX(ZOMBIE_SPEED);
            } else if (zombie.x > hero.x) {
                // Zombie is on the right of hero, move left
                zombie.setVelocityX(-ZOMBIE_SPEED);
            } else {
                // Zombie is exactly at hero's x position
                zombie.setVelocityX(0);
            }

            // Destroy zombies if they go way off screen
            if (zombie.y > this.game.config.height + 100) {
                 zombie.destroy();
            }
        }, this);
    }

    // --- Helper Functions ---
    startSpawningZombies(scene) {
        zombieTimer = scene.time.addEvent({
            delay: zombieSpawnDelay,
            callback: this.spawnZombie,
            callbackScope: this,
            loop: true
        });
    }

    spawnZombie() {
        const gameWidth = this.scale.width;
        
        // Randomly choose left or right edge for spawn location
        const spawnX = Phaser.Math.Between(0, 1) === 0 ? -30 : gameWidth + 30;
        const spawnY = Math.floor(this.scale.height * 0.6) - 64; // Just above ground level

        const zombie = zombies.create(spawnX, spawnY, 'zombie');

        // Set initial velocity towards hero
        if (spawnX < hero.x) {
            zombie.setVelocityX(ZOMBIE_SPEED);
        } else {
            zombie.setVelocityX(-ZOMBIE_SPEED);
        }
    }

    hitZombie(bullet, zombie) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        zombie.destroy();

        score += 10;
        scoreText.setText('Score: ' + score);

        // Increase difficulty
        zombieSpawnDelay = Math.max(500, zombieSpawnDelay * 0.98);
        if (zombieTimer) {
            zombieTimer.delay = zombieSpawnDelay;
        }
    }

    zombieHitsHero(hero, zombie) {
        this.physics.pause();
        hero.setTint(0xff0000);
        gameOver = true;
        gameOverText.setVisible(true);

        // Show cursor again when game is over
        this.input.setDefaultCursor('default');
        
        // Stop spawning new zombies
        if (zombieTimer) {
            zombieTimer.remove();
        }
    }
}

export default MainScene;