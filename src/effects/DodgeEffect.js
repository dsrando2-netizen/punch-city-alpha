import Phaser from "phaser";
export default class DodgeEffect {

    static burst(scene, sprite) {

        // ------------------------------------------
        // Dust puffs
        // ------------------------------------------

        for (let i = 0; i < 5; i++) {

            const dust = scene.add.circle(
                sprite.x +
                    Phaser.Math.Between(-18, 18),

                sprite.y + 48 +
                    Phaser.Math.Between(-5, 8),

                Phaser.Math.Between(5, 10),

                0xd9d9d9,
                0.65
            );

            dust.setDepth(
                sprite.depth - 1
            );

            scene.tweens.add({

                targets: dust,

                x:
                    dust.x +
                    Phaser.Math.Between(-25, 25),

                y:
                    dust.y -
                    Phaser.Math.Between(8, 22),

                scale: 1.8,

                alpha: 0,

                duration:
                    Phaser.Math.Between(
                        180,
                        260
                    ),

                ease: "Cubic.Out",

                onComplete: () => {
                    dust.destroy();
                }
            });
        }
    }


    static afterImage(
        scene,
        sprite
    ) {

        const ghost = scene.add.image(
            sprite.x,
            sprite.y,
            sprite.texture.key,
            sprite.frame.name
        );

        ghost.setDisplaySize(
            sprite.displayWidth,
            sprite.displayHeight
        );

        ghost.setFlipX(
            sprite.flipX
        );

        ghost.setAngle(
            sprite.angle
        );

        ghost.setAlpha(
            0.28
        );

        ghost.setTint(
            0xff6666
        );

        ghost.setDepth(
            sprite.depth - 1
        );

        scene.tweens.add({

            targets: ghost,

            alpha: 0,

            scaleX:
                ghost.scaleX * 0.92,

            scaleY:
                ghost.scaleY * 0.92,

            duration: 140,

            ease: "Sine.Out",

            onComplete: () => {
                ghost.destroy();
            }
        });
    }
}