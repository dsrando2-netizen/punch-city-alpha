import Phaser from "phaser";
import HitSpark from "../effects/HitSpark.js";

export default class CombatSystem {

    static punch(attacker, target) {

        if (!attacker || !target) {
            return false;
        }

        const distance = Phaser.Math.Distance.Between(
            attacker.sprite.x,
            attacker.sprite.y,
            target.sprite.x,
            target.sprite.y
        );

        if (distance > 95) {
            return false;
        }

        if (typeof target.takeDamage !== "function") {
            return false;
        }

        target.takeDamage(1);

        new HitSpark(
            attacker.scene,
            target.sprite.x,
            target.sprite.y
        );

        attacker.scene.cameras.main.shake(
            80,
            0.003
        );

        CombatSystem.applyKnockback(
            attacker,
            target,
            220
        );

        return true;
    }

    static applyKnockback(attacker, target, force) {

        const angle = Phaser.Math.Angle.Between(
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