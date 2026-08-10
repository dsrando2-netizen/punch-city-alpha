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

        const distance = Phaser.Math.Distance.Between(
            attacker.sprite.x,
            attacker.sprite.y,
            target.sprite.x,
            target.sprite.y
        );

        // Slightly more generous range for Bruiser Bear
        if (distance > 120) {
            return false;
        }

        if (typeof target.takeDamage !== "function") {
            return false;
        }

        target.takeDamage(1);

        // Impact point between PunchDog and the Bear's torso
        const hitX =
            Phaser.Math.Linear(
                attacker.sprite.x,
                target.sprite.x,
                0.72
            );

        const hitY =
            target.sprite.y - 30;

        new HitSpark(
            attacker.scene,
            hitX,
            hitY
        );

        // Heavy knockback
        CombatSystem.applyKnockback(
            attacker,
            target,
            310
        );

        // Camera impact
        attacker.scene.cameras.main.shake(
            90,
            0.006
        );

        // Punch sound
        if (
            attacker.scene.sound &&
            attacker.scene.cache.audio.exists("punch-hit")
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