export default class ScoreSystem {

    constructor(scene) {

        this.scene = scene;

        this.score = 0;
        this.koCount = 0;

        // ==========================================
        // SCORE HUD
        // ==========================================

        this.scoreText =
            scene.add.text(
                scene.scale.width - 24,
                28,
                "SCORE: 000000",
                {
                    fontFamily: "Arial Black",
                    fontSize: "22px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );

        this.scoreText
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1200);


        // ==========================================
        // KO HUD
        // ==========================================

        this.koText =
            scene.add.text(
                scene.scale.width - 24,
                60,
                "KOs: 0",
                {
                    fontFamily: "Arial Black",
                    fontSize: "18px",
                    color: "#ffd54a",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.koText
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(1200);


        // ==========================================
        // LISTEN FOR ENEMY KO EVENTS
        // ==========================================

        scene.events.on(
            "enemy-ko",
            this.handleEnemyKO,
            this
        );


        // Clean listener when scene shuts down.
        scene.events.once(
            "shutdown",
            () => {

                scene.events.off(
                    "enemy-ko",
                    this.handleEnemyKO,
                    this
                );
            }
        );
    }


    // ==============================================
    // ENEMY KO
    // ==============================================

    handleEnemyKO(data = {}) {

        const points =
            typeof data.points === "number"
                ? data.points
                : 100;

        this.score += points;
        this.koCount++;

        console.log(
            `SCORE SYSTEM: +${points} points`
        );

        console.log(
            `SCORE SYSTEM: ${this.koCount} total KOs`
        );

        this.updateHUD();

        this.showScorePopup(
            data.x,
            data.y,
            points
        );
    }


    // ==============================================
    // UPDATE HUD
    // ==============================================

    updateHUD() {

        this.scoreText.setText(
            `SCORE: ${String(this.score).padStart(6, "0")}`
        );

        this.koText.setText(
            `KOs: ${this.koCount}`
        );


        // Brief score punch animation.
        this.scene.tweens.killTweensOf(
            this.scoreText
        );

        this.scoreText.setScale(
            1.15
        );

        this.scene.tweens.add({

            targets:
                this.scoreText,

            scale:
                1,

            duration:
                180,

            ease:
                "Back.Out"
        });
    }


    // ==============================================
    // SCORE POPUP
    // ==============================================

    showScorePopup(
        x,
        y,
        points
    ) {

        if (
            typeof x !== "number" ||
            typeof y !== "number"
        ) {

            return;
        }


        const popup =
            this.scene.add.text(
                x,
                y - 75,
                `+${points}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: "22px",
                    color: "#ffd54a",
                    stroke: "#000000",
                    strokeThickness: 5
                }
            );


        popup
            .setOrigin(0.5)
            .setDepth(1500);


        this.scene.tweens.add({

            targets:
                popup,

            y:
                popup.y - 40,

            alpha:
                0,

            scale:
                1.25,

            duration:
                700,

            ease:
                "Cubic.Out",

            onComplete:
                () => {

                    popup.destroy();
                }
        });
    }
}