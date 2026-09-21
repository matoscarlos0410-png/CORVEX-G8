(() => {
  "use strict";

  const BOSSES = {
    titan: {
      id: "titan",
      name: "TITAN-X",
      description: "Jefe pesado con gran resistencia.",
      hp: 5000,
      damage: 75,
      speed: 0.7,
      range: 420,
      rate: 1200,
      radius: 58,
      reward: 15000,
      xp: 1500,
      phases: 3,
      color: "#ff5252",
      armor: 25,
      behavior: "tank"
    },

    overlord: {
      id: "overlord",
      name: "OVERLORD",
      description: "Comandante de las unidades avanzadas.",
      hp: 8500,
      damage: 95,
      speed: 1,
      range: 500,
      rate: 950,
      radius: 68,
      reward: 28000,
      xp: 3000,
      phases: 4,
      color: "#c77dff",
      armor: 35,
      behavior: "ranged"
    },

    omega: {
      id: "omega",
      name: "OMEGA CORE",
      description: "El jefe definitivo del núcleo Omega.",
      hp: 15000,
      damage: 130,
      speed: 1.2,
      range: 650,
      rate: 700,
      radius: 80,
      reward: 50000,
      xp: 6000,
      phases: 5,
      color: "#ffd54f",
      armor: 50,
      behavior: "orbit"
    }
  };

  function create(id = "titan", options = {}) {
    const base =
      BOSSES[id] ||
      BOSSES.titan;

    const boss = {
      ...base,
      ...options,

      id:
        options.instanceId ||
        "boss_" +
          Math.random()
            .toString(36)
            .slice(2),

      bossType: base.id,

      isBoss: true,

      maxHp:
        options.maxHp ??
        options.hp ??
        base.hp,

      hp:
        options.hp ??
        base.hp,

      alive: true,

      phase: 1,

      lastAttack: 0,

      stun: 0,

      slow: 1,

      rotation: 0,

      spawnedAt: performance.now()
    };

    boss.maxHp = Math.max(
      1,
      boss.maxHp
    );

    boss.hp = Math.min(
      boss.hp,
      boss.maxHp
    );

    updatePhase(boss);

    return boss;
  }

  function updatePhase(boss) {
    if (!boss) return 1;

    const phases =
      Math.max(
        1,
        Number(boss.phases) || 1
      );

    const healthRatio =
      Math.max(
        0,
        Math.min(
          1,
          boss.hp / boss.maxHp
        )
      );

    const phaseSize =
      1 / phases;

    const phase =
      Math.min(
        phases,
        Math.max(
          1,
          Math.floor(
            (1 - healthRatio) /
              phaseSize
          ) + 1
        )
      );

    boss.phase = phase;

    /*
     * Cada fase aumenta ligeramente
     * la presión del jefe sin hacer
     * el juego imposible.
     */
    boss.phaseMultiplier =
      1 + (phase - 1) * 0.12;

    return phase;
  }

  function damage(boss, amount) {
    if (
      !boss ||
      !boss.alive
    ) {
      return 0;
    }

    const armor =
      Number(boss.armor) || 0;

    const finalDamage =
      Math.max(
        1,
        Number(amount) - armor
      );

    const previousHp =
      boss.hp;

    boss.hp -= finalDamage;

    if (boss.hp <= 0) {
      boss.hp = 0;
      boss.alive = false;
    }

    updatePhase(boss);

    return Math.min(
      finalDamage,
      previousHp
    );
  }

  function heal(boss, amount) {
    if (!boss) return 0;

    const previousHp =
      boss.hp;

    boss.hp = Math.min(
      boss.maxHp,
      boss.hp +
        Math.max(0, amount)
    );

    if (boss.hp > 0) {
      boss.alive = true;
    }

    updatePhase(boss);

    return boss.hp - previousHp;
  }

  function canAttack(
    boss,
    player,
    now = performance.now()
  ) {
    if (
      !boss ||
      !player ||
      !boss.alive
    ) {
      return false;
    }

    if (
      boss.stun &&
      boss.stun > now
    ) {
      return false;
    }

    const distance =
      Math.hypot(
        boss.x - player.x,
        boss.y - player.y
      );

    const range =
      Number(boss.range) || 400;

    const rate =
      Number(boss.rate) || 1000;

    const ready =
      !boss.lastAttack ||
      now - boss.lastAttack >=
        rate /
          (boss.phaseMultiplier || 1);

    return (
      distance <= range &&
      ready
    );
  }

  function attack(
    boss,
    player,
    now = performance.now()
  ) {
    if (
      !canAttack(
        boss,
        player,
        now
      )
    ) {
      return {
        success: false,
        damage: 0,
        phase: boss?.phase || 1
      };
    }

    boss.lastAttack = now;

    const multiplier =
      boss.phaseMultiplier || 1;

    return {
      success: true,

      damage: Math.round(
        Math.max(
          1,
          (Number(boss.damage) || 1) *
            multiplier
        )
      ),

      phase:
        boss.phase || 1
    };
  }

  function stun(
    boss,
    duration = 1000
  ) {
    if (!boss) return false;

    boss.stun =
      performance.now() +
      Math.max(0, duration);

    return true;
  }

  function slow(
    boss,
    multiplier = 0.5,
    duration = 1000
  ) {
    if (!boss) return false;

    boss.slow =
      Math.max(
        0.1,
        Math.min(
          1,
          multiplier
        )
      );

    setTimeout(() => {
      if (boss) {
        boss.slow = 1;
      }
    }, Math.max(0, duration));

    return true;
  }

  function getPhaseInfo(boss) {
    if (!boss) return null;

    updatePhase(boss);

    return {
      phase: boss.phase,
      totalPhases: boss.phases,
      multiplier:
        boss.phaseMultiplier || 1,
      hp: boss.hp,
      maxHp: boss.maxHp,
      percentage:
        Math.round(
          (boss.hp /
            boss.maxHp) *
            100
        )
    };
  }

  function isDefeated(boss) {
    return !!(
      boss &&
      !boss.alive &&
      boss.hp <= 0
    );
  }

  function get(id) {
    return BOSSES[id] || null;
  }

  function getAll() {
    return Object.values(BOSSES);
  }

  function getRandom() {
    const list =
      getAll();

    return list[
      Math.floor(
        Math.random() *
          list.length
      )
    ];
  }

  function reset(boss) {
    if (!boss) return;

    boss.hp =
      boss.maxHp;

    boss.alive = true;

    boss.phase = 1;

    boss.lastAttack = 0;

    boss.stun = 0;

    boss.slow = 1;

    boss.phaseMultiplier = 1;
  }

  window.SCORVEX_BOSSES =
    BOSSES;

  window.createScorvexBoss =
    create;

  window.getScorvexBoss =
    get;

  window.getAllScorvexBosses =
    getAll;

  window.getRandomScorvexBoss =
    getRandom;

  window.updateScorvexBossPhase =
    updatePhase;

  window.damageScorvexBoss =
    damage;

  window.healScorvexBoss =
    heal;

  window.canScorvexBossAttack =
    canAttack;

  window.scorvexBossAttack =
    attack;

  window.stunScorvexBoss =
    stun;

  window.slowScorvexBoss =
    slow;

  window.getScorvexBossPhaseInfo =
    getPhaseInfo;

  window.isScorvexBossDefeated =
    isDefeated;

  window.resetScorvexBoss =
    reset;
})();
