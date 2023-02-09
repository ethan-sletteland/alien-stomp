export default class EnemyController {
  scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Sprite;
  private velocityX: number;
  private direction: number;
  dead = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "enemies", "slimeWalk1");
    this.sprite.setOrigin(0, 0);
    this.velocityX = 0.09;
    this.direction = 1;
  }

  update(time: number, delta: number) {
    this.sprite.x += this.velocityX * delta * this.direction;
    this.sprite.flipX = this.direction === 1 ? true : false;

    // Check if the enemy has reached the edge of the screen
    if (this.sprite.x > this.scene.sys.canvas.width || this.sprite.x < 0) {
      this.direction *= -1;
    }
  }
}
