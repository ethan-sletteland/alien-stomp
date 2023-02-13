import { Tweens } from "phaser";
import SpaceScene from "../scenes/SpaceScene";

export default class CharacterController {
  sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpButton: Phaser.Input.Keyboard.Key;
  // private attackButton: Phaser.Input.Keyboard.Key;
  private jumping = false;
  private dead = false;
  // decided to go with squishing instead of a ray gun
  // private attacking = false;
  private speed = 150;
  stunned = false;
  private playerDamage: Phaser.Sound.BaseSound;
  private playerDeath: Phaser.Sound.BaseSound;
  tweens!: Phaser.Tweens.Tween;

  constructor(private scene: SpaceScene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "playersprite");
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.jumpButton = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    // this.attackButton = scene.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.E
    // );
    this.sprite.setBounce(0.2);
    this.sprite.body.setGravityY(300);
    this.sprite.setCollideWorldBounds(true);
    this.playerDamage = this.scene.sound.add("playerDamage");
    this.playerDeath = this.scene.sound.add("playerDeath");

    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNames("player-walk", {
        prefix: "p1_walk",
        start: 1,
        end: 9,
      }),
    });

    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNames("player", {
        prefix: "p1_front_",
        end: 1,
      }),
    });

    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNames("player", {
        prefix: "p1_jump_",
        end: 1,
      }),
    });

    // this.scene.anims.create({
    //   key: "attack",
    //   frames: this.scene.anims.generateFrameNumbers("player", {
    //     start: 5,
    //     end: 7,
    //   }),
    //   frameRate: 10,
    //   repeat: 0,
    // });

    this.scene.anims.create({
      key: "damage",
      frames: this.scene.anims.generateFrameNames("player", {
        prefix: "p1_hurt_",
        end: 1,
      }),
    });
  }

  update(_time: number, delta: number) {
    this.sprite.setVelocityX(0);

    if (this.cursors.left?.isDown) {
      this.sprite.setVelocityX(-this.speed);
      this.sprite.flipX = true;
      if (!this.jumping && !this.stunned) this.sprite.anims.play("run", true);
    } else if (this.cursors.right?.isDown) {
      this.sprite.setVelocityX(this.speed);
      this.sprite.flipX = false;
      if (!this.jumping && !this.stunned) this.sprite.anims.play("run", true);
    } else {
      if (!this.jumping && !this.stunned) this.sprite.anims.play("idle", true);
    }

    if (this.jumpButton.isDown && !this.jumping) {
      this.sprite.setVelocityY(-500);
      this.jumping = true;
      this.sprite.anims.play("jump", true);
    }

    if (this.sprite.body.onFloor()) {
      this.jumping = false;
    }
    // if (this.attackButton.isDown) {
    //   this.attacking = true;
    //   this.sprite.anims.play("attack");
    // } else {
    //   this.attacking = false;
    // }

    // if (this.dead) {
    //   this.sprite.alpha = this.sprite.alpha -= 0.1 * delta;
    // }
  }

  damage() {
    if (this.scene.hud.health <= 0 || this.stunned) return;
    this.playerDamage.play();
    this.stunned = true;
    this.sprite.setVelocityY(-200);
    this.sprite.anims.play("damage", true);
    this.scene.hud.health -= 1;

    window.setTimeout(() => {
      this.stunned = false;
    }, 1000);
    if (!this.scene.hud.health) {
      this.playerDeath.play();
      // const particles = this.scene.add.particles("red");
      // const emitter = particles.createEmitter({
      //   speed: 100,
      //   scale: { start: 1, end: 0 },
      //   blendMode: "ADD",
      // });
      // emitter.startFollow(this.sprite);
      this.dead = true;
      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        duration: 500,
        ease: "Linear",
      });

      window.setTimeout(() => {
        this.scene.physics.pause();
        this.scene.hud.gameOver();
      });
    }
  }

  startFollowingPlayer() {
    this.scene.cameras.main.startFollow(
      this.sprite,
      false,
      undefined,
      undefined,
      0,
      50
    );
  }
}
