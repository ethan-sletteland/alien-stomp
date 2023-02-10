import CharacterController from "./CharacterController";

export default class EnemyController {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  private velocityX: number;
  private direction: number;
  dead = false;
  enemyDeath: any;
  characterController: CharacterController;

  constructor(
    scene: Phaser.Scene,
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
        window.setTimeout(() => this.sprite.destroy(), 1000);
        // let's get a little bounce
        this.characterController.sprite.setVelocityY(-200);
        this.characterController.score += 10;
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
