import Phaser from "phaser";

export default class CrowdSystem {

    static assignSlots(player, enemies) {

        const livingEnemies =
            enemies.filter(
                enemy =>
                    enemy &&
                    !enemy.isDead &&
                    enemy.sprite?.active
            );

        const count =
            livingEnemies.length;

        if (count === 0) {
            return;
        }

        const radius =
            count <= 2
                ? 135
                : 155;

        livingEnemies.forEach(
            (enemy, index) => {

                const angle =
                    Phaser.Math.DegToRad(
                        (360 / count) * index
                    );

                enemy.crowdTargetX =
                    player.sprite.x +
                    Math.cos(angle) *
                    radius;

                enemy.crowdTargetY =
                    player.sprite.y +
                    Math.sin(angle) *
                    radius;
            }
        );
    }


    static chooseAttackers(
        player,
        enemies,
        maxAttackers = 1
    ) {

        const candidates =
            enemies
                .filter(
                    enemy =>
                        enemy &&
                        !enemy.isDead &&
                        !enemy.isHit &&
                        enemy.sprite?.active
                )
                .sort(
                    (a, b) => {

                        const distanceA =
                            Phaser.Math.Distance.Between(
                                player.sprite.x,
                                player.sprite.y,
                                a.sprite.x,
                                a.sprite.y
                            );

                        const distanceB =
                            Phaser.Math.Distance.Between(
                                player.sprite.x,
                                player.sprite.y,
                                b.sprite.x,
                                b.sprite.y
                            );

                        return (
                            distanceA -
                            distanceB
                        );
                    }
                );

        enemies.forEach(
            enemy => {
                enemy.canAttack =
                    false;
            }
        );

        for (
            let i = 0;
            i <
            Math.min(
                maxAttackers,
                candidates.length
            );
            i++
        ) {

            candidates[i].canAttack =
                true;
        }
    }
}