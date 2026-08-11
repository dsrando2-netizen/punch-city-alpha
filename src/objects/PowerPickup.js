export default class PowerPickup {

    constructor(
        scene,
        x,
        y,
        player,
        duration = 8000
    ) {

        this.scene = scene;
        this.player = player;
        this.duration = duration;

        this.collected = false;

        // ==========================================
        // GLOW RING
        // ==========================================

        this.glow =
            scene.add.ellipse(
                x,
                y + 17,
                76,
                26,
                0xffcc22,
                0.22
            );

        this.glow.setDepth(498);

        scene.tweens.add({
            targets: this.glow,
            scaleX: 1.22,
            scaleY: 1.22,
            alpha: 0.07,
            duration: 380,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut"
        });

        // ==========================================
        // SPRITE
        // ==========================================

        this.sprite =
            scene.physics.add.image(
                x,
                y,
                "power_pickup"
            );

        this.sprite.setDepth(500);

        this.sprite.body.setAllowGravity(false);
        this.sprite.body.setImmovable(true);

        this.sprite.setDisplaySize(
            68,
            68
        );

        this.targetScaleX =
            this.sprite.scaleX;

        this.targetScaleY =
            this.sprite.scaleY;

        // ==========================================
        // SPAWN POP
        // ==========================================

        this.sprite.setScale(
            this.targetScaleX * 0.2,
            this.targetScaleY * 0.2
        );

        scene.tweens.add({
            targets: this.sprite,
            scaleX: this.targetScaleX,
            scaleY: this.targetScaleY,
            duration: 180,
            ease: "Back.Out"
        });

        // ==========================================
        // FLOAT
        // ==========================================

        scene.tweens.add({
            targets: this.sprite,
            y: y - 12,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
            onUpdate: () => {
                if (
                    this.glow &&
                    this.glow.active
                ) {
                    this.glow.x =
                        this.sprite.x;
                }
            }
        });

        // ==========================================
        // ROTATE
        // ==========================================

        scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 2200,
            repeat: -1,
            ease: "Linear"
        });

        // ==========================================
        // PULSE
        // ==========================================

        scene.tweens.add({
            targets: this.sprite,
            alpha: 0.82,
            duration: 350,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut"
        });

        // ==========================================
        // OVERLAP
        // ==========================================

        this.overlap =
            scene.physics.add.overlap(
                this.sprite,
                player.sprite,
                () => this.collect()
            );

        // ==========================================
        // EXPIRE
        // ==========================================

        this.expireTimer =
            scene.time.delayedCall(
                15000,
                () => this.expire()
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

        this.collected = true;

        this.applyPowerBoost();

        const text =
            this.scene.add.text(
                this.sprite.x,
                this.sprite.y - 25,
                "POWER UP!",
                {
                    fontFamily: "Arial Black",
                    fontSize: "22px",
                    color: "#ffd633",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

        text
            .setOrigin(0.5)
            .setDepth(1000);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 45,
            alpha: 0,
            duration: 850,
            ease: "Cubic.Out",
            onComplete: () => {
                text.destroy();
            }
        });

        // ==========================================
        // COLLECTION POP
        // ==========================================

        this.scene.tweens.killTweensOf(
            this.sprite
        );

        if (
            this.glow &&
            this.glow.active
        ) {

            this.scene.tweens.killTweensOf(
                this.glow
            );

            this.scene.tweens.add({
                targets: this.glow,
                scaleX: 1.8,
                scaleY: 1.8,
                alpha: 0,
                duration: 180,
                ease: "Cubic.Out"
            });
        }

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX:
                this.targetScaleX * 1.35,
            scaleY:
                this.targetScaleY * 1.35,
            alpha: 0,
            duration: 160,
            ease: "Back.In",
            onComplete: () => {
                this.destroy();
            }
        });
    }


    // ==============================================
    // POWER BOOST
    // ==============================================

    applyPowerBoost() {

        const player =
            this.player;

        if (
            typeof player.damageMultiplier !==
            "number"
        ) {

            player.damageMultiplier = 1;
        }

        // Refresh duration instead of stacking.
        if (player.powerBoostTimer) {

            player.powerBoostTimer.remove(false);
            player.powerBoostTimer = null;
        }

        player.damageMultiplier = 2;
        player.isPoweredUp = true;

        console.log(
            "PunchDog POWER BOOST active!"
        );

        player.sprite.setTint(
            0xffcc33
        );

        player.powerBoostTimer =
            this.scene.time.delayedCall(
                this.duration,
                () => {

                    player.damageMultiplier = 1;
                    player.isPoweredUp = false;
                    player.powerBoostTimer = null;

                    if (!player.isDead) {

                        player.sprite.clearTint();
                    }

                    console.log(
                        "PunchDog POWER BOOST ended."
                    );

                    if (player.isDead) {
                        return;
                    }

                    const expiredText =
                        this.scene.add.text(
                            player.sprite.x,
                            player.sprite.y - 70,
                            "POWER ENDED",
                            {
                                fontFamily: "Arial Black",
                                fontSize: "16px",
                                color: "#ffffff",
                                stroke: "#000000",
                                strokeThickness: 4
                            }
                        );

                    expiredText
                        .setOrigin(0.5)
                        .setDepth(1000);

                    this.scene.tweens.add({
                        targets: expiredText,
                        y: expiredText.y - 25,
                        alpha: 0,
                        duration: 600,
                        onComplete: () => {
                            expiredText.destroy();
                        }
                    });
                }
            );
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

        if (
            this.glow &&
            this.glow.active
        ) {

            this.scene.tweens.killTweensOf(
                this.glow
            );

            this.scene.tweens.add({
                targets: this.glow,
                alpha: 0,
                duration: 300
            });
        }

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }


    // ==============================================
    // DESTROY
    // ==============================================

    destroy() {

        if (this.expireTimer) {

            this.expireTimer.remove(false);
            this.expireTimer = null;
        }

        if (this.overlap) {

            this.overlap.destroy();
            this.overlap = null;
        }

        if (
            this.glow &&
            this.glow.active
        ) {

            this.glow.destroy();
        }

        if (
            this.sprite &&
            this.sprite.active
        ) {

            this.sprite.destroy();
        }
    }
}
