const config = {
  type: Phaser.WEBGL,
  width: 1024,
  height: 800,
  parent: "game-container",
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: {},
};

export default config;
