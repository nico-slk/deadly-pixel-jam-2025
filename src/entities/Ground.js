class Ground extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
    }

    static preload(scene) {
        let groundGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
        groundGraphics.fillStyle(0x3d2d1b, 1); // Brown
        groundGraphics.fillRect(0, 0, 800, 50); // Ground size
        groundGraphics.generateTexture('ground', 800, 50);
        groundGraphics.destroy();
    }
}

export default Ground;