import "./style.css";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        this.cameras.main.setBackgroundColor("#2b2b2b");

        this.add.text(
            640,
            360,
            "🐶 PUNCH CITY ALPHA 🥊",
            {
                fontSize: "42px",
                color: "#ffffff",
                fontFamily: "Arial"
            }
        ).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "app",
    backgroundColor: "#000000",
    scene: [GameScene]
};

new Phaser.Game(config);