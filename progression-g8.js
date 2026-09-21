(() => {
  "use strict";

  const BASE_XP = 100;

  const MAX_LEVEL = 100;

  const REWARDS = {
    coins: [
      500,
      750,
      1000,
      1500,
      2000,
      2500,
      3000,
      4000,
      5000,
      7500
    ],

    crystals: [
      0,
      0,
      5,
      5,
      10,
      10,
      15,
      20,
      25,
      50
    ]
  };

  function getRequiredXP(level) {
    const currentLevel =
      Math.max(
        1,
        Number(level) || 1
      );

    /*
     * La experiencia necesaria
     * aumenta progresivamente.
     */
    return Math.floor(
      BASE_XP *
        Math.pow(
          1.12,
          currentLevel - 1
        )
    );
  }

  function getLevelProgress() {
    const save =
      SCORVEX_SAVE.load();

    const level =
      Math.max(
        1,
        Number(save.level) || 1
      );

    const xp =
      Math.max(
        0,
        Number(save.xp) || 0
      );

    const required =
      getRequiredXP(level);

    return {
      level,

      xp,

      required,

      percentage:
        Math.min(
          100,
          (xp / required) *
            100
        ),

      maxLevel:
        MAX_LEVEL
    };
  }

  function getRewardForLevel(level) {
    const index =
      (Math.max(
        1,
        Number(level) || 1
      ) - 1) %
      REWARDS.coins.length;

    return {
      coins:
        REWARDS.coins[index] || 0,

      crystals:
        REWARDS.crystals[index] || 0
    };
  }

  function applyLevelReward(save, level) {
    const reward =
      getRewardForLevel(level);

    save.coins =
      Math.max(
        0,
        Number(save.coins) || 0
      ) + reward.coins;

    save.crystals =
      Math.max(
        0,
        Number(save.crystals) || 0
      ) + reward.crystals;

    return reward;
  }

  function addXP(amount) {
    const save =
      SCORVEX_SAVE.load();

    let value =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (value <= 0) {
      return {
        gained: 0,
        levels: 0,
        level: save.level,
        rewards: []
      };
    }

    let level =
      Math.max(
        1,
        Number(save.level) || 1
      );

    let xp =
      Math.max(
        0,
        Number(save.xp) || 0
      );

    const rewards = [];

    /*
     * No permite pasar el nivel máximo.
     */
    if (level >= MAX_LEVEL) {
      save.level = MAX_LEVEL;
      save.xp = 0;

      SCORVEX_SAVE.save(save);

      return {
        gained: value,
        levels: 0,
        level: MAX_LEVEL,
        rewards
      };
    }

    while (
      value > 0 &&
      level < MAX_LEVEL
    ) {
      const required =
        getRequiredXP(level);

      const remaining =
        Math.max(
          0,
          required - xp
        );

      if (
        value < remaining
      ) {
        xp += value;
        value = 0;
        break;
      }

      value -= remaining;

      level++;

      xp = 0;

      const reward =
        applyLevelReward(
          save,
          level
        );

      rewards.push({
        level,
        ...reward
      });
    }

    save.level = level;
    save.xp =
      level >= MAX_LEVEL
        ? 0
        : xp;

    SCORVEX_SAVE.save(save);

    return {
      gained: Number(amount) || 0,

      levels:
        rewards.length,

      level,

      xp: save.xp,

      required:
        getRequiredXP(level),

      rewards
    };
  }

  function setXP(value) {
    const save =
      SCORVEX_SAVE.load();

    save.xp =
      Math.max(
        0,
        Number(value) || 0
      );

    const required =
      getRequiredXP(
        save.level
      );

    if (
      save.xp >= required
    ) {
      return addXP(0);
    }

    SCORVEX_SAVE.save(save);

    return getLevelProgress();
  }

  function setLevel(level) {
    const save =
      SCORVEX_SAVE.load();

    const newLevel =
      Math.max(
        1,
        Math.min(
          MAX_LEVEL,
          Math.floor(
            Number(level) || 1
          )
        )
      );

    save.level = newLevel;
    save.xp = 0;

    SCORVEX_SAVE.save(save);

    return getLevelProgress();
  }

  function getTotalXPForLevel(level) {
    let total = 0;

    const target =
      Math.max(
        1,
        Math.min(
          MAX_LEVEL,
          Math.floor(
            Number(level) || 1
          )
        )
      );

    for (
      let i = 1;
      i < target;
      i++
    ) {
      total +=
        getRequiredXP(i);
    }

    return total;
  }

  function getCurrentTotalXP() {
    const save =
      SCORVEX_SAVE.load();

    return (
      getTotalXPForLevel(
        save.level
      ) +
      Math.max(
        0,
        Number(save.xp) || 0
      )
    );
  }

  function getNextLevelXP() {
    const save =
      SCORVEX_SAVE.load();

    if (
      save.level >= MAX_LEVEL
    ) {
      return 0;
    }

    return getRequiredXP(
      save.level
    );
  }

  function getRewardPreview(level) {
    return getRewardForLevel(
      level
    );
  }

  function getMaxLevel() {
    return MAX_LEVEL;
  }

  function isMaxLevel() {
    const save =
      SCORVEX_SAVE.load();

    return (
      Number(save.level) >=
      MAX_LEVEL
    );
  }

  window.SCORVEX_PROGRESSION = {
    BASE_XP,

    MAX_LEVEL,

    rewards: REWARDS,

    getRequiredXP,

    getLevelProgress,

    getRewardForLevel,

    getRewardPreview,

    addXP,

    setXP,

    setLevel,

    getTotalXPForLevel,

    getCurrentTotalXP,

    getNextLevelXP,

    getMaxLevel,

    isMaxLevel
  };
})();
