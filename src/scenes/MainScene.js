import Bullet from "../entities/Bullet.js";
import Hero from "../entities/Hero.js";
import Zombie from "../entities/Zombie.js";
import Crosshair from "../entities/Crosshair.js";
import Ground from "../entities/Ground.js";
import InputManager from "../managers/InputManager.js";
import { hitZombie, zombieHitsHero } from "../events/CollisionEvents.js";
import { createHeroAnimation } from "../animations/hero.js";

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

    // Hero
    hero = new Hero(this, this.game.config.width / 2, groundY - 70);

    // AGREGADO POR NICO PARA PROBAR ANIMACIONES

    createHeroAnimation(this);

    // AGREGADO POR NICO PARA PROBAR ANIMACIONES

    // Zombies
    zombies = this.physics.add.group();

    // Collisions
    collisionsDict["heroWithGround"] = this.physics.add.collider(hero, ground);
    collisionsDict["zombieWithGround"] = this.physics.add.collider(
      zombies,
      ground
    );
    collisionsDict["heroWithZombies"] = this.physics.add.collider(
      hero,
      zombies,
      () => zombieHitsHero(hero, zombies, this),
      null,
      this
    );
    collisionsDict["bulletWithZombies"] = this.physics.add.overlap(
      hero.bullets,
      zombies,
      (bullet, zombie) => hitZombie(bullet, zombie, this),
      null,
      this
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
    this.startSpawningZombies(this);
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    // crosshair
    crosshair.update(time, delta, inputManager.pointer);

    // Hero
    hero.update(time, delta, inputManager);

    // Zombies
    zombies.children.iterate(function (zombie) {
      zombie.update(time, hero);
    }, this);
  }

  // --- Helper Functions ---
  startSpawningZombies(scene) {
    this.zombieTimer = scene.time.addEvent({
      delay: this.zombieSpawnDelay,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true,
    });
  }

  spawnZombie() {
    const gameWidth = this.scale.width;

    // Randomly choose left or right edge for spawn location
    const spawnX = Phaser.Math.Between(0, 1) === 0 ? -30 : gameWidth + 30;
    const spawnY = Math.floor(this.scale.height * 0.5) - 64; // Just above ground level

    const zombie = zombies.create(spawnX, spawnY, "zombie");

    // Set initial velocity towards hero
    if (spawnX < hero.x) {
      zombie.setVelocityX(100);
    } else {
      zombie.setVelocityX(-100);
    }
  }
}

export default MainScene;