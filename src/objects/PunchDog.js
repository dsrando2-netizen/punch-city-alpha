import Phaser from "phaser";
import CombatSystem from "../systems/CombatSystem.js";

export default class PunchDog {

    constructor(scene, x, y) {

        this.scene = scene;

        this.sprite = scene.physics.add.sprite(
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

        this.body.setCollideWorldBounds(true);

        this.speed = 225;

        this.target = null;

        this.attackCooldown = 0;
        this.isPunching = false;
        this.punchTimer = 0;

        this.keys = scene.input.keyboard.addKeys({

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

        const isMoving =
            inputX !== 0 ||
            inputY !== 0;

        if (inputX < 0) {
            this.sprite.setFlipX(true);
        }

        if (inputX > 0) {
            this.sprite.setFlipX(false);
        }

        this.body.setVelocity(
            0,
            0
        );

        if (isMoving) {

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

        if (
            isMoving &&
            !this.isPunching
        ) {

            if (
                this.sprite.anims.currentAnim?.key !==
                "punchdog-walk"
            ) {

                this.sprite.play(
                    "punchdog-walk",
                    true
                );

            }

        } else if (!this.isPunching) {

            if (
                this.sprite.anims.currentAnim?.key !==
                "punchdog-idle"
            ) {

                this.sprite.play(
                    "punchdog-idle",
                    true
                );

            }

        }

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.punch
            ) &&
            this.attackCooldown <= 0
        ) {

            this.attackCooldown = 20;
            this.isPunching = true;
            this.punchTimer = 8;

            CombatSystem.punch(
                this,
                this.target
            );

        }

        if (this.isPunching) {

            this.punchTimer--;

            if (this.punchTimer <= 0) {
                this.isPunching = false;
            }

        }

    }

}