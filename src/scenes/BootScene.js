import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {

    constructor() {
        super("BootScene");
    }

    preload() {

        this.load.spritesheet(
            "punchdog_walk",
            "sprites/punchdog_walk.png",
            {
                frameWidth: 128,
                frameHeight: 128
            }
        );

    }

    create() {

        this.scene.start("GameScene");

    }

}