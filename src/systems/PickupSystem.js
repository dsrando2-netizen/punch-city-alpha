import HealthPickup from "../objects/HealthPickup.js";
import PowerPickup from "../objects/PowerPickup.js";

export default class PickupSystem {

    // ==============================================
    // REAL DROP RATES
    // ==============================================

    static HEALTH_DROP_CHANCE = 0.30;
    static POWER_DROP_CHANCE = 0.20;

    // Remaining 50% = no drop.

    static HEALTH_RESTORE_AMOUNT = 1;
    static POWER_DURATION = 8000;


    // ==============================================
    // DROP FROM ENEMY
    // ==============================================

    static dropFromEnemy(scene, enemy) {

        if (
            !scene ||
            !enemy ||
            !enemy.sprite
        ) {
            return null;
        }

        const x = enemy.sprite.x;
        const y = enemy.sprite.y + 20;

        const roll = Math.random();

        // ------------------------------------------
        // HEALTH
        // ------------------------------------------

        if (
            roll <
            PickupSystem.HEALTH_DROP_CHANCE
        ) {

            console.log("DROP: Health");

            return PickupSystem.spawnHealth(
                scene,
                x,
                y
            );
        }

        // ------------------------------------------
        // POWER
        // ------------------------------------------

        if (
            roll <
            PickupSystem.HEALTH_DROP_CHANCE +
            PickupSystem.POWER_DROP_CHANCE
        ) {

            console.log("DROP: Power");

            return PickupSystem.spawnPower(
                scene,
                x,
                y
            );
        }

        // ------------------------------------------
        // NOTHING
        // ------------------------------------------

        console.log("DROP: Nothing");

        return null;
    }


    // ==============================================
    // SPAWN HEALTH
    // ==============================================

    static spawnHealth(scene, x, y) {

        if (!scene.player) {

            console.warn(
                "PickupSystem: scene.player missing."
            );

            return null;
        }

        return new HealthPickup(
            scene,
            x,
            y,
            scene.player,
            PickupSystem.HEALTH_RESTORE_AMOUNT
        );
    }


    // ==============================================
    // SPAWN POWER
    // ==============================================

    static spawnPower(scene, x, y) {

        if (!scene.player) {

            console.warn(
                "PickupSystem: scene.player missing."
            );

            return null;
        }

        return new PowerPickup(
            scene,
            x,
            y,
            scene.player,
            PickupSystem.POWER_DURATION
        );
    }
}
