import Phaser from "phaser";
import AISystem from "../systems/AISystem.js";

export default class Bear {

    constructor(scene, x, y) {

        this.scene = scene;

        // ==========================================
        // SPRITE
        // ==========================================

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

        this.baseScaleX =
            this.sprite.scaleX;

        this.baseScaleY =
            this.sprite.scaleY;

        // ==========================================
        // MOVEMENT
        // ==========================================

        this.speed =
            120;

        this.backAwaySpeed =
            80;

        this.detectionRadius =
            400;

        this.attackRange =
            140;

        this.tooCloseRange =
            100;

        // ==========================================
        // HEALTH
        // ==========================================

        this.maxHealth =
            3;

        this.health =
            this.maxHealth;

        this.isHit =
            false;

        this.hitTimer =
            0;

        this.isDead =
            false;

        // ==========================================
        // ATTACK
        // ==========================================

        this.isAttacking =
            false;

        this.attackTimer =
            0;

        this.attackCooldown =
            0;

        this.attackHasHit =
            false;

        this.telegraphCircle =
            null;
    }


    // ==============================================
    // UPDATE
    // ==============================================

    update(player) {

        if (this.isDead) {
            return;
        }

        // ------------------------------------------
        // FACE PLAYER
        // ------------------------------------------

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

        // ------------------------------------------
        // HIT RECOVERY
        // ------------------------------------------

        if (this.isHit) {

            this.hitTimer--;

            this.body.velocity.scale(
                0.76
            );

            if (
                this.hitTimer <= 0
            ) {

                this.body.setVelocity(
                    0,
                    0
                );

                this.isHit =
                    false;
            }

            return;
        }

        // ------------------------------------------
        // ATTACK ACTIVE
        // ------------------------------------------

        if (this.isAttacking) {

            this.updateAttack(
                player
            );

            return;
        }

        if (
            this.attackCooldown > 0
        ) {

            this.attackCooldown--;
        }

        const dx =
            player.sprite.x -
            this.sprite.x;

        const dy =
            player.sprite.y -
            this.sprite.y;

        const distance =
            Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                player.sprite.x,
                player.sprite.y
            );

        // ------------------------------------------
        // TOO CLOSE
        // ------------------------------------------

        if (
            distance <
            this.tooCloseRange &&
            !player.isDead
        ) {

            const away =
                new Phaser.Math.Vector2(
                    -dx,
                    -dy
                );

            away.normalize();

            this.body.setVelocity(

                away.x *
                    this.backAwaySpeed,

                away.y *
                    this.backAwaySpeed
            );

            return;
        }

        // ------------------------------------------
        // ATTACK
        // ------------------------------------------

        if (
            distance <=
                this.attackRange &&
            this.attackCooldown <= 0 &&
            !player.isDead
        ) {

            this.startAttack();

            return;
        }

        // ------------------------------------------
        // CHASE
        // ------------------------------------------

