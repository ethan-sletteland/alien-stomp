import Phaser from "phaser";
import CharacterController from "../controllers/CharacterController";
import EnemyController from "../controllers/EnemyController";
import { HUDController } from "../controllers/HUDController";

export default class SpaceScene extends Phaser.Scene {
  characterController!: CharacterController;
  enemyControllers!: EnemyController[];
  ground!: Phaser.Physics.Arcade.StaticGroup;
  enemyDeath!: Phaser.Sound.BaseSound;
  playerDamage!: Phaser.Sound.BaseSound;
  playerDeath!: Phaser.Sound.BaseSound;
  hud!: HUDController;
  music!: Phaser.Sound.BaseSound;

  constructor() {
    super("space-scene");
  }

  preload() {
    // this.load.setBaseURL("http://localhost:8000/");
    this.load.atlasXML(
      "mysprites",
      "images/platformerGraphicsDeluxe_Updated/Tiles/tiles_spritesheet.png",
      "images/platformerGraphicsDeluxe_Updated/Tiles/tiles_spritesheet.xml"
    );
    this.load.atlas(
      "enemies",
      "images/platformerGraphicsDeluxe_Updated/Enemies/spritesheet.png",
      "images/platformerGraphicsDeluxe_Updated/Enemies/sprites.json"
    );
    this.load.atlas(
      "player",
      "images/player-spritesheet.png",
      "images/player-sprites.json"
    );
    this.load.atlas(
      "player-walk",
      "images/player-walk-spritesheet.png",
      "images/player-walk-sprites.json"
    );
    this.load.image("playersprite", "images/p1_stand.png");
    this.load.image("sky", "images/space3.png");
    this.load.image("red", "images/red.png");

    this.load.audio("theme", [
      "sound/Juhani Junkala [Retro Game Music Pack] Level 1.wav",
    ]);

    this.load.audio("enemyDeath", [
      "sound/effects/Death Screams/Alien/sfx_deathscream_alien2.wav",
    ]);

    this.load.audio("playerDamage", [
      "sound/effects/Death Screams/Human/sfx_deathscream_human4.wav",
    ]);

    this.load.audio("playerDeath", [
      "sound/effects/Explosions/Odd/sfx_exp_odd6.wav",
    ]);
  }

  create() {
    this.music = this.sound.add("theme");
    this.music.play({ loop: true, volume: 0.7 });

    this.enemyControllers = [];
    this.add.image(400, 300, "sky");

    this.characterController = new CharacterController(this, 100, 100);
    this.characterController.startFollowingPlayer();

    this.hud = new HUDController(this, 16, 16);

    this.ground = this.physics.add.staticGroup();
    for (let i = 0; i <= 12; i += 1) {
      this.ground.create(i * 70, 600, "mysprites", "dirt.png");
    }
    this.physics.add.collider(this.characterController.sprite, this.ground);

    const boxes = this.physics.add.staticGroup();
    boxes.create(200, 300, "mysprites", "boxCoin.png");
    boxes.create(400, 300, "mysprites", "boxCoin.png");
    boxes.create(600, 300, "mysprites", "boxCoin.png");
    this.physics.add.collider(this.characterController.sprite, boxes);

    const enemiesX = [200, 500, 700];
    enemiesX.forEach((e, i) => {
      this.enemyControllers.push(
        new EnemyController(this, e, 500, this.characterController)
      );
      this.physics.add.collider(this.enemyControllers[i].sprite, this.ground);
    });
  }

  update(time: number, delta: number) {
    this.characterController.update();
    this.hud.update();
    this.enemyControllers.forEach((e) => e.update(time, delta));
    if (this.enemyControllers.filter((e) => !e.dead).length < 3) {
      // spawn on random edge
      const spawn = Date.now() % 2 === 1 ? 10 : 700;
      const newEnemy = new EnemyController(
        this,
        spawn,
        400,
        this.characterController
      );
      this.enemyControllers.push(newEnemy);
      this.physics.add.collider(newEnemy.sprite, this.ground);
    }
  }
}
