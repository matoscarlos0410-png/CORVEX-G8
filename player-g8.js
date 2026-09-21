(() => {
  "use strict";

  /*
   * SCORVEX G8 — SISTEMA DEL JUGADOR
   *
   * Incluye:
   * - Vida
   * - Energía
   * - Velocidad
   * - Armadura
   * - Habilidades
   * - Personalización
   * - Movimiento
   * - Estadísticas
   * - Respawn
   */

  const DEFAULT_PLAYER = {
    x: 400,
    y: 300,

    radius: 18,

    hp: 100,
    maxHp: 100,

    energy: 100,
    maxEnergy: 100,

    speed: 3.2,

    angle: 0,

    defense: 0,

    alive: true,

    kills: 0,
    damage: 0,

    invulnerable: false,
    invulnerableUntil: 0
  };

  function num(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n)
      ? n
      : fallback;
  }

  function getSave() {
    return window.SCORVEX_SAVE?.load
      ? window.SCORVEX_SAVE.load()
      : null;
  }

  function getCharacter() {
    const save = getSave();

    if (
      !save ||
      !window.getScorvexCharacter
    ) {
      return null;
    }

    return window.getScorvexCharacter(
      save.customization?.character ||
      save.character ||
      "scorvex"
    );
  }

  function getAbility() {
    const save = getSave();

    if (
      !save ||
      !window.getScorvexAbility
    ) {
      return null;
    }

    return window.getScorvexAbility(
      save.ability || "nova"
    );
  }

  function getArmor() {
    const save = getSave();

    if (
      !save ||
      !window.SCORVEX_INVENTORY?.getArmor
    ) {
      return null;
    }

    return window.SCORVEX_INVENTORY.getArmor(
      save.armor || "none"
    );
  }

  function calculateStats() {
    const character = getCharacter();
    const armor = getArmor();

    let maxHp = DEFAULT_PLAYER.maxHp;
    let maxEnergy = DEFAULT_PLAYER.maxEnergy;
    let speed = DEFAULT_PLAYER.speed;
    let defense = 0;

    if (character) {
      if (character.bonuses) {
        maxHp += num(
          character.bonuses.hp,
          0
        );

        maxEnergy += num(
          character.bonuses.energy,
          0
        );

        speed += num(
          character.bonuses.speed,
          0
        );

        defense += num(
          character.bonuses.defense,
          0
        );
      }

      maxHp += num(
        character.hpBonus,
        0
      );

      maxEnergy += num(
        character.energyBonus,
        0
      );

      speed += num(
        character.speedBonus,
        0
      );

      defense += num(
        character.defenseBonus,
        0
      );
    }

    if (armor) {
      defense += num(
        armor.defense,
        0
      );

      maxHp += num(
        armor.hp,
        0
      );
    }

    return {
      maxHp,
      maxEnergy,
      speed,
      defense
    };
  }

  function create(canvas) {
    const stats = calculateStats();

    const player = {
      ...DEFAULT_PLAYER,

      x: canvas
        ? canvas.clientWidth / 2
        : DEFAULT_PLAYER.x,

      y: canvas
        ? canvas.clientHeight / 2
        : DEFAULT_PLAYER.y,

      maxHp: stats.maxHp,
      hp: stats.maxHp,

      maxEnergy: stats.maxEnergy,
      energy: stats.maxEnergy,

      speed: stats.speed,
      defense: stats.defense,

      alive: true
    };

    return player;
  }

  function refreshStats(player) {
    if (!player) return null;

    const stats = calculateStats();

    const hpRatio =
      player.maxHp > 0
        ? player.hp / player.maxHp
        : 1;

    const energyRatio =
      player.maxEnergy > 0
        ? player.energy /
          player.maxEnergy
        : 1;

    player.maxHp = stats.maxHp;
    player.maxEnergy = stats.maxEnergy;

    player.speed = stats.speed;
    player.defense = stats.defense;

    player.hp = Math.min(
      player.maxHp,
      player.maxHp * hpRatio
    );

    player.energy = Math.min(
      player.maxEnergy,
      player.maxEnergy * energyRatio
    );

    return player;
  }

  function move(player, dx, dy, dt = 1) {
    if (!player || !player.alive) {
      return false;
    }

    dx = num(dx);
    dy = num(dy);
    dt = Math.max(0, num(dt, 1));

    const length =
      Math.hypot(dx, dy);

    if (length <= 0) {
      return false;
    }

    dx /= length;
    dy /= length;

    const amount =
      player.speed * dt;

    const nextX =
      player.x + dx * amount;

    const nextY =
      player.y + dy * amount;

    if (
      window.SCORVEX_MAP?.canMoveTo
    ) {
      if (
        window.SCORVEX_MAP.canMoveTo(
          nextX,
          player.y,
          player.radius
        )
      ) {
        player.x = nextX;
      }

      if (
        window.SCORVEX_MAP.canMoveTo(
          player.x,
          nextY,
          player.radius
        )
      ) {
        player.y = nextY;
      }
    } else {
      player.x = nextX;
      player.y = nextY;
    }

    if (
      window.SCORVEX_MAP?.clampPosition
    ) {
      window.SCORVEX_MAP.clampPosition(
        player,
        player.radius
      );
    }

    return true;
  }

  function aimAt(player, x, y) {
    if (!player) return;

    player.angle = Math.atan2(
      num(y) - player.y,
      num(x) - player.x
    );
  }

  function takeDamage(player, amount) {
    if (!player || !player.alive) {
      return 0;
    }

    const now = Date.now();

    if (
      player.invulnerable ||
      now < num(
        player.invulnerableUntil,
        0
      )
    ) {
      return 0;
    }

    let damage = Math.max(
      0,
      num(amount)
    );

    const defense = Math.max(
      0,
      num(player.defense)
    );

    damage *=
      100 /
      (100 + defense);

    damage = Math.max(
      1,
      Math.round(damage)
    );

    const before = player.hp;

    player.hp = Math.max(
      0,
      player.hp - damage
    );

    const dealt =
      before - player.hp;

    if (dealt > 0) {
      player.invulnerableUntil =
        now + 250;
    }

    if (player.hp <= 0) {
      player.hp = 0;
      player.alive = false;
    }

    const save = getSave();

    if (save?.stats) {
      save.stats.damageTaken =
        num(save.stats.damageTaken) +
        dealt;

      window.SCORVEX_SAVE?.save(save);
    }

    return dealt;
  }

  function heal(player, amount) {
    if (!player || !player.alive) {
      return 0;
    }

    const before = player.hp;

    player.hp = Math.min(
      player.maxHp,
      player.hp +
        Math.max(
          0,
          num(amount)
        )
    );

    return player.hp - before;
  }

  function restoreEnergy(player, amount) {
    if (!player || !player.alive) {
      return 0;
    }

    const before = player.energy;

    player.energy = Math.min(
      player.maxEnergy,
      player.energy +
        Math.max(
          0,
          num(amount)
        )
    );

    return player.energy - before;
  }

  function consumeEnergy(player, amount) {
    if (!player) return false;

    amount = Math.max(
      0,
      num(amount)
    );

    if (player.energy < amount) {
      return false;
    }

    player.energy -= amount;

    return true;
  }

  function regenerateEnergy(
    player,
    dt = 1
  ) {
    if (!player || !player.alive) {
      return 0;
    }

    let rate = 0.015;

    if (
      window.SCORVEX_EVENTS?.getEffectMultiplier
    ) {
      rate *=
        window.SCORVEX_EVENTS
          .getEffectMultiplier(
            "energyRecovery"
          );
    }

    return restoreEnergy(
      player,
      rate * Math.max(0, num(dt))
    );
  }

  function useAbility(player, enemies) {
    if (!player || !player.alive) {
      return {
        success: false,
        message: "Jugador no disponible."
      };
    }

    const ability = getAbility();

    if (!ability) {
      return {
        success: false,
        message: "Habilidad no encontrada."
      };
    }

    const energy = Math.max(
      0,
      num(ability.energy, 0)
    );

    if (
      player.energy <
      energy
    ) {
      return {
        success: false,
        message: "Energía insuficiente."
      };
    }

    if (
      window.SCORVEX_COMBAT?.useAbility
    ) {
      return window.SCORVEX_COMBAT
        .useAbility(
          player,
          enemies,
          ability
        );
    }

    consumeEnergy(
      player,
      energy
    );

    return {
      success: true,
      damage: 0,
      affected: 0
    };
  }

  function respawn(
    player,
    canvas
  ) {
    if (!player) return null;

    const spawn =
      window.SCORVEX_MAP
        ?.getRandomSpawnPoint
        ? window.SCORVEX_MAP
            .getRandomSpawnPoint()
        : {
            x: canvas
              ? canvas.clientWidth / 2
              : 400,
            y: canvas
              ? canvas.clientHeight / 2
              : 300
          };

    const stats =
      calculateStats();

    player.x = spawn.x;
    player.y = spawn.y;

    player.maxHp =
      stats.maxHp;

    player.hp =
      stats.maxHp;

    player.maxEnergy =
      stats.maxEnergy;

    player.energy =
      stats.maxEnergy;

    player.speed =
      stats.speed;

    player.defense =
      stats.defense;

    player.alive = true;

    player.invulnerable = true;

    player.invulnerableUntil =
      Date.now() + 2000;

    return player;
  }

  function isAlive(player) {
    return Boolean(
      player &&
      player.alive &&
      player.hp > 0
    );
  }

  function getHealthPercent(player) {
    if (!player) return 0;

    return player.maxHp > 0
      ? Math.max(
          0,
          Math.min(
            100,
            player.hp /
              player.maxHp *
              100
          )
        )
      : 0;
  }

  function getEnergyPercent(player) {
    if (!player) return 0;

    return player.maxEnergy > 0
      ? Math.max(
          0,
          Math.min(
            100,
            player.energy /
              player.maxEnergy *
              100
          )
        )
      : 0;
  }

  function getState(player) {
    if (!player) {
      return "unknown";
    }

    if (!player.alive || player.hp <= 0) {
      return "dead";
    }

    if (
      player.hp <
      player.maxHp * 0.25
    ) {
      return "critical";
    }

    if (
      player.energy <
      player.maxEnergy * 0.2
    ) {
      return "low-energy";
    }

    return "ready";
  }

  function addKill(player) {
    if (!player) return;

    player.kills =
      num(player.kills) + 1;

    const save = getSave();

    if (save?.stats) {
      save.stats.kills =
        num(save.stats.kills) + 1;

      window.SCORVEX_SAVE?.save(save);
    }
  }

  function addDamage(player, amount) {
    if (!player) return;

    player.damage =
      num(player.damage) +
      Math.max(
        0,
        num(amount)
      );
  }

  function getVisual(player) {
    const save = getSave();

    const customization =
      save?.customization || {};

    let visual = null;

    if (
      window.getScorvexCharacterVisual
    ) {
      visual =
        window.getScorvexCharacterVisual(
          customization
        );
    }

    return {
      character:
        customization.character ||
        "scorvex",

      outfit:
        customization.outfit ||
        "outfit_default",

      helmet:
        customization.helmet ||
        "helmet_none",

      accessory:
        customization.accessory ||
        "accessory_none",

      effect:
        customization.effect ||
        "effect_none",

      color:
        customization.color ||
        "color_default",

      data: visual
    };
  }

  function update(
    player,
    dt = 1
  ) {
    if (!player) return null;

    if (
      player.invulnerable &&
      Date.now() >=
        player.invulnerableUntil
    ) {
      player.invulnerable = false;
    }

    if (player.alive) {
      regenerateEnergy(
        player,
        dt
      );
    }

    return player;
  }

  function reset(player, canvas) {
    if (!player) {
      return create(canvas);
    }

    const fresh =
      create(canvas);

    Object.keys(player)
      .forEach(key => {
        delete player[key];
      });

    Object.assign(
      player,
      fresh
    );

    return player;
  }

  window.SCORVEX_PLAYER = {
    defaults: {
      ...DEFAULT_PLAYER
    },

    create,
    refreshStats,

    calculateStats,

    move,
    aimAt,

    takeDamage,
    heal,

    restoreEnergy,
    consumeEnergy,
    regenerateEnergy,

    useAbility,

    respawn,

    isAlive,
    getHealthPercent,
    getEnergyPercent,
    getState,

    addKill,
    addDamage,

    getVisual,

    update,
    reset
  };
})();
