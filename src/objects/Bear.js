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

        // Movement
        this.speed = 120;
        this.detectionRadius = 300;

        // Combat
        this.health = 3;
        this.isHit = false;
        this.hitTimer = 0;

    }

    update(player) {

        // Pause AI briefly after getting hit
        if (this.isHit) {

            this.hitTimer--;

            if (this.hitTimer <= 0) {
                this.isHit = false;
            }

            return;
        }

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

        } else {

            AISystem.stop(this);

        }

    }

    takeDamage(amount) {

        if (this.isHit) {
            return;
        }

        this.health -= amount;

        this.isHit = true;
        this.hitTimer = 12;

        // Flash red
        this.sprite.setFillStyle(0xff0000);

        this.scene.time.delayedCall(120, () => {

            if (this.health > 0) {
                this.sprite.setFillStyle(0x7b5235);
            }

        });

        console.log("Bear HP:", this.health);

        if (this.health <= 0) {
            this.die();
        }

    }

    die() {

        console.log("Bear defeated!");

        this.body.setVelocity(0);

        this.sprite.setFillStyle(0x444444);

        this.body.enable = false;

    }

}