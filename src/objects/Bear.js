import Phaser from "phaser";
import PickupSystem from "../systems/PickupSystem.js";

export default class Bear {
    constructor(scene, x, y) {
        this.scene = scene;

        this.sprite = scene.physics.add.image(x, y, "bruiser_bear");
        this.sprite.setDisplaySize(190, 190);

        this.body = this.sprite.body;
        this.body.setSize(85, 95);
        this.body.setOffset(52, 85);
        this.body.setCollideWorldBounds(true);

        this.baseScaleX = this.sprite.scaleX;
        this.baseScaleY = this.sprite.scaleY;

        this.speed = 120;
        this.repositionSpeed = 95;
        this.detectionRadius = 420;
        this.attackRange = 140;
        this.tooCloseRange = 100;

        this.crowdTargetX = x;
        this.crowdTargetY = y;
        this.canAttack = false;

        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.isHit = false;
        this.hitTimer = 0;
        this.isDead = false;
        this.hasDroppedLoot = false;

        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.attackHasHit = false;
        this.telegraphCircle = null;
    }

    update(player) {
        if (this.isDead) return;

        this.sprite.setFlipX(player.sprite.x < this.sprite.x);

        if (this.isHit) {
            this.hitTimer--;
            this.body.velocity.scale(0.76);

            if (Math.abs(this.body.velocity.x) < 8) this.body.setVelocityX(0);
            if (Math.abs(this.body.velocity.y) < 8) this.body.setVelocityY(0);

            if (this.hitTimer <= 0) {
                this.body.setVelocity(0, 0);
                this.isHit = false;
            }

            return;
        }

        if (this.isAttacking) {
            this.updateAttack(player);
            return;
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            player.sprite.x,
            player.sprite.y
        );

        if (
            this.canAttack &&
            distanceToPlayer <= this.attackRange &&
            this.attackCooldown <= 0 &&
            !player.isDead
        ) {
            this.startAttack();
            return;
        }

        const distanceToSlot = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            this.crowdTargetX,
            this.crowdTargetY
        );

        if (distanceToSlot > 18 && !player.isDead) {
            const direction = new Phaser.Math.Vector2(
                this.crowdTargetX - this.sprite.x,
                this.crowdTargetY - this.sprite.y
            ).normalize();

            this.body.setVelocity(
                direction.x * this.repositionSpeed,
                direction.y * this.repositionSpeed
            );

            return;
        }

