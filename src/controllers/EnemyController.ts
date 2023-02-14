import SpaceScene from "../scenes/SpaceScene";
import CharacterController from "./CharacterController";

export default class EnemyController {
  private scene: SpaceScene;
  private velocityX: number;
  private direction: number;
  private enemyDeath: Phaser.Sound.BaseSound;
  private characterController: CharacterController;
  sprite: Phaser.GameObjects.Sprite;
  dead = false;

  constructor(
    scene: SpaceScene,
    x: number,
    y: number,
    characterController: CharacterController
  ) {
    this.scene = scene;
    this.characterController = characterController;
    this.sprite = scene.physics.add.sprite(x, y, "enemies", "slimeWalk1");
    this.sprite.setOrigin(0, 0);
    this.velocityX = 0.09;
    this.direction = 1;
    this.enemyDeath = this.scene.sound.add("enemyDeath");
  }

  update(_time: number, delta: number) {
    this.sprite.x += this.velocityX * delta * this.direction;
    this.sprite.flipX = this.direction === 1 ? true : false;

    if (this.dead) return;
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.characterController.sprite.getBounds(),
        this.sprite.getBounds()
      )
    ) {
      // Check if the player is above the enemy
      if (
        this.characterController.sprite.y < this.sprite.y - 20 &&
        !this.characterController.stunned
      ) {
        this.enemyDeath.play();
        this.dead = true;
        this.velocityX = 0;
        this.sprite.y = this.sprite.y + 10;
        this.sprite.setFrame("slimeDead");
        // let's get a little bounce
        this.characterController.sprite.setVelocityY(-200);
        this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0,
          duration: 2000,
          ease: "Linear",
          onComplete: () => {
            this.sprite.destroy();
          },
        });

        this.scene.hud.score += 10;
      } else {
        this.characterController.damage();
      }
    }

    // Check if the enemy has reached the edge of the screen
    if (this.sprite.x > this.scene.sys.canvas.width || this.sprite.x < 0) {
      this.direction *= -1;
    }
  }
}
