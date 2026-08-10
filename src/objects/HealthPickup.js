import Phaser from "phaser";

export default class HealthPickup {

    constructor(
        scene,
        x,
        y,
        player,
        healAmount = 1
    ) {

        this.scene = scene;
        this.player = player;
        this.healAmount = healAmount;

        this.collected = false;

        // ==========================================
        // CREATE HEART TEXTURE ONCE
        // ==========================================

        if (
            !scene.textures.exists(
                "health-pickup-heart"
            )
        ) {

            const graphics =
                scene.make.graphics({
                    x: 0,
                    y: 0,
                    add: false
                });

            graphics.fillStyle(
                0xff3344,
                1
            );

            graphics.fillCircle(
                16,
                14,
                10
            );

            graphics.fillCircle(
                32,
                14,
                10
            );

            graphics.fillTriangle(
                7,
                16,
                41,
                16,
                24,
                42
            );

            graphics.generateTexture(
                "health-pickup-heart",
                48,
                48
            );

            graphics.destroy();
        }

        // ==========================================
        // PHYSICS SPRITE
        // ==========================================

        this.sprite =
            scene.physics.add.image(
                x,
                y,
                "health-pickup-heart"
            );

        this.sprite.setDisplaySize(
            38,
            38
        );

        this.sprite.setDepth(
            500
        );

        this.sprite.body.setAllowGravity(
            false
        );

        this.sprite.body.setImmovable(
            true
        );

        // ==========================================
        // SPAWN POP
        // ==========================================

        this.sprite.setScale(
            0.2
        );

        scene.tweens.add({

            targets:
                this.sprite,

            scale:
                0.8,

            duration:
                180,

            ease:
                "Back.Out"
        });

        // ==========================================
        // FLOATING / BOBBING
        // ==========================================

        scene.tweens.add({

            targets:
                this.sprite,

            y:
                y - 10,

            duration:
                550,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.InOut"
        });

        // ==========================================
        // PULSE
        // ==========================================

        scene.tweens.add({

            targets:
                this.sprite,

            alpha:
                0.65,

            duration:
                450,

            yoyo:
                true,

            repeat:
                -1,

            ease:
                "Sine.InOut"
        });

        // ==========================================
        // PLAYER OVERLAP
        // ==========================================

        this.overlap =
            scene.physics.add.overlap(

                this.sprite,

                player.sprite,

                () => {

                    this.collect();

                }
            );

        // ==========================================
        // AUTO EXPIRE
        // ==========================================

        this.expireTimer =
            scene.time.delayedCall(
                15000,
                () => {

                    this.expire();

                }
            );
    }


    // ==============================================
    // COLLECT
    // ==============================================

    collect() {

        if (
            this.collected ||
            !this.player ||
            this.player.isDead
        ) {

            return;
        }

        // Do not waste the pickup at full HP.
        if (
            this.player.health >=
            this.player.maxHealth
        ) {

            return;
        }

        this.collected = true;

        const oldHealth =
            this.player.health;

        this.player.health =
            Math.min(

                this.player.maxHealth,

                this.player.health +
                this.healAmount
            );

        const restored =
            this.player.health -
            oldHealth;

        console.log(
            `Health Pickup: +${restored} HP`
        );

        // ==========================================
        // PLAYER HEAL FLASH
        // ==========================================

        this.player.sprite.setTint(
            0x66ff88
        );

        this.scene.time.delayedCall(
            180,
            () => {

                if (
                    !this.player.isDead
                ) {

                    this.player.sprite.clearTint();
                }
            }
        );

        // ==========================================
        // FLOATING +HP TEXT
        // ==========================================

        const text =
            this.scene.add.text(

                this.sprite.x,

                this.sprite.y - 20,

                `+${restored} HP`,

                {
                    fontFamily:
                        "Arial Black",

                    fontSize:
                        "20px",

                    color:
                        "#65ff7a",

                    stroke:
                        "#000000",

                    strokeThickness:
                        5
                }
            );

        text
            .setOrigin(0.5)
            .setDepth(1000);

        this.scene.tweens.add({

            targets:
                text,

            y:
                text.y - 40,

            alpha:
                0,

            duration:
                700,

            ease:
                "Cubic.Out",

            onComplete:
                () => {

                    text.destroy();
                }
        });

        // ==========================================
        // PICKUP POP
        // ==========================================

        this.scene.tweens.killTweensOf(
            this.sprite
        );

        this.scene.tweens.add({

            targets:
                this.sprite,

            scale:
                1.4,

            alpha:
                0,

            duration:
                150,

            ease:
                "Back.In",

            onComplete:
                () => {

                    this.destroy();
                }
        });
    }


    // ==============================================
    // EXPIRE
    // ==============================================

    expire() {

        if (
            this.collected ||
            !this.sprite ||
            !this.sprite.active
        ) {

            return;
        }

        this.scene.tweens.killTweensOf(
            this.sprite
        );

        this.scene.tweens.add({

            targets:
                this.sprite,

            alpha:
                0,

            duration:
                300,

            onComplete:
                () => {

                    this.destroy();
                }
        });
    }


    // ==============================================
    // DESTROY
    // ==============================================

    destroy() {

        if (
            this.expireTimer
        ) {

            this.expireTimer.remove(
                false
            );
        }

        if (
            this.overlap
        ) {

            this.overlap.destroy();
        }

        if (
            this.sprite &&
            this.sprite.active
        ) {

            this.sprite.destroy();
        }
    }
}