import Phaser from "phaser";

export default class AISystem {

    static chase(enemy, target, speed) {

        enemy.scene.physics.moveToObject(
            enemy.sprite,
            target.sprite,
            speed
        );

    }

    static stop(enemy) {

        enemy.body.setVelocity(0);

    }

}