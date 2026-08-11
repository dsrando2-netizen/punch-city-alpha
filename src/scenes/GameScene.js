import Phaser from "phaser";

import PunchDog from "../objects/PunchDog.js";

import Road from "../world/Road.js";
import Sidewalk from "../world/Sidewalk.js";
import Buildings from "../world/Buildings.js";
import Props from "../world/Props.js";

import HealthBar from "../ui/HealthBar.js";

import AnimationSystem from "../systems/AnimationSystem.js";
import SpawnSystem from "../systems/SpawnSystem.js";
import CrowdSystem from "../systems/CrowdSystem.js";

export default class GameScene extends Phaser.Scene {

    constructor() {

        super("GameScene");
    }


    // ==============================================
    // PRELOAD
    // ==============================================

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
// ==========================================
// PICKUP ASSETS
// ==========================================

this.load.image(
    "health_pickup",
    "/sprites/pickups/health_pickup.png"
);

this.load.image(
    "power_pickup",
    "/sprites/pickups/power_pickup.png"
);

        this.load.audio(
            "punch-hit",
            "/audio/punch_hit.wav"
        );
    }


    // ==============================================
    // CREATE
    // ==============================================

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
        // ENCOUNTER STATE
        // ==========================================

        this.currentWave = 1;

        // Alpha 0.5.0 ends after Wave 3.
        this.maxWave = 3;

        this.enemies = [];

        this.waveStarted = false;

        this.isWaveTransitioning = false;

        this.encounterComplete = false;


        // ==========================================
        // RESTART CONTROL
        // ==========================================

        this.restartKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.R
            );


        // ==========================================
        // PLAYER HUD
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


        // ==========================================
        // ENEMY COUNTER
        // ==========================================

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
            .setScrollFactor(0)
            .setDepth(1000);


        // ==========================================
        // WAVE NUMBER
        // ==========================================

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
            .setScrollFactor(0)
            .setDepth(1000);


        // ==========================================
        // CENTER MESSAGE
        // ==========================================

        this.centerMessage =
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                "",
                {
                    fontFamily: "Arial Black",
                    fontSize: "50px",
                    color: "#ffffff",

                    align: "center",

                    stroke: "#000000",
                    strokeThickness: 9
                }
            );

        this.centerMessage
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(2000)
            .setVisible(false);


        // ==========================================
        // REWARD MESSAGE
        // ==========================================

        this.rewardMessage =
            this.add.text(
                this.scale.width / 2,
                (this.scale.height / 2) + 85,
                "",
                {
                    fontFamily: "Arial Black",
                    fontSize: "24px",
                    color: "#65ff7a",

                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

        this.rewardMessage
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(2001)
            .setVisible(false);


        // ==========================================
        // FINAL ENCOUNTER MESSAGE
        // ==========================================

        this.victoryMessage =
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                "",
                {
                    fontFamily: "Arial Black",

                    fontSize: "42px",

                    color: "#ffd54a",

                    align: "center",

                    stroke: "#000000",

                    strokeThickness: 9
                }
            );

        this.victoryMessage
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(3000)
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
        // START FIRST WAVE
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
        // ENCOUNTER FINISHED
        // ==========================================

        if (this.encounterComplete) {

            if (
                this.player?.body?.enable
            ) {

                this.player.body.setVelocity(
                    0,
                    0
                );
            }

            if (
                Phaser.Input.Keyboard.JustDown(
                    this.restartKey
                )
            ) {

                this.scene.restart();
            }

            return;
        }


        // ==========================================
        // TRANSITION LOCK
        // ==========================================

        if (
            this.isWaveTransitioning
        ) {

            if (
                this.player?.body?.enable
            ) {

                this.player.body.setVelocity(
                    0,
                    0
                );
            }

        } else {

            this.player.update();
        }


        // ==========================================
        // REMOVE DEAD ENEMIES
        // ==========================================

        this.enemies =
            this.enemies.filter(
                enemy =>
                    !enemy.isDead
            );


        // ==========================================
        // CROWD SYSTEM
        // ==========================================

        if (
            !this.isWaveTransitioning &&
            this.enemies.length > 0
        ) {

            CrowdSystem.assignSlots(
                this.player,
                this.enemies
            );

            CrowdSystem.chooseAttackers(
                this.player,
                this.enemies,
                1
            );
        }


        // ==========================================
        // UPDATE ENEMIES
        // ==========================================

        if (
            !this.isWaveTransitioning
        ) {

            this.enemies.forEach(
                enemy => {

                    enemy.update(
                        this.player
                    );
                }
            );
        }


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
        // WAVE COMPLETE CHECK
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


        // ==========================================
        // SPAWN WAVE
        // ==========================================

        this.enemies =
            SpawnSystem.spawnWave(
                this,
                waveNumber
            );


        // ==========================================
        // PLAYER ↔ ENEMY COLLISION
        // ==========================================

        this.enemies.forEach(
            enemy => {

                this.physics.add.collider(
                    this.player.sprite,
                    enemy.sprite
                );
            }
        );


        // ==========================================
        // ENEMY ↔ ENEMY COLLISION
        // ==========================================

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


        // ==========================================
        // CROWD SETUP
        // ==========================================

        CrowdSystem.assignSlots(
            this.player,
            this.enemies
        );

        CrowdSystem.chooseAttackers(
            this.player,
            this.enemies,
            1
        );


        // ==========================================
        // PLAYER TARGET
        // ==========================================

        this.updatePlayerTarget();

        this.waveStarted = true;


        // ==========================================
        // WAVE INTRO
        // ==========================================

        this.showWaveStart(
            waveNumber
        );
    }


    // ==============================================
    // WAVE INTRO
    // ==============================================

    showWaveStart(waveNumber) {

        this.centerMessage
            .setText(
                `WAVE ${waveNumber}\nFIGHT!`
            )
            .setVisible(true)
            .setAlpha(0)
            .setScale(1.35)
            .setAngle(0);


        this.tweens.add({

            targets:
                this.centerMessage,

            alpha:
                1,

            scale:
                1,

            duration:
                220,

            ease:
                "Back.Out",

            onComplete: () => {

                this.time.delayedCall(
                    650,
                    () => {

                        this.tweens.add({

                            targets:
                                this.centerMessage,

                            alpha:
                                0,

                            duration:
                                180,

                            onComplete:
                                () => {

                                    this.centerMessage
                                        .setVisible(
                                            false
                                        );
                                }
                        });
                    }
                );
            }
        });
    }


    // ==============================================
    // COMPLETE WAVE
    // ==============================================

    completeWave() {

        this.isWaveTransitioning = true;

        this.waveStarted = false;

        this.player.target = null;


        if (
            this.player?.body?.enable
        ) {

            this.player.body.setVelocity(
                0,
                0
            );
        }


        // ==========================================
        // FINAL WAVE?
        // ==========================================

        if (
            this.currentWave >=
            this.maxWave
        ) {

            this.completeEncounter();

            return;
        }


        // ==========================================
        // NORMAL WAVE CLEAR
        // ==========================================

        this.showStreetCleared(
            false
        );
    }


    // ==============================================
    // NORMAL STREET CLEAR
    // ==============================================

    showStreetCleared(
        finalClear = false
    ) {

        this.centerMessage
            .setText(
                "STREET CLEARED!"
            )
            .setVisible(true)
            .setAlpha(0)
            .setScale(0.45)
            .setAngle(-5);


        this.tweens.add({

            targets:
                this.centerMessage,

            alpha:
                1,

            scale:
                1.08,

            angle:
                0,

            duration:
                320,

            ease:
                "Back.Out",

            onComplete: () => {

                this.cameras.main.shake(
                    90,
                    0.003
                );


                if (finalClear) {

                    this.time.delayedCall(
                        900,
                        () => {

                            this.showVictoryScreen();
                        }
                    );

                    return;
                }


                // ----------------------------------
                // BETWEEN-WAVE HEAL
                // ----------------------------------

                this.restorePlayerHealth(
                    1
                );


                this.time.delayedCall(
                    1000,
                    () => {

                        this.beginNextWaveCountdown();
                    }
                );
            }
        });
    }


    // ==============================================
    // COMPLETE ENCOUNTER
    // ==============================================

    completeEncounter() {

        this.encounterComplete = true;

        this.isWaveTransitioning = true;

        this.waveStarted = false;

        this.player.target = null;


        if (
            this.player?.body?.enable
        ) {

            this.player.body.setVelocity(
                0,
                0
            );
        }


        this.showStreetCleared(
            true
        );
    }


    // ==============================================
    // FINAL VICTORY SCREEN
    // ==============================================

    showVictoryScreen() {

        this.centerMessage
            .setVisible(false);


        this.victoryMessage
            .setText(
                "AREA COMPLETE!\n\n" +
                "PUNCH CITY\n" +
                "ALPHA 0.5.0\n\n" +
                "PRESS R TO REPLAY"
            )
            .setVisible(true)
            .setAlpha(0)
            .setScale(0.6);


        this.tweens.add({

            targets:
                this.victoryMessage,

            alpha:
                1,

            scale:
                1,

            duration:
                500,

            ease:
                "Back.Out"
        });


        // Small victory camera bump.
        this.cameras.main.shake(
            130,
            0.0025
        );
    }


    // ==============================================
    // RESTORE PLAYER HEALTH
    // ==============================================

    restorePlayerHealth(amount) {

        if (
            this.player.health >=
            this.player.maxHealth
        ) {

            this.rewardMessage
                .setText(
                    "HP FULL"
                );

        } else {

            const oldHealth =
                this.player.health;


            this.player.health =
                Math.min(
                    this.player.maxHealth,

                    this.player.health +
                    amount
                );


            const restored =
                this.player.health -
                oldHealth;


            this.rewardMessage
                .setText(
                    `+${restored} HP`
                );


            this.player.sprite.setTint(
                0x66ff88
            );


            this.time.delayedCall(
                250,
                () => {

                    if (
                        !this.player.isDead
                    ) {

                        this.player.sprite.clearTint();
                    }
                }
            );
        }


        this.rewardMessage
            .setVisible(true)
            .setAlpha(0)
            .setY(
                (this.scale.height / 2) +
                95
            );


        this.tweens.add({

            targets:
                this.rewardMessage,

            alpha:
                1,

            y:
                this.rewardMessage.y -
                18,

            duration:
                220,

            ease:
                "Cubic.Out",

            onComplete: () => {

                this.time.delayedCall(
                    550,
                    () => {

                        this.tweens.add({

                            targets:
                                this.rewardMessage,

                            alpha:
                                0,

                            duration:
                                180,

                            onComplete:
                                () => {

                                    this.rewardMessage
                                        .setVisible(
                                            false
                                        );
                                }
                        });
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


        this.centerMessage
            .setVisible(true)
            .setAlpha(1)
            .setScale(1)
            .setAngle(0)
            .setText(
                `NEXT WAVE\n${countdown}`
            );


        const countdownEvent =
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

                            this.centerMessage
                                .setText(
                                    `NEXT WAVE\n${countdown}`
                                );

                            this.centerMessage
                                .setScale(
                                    1.15
                                );


                            this.tweens.add({

                                targets:
                                    this.centerMessage,

                                scale:
                                    1,

                                duration:
                                    150,

                                ease:
                                    "Back.Out"
                            });

                        } else {

                            this.centerMessage
                                .setText(
                                    "GET READY!"
                                );
                        }
                    }
            });


        this.time.delayedCall(
            2300,
            () => {

                countdownEvent.remove(
                    false
                );


                this.centerMessage
                    .setVisible(
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
    // FIND NEAREST LIVING ENEMY
    // ==============================================

    updatePlayerTarget() {

        if (
            this.enemies.length === 0
        ) {

            this.player.target = null;

            return;
        }


        let nearestEnemy = null;

        let nearestDistance = Infinity;


        this.enemies.forEach(
            enemy => {

                if (
                    enemy.isDead ||
                    !enemy.sprite ||
                    !enemy.sprite.active
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