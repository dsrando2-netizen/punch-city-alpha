import Phaser from "phaser";
export default class ResultsSystem {

    constructor(scene) {

        this.scene = scene;

        this.isShowing = false;

        // ==========================================
        // DARK PANEL
        // ==========================================

        this.panel =
            scene.add.rectangle(
                scene.scale.width / 2,
                scene.scale.height / 2,
                520,
                500,
                0x07131f,
                0.94
            );

        this.panel
            .setScrollFactor(0)
            .setDepth(6000)
            .setVisible(false);

        this.panel.setStrokeStyle(
            5,
            0xffd54a,
            1
        );


        // ==========================================
        // TITLE
        // ==========================================

        this.title =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 - 195,
                "STREET CLEARED!",
                {
                    fontFamily: "Arial Black",
                    fontSize: "42px",
                    color: "#ffd54a",
                    stroke: "#000000",
                    strokeThickness: 8
                }
            );

        this.title
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // SCORE LABEL
        // ==========================================

        this.scoreLabel =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 - 105,
                "SCORE",
                {
                    fontFamily: "Arial Black",
                    fontSize: "18px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.scoreLabel
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        this.scoreValue =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 - 72,
                "000000",
                {
                    fontFamily: "Arial Black",
                    fontSize: "34px",
                    color: "#ffd54a",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

        this.scoreValue
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // KO COUNT
        // ==========================================

        this.koText =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 - 5,
                "ENEMIES KO'D\n0",
                {
                    fontFamily: "Arial Black",
                    fontSize: "20px",
                    color: "#ffffff",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.koText
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // WAVES
        // ==========================================

        this.waveText =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 + 60,
                "WAVES CLEARED\n3 / 3",
                {
                    fontFamily: "Arial Black",
                    fontSize: "20px",
                    color: "#ffffff",
                    align: "center",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.waveText
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // RANK
        // ==========================================

        this.rankText =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 + 135,
                "RANK: C",
                {
                    fontFamily: "Arial Black",
                    fontSize: "32px",
                    color: "#66ffff",
                    stroke: "#000000",
                    strokeThickness: 6
                }
            );

        this.rankText
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // REPLAY
        // ==========================================

        this.replayText =
            scene.add.text(
                scene.scale.width / 2,
                scene.scale.height / 2 + 205,
                "PRESS R TO REPLAY",
                {
                    fontFamily: "Arial Black",
                    fontSize: "18px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.replayText
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(6001)
            .setVisible(false);


        // ==========================================
        // REPLAY KEY
        // ==========================================

        this.restartKey =
            scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.R
            );
    }


    // ==============================================
    // SHOW RESULTS
    // ==============================================

    show() {

        if (this.isShowing) {
            return;
        }

        this.isShowing = true;

        const score =
            this.scene.scoreSystem?.score ?? 0;

        const koCount =
            this.scene.scoreSystem?.koCount ?? 0;

        const currentWave =
            this.scene.currentWave ?? 0;

        const maxWave =
            this.scene.maxWave ?? 3;


        // ==========================================
        // RANK
        // ==========================================

        const rank =
            this.calculateRank(
                score
            );


        // ==========================================
        // SET VALUES
        // ==========================================

        this.scoreValue.setText(
            String(score).padStart(
                6,
                "0"
            )
        );

        this.koText.setText(
            `ENEMIES KO'D\n${koCount}`
        );

        this.waveText.setText(
            `WAVES CLEARED\n${currentWave} / ${maxWave}`
        );

        this.rankText.setText(
            `RANK: ${rank}`
        );


        // ==========================================
        // SHOW OBJECTS
        // ==========================================

        const objects = [
            this.panel,
            this.title,
            this.scoreLabel,
            this.scoreValue,
            this.koText,
            this.waveText,
            this.rankText,
            this.replayText
        ];


        objects.forEach(
            object => {

                object
                    .setVisible(true)
                    .setAlpha(0);
            }
        );


        this.panel.setScale(
            0.8
        );


        // ==========================================
        // PANEL INTRO
        // ==========================================

        this.scene.tweens.add({

            targets:
                this.panel,

            alpha:
                0.94,

            scale:
                1,

            duration:
                400,

            ease:
                "Back.Out"
        });


        // ==========================================
        // TEXT INTRO
        // ==========================================

        this.scene.tweens.add({

            targets: [
                this.title,
                this.scoreLabel,
                this.scoreValue,
                this.koText,
                this.waveText,
                this.rankText,
                this.replayText
            ],

            alpha:
                1,

            duration:
                400,

            delay:
                250
        });


        // ==========================================
        // TITLE PUNCH
        // ==========================================

        this.title.setScale(
            1.35
        );

        this.scene.tweens.add({

            targets:
                this.title,

            scale:
                1,

            duration:
                500,

            ease:
                "Back.Out"
        });


        // ==========================================
        // RANK POP
        // ==========================================

        this.rankText.setScale(
            0.3
        );

        this.scene.tweens.add({

            targets:
                this.rankText,

            scale:
                1,

            duration:
                650,

            delay:
                500,

            ease:
                "Back.Out"
        });


        console.log(
            "RESULTS:",
            {
                score,
                koCount,
                waves:
                    `${currentWave}/${maxWave}`,
                rank
            }
        );
    }


    // ==============================================
    // UPDATE
    // ==============================================

    update() {

        if (!this.isShowing) {
            return;
        }


        if (
            Phaser.Input.Keyboard.JustDown(
                this.restartKey
            )
        ) {

            this.scene.scene.restart();
        }
    }


    // ==============================================
    // CALCULATE RANK
    // ==============================================

    calculateRank(score) {

        // Current Alpha 0.5.3 encounter:
        // 6 Bruisers x 100 points = 600 max.

        if (score >= 600) {
            return "S";
        }

        if (score >= 500) {
            return "A";
        }

        if (score >= 300) {
            return "B";
        }

        return "C";
    }
}