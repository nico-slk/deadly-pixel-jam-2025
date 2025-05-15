const ZOMBIE_ANIMATIONS = [
  {
    id: "zombie-walk",
    spriteSheet: "zombie-walk",
    frames: [0, 1, 2, 3, 4, 5, 6, 7],
    frameRate: 6,
    repeat: -1,
  },
  {
    id: "zombie-death",
    spriteSheet: "zombie-death",
    frames: [0, 1, 2, 3, 4, 5, 6, 7],
    frameRate: 6,
    repeat: 0,
  },
];

export const createZombieAnimation = ({ anims }) => {
  ZOMBIE_ANIMATIONS.forEach(
    ({ id, spriteSheet, frames, frameRate, repeat }) => {
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
    }
  );
};
