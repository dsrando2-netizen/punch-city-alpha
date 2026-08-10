import Bear from "../objects/Bear.js";

export default class SpawnSystem {

    static spawnBruiser(scene, x, y) {

        return new Bear(
            scene,
            x,
            y
        );
    }


    static spawnWave(scene, waveNumber) {

        const enemies = [];

        // ==========================================
        // WAVE 1
        // ==========================================

        if (waveNumber === 1) {

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    900,
                    600
                )
            );
        }

        // ==========================================
        // WAVE 2
        // ==========================================

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

        // ==========================================
        // WAVE 3
        // ==========================================

        else if (waveNumber === 3) {

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    850,
                    500
                )
            );

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    1050,
                    600
                )
            );

            enemies.push(
                SpawnSystem.spawnBruiser(
                    scene,
                    850,
                    700
                )
            );
        }

        // ==========================================
        // WAVE 4+
        // ==========================================

        else {

            const amount =
                Math.min(
                    waveNumber,
                    6
                );

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                const row =
                    i % 3;

                const column =
                    Math.floor(i / 3);

                enemies.push(
                    SpawnSystem.spawnBruiser(
                        scene,

                        850 +
                            (column * 220),

                        480 +
                            (row * 120)
                    )
                );
            }
        }

        return enemies;
    }
}