(() => {
  "use strict";

  const ENEMY_TYPES = {
    scout: {
      id: "scout",
      name: "Scout",
      description: "Enemigo rápido y ligero.",
      hp: 120,
      damage: 10,
      speed: 2.8,
      range: 230,
      rate: 900,
      radius: 17,
      color: "#45d8ff",
      reward: 120,
      xp: 35,
      behavior: "chase",
      armor: 0
    },

    striker: {
      id: "striker",
      name: "Striker",
      description: "Unidad equilibrada de combate.",
      hp: 220,
      damage: 18,
      speed: 2.1,
      range: 300,
      rate: 700,
      radius: 21,
      color: "#ffad42",
      reward: 220,
      xp: 60,
      behavior: "attack",
      armor: 4
    },

    tank: {
      id: "tank",
      name: "Titan Guard",
      description: "Unidad pesada con mucha resistencia.",
      hp: 600,
      damage: 32,
      speed: 0.9,
      range: 250,
      rate: 1200,
      radius: 32,
      color: "#ff5d5d",
      reward: 550,
      xp: 130,
      behavior: "tank",
      armor: 18
    },

    sniper: {
      id: "sniper",
      name: "Specter Sniper",
      description: "Mantiene distancia y realiza ataques precisos.",
      hp: 180,
      damage: 42,
      speed: 1.2,
      range: 600,
      rate: 1700,
      radius: 19,
      color: "#c27dff",
      reward: 400,
      xp: 110,
      behavior: "ranged",
      armor: 3
    },

    drone: {
      id: "drone",
      name: "Omega Drone",
      description: "Unidad aérea rápida que rodea al jugador.",
      hp: 150,
      damage: 22,
      speed: 3.3,
      range: 340,
      rate: 850,
      radius: 16,
      color: "#54f5b0",
      reward: 300,
      xp: 85,
      behavior: "orbit",
      armor: 2
    },

    hunter: {
      id: "hunter",
      name: "Void Hunter",
      description: "Cazador especializado en perseguir objetivos.",
      hp: 340,
      damage: 27,
      speed: 2.5,
      range: 360,
      rate: 800,
      radius: 24,
      color: "#ff4fd8",
      reward: 650,
      xp: 170,
      behavior: "chase",
      armor: 8
    },

    guardian: {
      id: "guardian",
      name: "Neon Guardian",
      description: "Defensor resistente de las zonas avanzadas.",
      hp: 900,
      damage: 38,
      speed: 0.75,
      range: 280,
      rate: 1300,
      radius: 38,
      color: "#4f8cff",
      reward: 900,
      xp: 230,
      behavior: "tank",
      armor: 25
    },

    phantom: {
      id: "phantom",
      name: "Phantom Unit",
      description: "Unidad veloz con movimientos impredecibles.",
      hp: 280,
      damage: 30,
      speed: 3.5,
      range: 320,
      rate: 750,
      radius: 20,
      color: "#9f7cff",
      reward: 800,
      xp: 210,
      behavior: "orbit",
      armor: 6
    }
  };

  function create(type = "scout", options = {}) {
    const base = ENEMY_TYPES[type] || ENEMY_TYPES.scout;

    const enemy = {
      ...base,
      ...options,

      id:
        options.id ||
        "enemy_" +
          Math.random()
            .toString(36)
            .slice(2),

      maxHp:
        options.maxHp ??
        options.hp ??
        base.hp,

      hp:
        options.hp ??
        base.hp,

      alive: true,

      lastAttack: 0,

      stun: 0,

      slow: 1,

      rotation: 0,

      spawnTime: performance.now()
    };

    enemy.maxHp = Math.max(1, enemy.maxHp);
    enemy.hp = Math.min(enemy.hp, enemy.maxHp);

    return enemy;
  }

  function get(type) {
    return ENEMY_TYPES[type] || null;
  }

  function getAll() {
    return Object.values(ENEMY_TYPES);
  }

  function getByBehavior(behavior) {
    return getAll().filter(
      enemy => enemy.behavior === behavior
    );
  }

  function getDistance(a, b) {
    if (!a || !b) return Infinity;

    return Math.hypot(
      a.x - b.x,
      a.y - b.y
    );
  }

  function isAlive(enemy) {
    return !!(
      enemy &&
      enemy.alive &&
      enemy.hp > 0
    );
  }

  function damage(enemy, amount) {
    if (!isAlive(enemy)) return 0;

    const armor = Number(enemy.armor) || 0;

    const finalDamage = Math.max(
      1,
      Number(amount) - armor
    );

    enemy.hp -= finalDamage;

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
    }

    return finalDamage;
  }

  function heal(enemy, amount) {
    if (!enemy) return 0;

    const before = enemy.hp;

    enemy.hp = Math.min(
      enemy.maxHp,
      enemy.hp + Math.max(0, amount)
    );

    if (enemy.hp > 0) {
      enemy.alive = true;
    }

    return enemy.hp - before;
  }

  function stun(enemy, duration) {
    if (!enemy) return false;

    enemy.stun =
      performance.now() +
      Math.max(0, duration);

    return true;
  }

  function slow(enemy, multiplier = 0.5, duration = 1000) {
    if (!enemy) return false;

    enemy.slow = Math.max(
      0.1,
      Math.min(1, multiplier)
    );

    setTimeout(() => {
      if (enemy) {
        enemy.slow = 1;
      }
    }, Math.max(0, duration));

    return true;
  }

  function createRandom(options = {}) {
    const types = Object.keys(ENEMY_TYPES);

    const type =
      types[
        Math.floor(
          Math.random() * types.length
        )
      ];

    return create(type, options);
  }

  function createForWave(wave = 1, options = {}) {
    const level = Math.max(
      1,
      Number(wave) || 1
    );

    const types = [
      "scout",
      "striker"
    ];

    if (level >= 2) {
      types.push("drone");
    }

    if (level >= 3) {
      types.push("sniper");
    }

    if (level >= 5) {
      types.push("tank");
    }

    if (level >= 7) {
      types.push("hunter");
    }

    if (level >= 10) {
      types.push("phantom");
    }

    if (level >= 15) {
      types.push("guardian");
    }

    const type =
      types[
        Math.floor(
          Math.random() * types.length
        )
      ];

    const multiplier =
      1 + (level - 1) * 0.035;

    const base = ENEMY_TYPES[type];

    return create(type, {
      ...options,

      hp:
        Math.round(
          base.hp * multiplier
        ),

      maxHp:
        Math.round(
          base.hp * multiplier
        ),

      damage:
        Math.round(
          base.damage *
            (1 + (level - 1) * 0.018)
        ),

      reward:
        Math.round(
          base.reward *
            (1 + (level - 1) * 0.025)
        ),

      xp:
        Math.round(
          base.xp *
            (1 + (level - 1) * 0.02)
        )
    });
  }

  window.SCORVEX_ENEMIES = ENEMY_TYPES;

  window.createScorvexEnemy = create;

  window.getScorvexEnemy =
    get;

  window.getAllScorvexEnemies =
    getAll;

  window.getScorvexEnemiesByBehavior =
    getByBehavior;

  window.getScorvexEnemyDistance =
    getDistance;

  window.isScorvexEnemyAlive =
    isAlive;

  window.damageScorvexEnemy =
    damage;

  window.healScorvexEnemy =
    heal;

  window.stunScorvexEnemy =
    stun;

  window.slowScorvexEnemy =
    slow;

  window.createRandomScorvexEnemy =
    createRandom;

  window.createScorvexEnemyForWave =
    createForWave;
})();
