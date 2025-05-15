import Zombie from "./Zombie.js";

class Zombies extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        this.createMultiple({
            frameQuantity: 10,
            key: 'zombie-walk',
            active: false,
            visible: false,
            classType: Zombie,
            runChildUpdate: true
        });
    }
}

export default Zombies;