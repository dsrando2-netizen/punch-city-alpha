import Phaser from "phaser";
import Bear from "../objects/Bear.js";
import PunchDog from "../objects/PunchDog.js";

import Road from "../world/Road.js";
import Sidewalk from "../world/Sidewalk.js";
import Buildings from "../world/Buildings.js";
import Props from "../world/Props.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    create() {

        // Background
        this.cameras.main.setBackgroundColor("#87ceeb");

        // World size
        this.physics.world.setBounds(0, 0, 3000, 2000);
        this.cameras.main.setBounds(0, 0, 3000, 2000);

        // Build the city
        new Buildings(this);
        new Sidewalk(this);
        new Road(this);
        new Props(this);

        // Create PunchDog
        this.player = new PunchDog(this, 400, 600);
        this.bear = new Bear(
    this,
    900,
    600
);

        // Camera
        this.cameras.main.startFollow(
            this.player.sprite,
            true,
            0.08,
            0.08
        );

    }

update() {

    this.player.update();

    this.bear.update(this.player);

}

}