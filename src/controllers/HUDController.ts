import SpaceScene from "../scenes/SpaceScene";

export class HUDController {
  private _health = 10;
  public get health() {
    return this._health;
  }
  public set health(value) {
    this._health = value;
  }
  private _score = 0;
  public get score() {
    return this._score;
  }
  public set score(value) {
    this._score = value;
  }
  private healthText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private xOffset = 300;
  private yOffset = 32;

  constructor(private scene: SpaceScene, x: number, y: number) {
    this.healthText = this.scene.add
      .text(x, y, `health: ${this.health}`, {
        fontSize: "32px",
        color: "red",
      })
      .setDepth(1);
    this.scoreText = this.scene.add
      .text(x, y + 32, `score: ${this.score}`, {
        fontSize: "32px",
        color: "red",
      })
      .setDepth(1);
  }

  update() {
    this.healthText.setText(`health: ${this.health}`);
    this.scoreText.setText(`score: ${this.score}`);
    this.healthText.x =
      this.scene.characterController.sprite.body.x - this.xOffset;
    this.healthText.y =
      this.scene.characterController.sprite.body.y - this.xOffset;
    this.scoreText.x =
      this.scene.characterController.sprite.body.x - this.xOffset;
    this.scoreText.y =
      this.scene.characterController.sprite.body.y -
      this.xOffset +
      this.yOffset;
  }

  gameOver() {
    // Create a text object for the reset button
    const resetText = this.scene.add.text(
      this.scoreText.x,
      this.scoreText.y + this.yOffset,
      "RESET",
      {
        font: "24px Arial",
        color: "#ffffff",
      }
    );
    resetText.setInteractive({ useHandCursor: true });

    // Add a pointerdown event listener to the reset button
    resetText.on("pointerdown", () => {
      this.scene.music.stop();
      this.scene.scene.restart();
    });
  }
}
