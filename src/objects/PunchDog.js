import Phaser from "phaser";

import CombatSystem from "../systems/CombatSystem.js";
import DodgeEffect from "../effects/DodgeEffect.js";

export default class PunchDog {

    constructor(scene, x, y) {

        this.scene = scene;

        // ==========================================
        // SPRITE
        // ==========================================

        this.sprite =
            scene.physics.add.sprite(
                x,
                y,
                "punchdog_idle_autosprite",
                0
            );

        this.sprite.setDisplaySize(
            170,
            170
        );

        this.body =
            this.sprite.body;

        this.body.setSize(
            70,
            75
        );

        this.body.setOffset(
            93,
            160
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

        this.speed = 225;

        this.facing = "right";

        // ==========================================
        // HEALTH
        // ==========================================

        this.maxHealth = 5;

        this.health =
            this.maxHealth;

        this.isHit = false;

        this.hitTimer = 0;

        this.isDead = false;

        // ==========================================
        // PUNCH
        // ==========================================

        this.target = null;

        this.attackCooldown = 0;

        this.isPunching = false;

        this.punchTimer = 0;

        this.punchStartX = 0;

        // ==========================================
        // DODGE
        // ==========================================

        this.isDodging = false;

        this.isInvulnerable = false;

        this.dodgeTimer = 0;

        this.dodgeCooldown = 0;

        // Slightly reduced from previous version.
        this.dodgeSpeed = 460;

        this.dodgeDirection =
            new Phaser.Math.Vector2(
                1,
                0
            );

        this.afterImageTimer = 0;

        // ==========================================
        // CONTROLS
        // ==========================================

        this.keys =
            scene.input.keyboard.addKeys({

                up:
                    Phaser.Input.Keyboard.KeyCodes.W,

                down:
                    Phaser.Input.Keyboard.KeyCodes.S,

                left:
                    Phaser.Input.Keyboard.KeyCodes.A,

                right:
                    Phaser.Input.Keyboard.KeyCodes.D,

                punch:
                    Phaser.Input.Keyboard.KeyCodes.SPACE,

                dodge:
                    Phaser.Input.Keyboard.KeyCodes.SHIFT
            });

        this.sprite.play(
            "punchdog-idle"
        );
    }


    // ==============================================
    // UPDATE
    // ==============================================

    update() {

        if (this.isDead) {

            this.body.setVelocity(
                0,
                0
            );

            return;
        }

        // ------------------------------------------
        // COOLDOWNS
        // ------------------------------------------

        if (
            this.attackCooldown > 0
        ) {
            this.attackCooldown--;
        }

        if (
            this.dodgeCooldown > 0
        ) {
            this.dodgeCooldown--;
        }

        // ------------------------------------------
        // ACTIVE DODGE
        // ------------------------------------------

        if (this.isDodging) {

            this.updateDodge();

            return;
        }

        // ------------------------------------------
        // HIT RECOVERY
        // ------------------------------------------

        if (this.isHit) {

            this.hitTimer--;

            this.body.velocity.scale(
                0.8
            );

            if (
                this.hitTimer <= 0
            ) {

                this.body.setVelocity(
                    0,
                    0
                );

                this.isHit = false;

                this.sprite.clearTint();

                this.sprite.play(
                    "punchdog-idle",
                    true
                );
            }

            return;
        }

        // ------------------------------------------
        // INPUT
        // ------------------------------------------

        let inputX = 0;
        let inputY = 0;

        if (!this.isPunching) {

            if (this.keys.left.isDown) {
                inputX -= 1;
            }

            if (this.keys.right.isDown) {
                inputX += 1;
            }

            if (this.keys.up.isDown) {
                inputY -= 1;
            }

            if (this.keys.down.isDown) {
                inputY += 1;
            }
        }

        const isMoving =
            inputX !== 0 ||
            inputY !== 0;

        // ------------------------------------------
        // FACING
        // ------------------------------------------

        if (inputX < 0) {

            this.facing = "left";

            this.sprite.setFlipX(
                true
            );
        }

        if (inputX > 0) {

            this.facing = "right";

            this.sprite.setFlipX(
                false
            );
        }

        // ------------------------------------------
        // START DODGE
        // ------------------------------------------

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.dodge
            ) &&
            this.dodgeCooldown <= 0 &&
            !this.isPunching
        ) {

            this.startDodge(
                inputX,
                inputY
            );

            return;
        }

        // ------------------------------------------
        // MOVEMENT
        // ------------------------------------------

        this.body.setVelocity(
            0,
            0
        );

        if (
            isMoving &&
            !this.isPunching
        ) {

            const direction =
                new Phaser.Math.Vector2(
                    inputX,
                    inputY
                );

            direction.normalize();

            this.body.setVelocity(

                direction.x *
                    this.speed,

                direction.y *
                    this.speed
            );
        }

        // ------------------------------------------
        // WALK / IDLE
        // ------------------------------------------

        if (
            !this.isPunching &&
            isMoving
        ) {

            if (
                this.sprite.anims
                    .currentAnim?.key !==
                "punchdog-walk"
            ) {

                this.sprite.play(
                    "punchdog-walk",
                    true
                );
            }

        } else if (
            !this.isPunching
        ) {

            if (
                this.sprite.anims
                    .currentAnim?.key !==
                "punchdog-idle"
            ) {

                this.sprite.play(
                    "punchdog-idle",
                    true
                );
            }
        }

