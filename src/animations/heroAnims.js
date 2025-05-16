const HERO_ANIMATIONS = [
  {
    id: "hero-run",
    spriteSheet: "hero-run",
    frames: [0, 1, 2, 3, 4, 5, 6, 7],
    frameRate: 24,
    repeat: -1,
  },
  {
    id: "hero-jump",
    spriteSheet: "hero-jump",
    frames: [0, 1, 2, 3, 4, 5],
    frameRate: 6,
    repeat: 0,
  },
  {
    id: "hero-idle",
    spriteSheet: "hero-idle",
    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    frameRate: 6,
    repeat: -1,
  },
  {
    id: "hero-death",
    spriteSheet: "hero-death",
    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    frameRate: 6,
    repeat: 0,
  },
  {
    id: "hero-shot",
    spriteSheet: "hero-shot",
    frames: [2, 3, 4, 5, 6, 7, 8, 9],
    frameRate: 24,
    repeat: 0,
  },
];

export const createHeroAnimation = ({ anims }) => {
  HERO_ANIMATIONS.forEach(({ id, spriteSheet, frames, frameRate, repeat }) => {
    if (!anims.exists(id)) {
      anims.create({
        key: id,
        frames: anims.generateFrameNumbers(spriteSheet, {
          start: frames[0],
          end: frames[frames.length - 1],
        }),
        frameRate: frameRate || 12,
        repeat: repeat || 0,
      });
    }
  });
};
