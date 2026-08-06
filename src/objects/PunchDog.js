import Phaser from "phaser";

export default class PunchDog {

    constructor(scene, x, y) {

        this.scene = scene;

        // Create a simple physics rectangle
        this.sprite = scene.add.rectangle(x, y, 48, 64, 0xff3333);

        scene.physics.add.existing(this.sprite);

        this.body = this.sprite.body;

        this.body.setCollideWorldBounds(true);

        this.speed = 250;

        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

    }

    update() {

        this.body.setVelocity(0);

        if (this.keys.left.isDown) {
            this.body.setVelocityX(-this.speed);
        }

        if (this.keys.right.isDown) {
            this.body.setVelocityX(this.speed);
        }

        if (this.keys.up.isDown) {
            this.body.setVelocityY(-this.speed);
        }

        if (this.keys.down.isDown) {
            this.body.setVelocityY(this.speed);
        }

        this.body.velocity.normalize().scale(this.speed);

        console.log("Sprite:", this.sprite.x, this.sprite.y);
console.log("Body:", this.body.x, this.body.y);

    }

}