import Phaser from "phaser";
import CombatSystem from "../systems/CombatSystem.js";

export default class PunchDog {

    constructor(scene, x, y) {

        this.scene = scene;

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

        this.body = this.sprite.body;

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

        // -------------------------
        // Movement
        // -------------------------

        this.speed = 225;

        this.facing = "right";

        // -------------------------
        // Combat
        // -------------------------

        this.target = null;

        this.attackCooldown = 0;

        this.isPunching = false;

        this.punchTimer = 0;

        this.punchStartX = 0;

        this.punchStartAngle = 0;

        // -------------------------
        // Input
        // -------------------------

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
                    Phaser.Input.Keyboard.KeyCodes.SPACE

            });

        this.sprite.play(
            "punchdog-idle"
        );
    }

    update() {

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        let inputX = 0;
        let inputY = 0;

        if (
            !this.isPunching
        ) {

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

        // -------------------------
        // Facing
        // -------------------------

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

        // -------------------------
        // Movement
        // -------------------------

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
                direction.x * this.speed,
                direction.y * this.speed
            );
        }

        // -------------------------
        // Animation switching
        // -------------------------

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
        }

        else if (
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

        // -------------------------
        // Start Punch
        // -------------------------

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.punch
            ) &&
            this.attackCooldown <= 0 &&
            !this.isPunching
        ) {

            this.attackCooldown = 18;

            this.isPunching = true;

            this.punchTimer = 10;

            this.sprite.stop();

            this.punchStartX =
                this.sprite.x;

            this.punchStartAngle =
                this.sprite.angle;

            CombatSystem.punch(
                this,
                this.target
            );
        }

        // -------------------------
        // Temporary Punch Animation
        // -------------------------

        if (
            this.isPunching
        ) {

            this.punchTimer--;

            const direction =
                this.facing === "left"
                    ? -1
                    : 1;

            // First half = lunge
            if (
                this.punchTimer > 5
            ) {

                this.sprite.x =
                    this.punchStartX +
                    direction * 16;

                this.sprite.angle =
                    direction * 5;
            }

            // Second half = recoil
            else {

                this.sprite.x =
                    Phaser.Math.Linear(
                        this.sprite.x,
                        this.punchStartX,
                        0.45
                    );

                this.sprite.angle =
                    Phaser.Math.Linear(
                        this.sprite.angle,
                        this.punchStartAngle,
                        0.45
                    );
            }

            if (
                this.punchTimer <= 0
            ) {

                this.sprite.x =
                    this.punchStartX;

                this.sprite.angle =
                    this.punchStartAngle;

                this.isPunching = false;

                this.sprite.play(
                    "punchdog-idle",
                    true
                );
            }
        }
    }
}