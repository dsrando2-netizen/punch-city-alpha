import Phaser from "phaser";

export default class Sidewalk {

    constructor(scene) {

        const g = scene.add.graphics();

        // Sidewalk
        g.fillStyle(0xbdbdbd);
        g.fillRect(0, 300, 3000, 200);

        // Curb
        g.fillStyle(0x8a8a8a);
        g.fillRect(0, 495, 3000, 5);

    }

}