import Phaser from "phaser";
import HitSpark from "../effects/HitSpark.js";

export default class CombatSystem {

    static punch(attacker, target) {

        if (!attacker || !target) {
            return false;
        }

        if (target.isDead) {
            return false;
        }

        const dx = Math.abs(
            attacker.sprite.x -
            target.sprite.x
        );

        const dy = Math.abs(
            attacker.sprite.y -
            target.sprite.y
        );

        // Beat-'em-up style attack range.
        // Allows punching from natural spacing
        // without needing to overlap the Bear.
        const horizontalRange = 135;
        const verticalRange = 85;

        if (
            dx > horizontalRange ||
            dy > verticalRange
        ) {
            return false;
        }

        if (
            typeof target.takeDamage !==
            "function"
        ) {
            return false;
        }

        target.takeDamage(1);

        // Place the spark around Bruiser Bear's torso.
        const hitX =
            Phaser.Math.Linear(
                attacker.sprite.x,
                target.sprite.x,
                0.7
            );

        const hitY =
            target.sprite.y - 25;

        new HitSpark(
            attacker.scene,
            hitX,
            hitY
        );

        CombatSystem.applyKnockback(
            attacker,
            target,
            235
        );

        attacker.scene.cameras.main.shake(
            75,
            0.0045
        );

        if (
            attacker.scene.sound &&
            attacker.scene.cache.audio.exists(
                "punch-hit"
            )
        ) {

            attacker.scene.sound.play(
                "punch-hit",
                {
                    volume: 0.65
                }
            );
        }

        return true;
    }

    static applyKnockback(
        attacker,
        target,
        force
    ) {

        const angle =
            Phaser.Math.Angle.Between(
                attacker.sprite.x,
                attacker.sprite.y,
                target.sprite.x,
                target.sprite.y
            );

        target.body.setVelocity(
            Math.cos(angle) * force,
            Math.sin(angle) * force
        );
    }
}