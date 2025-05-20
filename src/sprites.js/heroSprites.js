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
    path: "./assets/Run/run_48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-death",
    path: "./assets/Death/death_48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-shot",
    path: "./assets/Shooting/shooting_48.png",
    frameWidth: 48,
    frameHeight: 48,
  },
  {
    id: "hero-attack",
    path: "./assets/Katana Attack-Sheathe/katana_80x64.png",
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
