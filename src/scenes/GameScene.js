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

        this.player = new PunchDog(
            this,
            400,
            600
        );

        // ==========================================
        // WAVE STATE
        // ==========================================

        this.currentWave = 1;

        this.enemies = [];

        this.isWaveTransitioning = false;

        this.waveStarted = false;

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
                535,
                26,
                "",
                {
                    fontFamily: "Arial",
                    fontSize: "22px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

        this.enemyCountText
            .setScrollFactor(0);

        this.enemyCountText
            .setDepth(1000);

        this.waveText =
            this.add.text(
                535,
                58,
                "",
                {
                    fontFamily: "Arial",
                    fontSize: "20px",
                    color: "#ffd54a",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.waveText
            .setScrollFactor(0);

        this.waveText
            .setDepth(1000);

        // ==========================================
        // BIG CENTER MESSAGE
        // ==========================================

        this.centerMessage =
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                "",
                {
                    fontFamily: "Arial Black",
                    fontSize: "48px",
                    color: "#ffffff",

                    align: "center",

                    stroke: "#000000",
                    strokeThickness: 8
                }
            );

        this.centerMessage
            .setOrigin(0.5);

        this.centerMessage
            .setScrollFactor(0);

        this.centerMessage
            .setDepth(2000);

        this.centerMessage
            .setVisible(false);

        // ==========================================
        // CAMERA
        // ==========================================

        this.cameras.main.startFollow(
            this.player.sprite,
            true,
            0.08,
            0.08
        );

        // ==========================================
        // BEGIN WAVE 1
        // ==========================================

        this.startWave(
            this.currentWave
        );
    }


    // ==============================================
    // UPDATE
    // ==============================================

    update() {

        // ==========================================
        // PLAYER
        // ==========================================

        this.player.update();

        // ==========================================
        // KEEP ONLY ACTIVE ENEMIES
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

        // ==========================================
        // WAVE CLEAR CHECK
        // ==========================================

        if (
            this.waveStarted &&
            this.enemies.length === 0 &&
            !this.isWaveTransitioning &&
            !this.player.isDead
        ) {

            this.completeWave();
        }
    }


    // ==============================================
    // START WAVE
    // ==============================================

    startWave(waveNumber) {

        this.waveStarted = false;

        this.isWaveTransitioning = false;

        // ------------------------------------------
        // SPAWN ENEMIES
        // ------------------------------------------

        this.enemies =
            SpawnSystem.spawnWave(
                this,
                waveNumber
            );

        // ------------------------------------------
        // PLAYER COLLISION WITH EACH ENEMY
        // ------------------------------------------

        this.enemies.forEach(
            (enemy) => {

                this.physics.add.collider(
                    this.player.sprite,
                    enemy.sprite
                );
            }
        );

        // ------------------------------------------
        // ENEMIES COLLIDE WITH EACH OTHER
        // ------------------------------------------

        for (
            let i = 0;
            i < this.enemies.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < this.enemies.length;
                j++
            ) {

                this.physics.add.collider(
                    this.enemies[i].sprite,
                    this.enemies[j].sprite
                );
            }
        }

        this.updatePlayerTarget();

        this.waveStarted = true;

        // ------------------------------------------
        // WAVE START MESSAGE
        // ------------------------------------------

        this.showCenterMessage(
            `WAVE ${waveNumber}\nFIGHT!`,
            900
        );
    }


    // ==============================================
    // WAVE COMPLETE
    // ==============================================

    completeWave() {

        this.isWaveTransitioning = true;

        this.waveStarted = false;

        this.player.target = null;

        this.showStreetCleared();
    }


    // ==============================================
    // STREET CLEARED
    // ==============================================

    showStreetCleared() {

        this.centerMessage.setText(
            "STREET CLEARED!"
        );

        this.centerMessage.setVisible(
            true
        );

        this.centerMessage.setScale(
            0.7
        );

        this.centerMessage.setAlpha(
            0
        );

        this.tweens.add({

            targets:
                this.centerMessage,

            scale:
                1,

            alpha:
                1,

            duration:
                250,

            ease:
                "Back.Out",

            onComplete: () => {

                this.time.delayedCall(
                    900,
                    () => {

                        this.beginNextWaveCountdown();
                    }
                );
            }
        });
    }


    // ==============================================
    // NEXT WAVE COUNTDOWN
    // ==============================================

    beginNextWaveCountdown() {

        let countdown = 3;

        this.centerMessage.setScale(
            1
        );

        this.centerMessage.setAlpha(
            1
        );

        this.centerMessage.setText(
            `NEXT WAVE\n${countdown}`
        );

        const timer =
            this.time.addEvent({

                delay:
                    700,

                repeat:
                    2,

                callback:
                    () => {

                        countdown--;

                        if (
                            countdown > 0
                        ) {

                            this.centerMessage.setText(
                                `NEXT WAVE\n${countdown}`
                            );

                        } else {

                            this.centerMessage.setText(
                                "FIGHT!"
                            );
                        }
                    }
            });

        this.time.delayedCall(
            2300,
            () => {

                timer.remove(false);

                this.centerMessage.setVisible(
                    false
                );

                this.currentWave++;

                this.startWave(
                    this.currentWave
                );
            }
        );
    }


    // ==============================================
    // CENTER MESSAGE HELPER
    // ==============================================

    showCenterMessage(
        text,
        duration = 1000
    ) {

        this.centerMessage.setText(
            text
        );

        this.centerMessage.setVisible(
            true
        );

        this.centerMessage.setAlpha(
            1
        );

        this.time.delayedCall(
            duration,
            () => {

                // Don't hide it if we're currently
                // transitioning between waves.
                if (
                    !this.isWaveTransitioning
                ) {

                    this.centerMessage.setVisible(
                        false
                    );
                }
            }
        );
    }


    // ==============================================
    // FIND NEAREST LIVING ENEMY
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

                if (
                    enemy.isDead
                ) {
                    return;
                }

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