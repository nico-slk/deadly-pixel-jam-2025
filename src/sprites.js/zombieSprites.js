const ZOMBIE_SPRITES = [
  {
    id: "zombie-walk",
    path: "./assets/Walk/PlayerWalk 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "zombie-death",
    path: "./assets/Death/PlayerDeath.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "zombie-falling",
    path: "./assets/Jump/player new jump 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
];

export const createZombieSprites = ({ load }) => {
  ZOMBIE_SPRITES.forEach(({ id, path, frameWidth, frameHeight }) => {
    load.spritesheet(id, path, {
      frameWidth,
      frameHeight,
    });
  });
};
