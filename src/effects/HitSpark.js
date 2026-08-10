export default class HitSpark {

    constructor(scene, x, y) {

        const spark = scene.add.circle(
            x,
            y,
            12,
            0xfff36b
        );

        spark.setDepth(100);

        scene.tweens.add({
            targets: spark,

            scaleX: 3.2,
            scaleY: 1.8,

            alpha: 0,

            duration: 120,

            ease: "Cubic.Out",

            onComplete: () => {
                spark.destroy();
            }
        });

        // Small secondary impact ring
        const ring = scene.add.circle(
            x,
            y,
            18
        );

        ring.setStrokeStyle(
            4,
            0xffffff
        );

        ring.setDepth(99);

        scene.tweens.add({
            targets: ring,

            scale: 2,

            alpha: 0,

            duration: 150,

            ease: "Cubic.Out",

            onComplete: () => {
                ring.destroy();
            }
        });
    }
}