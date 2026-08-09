import Phaser from "phaser";
import AISystem from "../systems/AISystem.js";

export default class Bear {

    constructor(scene, x, y) {

        this.scene = scene;

        this.sprite = scene.add.rectangle(
            x,
            y,
            50,
            70,
            0x7b5235
        );

        scene.physics.add.existing(this.sprite);

        this.body = this.sprite.body;

        this.body.setCollideWorldBounds(true);

        this.speed = 120;

        this.detectionRadius = 300;

    }

    update(player) {

        const distance = Phaser.Math.Distance.Between(

            this.sprite.x,
            this.sprite.y,

            player.sprite.x,
            player.sprite.y

        );

        if (distance < this.detectionRadius) {

            AISystem.chase(
                this,
                player,
                this.speed
            );

        }
        else {

            AISystem.stop(this);

        }

    }

}