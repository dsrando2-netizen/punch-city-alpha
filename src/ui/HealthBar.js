export default class HealthBar {

    constructor(scene, target, options = {}) {

        this.scene = scene;
        this.target = target;

        this.x = options.x ?? 24;
        this.y = options.y ?? 24;

        this.width = options.width ?? 220;
        this.height = options.height ?? 20;

        this.label = options.label ?? "HP";

        this.alignRight =
            options.alignRight ?? false;

        this.container =
            scene.add.container(
                this.x,
                this.y
            );

        this.container.setScrollFactor(0);
        this.container.setDepth(1000);

        this.labelText =
            scene.add.text(
                0,
                -24,
                this.label,
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 4
                }
            );

        this.background =
            scene.add.rectangle(
                0,
                0,
                this.width,
                this.height,
                0x222222
            );

        this.background.setOrigin(
            0,
            0.5
        );

        this.fill =
            scene.add.rectangle(
                2,
                0,
                this.width - 4,
                this.height - 4,
                0x36d65c
            );

        this.fill.setOrigin(
            0,
            0.5
        );

        this.container.add([
            this.labelText,
            this.background,
            this.fill
        ]);
    }

    update() {

        if (
            !this.target ||
            typeof this.target.health !== "number"
        ) {
            return;
        }

        const ratio =
            Math.max(
                0,
                Math.min(
                    1,
                    this.target.health /
                    this.target.maxHealth
                )
            );

        this.fill.width =
            (this.width - 4) * ratio;

        if (ratio > 0.6) {

            this.fill.setFillStyle(
                0x36d65c
            );

        } else if (ratio > 0.3) {

            this.fill.setFillStyle(
                0xf0c52f
            );

        } else {

            this.fill.setFillStyle(
                0xe33b3b
            );
        }
    }
}