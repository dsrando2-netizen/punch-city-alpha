import "./style.css";
import Phaser from "phaser";

import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "app",
    backgroundColor: "#000000",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [GameScene]
};

new Phaser.Game(config);