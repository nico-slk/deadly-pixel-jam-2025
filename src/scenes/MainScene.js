import Bullet from "../entities/Bullet.js";
import Hero from "../entities/Hero.js";
import Zombie from "../entities/Zombie.js";
import Zombies from "../entities/Zombies.js";
import Crosshair from "../entities/Crosshair.js";
import Ground from "../entities/Ground.js";
import InputManager from "../managers/InputManager.js";
import { hitZombie, zombieHitsHero } from "../events/CollisionEvents.js";
import { createHeroAnimation } from "../animations/hero.js";
import { createZombieAnimation } from "../animations/zombie.js";

// --- Global Variables ---
let hero;
let ground;
let zombies;
let crosshair;
let inputManager;
let collisionsDict = {};

const ZOMBIE_SPAWN_DELAY_INITIAL = 2000;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.gameOver = false;
    this.gameOverText = null;
    this.zombieSpawnDelay = ZOMBIE_SPAWN_DELAY_INITIAL;
    this.zombieTimer = {};
  }

  preload() {
    Hero.preload(this);
    Zombie.preload(this);
    Crosshair.preload(this);
    Bullet.preload(this);
    Ground.preload(this);
  }

  create() {
    this.cameras.main.setBackgroundColor("#808080");

    // Ground
    const groundY = Math.floor(this.game.config.height * 0.6);
    ground = this.physics.add.staticImage(
      this.game.config.width / 2,
      groundY,
      "ground"
    );
    ground.setDisplaySize(this.game.config.width, 50);
    ground.body.setSize(this.game.config.width, 50);
    ground.body.updateFromGameObject();
    this.ground = ground;

    // Hero
    this.hero = new Hero(this, this.game.config.width / 2, groundY - 70);
    createHeroAnimation(this);

    // Zombies
    this.zombies = new Zombies(this);
    this.zombies.setGround(this.ground);
    createZombieAnimation(this);

    // Collisions
    // collisionsDict["heroWithGround"] = this.physics.add.collider(hero, ground);
    this.physics.add.collider(this.hero, ground);
    this.physics.add.collider(this.zombies, ground);
    this.physics.add.collider(this.hero, this.zombies, () => {
      zombieHitsHero(this.hero, this.zombies, this);
    });
    this.physics.add.overlap(
      this.hero.bullets,
      this.zombies,
      (bullet, zombie) => {
        bullet.finalize(); // Desactiva la bala
      }
    );

    // Input
    inputManager = new InputManager(this);

    // Crosshair
    crosshair = new Crosshair(this, 0, 0);

    // Hide default cursor
    this.input.setDefaultCursor("none");

    // UI - Game Over Text (initially invisible)
    this.gameOverText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "GAME OVER",
      {
        fontSize: "64px",
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fill: "#ff0000",
      }
    );
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setVisible(false);

    // Start spawning zombies
    this.zombieSpawnDelay = 2000;
    this.startSpawningZombies();
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    // crosshair
    crosshair.update(time, delta, inputManager.pointer);

    // Hero
    this.hero.update(time, delta, inputManager);

    // Zombies
    this.zombies.children.iterate(function (zombie) {
      zombie.update(time, this.hero);
    }, this);
  }

  // --- Helper Functions ---
  // startSpawningZombies(scene) {
  //   this.zombieTimer = scene.time.addEvent({
  //     delay: this.zombieSpawnDelay,
  //     callback: this.spawnZombie,
  //     callbackScope: this,
  //     loop: true,
  //   });
  // }
  startSpawningZombies() {
    this.zombieTimer = this.time.addEvent({
      delay: this.zombieSpawnDelay,
      loop: true,
      callback: () => {
        this.zombies.spawn();
      },
    });
  }

  spawnZombie() {
    // Randomly choose left or right edge for spawn location
    const spawnX =
      Phaser.Math.Between(0, 1) === 0 ? -30 : this.scale.width + 30;
    const spawnY = Math.floor(this.scale.height * 0.5) - 64; // Just above ground level

    const zombie = zombies.create(spawnX, spawnY, "zombie-walk");

    // Set initial velocity towards hero
    if (spawnX < hero.x) {
      zombie.setVelocityX(100);
    } else {
      zombie.setVelocityX(-100);
    }
  }
}

export default MainScene;
