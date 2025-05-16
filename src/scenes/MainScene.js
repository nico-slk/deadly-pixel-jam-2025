import Bullet from "../entities/Bullet.js";
import Hero from "../entities/Hero.js";
import Zombie from "../entities/Zombie.js";
import Zombies from "../entities/Zombies.js";
import Crosshair from "../entities/Crosshair.js";
import Ground from "../entities/Ground.js";
import InputManager from "../managers/InputManager.js";
import { hitZombie, zombieHitsHero } from "../events/CollisionEvents.js";
import { createHeroAnimation } from "../animations/heroAnims.js";
import { createZombieAnimation } from "../animations/zombieAnims.js";

// GLOBAL VARIABLES
let hero;
let crosshair;
let inputManager;

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

    createHeroAnimation(this);
    createZombieAnimation(this);

    this.createGround();

    hero = new Hero(this, this.game.config.width / 2, this.game.config.height * 0.5);
    
    this.zombies = new Zombies(this);
    
    this.configureCollisions();

    inputManager = new InputManager(this);

    crosshair = new Crosshair(this, 0, 0);

    this.input.setDefaultCursor("none");

    this.setGameOverScreen();

    this.startSpawningZombies();
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    crosshair.update(time, delta, inputManager.pointer);

    hero.update(time, delta, inputManager);

    this.zombies.children.iterate(function (zombie) {
      zombie.update(time, hero);
    }, this);
  }

  // PRIVATE MEMBERS
  createGround() {
    const groundY = Math.floor(this.game.config.height * 0.6);
    this.ground = this.physics.add.staticImage(
      this.game.config.width / 2,
      groundY,
      "ground"
    );
    this.ground.setDisplaySize(this.game.config.width * 2, 50);
    this.ground.body.setSize(this.game.config.width * 2, 50);
    this.ground.body.updateFromGameObject();
  }

  configureCollisions() {
    this.physics.add.collider(hero, this.ground);
    this.physics.add.collider(this.zombies, this.ground);
    this.physics.add.overlap(
      hero.bullets,
      this.zombies,
      (bullet, zombie) => hitZombie(bullet, zombie, this)
    );
  }

  setGameOverScreen() {
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
  }

  startSpawningZombies() {
    this.zombieTimer = this.time.addEvent({
      delay: this.zombieSpawnDelay,
      loop: true,
      callback: () => {
        this.zombies.spawn(hero, this.ground);
      },
    });
  }
}

export default MainScene;