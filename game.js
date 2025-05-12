// --- Game Configuration ---
const config = {
    type: Phaser.AUTO,
    width: 1024, // Wider screen
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// --- Global Variables ---
let hero;
let ground;
let zombies;
let bullets;
let cursors;
let keyA;
let keyD;
let crosshair;
let pointer;

let score = 0;
let scoreText;
let gameOverText;
let gameOver = false;
let heroFacing = 'right';
let lastShotTime = 0;
const shotDelay = 100; // Reduced delay for faster shooting

const ZOMBIE_SPEED = 100;
const ZOMBIE_SPAWN_DELAY_INITIAL = 2000;
let zombieSpawnDelay = ZOMBIE_SPAWN_DELAY_INITIAL;
let zombieTimer;

const BULLET_SPEED = 800;

const game = new Phaser.Game(config);

function preload() {
    // Create dynamic textures for our simple shapes

    // Hero (Blue Rectangle)
    let heroGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    heroGraphics.fillStyle(0x0000ff, 1); // Blue
    heroGraphics.fillRect(0, 0, 32, 64); // Hero size
    heroGraphics.generateTexture('hero', 32, 64);
    heroGraphics.destroy();

    // Zombie (Dark Green Rectangle)
    let zombieGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    zombieGraphics.fillStyle(0x006400, 1); // Dark Green
    zombieGraphics.fillRect(0, 0, 32, 64); // Zombie size
    zombieGraphics.generateTexture('zombie', 32, 64);
    zombieGraphics.destroy();

    // Ground (Very Dark Brown Rectangle)
    let groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    groundGraphics.fillStyle(0x3d2d1b, 1); // Very Dark Brown
    groundGraphics.fillRect(0, 0, 1024, 50); // Ground size (wider)
    groundGraphics.generateTexture('ground', 1024, 50);
    groundGraphics.destroy();

    // Bullet (White Square)
    let bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bulletGraphics.fillStyle(0xffffff, 1); // White
    bulletGraphics.fillRect(0, 0, 8, 8); // Bullet size
    bulletGraphics.generateTexture('bullet', 8, 8);
    bulletGraphics.destroy();

    // Crosshair
    let crosshairGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    crosshairGraphics.lineStyle(2, 0xff0000, 1);
    crosshairGraphics.strokeCircle(16, 16, 10);
    crosshairGraphics.lineBetween(16, 6, 16, 1);  // Top line
    crosshairGraphics.lineBetween(16, 26, 16, 31); // Bottom line
    crosshairGraphics.lineBetween(6, 16, 1, 16);   // Left line
    crosshairGraphics.lineBetween(26, 16, 31, 16); // Right line
    crosshairGraphics.generateTexture('crosshair', 32, 32);
    crosshairGraphics.destroy();
}

function create() {
    this.cameras.main.setBackgroundColor('#808080');

    // Ground
    const groundY = Math.floor(config.height * 0.6);
    ground = this.physics.add.staticImage(config.width / 2, groundY, 'ground');
    
    ground.setDisplaySize(config.width, 50);
    
    ground.body.setSize(config.width, 50);
    ground.body.updateFromGameObject();

    // Hero
    hero = this.physics.add.sprite(config.width / 2, groundY - 70, 'hero');
    hero.setCollideWorldBounds(true);
    hero.body.setGravityY(300);

    // Zombies
    zombies = this.physics.add.group();

    // Bullets
    bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true,
        maxSize: 30
    });

    // Collisions
    this.physics.add.collider(hero, ground);
    this.physics.add.collider(zombies, ground);
    this.physics.add.collider(hero, zombies, zombieHitsHero, null, this);
    this.physics.add.overlap(bullets, zombies, hitZombie, null, this);

    // Input
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    pointer = this.input.activePointer;
    
    // Crosshair
    crosshair = this.add.image(0, 0, 'crosshair');
    crosshair.setDepth(1000); // Make sure it's above everything else

    // Hide default cursor
    this.input.setDefaultCursor('none');
    
    // Shooting (mouse click)
    this.input.on('pointerdown', function(pointer) {
        if (!gameOver) {
            shootBullet(pointer.x, pointer.y);
        }
    }, this);

    // UI - Score Text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fill: '#FFF'
    });

    // UI - Game Over Text (initially invisible)
    gameOverText = this.add.text(config.width / 2, config.height / 2, 'GAME OVER', {
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
        ground.setPosition(gameSize.width / 2, Math.floor(gameSize.height * 0.6));
        ground.setDisplaySize(gameSize.width, 50);
        ground.body.setSize(gameSize.width, 50);
        ground.body.updateFromGameObject();
        
        // Update game over text position
        gameOverText.setPosition(gameSize.width / 2, gameSize.height / 2);
    }, this);

    // Start spawning zombies
    startSpawningZombies(this);
}

function update(time) {
    if (gameOver) {
        return;
    }

    // Update crosshair
    crosshair.setPosition(pointer.x, pointer.y);

    // Hero Movement
    if (cursors.left.isDown || keyA.isDown) {
        hero.setVelocityX(-250);
        heroFacing = 'left';
    } else if (cursors.right.isDown || keyD.isDown) {
        hero.setVelocityX(250);
        heroFacing = 'right';
    } else {
        hero.setVelocityX(0);
    }

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
        if (zombie.y > config.height + 100) {
             zombie.destroy();
        }
    });
}

// --- Helper Functions ---
function startSpawningZombies(scene) {
    zombieTimer = scene.time.addEvent({
        delay: zombieSpawnDelay,
        callback: spawnZombie,
        callbackScope: scene,
        loop: true
    });
}

function spawnZombie() {
    const gameWidth = this.scale.width;
    
    // Randomly choose left or right edge for spawn location
    const spawnX = Phaser.Math.Between(0, 1) === 0 ? -30 : gameWidth + 30;
    const spawnY = Math.floor(this.scale.height * 0.6) - 64; // Just above ground level

    const zombie = zombies.create(spawnX, spawnY, 'zombie');
    zombie.setCollideWorldBounds(false);
    zombie.body.setGravityY(300);
    zombie.setBounce(0.1);

    // Set initial velocity towards hero
    if (spawnX < hero.x) {
        zombie.setVelocityX(ZOMBIE_SPEED);
    } else {
        zombie.setVelocityX(-ZOMBIE_SPEED);
    }
}

function shootBullet(targetX, targetY) {
    const bullet = bullets.get(hero.x, hero.y - 20);

    if (bullet) {
        // Calculate angle to target
        const angle = Phaser.Math.Angle.Between(hero.x, hero.y - 20, targetX, targetY);
        
        bullet.fire(hero.x, hero.y - 20, angle);
        
        heroFacing = targetX < hero.x ? 'left' : 'right';
    }
}

function hitZombie(bullet, zombie) {
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

function zombieHitsHero(hero, zombie) {
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

// --- Custom Bullet Class ---
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    fire(x, y, angle) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.allowGravity = false;

        // Calculate velocity based on angle
        const speed = BULLET_SPEED;
        this.body.velocity.x = Math.cos(angle) * speed;d
        this.body.velocity.y = Math.sin(angle) * speed;
    }

    update(time, delta) {
        // Get current game dimensions
        const gameWidth = this.scene.scale.width;
        const gameHeight = this.scene.scale.height;
        
        // Deactivate bullet if it goes off screen
        if (this.x < -50 || this.x > gameWidth + 50 || 
            this.y < -50 || this.y > gameHeight + 50) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}