export default class HealthBar {

    constructor(scene, target) {

        this.scene = scene;
        this.target = target;

        this.maxHealth = target.health;

        this.width = 220;
        this.height = 22;

        this.x = 30;
        this.y = 30;

        // Keep HUD fixed to the camera
        this.graphics = scene.add.graphics();
        this.graphics.setScrollFactor(0);

        this.label = scene.add.text(
            this.x,
            this.y - 24,
            "BEAR HP",
            {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#ffffff"
            }
        );

        this.label.setScrollFactor(0);

        this.draw();
    }

    update() {
        this.draw();
    }

    draw() {

        this.graphics.clear();

        // Outer border
        this.graphics.fillStyle(0x111111);
        this.graphics.fillRect(
            this.x - 3,
            this.y - 3,
            this.width + 6,
            this.height + 6
        );

        // Empty bar
        this.graphics.fillStyle(0x555555);
        this.graphics.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        const healthPercent =
            Math.max(this.target.health, 0) / this.maxHealth;

        // Remaining HP
        this.graphics.fillStyle(0xe53935);
        this.graphics.fillRect(
            this.x,
            this.y,
            this.width * healthPercent,
            this.height
        );
    }

}