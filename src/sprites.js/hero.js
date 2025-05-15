const HERO_SPRITES = [
  {
    id: "hero-idle",
    path: "./assets/Idle/Player Idle 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-jump",
    path: "./assets/Jump/player jump left 48x48-sheet.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-walk",
    path: "./assets/Walk/PlayerWalk 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-death",
    path: "./assets/Death/Player Death 64x64.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-shot",
    path: "./assets/Shooting/player shoot 2H 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
];

export const createHeroSprites = ({ load }) => {
  HERO_SPRITES.forEach(({ id, path, frameWidth, frameHeight }) => {
    load.spritesheet(id, path, {
      frameWidth,
      frameHeight,
    });
  });
};