        if (
            distance <
            this.detectionRadius &&
            distance >
            this.attackRange
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


    // ==============================================
    // START ATTACK
    // ==============================================

    startAttack() {

        this.isAttacking =
            true;

        // Slightly longer telegraph.
        this.attackTimer =
            38;

        this.attackHasHit =
            false;

        this.body.setVelocity(
            0,
            0
        );

        // ------------------------------------------
        // TELEGRAPH RING
        // ------------------------------------------

        this.telegraphCircle =
            this.scene.add.circle(
                this.sprite.x,
                this.sprite.y + 42,
                35
            );

        this.telegraphCircle
            .setStrokeStyle(
                5,
                0xff8c00,
                0.9
            );

        this.telegraphCircle
            .setDepth(
                this.sprite.depth - 1
            );

        this.scene.tweens.add({

            targets:
                this.telegraphCircle,

            scale:
                1.7,

            alpha:
                0,

            duration:
                300,

            repeat:
                1,

            ease:
                "Sine.Out"
        });
    }


    // ==============================================
    // UPDATE ATTACK
    // ==============================================

    updateAttack(player) {

        this.attackTimer--;

        const direction =
            player.sprite.x <
            this.sprite.x
                ? -1
                : 1;

        // ------------------------------------------
        // PHASE 1
        // WARNING / WIND-UP
        // ------------------------------------------

        if (
            this.attackTimer >
            20
        ) {

            // Completely frozen while telegraphing.
            this.body.setVelocity(
                0,
                0
            );

            // Flash orange/normal.
            if (
                Math.floor(
                    this.attackTimer / 3
                ) %
                2 ===
                0
            ) {

                this.sprite.setTint(
                    0xff9d24
                );

            } else {

                this.sprite.clearTint();
            }

            // Heavy wind-up posture.
            this.sprite.setScale(

                this.baseScaleX *
                    1.08,

                this.baseScaleY *
                    0.92
            );

            this.sprite.angle =
                -direction * 6;
        }

        // ------------------------------------------
        // PHASE 2
        // STRIKE
        // ------------------------------------------

        else if (
            this.attackTimer >
            11
        ) {

            this.sprite.clearTint();

            if (
                this.telegraphCircle
            ) {

                this.telegraphCircle.destroy();

                this.telegraphCircle =
                    null;
            }

            this.sprite.setScale(

                this.baseScaleX *
                    1.10,

                this.baseScaleY *
                    0.96
            );

            this.sprite.angle =
                direction * 8;

            this.body.setVelocityX(
                direction * 65
            );

            if (
                !this.attackHasHit
            ) {

                const hitDX =
                    Math.abs(
                        this.sprite.x -
                        player.sprite.x
                    );

                const hitDY =
                    Math.abs(
                        this.sprite.y -
                        player.sprite.y
                    );

                if (
                    hitDX <= 145 &&
                    hitDY <= 90
                ) {

                    const hit =
                        player.takeDamage(
                            1,
                            this
                        );

                    this.attackHasHit =
                        true;

                    if (
                        hit !== false &&
                        this.scene.cache.audio.exists(
                            "punch-hit"
                        )
                    ) {

                        this.scene.sound.play(
                            "punch-hit",
                            {
                                volume:
                                    0.8,

                                rate:
                                    0.72
                            }
                        );
                    }
                }
            }
        }

        // ------------------------------------------
        // PHASE 3
        // RECOVERY
        // ------------------------------------------

        else {

            this.sprite.clearTint();

            this.body.setVelocity(
                0,
                0
            );

            this.sprite.angle =
                Phaser.Math.Linear(
                    this.sprite.angle,
                    0,
                    0.30
                );

            this.sprite.setScale(

                Phaser.Math.Linear(
                    this.sprite.scaleX,
                    this.baseScaleX,
                    0.30
                ),

                Phaser.Math.Linear(
                    this.sprite.scaleY,
                    this.baseScaleY,
                    0.30
                )
            );
        }

        // ------------------------------------------
        // ATTACK COMPLETE
        // ------------------------------------------

        if (
            this.attackTimer <= 0
        ) {

            this.body.setVelocity(
                0,
                0
            );

            this.sprite.clearTint();

            this.sprite.angle =
                0;

            this.sprite.setScale(
                this.baseScaleX,
                this.baseScaleY
            );

            if (
                this.telegraphCircle
            ) {

                this.telegraphCircle.destroy();

                this.telegraphCircle =
                    null;
            }

            this.isAttacking =
                false;

            this.attackCooldown =
                60;
        }
    }


    // ==============================================
    // TAKE DAMAGE
    // ==============================================

    takeDamage(amount) {

        if (
            this.isDead ||
            this.isHit
        ) {
            return;
        }

        // ------------------------------------------
        // INTERRUPT ATTACK
        // ------------------------------------------

        if (this.isAttacking) {

            this.isAttacking =
                false;

            this.attackTimer =
                0;

            this.attackHasHit =
                false;

            if (
                this.telegraphCircle
            ) {

                this.telegraphCircle.destroy();

                this.telegraphCircle =
                    null;
            }

            this.body.setVelocity(
                0,
                0
            );

            this.sprite.clearTint();

            this.sprite.angle =
                0;

            this.sprite.setScale(
                this.baseScaleX,
                this.baseScaleY
            );
        }

        this.health -= amount;

        this.health =
            Math.max(
                0,
                this.health
            );

        this.isHit =
            true;

        this.hitTimer =
            14;

        this.sprite.setTint(
            0xff3b3b
        );

        this.scene.time.delayedCall(
            110,
            () => {

                if (
                    !this.isDead &&
                    !this.isAttacking
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


    // ==============================================
    // KO
    // ==============================================

    die() {

        if (this.isDead) {
            return;
        }

        this.isDead =
            true;

        this.isAttacking =
            false;

        if (
            this.telegraphCircle
        ) {

            this.telegraphCircle.destroy();

            this.telegraphCircle =
                null;
        }

        this.sprite.clearTint();

        this.body.setVelocity(
            0,
            0
        );

        this.body.enable =
            false;

        const fallDirection =
            this.sprite.flipX
                ? 1
                : -1;

        this.scene.tweens.add({

            targets:
                this.sprite,

            x:
                this.sprite.x +
                (
                    65 *
                    fallDirection
                ),

            y:
                this.sprite.y +
                24,

            angle:
                78 *
                fallDirection,

            duration:
                320,

            ease:
                "Cubic.Out",

            onComplete: () => {

                this.scene.cameras.main.shake(
                    110,
                    0.005
                );

                this.scene.tweens.add({

                    targets:
                        this.sprite,

                    y:
                        this.sprite.y -
                        7,

                    duration:
                        90,

                    yoyo:
                        true,

                    ease:
                        "Quad.Out",

                    onComplete:
                        () => {

                            this.sprite.setTint(
                                0x888888
                            );

                            this.scene.time.delayedCall(
                                1700,
                                () => {

                                    this.scene.tweens.add({

                                        targets:
                                            this.sprite,

                                        alpha:
                                            0,

                                        duration:
                                            500,

                                        ease:
                                            "Sine.In",

                                        onComplete:
                                            () => {

                                                this.sprite.destroy();
                                            }
                                    });
                                }
                            );
                        }
                });
            }
        });
    }
}