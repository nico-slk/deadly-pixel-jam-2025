import Bullet from "../entities/Bullet.js";
import Hero from "../entities/Hero.js";
import Zombie from "../entities/Zombie.js";
import ZombiesManager from "../managers/ZombiesManager.js";
import Crosshair from "../entities/Crosshair.js";
import Ground from "../entities/Ground.js";
import InputManager from "../managers/InputManager.js";
import { createHeroAnimation } from "../animations/heroAnims.js";
import { createZombieAnimation } from "../animations/zombieAnims.js";

// GLOBAL VARIABLES
// let hero;
// let crosshair;
let inputManager;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.gameOver = false;
    this.gameOverText = null;
    this.ground = {};
    this.zombiesManager = {};
    this.parallaxObjects = [];
  }

  preload() {
    Hero.preload(this);
    Zombie.preload(this);
    Crosshair.preload(this);
    Bullet.preload(this);
    Ground.preload(this);

    this.load.image("bush", "assets/ImagenesPruebas/bush1.png");
    this.load.image("cloud1", "assets/ImagenesPruebas/cloud1.png");
    this.load.image("cloud2", "assets/ImagenesPruebas/cloud2.png");
  }

  create() {
    // this.cameras.main.setBackgroundColor("#808080");
    this.cameras.main.setBackgroundColor("#87CEEB");

    const cloud2 = this.add.sprite(100, 150, "cloud2");
    cloud2.setScale(0.5);
    cloud2.baseX = 100;
    cloud2.parallaxFactor = 0.3;
    this.parallaxObjects.push(cloud2);

    const cloud1 = this.add.sprite(300, 100, "cloud1");
    cloud1.setScale(0.5);
    cloud1.baseX = 300;
    cloud1.parallaxFactor = 0.5;
    this.parallaxObjects.push(cloud1);

    const bush = this.add.sprite(300, 440, "bush");
    bush.baseX = 300;
    bush.parallaxFactor = 0.8;
    this.parallaxObjects.push(bush);

    createHeroAnimation(this);
    createZombieAnimation(this);

    this.createGround();

    this.hero = new Hero(
      this,
      this.game.config.width / 2,
      this.game.config.height * 0.5
    );

    this.zombiesManager = new ZombiesManager(this);

    this.configureGroundCollisions();

    inputManager = new InputManager(this);

    this.crosshair = new Crosshair(this, 0, 0);

    this.input.setDefaultCursor("none");

    this.setGameOverScreen();

    this.zombiesManager.startSpawningZombies(this);

    this.physics.world.setBounds(0, 0, 1500, this.game.config.height);
    this.cameras.main.setBounds(0, 0, 1500, this.game.config.width);
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    const scrollX = this.cameras.main.scrollX;

    this.parallaxObjects.forEach((obj) => {
      obj.x = obj.baseX + scrollX * obj.parallaxFactor;
    });

    this.crosshair.update(time, delta, inputManager);

    this.hero.update(time, delta, inputManager);

    this.zombiesManager.update(time, delta, this.hero);
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

  configureGroundCollisions() {
    this.physics.add.collider(this.hero, this.ground);
    this.physics.add.collider(this.zombiesManager.zombies, this.ground);
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
}

export default MainScene;