        // ------------------------------------------
        // START PUNCH
        // ------------------------------------------

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.punch
            ) &&
            this.attackCooldown <= 0 &&
            !this.isPunching
        ) {

            this.attackCooldown =
                18;

            this.isPunching =
                true;

            this.punchTimer =
                10;

            this.punchStartX =
                this.sprite.x;

            this.sprite.stop();

            CombatSystem.punch(
                this,
                this.target
            );
        }

        // ------------------------------------------
        // TEMPORARY PUNCH VISUAL
        // ------------------------------------------

        if (this.isPunching) {

            this.punchTimer--;

            const direction =
                this.facing === "left"
                    ? -1
                    : 1;

            if (
                this.punchTimer >= 6
            ) {

                this.sprite.x =
                    this.punchStartX +
                    direction * 7;

                this.sprite.setScale(

                    this.baseScaleX *
                        1.04,

                    this.baseScaleY *
                        0.98
                );

            } else {

                this.sprite.x =
                    Phaser.Math.Linear(
                        this.sprite.x,
                        this.punchStartX,
                        0.55
                    );

                this.sprite.setScale(

                    Phaser.Math.Linear(
                        this.sprite.scaleX,
                        this.baseScaleX,
                        0.55
                    ),

                    Phaser.Math.Linear(
                        this.sprite.scaleY,
                        this.baseScaleY,
                        0.55
                    )
                );
            }

            if (
                this.punchTimer <= 0
            ) {

                this.sprite.x =
                    this.punchStartX;

                this.sprite.setScale(
                    this.baseScaleX,
                    this.baseScaleY
                );

                this.isPunching =
                    false;

                this.sprite.play(
                    "punchdog-idle",
                    true
                );
            }
        }
    }


    // ==============================================
    // START DODGE
    // ==============================================

    startDodge(
        inputX,
        inputY
    ) {

        this.isDodging =
            true;

        this.isInvulnerable =
            true;

        // Shorter, tighter dash.
        this.dodgeTimer =
            10;

        this.dodgeCooldown =
            40;

        this.afterImageTimer =
            0;

        // ------------------------------------------
        // DIRECTION
        // ------------------------------------------

        if (
            inputX !== 0 ||
            inputY !== 0
        ) {

            this.dodgeDirection.set(
                inputX,
                inputY
            );

            this.dodgeDirection.normalize();

        } else {

            this.dodgeDirection.set(

                this.facing === "left"
                    ? -1
                    : 1,

                0
            );
        }

        // ------------------------------------------
        // START EFFECT
        // ------------------------------------------

        DodgeEffect.burst(
            this.scene,
            this.sprite
        );

        this.sprite.setAlpha(
            0.65
        );

        this.sprite.stop();

        this.body.setVelocity(

            this.dodgeDirection.x *
                this.dodgeSpeed,

            this.dodgeDirection.y *
                this.dodgeSpeed
        );
    }


    // ==============================================
    // UPDATE DODGE
    // ==============================================

    updateDodge() {

        this.dodgeTimer--;

        this.afterImageTimer--;

        this.body.setVelocity(

            this.dodgeDirection.x *
                this.dodgeSpeed,

            this.dodgeDirection.y *
                this.dodgeSpeed
        );

        // ------------------------------------------
        // AFTERIMAGE
        // ------------------------------------------

        if (
            this.afterImageTimer <= 0
        ) {

            DodgeEffect.afterImage(
                this.scene,
                this.sprite
            );

            this.afterImageTimer =
                2;
        }

        // Slight dash squash.
        this.sprite.setScale(

            this.baseScaleX *
                1.06,

            this.baseScaleY *
                0.92
        );

        // ------------------------------------------
        // END DODGE
        // ------------------------------------------

        if (
            this.dodgeTimer <= 0
        ) {

            this.isDodging =
                false;

            this.isInvulnerable =
                false;

            this.body.setVelocity(
                0,
                0
            );

            this.sprite.setAlpha(
                1
            );

            this.sprite.setScale(
                this.baseScaleX,
                this.baseScaleY
            );

            this.sprite.play(
                "punchdog-idle",
                true
            );
        }
    }


    // ==============================================
    // TAKE DAMAGE
    // ==============================================

    takeDamage(
        amount,
        attacker = null
    ) {

        // ------------------------------------------
        // SUCCESSFUL DODGE
        // ------------------------------------------

        if (
            this.isInvulnerable
        ) {

            console.log(
                "Perfect dodge!"
            );

            return false;
        }

        if (
            this.isDead ||
            this.isHit
        ) {

            return false;
        }

        this.health -= amount;

        this.health =
            Math.max(
                0,
                this.health
            );

        console.log(
            "PunchDog HP:",
            this.health
        );

        this.isHit = true;

        this.hitTimer = 18;

        this.isPunching = false;

        this.sprite.setScale(
            this.baseScaleX,
            this.baseScaleY
        );

        this.sprite.setTint(
            0xff4444
        );

        // ------------------------------------------
        // KNOCKBACK
        // ------------------------------------------

        if (attacker) {

            const angle =
                Phaser.Math.Angle.Between(

                    attacker.sprite.x,
                    attacker.sprite.y,

                    this.sprite.x,
                    this.sprite.y
                );

            this.body.setVelocity(

                Math.cos(angle) *
                    260,

                Math.sin(angle) *
                    260
            );
        }

        this.scene.cameras.main.shake(
            110,
            0.006
        );

        if (
            this.health <= 0
        ) {

            this.die();
        }

        return true;
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

        this.isDodging =
            false;

        this.isInvulnerable =
            false;

        this.body.setVelocity(
            0,
            0
        );

        this.sprite.clearTint();

        this.sprite.setAlpha(
            1
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

            angle:
                80 *
                fallDirection,

            y:
                this.sprite.y +
                22,

            alpha:
                0.7,

            duration:
                350,

            ease:
                "Cubic.Out"
        });

        console.log(
            "PunchDog KO!"
        );
    }
}