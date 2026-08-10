import HealthPickup from "../objects/HealthPickup.js";

export default class PickupSystem {

    // ==============================================
    // TEST SETTINGS
    // ==============================================

    // 1.0 = 100%
    // 0.5 = 50%
    // 0.25 = 25%
    static HEALTH_DROP_CHANCE = 1.0;

    static HEALTH_RESTORE_AMOUNT = 1;


    // ==============================================
    // ENEMY DROP TABLE
    // ==============================================

    static dropFromEnemy(
        scene,
        enemy
    ) {

        if (
            !scene ||
            !enemy ||
            !enemy.sprite
        ) {

            return;
        }

        const x =
            enemy.sprite.x;

        const y =
            enemy.sprite.y + 20;


        // ==========================================
        // HEALTH DROP
        // ==========================================

        const roll =
            Math.random();

        if (
            roll <=
            PickupSystem.HEALTH_DROP_CHANCE
        ) {

            PickupSystem.spawnHealth(
                scene,
                x,
                y
            );
        }
    }


    // ==============================================
    // SPAWN HEALTH
    // ==============================================

    static spawnHealth(
        scene,
        x,
        y
    ) {

        if (
            !scene.player
        ) {

            console.warn(
                "PickupSystem: scene.player not found."
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
}