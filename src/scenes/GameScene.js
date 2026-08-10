import Phaser from "phaser";

import PunchDog from "../objects/PunchDog.js";

import Road from "../world/Road.js";
import Sidewalk from "../world/Sidewalk.js";
import Buildings from "../world/Buildings.js";
import Props from "../world/Props.js";

import HealthBar from "../ui/HealthBar.js";
import AnimationSystem from "../systems/AnimationSystem.js";
import SpawnSystem from "../systems/SpawnSystem.js";

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

        // ==========================================
        // WORLD
        // ==========================================

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

        AnimationSystem.create(this);

        new Buildings(this);
        new Sidewalk(this);
        new Road(this);
        new Props(this);

        // ==========================================
        // PLAYER
        // ==========================================

        this.player =
            new PunchDog(
                this,
                400,
                600
            );

        // ==========================================
        // WAVE SYSTEM
        // ==========================================

        this.currentWave = 1;

        this.enemies =
            SpawnSystem.spawnWave(
                this,
                this.currentWave
            );

        // ==========================================
        // COLLIDERS
        // ==========================================

        this.enemies.forEach(
            (enemy) => {

                this.physics.add.collider(
                    this.player.sprite,
                    enemy.sprite
                );

            }
        );

        // ==========================================
        // TARGET
        // ==========================================

        this.updatePlayerTarget();

        // ==========================================
        // HUD
        // ==========================================

        this.playerHealthBar =
            new HealthBar(
                this,
                this.player,
                {
                    x: 24,
                    y: 42,
                    width: 220,
                    label: "PUNCHDOG HP"
                }
            );

        this.enemyCountText =
            this.add.text(
                540,
                32,
                "",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "22px",

                    color:
                        "#ffffff",

                    stroke:
                        "#000000",

                    strokeThickness:
                        5
                }
            );

        this.enemyCountText
            .setScrollFactor(0);

        this.enemyCountText
            .setDepth(1000);

        this.waveText =
            this.add.text(
                540,
                62,
                "",
                {
                    fontFamily:
                        "Arial",

                    fontSize:
                        "18px",

                    color:
                        "#ffd54a",

                    stroke:
                        "#000000",

                    strokeThickness:
                        4
                }
            );

        this.waveText
            .setScrollFactor(0);

        this.waveText
            .setDepth(1000);

        // ==========================================
        // CAMERA
        // ==========================================

        this.cameras.main.startFollow(
            this.player.sprite,
            true,
            0.08,
            0.08
        );
    }

    update() {

        // ==========================================
        // PLAYER
        // ==========================================

        this.player.update();

        // ==========================================
        // REMOVE DEAD ENEMIES
        // ==========================================

        this.enemies =
            this.enemies.filter(
                (enemy) =>
                    !enemy.isDead
            );

        // ==========================================
        // UPDATE ENEMIES
        // ==========================================

        this.enemies.forEach(
            (enemy) => {

                enemy.update(
                    this.player
                );

            }
        );

        // ==========================================
        // PLAYER TARGET
        // ==========================================

        this.updatePlayerTarget();

        // ==========================================
        // HUD
        // ==========================================

        this.playerHealthBar.update();

        this.enemyCountText.setText(
            `ENEMIES: ${this.enemies.length}`
        );

        this.waveText.setText(
            `WAVE ${this.currentWave}`
        );
    }


    // ==============================================
    // FIND NEAREST ENEMY
    // ==============================================

    updatePlayerTarget() {

        if (
            this.enemies.length === 0
        ) {

            this.player.target =
                null;

            return;
        }

        let nearestEnemy =
            null;

        let nearestDistance =
            Infinity;

        this.enemies.forEach(
            (enemy) => {

                const distance =
                    Phaser.Math.Distance.Between(
                        this.player.sprite.x,
                        this.player.sprite.y,
                        enemy.sprite.x,
                        enemy.sprite.y
                    );

                if (
                    distance <
                    nearestDistance
                ) {

                    nearestDistance =
                        distance;

                    nearestEnemy =
                        enemy;
                }

            }
        );

        this.player.target =
            nearestEnemy;
    }
}