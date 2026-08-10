import Phaser from "phaser";

export default class CombatSystem {

    static punch(attacker, target) {

        if (!attacker || !target) return false;

        const distance = Phaser.Math.Distance.Between(
            attacker.sprite.x,
            attacker.sprite.y,
            target.sprite.x,
            target.sprite.y
        );

        // Punch range
        if (distance > 95) {
            return false;
        }

        // Make sure the enemy can receive damage
        if (typeof target.takeDamage !== "function") {
            return false;
        }

        target.takeDamage(1);

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