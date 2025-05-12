import config from './src/config.js';
import MainScene from './src/scenes/MainScene.js';

config.scene = [MainScene];

const game = new Phaser.Game(config);