import Phaser from "phaser";

export default class Road {

    constructor(scene) {

        const g = scene.add.graphics();

        // Road
        g.fillStyle(0x303030);
        g.fillRect(0, 500, 3000, 300);

        // Lane stripes
        g.fillStyle(0xffd54a);

        for (let x = 0; x < 3000; x += 120) {

            g.fillRect(
                x,
                645,
                60,
                10
            );

        }

    }

}