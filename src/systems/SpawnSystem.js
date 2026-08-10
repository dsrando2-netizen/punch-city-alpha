import Bear from "../objects/Bear.js";

export default class SpawnSystem {

    static spawnBruiser(scene, x, y) {

        const enemy = new Bear(
            scene,
            x,
            y
        );

        return enemy;
    }

    static spawnWave(scene, waveNumber) {

        const enemies = [];

        // Wave 1
        if (waveNumber === 1) {

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    900,
                    600
                )
            );

        }

        // Wave 2
        else if (waveNumber === 2) {

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    850,
                    520
                )
            );

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    1050,
                    680
                )
            );

        }

        // Wave 3+
        else {

            const amount =
                Math.min(
                    2 + waveNumber,
                    6
                );

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                enemies.push(
                    SpawnSystem.spawnBruiser(
                        scene,
                        850 + (i * 120),
                        500 + ((i % 2) * 160)
                    )
                );
            }
        }

        return enemies;
    }
}