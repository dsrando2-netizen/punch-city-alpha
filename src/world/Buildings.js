import Phaser from "phaser";

export default class Buildings {

    constructor(scene) {

        const g = scene.add.graphics();

        for (let x = 0; x < 3000; x += 350) {

            g.fillStyle(0x5d6d7e);

            g.fillRect(
                x,
                40,
                220,
                240
            );

        }

    }

}