export default class HitSpark {

    constructor(scene, x, y) {

        const spark = scene.add.circle(
            x,
            y,
            10,
            0xffff00
        );

        scene.tweens.add({
            targets: spark,
            scale: 3,
            alpha: 0,
            duration: 150,
            onComplete: () => spark.destroy()
        });

    }

}