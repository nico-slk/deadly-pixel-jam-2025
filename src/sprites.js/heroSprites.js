const HERO_SPRITES = [
  {
    id: "hero-idle",
    path: "./assets/Idle/idle_48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-jump",
    path: "./assets/Jump/jump_48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-run",
    path: "./assets/Run/player run 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-death",
    path: "./assets/Death/PlayerDeath.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-shot",
    path: "./assets/Shooting/player shoot 2H 48x48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-attack",
    path: "./assets/Katana Attack-Sheathe/player katana attack-sheathe 80x64.png",
    frameWidth: 80,
    frameHeight: 60,
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
