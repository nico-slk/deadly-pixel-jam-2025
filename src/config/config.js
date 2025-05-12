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
    scene: { }
};

export default config;