        this.body.setVelocity(0, 0);
    }

    startAttack() {
        this.isAttacking = true;
        this.attackTimer = 38;
        this.attackHasHit = false;
        this.body.setVelocity(0, 0);

        this.telegraphCircle = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y + 42,
            35
        );

        this.telegraphCircle
            .setStrokeStyle(5, 0xff8c00, 0.9)
            .setDepth(this.sprite.depth - 1);

        this.scene.tweens.add({
            targets: this.telegraphCircle,
            scale: 1.7,
            alpha: 0,
            duration: 300,
            repeat: 1,
            ease: "Sine.Out"
        });
    }

    updateAttack(player) {
        this.attackTimer--;

        const direction = player.sprite.x < this.sprite.x ? -1 : 1;

        if (this.attackTimer > 20) {
            this.body.setVelocity(0, 0);

            if (Math.floor(this.attackTimer / 3) % 2 === 0) {
                this.sprite.setTint(0xff9d24);
            } else {
                this.sprite.clearTint();
            }

            this.sprite.setScale(
                this.baseScaleX * 1.08,
                this.baseScaleY * 0.92
            );

            this.sprite.angle = -direction * 6;
        }
        else if (this.attackTimer > 11) {
            this.sprite.clearTint();
            this.destroyTelegraph();

            this.sprite.setScale(
                this.baseScaleX * 1.10,
                this.baseScaleY * 0.96
            );

            this.sprite.angle = direction * 8;
            this.body.setVelocityX(direction * 65);

            if (!this.attackHasHit) {
                const hitDX = Math.abs(this.sprite.x - player.sprite.x);
                const hitDY = Math.abs(this.sprite.y - player.sprite.y);

                if (hitDX <= 145 && hitDY <= 90) {
                    const hit = player.takeDamage(1, this);
                    this.attackHasHit = true;

                    if (
                        hit !== false &&
                        this.scene.cache.audio.exists("punch-hit")
                    ) {
                        this.scene.sound.play("punch-hit", {
                            volume: 0.8,
                            rate: 0.72
                        });
                    }
                }
            }
        }
        else {
            this.sprite.clearTint();
            this.body.setVelocity(0, 0);

            this.sprite.angle = Phaser.Math.Linear(
                this.sprite.angle,
                0,
                0.30
            );

            this.sprite.setScale(
                Phaser.Math.Linear(
                    this.sprite.scaleX,
                    this.baseScaleX,
                    0.30
                ),
                Phaser.Math.Linear(
                    this.sprite.scaleY,
                    this.baseScaleY,
                    0.30
                )
            );
        }

        if (this.attackTimer <= 0) {
            this.body.setVelocity(0, 0);
            this.sprite.clearTint();
            this.sprite.angle = 0;
            this.sprite.setScale(this.baseScaleX, this.baseScaleY);
            this.destroyTelegraph();

            this.isAttacking = false;
            this.attackCooldown = 60;
        }
    }

    takeDamage(amount) {
        if (this.isDead || this.isHit) return;

        if (this.isAttacking) {
            this.isAttacking = false;
            this.attackTimer = 0;
            this.attackHasHit = false;
            this.destroyTelegraph();

            this.body.setVelocity(0, 0);
            this.sprite.clearTint();
            this.sprite.angle = 0;
            this.sprite.setScale(this.baseScaleX, this.baseScaleY);
        }

        this.health = Math.max(0, this.health - amount);
        this.isHit = true;
        this.hitTimer = 14;

        this.sprite.setTint(0xff3b3b);

        this.scene.time.delayedCall(110, () => {
            if (!this.isDead && !this.isAttacking) {
                this.sprite.clearTint();
            }
        });

        console.log("Bruiser Bear HP:", this.health);

        if (this.health <= 0) {
            if (!this.hasDroppedLoot) {
                this.hasDroppedLoot = true;

                console.log(
                    "Bruiser defeated - spawning pickups"
                );

                PickupSystem.dropFromEnemy(
                    this.scene,
                    this
                );
            }

            this.die();
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.isAttacking = false;
        this.canAttack = false;

        this.destroyTelegraph();

        this.sprite.clearTint();
        this.body.setVelocity(0, 0);
        this.body.enable = false;

        const fallDirection = this.sprite.flipX ? 1 : -1;

        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + (65 * fallDirection),
            y: this.sprite.y + 24,
            angle: 78 * fallDirection,
            duration: 320,
            ease: "Cubic.Out",

            onComplete: () => {
                this.scene.cameras.main.shake(110, 0.005);

                this.scene.tweens.add({
                    targets: this.sprite,
                    y: this.sprite.y - 7,
                    duration: 90,
                    yoyo: true,
                    ease: "Quad.Out",

                    onComplete: () => {
                        this.sprite.setTint(0x888888);

                        this.scene.time.delayedCall(1700, () => {
                            if (!this.sprite || !this.sprite.active) return;

                            this.scene.tweens.add({
                                targets: this.sprite,
                                alpha: 0,
                                duration: 500,
                                ease: "Sine.In",

                                onComplete: () => {
                                    if (this.sprite && this.sprite.active) {
                                        this.sprite.destroy();
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    destroyTelegraph() {
        if (
            this.telegraphCircle &&
            this.telegraphCircle.active
        ) {
            this.telegraphCircle.destroy();
        }

        this.telegraphCircle = null;
    }
}
