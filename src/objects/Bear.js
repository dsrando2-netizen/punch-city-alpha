import Phaser from "phaser";
import AISystem from "../systems/AISystem.js";

export default class Bear {

    constructor(scene, x, y) {

        this.scene = scene;

        this.sprite =
            scene.physics.add.image(
                x,
                y,
                "bruiser_bear"
            );

        this.sprite.setDisplaySize(
            190,
            190
        );

        this.body =
            this.sprite.body;

        this.body.setSize(
            85,
            95
        );

        this.body.setOffset(
            52,
            85
        );

        this.body.setCollideWorldBounds(
            true
        );

        // -------------------------
        // Movement
        // -------------------------

        this.speed = 120;

        this.detectionRadius = 300;

        // -------------------------
        // Combat
        // -------------------------

        this.maxHealth = 3;

        this.health =
            this.maxHealth;

        this.isHit = false;

        this.hitTimer = 0;

        this.isDead = false;
    }

    update(player) {

        if (
            this.isDead
        ) {
            return;
        }

        // Always face PunchDog
        if (
            player.sprite.x <
            this.sprite.x
        ) {

            this.sprite.setFlipX(
                true
            );

        } else {

            this.sprite.setFlipX(
                false
            );
        }

        // Let knockback finish
        if (
            this.isHit
        ) {

            this.hitTimer--;

            // Gradually reduce knockback
            this.body.velocity.scale(
                0.88
            );

            if (
                this.hitTimer <= 0
            ) {

                this.isHit = false;
            }

            return;
        }

        const distance =
            Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                player.sprite.x,
                player.sprite.y
            );

        if (
            distance <
            this.detectionRadius
        ) {

            AISystem.chase(
                this,
                player,
                this.speed
            );

        } else {

            AISystem.stop(
                this
            );
        }
    }

    takeDamage(amount) {

        if (
            this.isDead ||
            this.isHit
        ) {
            return;
        }

        this.health -= amount;

        this.isHit = true;

        // Longer stun = stronger looking knockback
        this.hitTimer = 18;

        this.sprite.setTint(
            0xff4444
        );

        this.scene.time.delayedCall(
            120,
            () => {

                if (
                    !this.isDead
                ) {

                    this.sprite.clearTint();
                }
            }
        );

        console.log(
            "Bruiser Bear HP:",
            this.health
        );

        if (
            this.health <= 0
        ) {

            this.die();
        }
    }

    die() {

        this.isDead = true;

        this.body.setVelocity(
            0,
            0
        );

        this.body.enable = false;

        this.sprite.setTint(
            0x555555
        );

        this.scene.tweens.add({

            targets:
                this.sprite,

            angle: 90,

            alpha: 0.4,

            y:
                this.sprite.y + 25,

            duration: 350,

            ease:
                "Cubic.Out"

        });
    }
}