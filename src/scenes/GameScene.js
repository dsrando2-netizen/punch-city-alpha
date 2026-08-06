import Phaser from "phaser";
import PunchDog from "../objects/PunchDog.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    create() {

        // Dark background
        this.cameras.main.setBackgroundColor("#2b2b2b");

const g = this.add.graphics();

g.lineStyle(2, 0x555555);

for (let x = 0; x <= 3000; x += 100) {
    g.lineBetween(x, 0, x, 2000);
}

for (let y = 0; y <= 2000; y += 100) {
    g.lineBetween(0, y, 3000, y);
}

this.physics.world.setBounds(0, 0, 3000, 2000);
this.cameras.main.setBounds(0, 0, 3000, 2000);

        // Create PunchDog
        this.player = new PunchDog(this, 640, 360);

        // Camera follows player
        this.cameras.main.startFollow(this.player.sprite);

    }

    update() {

        this.player.update();

    }

}