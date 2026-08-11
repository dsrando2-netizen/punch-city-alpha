export default class KOSystem {

    constructor(scene, player) {

        this.scene = scene;
        this.player = player;

        this.isActive = false;

        // ==========================================
        // REVIVE SETTINGS
        // ==========================================

        this.reviveHealthPercent = 0.50;
        this.reviveInvulnerabilityTime = 1500;

        // One revive per run.
        this.reviveUsed = false;


        // ==========================================
        // DARK OVERLAY
        // ==========================================

        this.overlay = scene.add.rectangle(
            scene.scale.width / 2,
            scene.scale.height / 2,
            scene.scale.width,
            scene.scale.height,
            0x000000,
            0
        );

        this.overlay
            .setScrollFactor(0)
            .setDepth(5000)
            .setVisible(false);


        // ==========================================
        // KO TITLE
        // ==========================================

        this.title = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2 - 130,
            "PUNCHDOG KO!",
            {
                fontFamily: "Arial Black",
                fontSize: "56px",
                color: "#ff3b3b",
                stroke: "#000000",
                strokeThickness: 10,
                align: "center"
            }
        );

        this.title
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(5001)
            .setVisible(false);


        // ==========================================
        // MESSAGE
        // ==========================================

        this.message = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2 - 55,
            "THE STREETS GOT YOU THIS TIME...",
            {
                fontFamily: "Arial Black",
                fontSize: "20px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 5,
                align: "center"
            }
        );

        this.message
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(5001)
            .setVisible(false);


        // ==========================================
        // REVIVE INFO
        // ==========================================

        this.reviveInfo = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2,
            "REVIVE WITH 50% HP",
            {
                fontFamily: "Arial Black",
                fontSize: "18px",
                color: "#ffd54a",
                stroke: "#000000",
                strokeThickness: 5,
                align: "center"
            }
        );

        this.reviveInfo
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(5001)
            .setVisible(false);


        // ==========================================
        // REVIVE BUTTON
        // ==========================================

        this.reviveButton = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2 + 65,
            "❤️  REVIVE",
            {
                fontFamily: "Arial Black",
                fontSize: "28px",
                color: "#ffffff",
                backgroundColor: "#1f9d55",

                padding: {
                    left: 28,
                    right: 28,
                    top: 14,
                    bottom: 14
                },

                stroke: "#000000",
                strokeThickness: 5
            }
        );

        this.reviveButton
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(5002)
            .setVisible(false)
            .setInteractive({
                useHandCursor: true
            });


        // ==========================================
        // RESTART BUTTON
        // ==========================================

        this.restartButton = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2 + 135,
            "RESTART RUN",
            {
                fontFamily: "Arial Black",
                fontSize: "20px",
                color: "#ffffff",
                backgroundColor: "#555555",

                padding: {
                    left: 22,
                    right: 22,
                    top: 11,
                    bottom: 11
                },

                stroke: "#000000",
                strokeThickness: 4
            }
        );

        this.restartButton
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(5002)
            .setVisible(false)
            .setInteractive({
                useHandCursor: true
            });


        // ==========================================
        // BUTTON EVENTS
        // ==========================================

        this.reviveButton.on(
            "pointerover",
            () => {

                if (
                    !this.isActive ||
                    this.reviveUsed
                ) {
                    return;
                }

                this.reviveButton.setScale(1.06);
            }
        );


        this.reviveButton.on(
            "pointerout",
            () => {

                this.reviveButton.setScale(1);
            }
        );


        this.reviveButton.on(
            "pointerdown",
            () => {

                if (
                    !this.isActive ||
                    this.reviveUsed
                ) {
                    return;
                }

                this.revive();
            }
        );


        this.restartButton.on(
            "pointerover",
            () => {

                if (!this.isActive) {
                    return;
                }

                this.restartButton.setScale(1.05);
            }
        );


        this.restartButton.on(
            "pointerout",
            () => {

                this.restartButton.setScale(1);
            }
        );


        this.restartButton.on(
            "pointerdown",
            () => {

                if (!this.isActive) {
                    return;
                }

                this.scene.scene.restart();
            }
        );
    }


    // ==============================================
    // UPDATE
    // ==============================================

    update() {

        if (this.isActive) {
            return;
        }

        if (
            this.player &&
            this.player.isDead
        ) {

            this.activate();
        }
    }


    // ==============================================
    // ACTIVATE KO SCREEN
    // ==============================================

    activate() {

        if (this.isActive) {
            return;
        }

        this.isActive = true;

        console.log(
            "KO SYSTEM: PunchDog defeated"
        );


        // ==========================================
        // STOP PLAYER
        // ==========================================

        if (this.player.body) {

            this.player.body.setVelocity(
                0,
                0
            );
        }


        // ==========================================
        // STOP ENEMIES
        // ==========================================

        if (
            Array.isArray(
                this.scene.enemies
            )
        ) {

            this.scene.enemies.forEach(
                enemy => {

                    if (
                        enemy &&
                        enemy.body &&
                        enemy.body.enable
                    ) {

                        enemy.body.setVelocity(
                            0,
                            0
                        );
                    }
                }
            );
        }


        // ==========================================
        // CONFIGURE REVIVE STATE
        // ==========================================

        if (this.reviveUsed) {

            this.reviveInfo.setText(
                "REVIVE ALREADY USED"
            );

            this.reviveInfo.setColor(
                "#ff7777"
            );

            this.reviveButton.setText(
                "🔒  REVIVE USED"
            );

            this.reviveButton.setStyle({
                backgroundColor: "#4a4a4a",
                color: "#999999"
            });

            this.reviveButton.disableInteractive();

        } else {

            this.reviveInfo.setText(
                "REVIVE WITH 50% HP"
            );

            this.reviveInfo.setColor(
                "#ffd54a"
            );

            this.reviveButton.setText(
                "❤️  REVIVE"
            );

            this.reviveButton.setStyle({
                backgroundColor: "#1f9d55",
                color: "#ffffff"
            });

            this.reviveButton.setInteractive({
                useHandCursor: true
            });
        }


        // ==========================================
        // SHOW UI
        // ==========================================

        this.overlay
            .setVisible(true)
            .setAlpha(0);

        this.title
            .setVisible(true)
            .setAlpha(0)
            .setScale(1.6);

        this.message
            .setVisible(true)
            .setAlpha(0);

        this.reviveInfo
            .setVisible(true)
            .setAlpha(0);

        this.reviveButton
            .setVisible(true)
            .setAlpha(0)
            .setScale(1);

        this.restartButton
            .setVisible(true)
            .setAlpha(0)
            .setScale(1);


        // ==========================================
        // OVERLAY FADE
        // ==========================================

        this.scene.tweens.add({

            targets: this.overlay,

            alpha: 0.72,

            duration: 350,

            ease: "Sine.Out"
        });


        // ==========================================
        // TITLE IMPACT
        // ==========================================

        this.scene.tweens.add({

            targets: this.title,

            alpha: 1,

            scale: 1,

            duration: 450,

            ease: "Back.Out",

            onStart: () => {

                this.scene.cameras.main.shake(
                    180,
                    0.007
                );
            }
        });


        // ==========================================
        // OTHER UI
        // ==========================================

        this.scene.tweens.add({

            targets: [
                this.message,
                this.reviveInfo,
                this.reviveButton,
                this.restartButton
            ],

            alpha: 1,

            duration: 350,

            delay: 300
        });
    }


    // ==============================================
    // REVIVE
    // ==============================================

    revive() {

        if (
            !this.isActive ||
            !this.player ||
            this.reviveUsed
        ) {

            return;
        }


        // Consume the run's revive immediately.
        this.reviveUsed = true;


        console.log(
            "KO SYSTEM: Reviving PunchDog"
        );

        console.log(
            "KO SYSTEM: Revive consumed for this run"
        );


        // ==========================================
        // CALCULATE REVIVE HP
        // ==========================================

        const reviveHealth =
            Math.max(
                1,
                Math.ceil(
                    this.player.maxHealth *
                    this.reviveHealthPercent
                )
            );


        this.player.health =
            reviveHealth;


        // ==========================================
        // RESET PLAYER STATE
        // ==========================================

        this.player.isDead = false;

        this.player.isHit = false;
        this.player.hitTimer = 0;

        this.player.isPunching = false;
        this.player.punchTimer = 0;

        this.player.isDodging = false;
        this.player.dodgeTimer = 0;

        this.player.isInvulnerable = true;


        // ==========================================
        // RE-ENABLE PHYSICS
        // ==========================================

        if (this.player.body) {

            this.player.body.enable = true;

            this.player.body.setVelocity(
                0,
                0
            );
        }


        // ==========================================
        // RESTORE SPRITE
        // ==========================================

        if (this.player.sprite) {

            this.player.sprite
                .setVisible(true);

            this.player.sprite
                .setAlpha(1);

            this.player.sprite
                .setAngle(0);

            this.player.sprite
                .clearTint();


            if (
                typeof this.player.baseScaleX ===
                    "number" &&
                typeof this.player.baseScaleY ===
                    "number"
            ) {

                this.player.sprite.setScale(
                    this.player.baseScaleX,
                    this.player.baseScaleY
                );
            }


            if (
                this.scene.anims.exists(
                    "punchdog-idle"
                )
            ) {

                this.player.sprite.play(
                    "punchdog-idle",
                    true
                );
            }
        }


        // ==========================================
        // TEMP REVIVE INVULNERABILITY
        // ==========================================

        this.player.sprite.setTint(
            0x66ffff
        );


        this.scene.time.delayedCall(
            this.reviveInvulnerabilityTime,
            () => {

                if (
                    !this.player ||
                    this.player.isDead
                ) {

                    return;
                }


                this.player.isInvulnerable =
                    false;


                if (
                    this.player.isPoweredUp
                ) {

                    this.player.sprite.setTint(
                        0xffcc33
                    );

                } else {

                    this.player.sprite.clearTint();
                }
            }
        );


        // ==========================================
        // RESET ENEMY ATTACKS
        // ==========================================

        if (
            Array.isArray(
                this.scene.enemies
            )
        ) {

            this.scene.enemies.forEach(
                enemy => {

                    if (
                        !enemy ||
                        enemy.isDead
                    ) {

                        return;
                    }


                    if (
                        enemy.body &&
                        enemy.body.enable
                    ) {

                        enemy.body.setVelocity(
                            0,
                            0
                        );
                    }


                    if (
                        "isAttacking" in enemy
                    ) {

                        enemy.isAttacking = false;
                    }


                    if (
                        "attackTimer" in enemy
                    ) {

                        enemy.attackTimer = 0;
                    }


                    if (
                        "attackHasHit" in enemy
                    ) {

                        enemy.attackHasHit = false;
                    }


                    if (
                        "attackCooldown" in enemy
                    ) {

                        enemy.attackCooldown = 45;
                    }


                    if (
                        typeof enemy.destroyTelegraph ===
                        "function"
                    ) {

                        enemy.destroyTelegraph();
                    }


                    if (
                        enemy.sprite &&
                        enemy.sprite.active
                    ) {

                        enemy.sprite.clearTint();

                        enemy.sprite.angle = 0;


                        if (
                            typeof enemy.baseScaleX ===
                                "number" &&
                            typeof enemy.baseScaleY ===
                                "number"
                        ) {

                            enemy.sprite.setScale(
                                enemy.baseScaleX,
                                enemy.baseScaleY
                            );
                        }
                    }
                }
            );
        }


        // ==========================================
        // REVIVE FEEDBACK
        // ==========================================

        const reviveText =
            this.scene.add.text(
                this.player.sprite.x,
                this.player.sprite.y - 85,
                "REVIVED!",
                {
                    fontFamily: "Arial Black",
                    fontSize: "28px",
                    color: "#66ffff",
                    stroke: "#000000",
                    strokeThickness: 6
                }
            );


        reviveText
            .setOrigin(0.5)
            .setDepth(4000);


        this.scene.tweens.add({

            targets: reviveText,

            y: reviveText.y - 40,

            alpha: 0,

            duration: 900,

            ease: "Cubic.Out",

            onComplete: () => {

                reviveText.destroy();
            }
        });


        // ==========================================
        // HIDE KO SCREEN / RESUME
        // ==========================================

        this.hideKOUI();

        this.isActive = false;
    }


    // ==============================================
    // HIDE KO UI
    // ==============================================

    hideKOUI() {

        this.scene.tweens.killTweensOf(
            this.overlay
        );

        this.scene.tweens.killTweensOf(
            this.title
        );

        this.scene.tweens.killTweensOf(
            this.message
        );

        this.scene.tweens.killTweensOf(
            this.reviveInfo
        );

        this.scene.tweens.killTweensOf(
            this.reviveButton
        );

        this.scene.tweens.killTweensOf(
            this.restartButton
        );


        this.overlay
            .setVisible(false)
            .setAlpha(0);

        this.title
            .setVisible(false)
            .setAlpha(0);

        this.message
            .setVisible(false)
            .setAlpha(0);

        this.reviveInfo
            .setVisible(false)
            .setAlpha(0);

        this.reviveButton
            .setVisible(false)
            .setAlpha(0)
            .setScale(1);

        this.restartButton
            .setVisible(false)
            .setAlpha(0)
            .setScale(1);
    }
}
