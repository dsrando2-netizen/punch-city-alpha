import Phaser from "phaser";

import Bear from "../objects/Bear.js";
import PunchDog from "../objects/PunchDog.js";

import Road from "../world/Road.js";
import Sidewalk from "../world/Sidewalk.js";
import Buildings from "../world/Buildings.js";
import Props from "../world/Props.js";

import HealthBar from "../ui/HealthBar.js";
import AnimationSystem from "../systems/AnimationSystem.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    preload() {

        this.load.spritesheet(
            "punchdog_idle_autosprite",
            "/sprites/punchdog_idle_autosprite.png",
            {
                frameWidth: 256,
                frameHeight: 256
            }
        );

        this.load.spritesheet(
            "punchdog_walk_autosprite",
            "/sprites/punchdog_walk_autosprite.png",
            {
                frameWidth: 256,
                frameHeight: 256
            }
        );

        this.load.image(
            "bruiser_bear",
            "/sprites/bruiser_bear.png"
        );

        this.load.audio(
            "punch-hit",
            "/audio/punch_hit.wav"
        );
    }

    create() {

        this.cameras.main.setBackgroundColor(
            "#87ceeb"
        );

        this.physics.world.setBounds(
            0,
            0,
            3000,
            2000
        );

        this.cameras.main.setBounds(
            0,
            0,
            3000,
            2000
        );

        AnimationSystem.create(
            this
        );

        new Buildings(this);
        new Sidewalk(this);
        new Road(this);
        new Props(this);

        this.player =
            new PunchDog(
                this,
                400,
                600
            );

        this.bear =
            new Bear(
                this,
                900,
                600
            );

        this.player.target =
            this.bear;

        this.bearHealthBar =
            new HealthBar(
                this,
                this.bear
            );

        this.cameras.main.startFollow(
            this.player.sprite,
            true,
            0.08,
            0.08
        );
    }

    update() {

        this.player.update();

        this.bear.update(
            this.player
        );

        this.bearHealthBar.update();
    }
}