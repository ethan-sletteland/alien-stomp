import Phaser from "phaser";

import SpaceScene from "./scenes/SpaceScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [SpaceScene],
};

export default new Phaser.Game(config);
