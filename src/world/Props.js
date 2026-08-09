import Phaser from "phaser";

export default class Props {

    constructor(scene) {

        const g = scene.add.graphics();

        for (let x = 150; x < 3000; x += 300) {

            // Tree trunk
            g.fillStyle(0x6d4c41);
            g.fillRect(x, 250, 12, 30);

            // Leaves
            g.fillStyle(0x43a047);
            g.fillCircle(x + 6, 235, 22);

        }

    }

}