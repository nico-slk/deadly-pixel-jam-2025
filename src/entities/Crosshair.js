class Crosshair extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'crosshair');
        scene.add.existing(this);
        this.setDepth(1000); // Make sure it's above everything else
    }

    static preload(scene) {
        let crosshairGraphics = scene.make.graphics({ x: 0, y: 0, add: false });
        crosshairGraphics.lineStyle(2, 0xff0000, 1);
        crosshairGraphics.strokeCircle(16, 16, 10);
        crosshairGraphics.lineBetween(16, 6, 16, 1);  // Top line
        crosshairGraphics.lineBetween(16, 26, 16, 31); // Bottom line
        crosshairGraphics.lineBetween(6, 16, 1, 16);   // Left line
        crosshairGraphics.lineBetween(26, 16, 31, 16); // Right line
        crosshairGraphics.generateTexture('crosshair', 32, 32);
        crosshairGraphics.destroy();
    }

    update(time, x, y) {
        this.setPosition(x, y);
    }
}

export default Crosshair;