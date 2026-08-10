export default class AnimationSystem {

    static create(scene) {

        if (!scene.anims.exists("punchdog-idle")) {

            scene.anims.create({
                key: "punchdog-idle",

                frames: scene.anims.generateFrameNumbers(
                    "punchdog_idle_autosprite",
                    {
                        start: 0,
                        end: 22
                    }
                ),

                frameRate: 12,
                repeat: -1
            });

        }

        if (!scene.anims.exists("punchdog-walk")) {

            scene.anims.create({
                key: "punchdog-walk",

                frames: scene.anims.generateFrameNumbers(
                    "punchdog_walk_autosprite",
                    {
                        start: 0,
                        end: 24
                    }
                ),

                frameRate: 16,
                repeat: -1
            });

        }

    }

}