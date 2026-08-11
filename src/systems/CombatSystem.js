import Phaser from "phaser";
import HitSpark from "../effects/HitSpark.js";

export default class CombatSystem {

    static punch(
        attacker,
        target
    ) {

        if (
            !attacker ||
            !target
        ) {

            return false;
        }

        if (
            target.isDead
        ) {

            return false;
        }

        const dx =
            Math.abs(
                attacker.sprite.x -
                target.sprite.x
            );

        const dy =
            Math.abs(
                attacker.sprite.y -
                target.sprite.y
            );


        // ==========================================
        // ATTACK RANGE
        // ==========================================

        const horizontalRange =
            135;

        const verticalRange =
            85;


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


        // ==========================================
        // DAMAGE
        // ==========================================

        const multiplier =
            typeof attacker.damageMultiplier ===
            "number"
                ? attacker.damageMultiplier
                : 1;


        const damage =
            Math.max(
                1,
                Math.round(
                    1 * multiplier
                )
            );


        target.takeDamage(
            damage
        );


        console.log(
            `PunchDog Damage: ${damage}`
        );


        // ==========================================
        // HIT SPARK
        // ==========================================

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


        // ==========================================
        // KNOCKBACK
        // ==========================================

        const knockbackForce =
            multiplier > 1
                ? 300
                : 235;


        CombatSystem.applyKnockback(

            attacker,

            target,

            knockbackForce
        );


        // ==========================================
        // CAMERA SHAKE
        // ==========================================

        attacker.scene.cameras.main.shake(

            multiplier > 1
                ? 105
                : 75,

            multiplier > 1
                ? 0.006
                : 0.0045
        );


        // ==========================================
        // HIT SOUND
        // ==========================================

        if (
            attacker.scene.sound &&
            attacker.scene.cache.audio.exists(
                "punch-hit"
            )
        ) {

            attacker.scene.sound.play(

                "punch-hit",

                {
                    volume:
                        multiplier > 1
                            ? 0.85
                            : 0.65,

                    rate:
                        multiplier > 1
                            ? 0.85
                            : 1
                }
            );
        }


        return true;
    }


    // ==============================================
    // KNOCKBACK
    // ==============================================

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

            Math.cos(angle) *
                force,

            Math.sin(angle) *
                force
        );
    }
}