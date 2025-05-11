console.log("Game started");

const config = {
  type: Phaser.WEBGL,
  width: 256,
  height: 240,
  backgroundColor: 0x009bd9,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  console.log("Preloading assets");
}

function create() {
  console.log("Creating game scene");
}

function update() {
  console.log("Updating game scene");
}
