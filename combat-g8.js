(() => {
  "use strict";

  /*
   * SCORVEX G8 — SISTEMA DE COMBATE
   *
   * Gestiona:
   * - Daño
   * - Críticos
   * - Armadura
   * - Penetración
   * - Distancia
   * - Habilidades
   * - Jefes
   * - Estadísticas
   * - Eventos
   */

  const COMBAT = {
    minDamage: 1,
    maxDistanceMultiplier: 1.25,
    closeDistanceMultiplier: 1.05,
    farDistanceMultiplier: 0.85
  };

  function number(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function distance(a, b) {
    if (!a || !b) return Infinity;

    return Math.hypot(
      number(a.x) - number(b.x),
      number(a.y) - number(b.y)
    );
  }

  function getDistanceMultiplier(dist, weapon) {
    const range = Math.max(
      1,
      number(weapon?.range, 300)
    );

    if (dist <= range * 0.25) {
      return COMBAT.closeDistanceMultiplier;
    }

    if (dist >= range) {
      return COMBAT.farDistanceMultiplier;
    }

    const ratio = dist / range;

    return (
      COMBAT.maxDistanceMultiplier -
      ratio * 0.40
    );
  }

  function getCriticalMultiplier(weapon) {
    const chance = Math.max(
      0,
      Math.min(
        100,
        number(weapon?.criticalChance, 0)
      )
    );

    const critical =
      Math.random() * 100 < chance;

    return {
      critical,
      multiplier: critical ? 1.75 : 1
    };
  }

  function calculateDamage(attacker, target, baseDamage, options = {}) {
    baseDamage = Math.max(
      COMBAT.minDamage,
      number(baseDamage, 1)
    );

    const weapon = options.weapon || attacker?.weapon || {};

    const dist = distance(attacker, target);

    const distanceMultiplier =
      options.ignoreDistance
        ? 1
        : getDistanceMultiplier(dist, weapon);

    const criticalData =
      options.ignoreCritical
        ? {
            critical: false,
            multiplier: 1
          }
        : getCriticalMultiplier(weapon);

    const armor = Math.max(
      0,
      number(
        target?.armor ??
        target?.defense ??
        0
      )
    );

    const penetration = Math.max(
      0,
      number(
        weapon?.penetration ??
        options.penetration ??
        0
      )
    );

    const effectiveArmor = Math.max(
      0,
      armor - penetration
    );

    const armorMultiplier =
      100 /
      (100 + effectiveArmor);

    let damage =
      baseDamage *
      distanceMultiplier *
      criticalData.multiplier *
      armorMultiplier;

    if (options.multiplier) {
      damage *= Math.max(
        0,
        number(options.multiplier, 1)
      );
    }

    damage = Math.max(
      COMBAT.minDamage,
      Math.round(damage)
    );

    return {
      damage,
      critical: criticalData.critical,
      distance: Math.round(dist),
      distanceMultiplier,
      criticalMultiplier: criticalData.multiplier,
      armor,
      penetration,
      effectiveArmor,
      armorMultiplier
    };
  }

  function damageEnemy(enemy, amount, attacker = null, options = {}) {
    if (!enemy || enemy.alive === false) {
      return 0;
    }

    let result;

    if (attacker) {
      result = calculateDamage(
        attacker,
        enemy,
        amount,
        options
      );
    } else {
      result = {
        damage: Math.max(
          COMBAT.minDamage,
          Math.round(number(amount, 1))
        ),
        critical: false
      };
    }

    let damage = result.damage;

    if (
      window.SCORVEX_EVENTS?.getEffectMultiplier &&
      window.SCORVEX_EVENTS.hasEffect?.("omegaStorm")
    ) {
      damage *=
        window.SCORVEX_EVENTS.getEffectMultiplier(
          "omegaPower"
        );
    }

    damage = Math.max(
      COMBAT.minDamage,
      Math.round(damage)
    );

    if (
      typeof window.damageScorvexEnemy === "function"
    ) {
      const dealt = window.damageScorvexEnemy(
        enemy,
        damage
      );

      return Math.max(
        0,
        number(dealt, damage)
      );
    }

    const before = number(enemy.hp, 0);

    enemy.hp = Math.max(
      0,
      before - damage
    );

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
    }

    return Math.max(
      0,
      before - enemy.hp
    );
  }

  function damageBoss(boss, amount, attacker = null, options = {}) {
    if (!boss || boss.alive === false) {
      return 0;
    }

    let result;

    if (attacker) {
      result = calculateDamage(
        attacker,
        boss,
        amount,
        options
      );
    } else {
      result = {
        damage: Math.max(
          COMBAT.minDamage,
          Math.round(number(amount, 1))
        ),
        critical: false
      };
    }

    let damage = result.damage;

    const armor = Math.max(
      0,
      number(boss.armor, 0)
    );

    const penetration = Math.max(
      0,
      number(
        options.penetration,
        0
      )
    );

    const effectiveArmor = Math.max(
      0,
      armor - penetration
    );

    damage *=
      100 /
      (100 + effectiveArmor);

    damage = Math.max(
      COMBAT.minDamage,
      Math.round(damage)
    );

    if (
      typeof window.damageScorvexBoss === "function"
    ) {
      return Math.max(
        0,
        number(
          window.damageScorvexBoss(
            boss,
            damage
          ),
          damage
        )
      );
    }

    const before = number(boss.hp, 0);

    boss.hp = Math.max(
      0,
      before - damage
    );

    if (boss.hp <= 0) {
      boss.hp = 0;
      boss.alive = false;
    }

    return Math.max(
      0,
      before - boss.hp
    );
  }

  function damagePlayer(player, amount, source = null) {
    if (!player) return 0;

    let damage = Math.max(
      0,
      number(amount, 0)
    );

    const armor =
      number(
        player.armorDefense ??
        player.defense ??
        0
      );

    damage *=
      100 /
      (100 + Math.max(0, armor));

    damage = Math.max(
      0,
      Math.round(damage)
    );

    const before = Math.max(
      0,
      number(player.hp, 0)
    );

    player.hp = Math.max(
      0,
      before - damage
    );

    const dealt = before - player.hp;

    const save =
      window.SCORVEX_SAVE?.load?.();

    if (save?.stats) {
      save.stats.damageTaken =
        number(save.stats.damageTaken) +
        dealt;

      window.SCORVEX_SAVE.save(save);
    }

    void source;

    return dealt;
  }

  function healPlayer(player, amount) {
    if (!player) return 0;

    const before = number(
      player.hp,
      0
    );

    const maxHp = Math.max(
      before,
      number(
        player.maxHp,
        before
      )
    );

    player.hp = Math.min(
      maxHp,
      before + Math.max(
        0,
        number(amount, 0)
      )
    );

    return player.hp - before;
  }

  function restoreEnergy(player, amount) {
    if (!player) return 0;

    const before = number(
      player.energy,
      0
    );

    const maxEnergy = Math.max(
      before,
      number(
        player.maxEnergy,
        before
      )
    );

    player.energy = Math.min(
      maxEnergy,
      before + Math.max(
        0,
        number(amount, 0)
      )
    );

    return player.energy - before;
  }

  function useAbility(player, enemies, ability) {
    if (!player || !ability) {
      return {
        success: false,
        damage: 0,
        affected: 0
      };
    }

    const energyCost = Math.max(
      0,
      number(ability.energy, 0)
    );

    if (
      number(player.energy, 0) <
      energyCost
    ) {
      return {
        success: false,
        damage: 0,
        affected: 0,
        message: "Energía insuficiente."
      };
    }

    player.energy -= energyCost;

    const radius = Math.max(
      20,
      number(
        ability.radius,
        190
      )
    );

    const power = Math.max(
      1,
      number(
        ability.power,
        50
      )
    );

    let totalDamage = 0;
    let affected = 0;

    if (Array.isArray(enemies)) {
      enemies.forEach(enemy => {
        if (!enemy || enemy.alive === false) {
          return;
        }

        const d = distance(
          player,
          enemy
        );

        if (d <= radius) {
          const dealt = damageEnemy(
            enemy,
            power,
            player,
            {
              weapon: ability,
              ignoreCritical: true
            }
          );

          totalDamage += dealt;
          affected++;
        }
      });
    }

    return {
      success: true,
      damage: totalDamage,
      affected
    };
  }

  function recordShot(hit = false, damage = 0) {
    const save =
      window.SCORVEX_SAVE?.load?.();

    if (!save) return;

    if (!save.stats) {
      save.stats = {};
    }

    save.stats.shots =
      number(save.stats.shots) + 1;

    if (hit) {
      save.stats.hits =
        number(save.stats.hits) + 1;
    }

    if (damage > 0) {
      save.stats.damage =
        number(save.stats.damage) +
        number(damage);
    }

    window.SCORVEX_SAVE.save(save);
  }

  function recordKill(reward = 0, xp = 0) {
    const save =
      window.SCORVEX_SAVE?.load?.();

    if (!save) return;

    if (!save.stats) {
      save.stats = {};
    }

    save.stats.kills =
      number(save.stats.kills) + 1;

    save.score =
      number(save.score) +
      Math.max(0, number(reward));

    window.SCORVEX_SAVE.save(save);

    if (
      xp > 0 &&
      window.SCORVEX_PROGRESSION?.addXP
    ) {
      window.SCORVEX_PROGRESSION.addXP(xp);
    }

    if (
      window.SCORVEX_EVENTS?.addKill
    ) {
      window.SCORVEX_EVENTS.addKill(1);
    }
  }

  function recordDamage(damage) {
    const amount = Math.max(
      0,
      number(damage)
    );

    if (
      window.SCORVEX_EVENTS?.addDamage
    ) {
      window.SCORVEX_EVENTS.addDamage(
        amount
      );
    }

    const save =
      window.SCORVEX_SAVE?.load?.();

    if (!save) return;

    if (!save.stats) {
      save.stats = {};
    }

    save.stats.damage =
      number(save.stats.damage) +
      amount;

    window.SCORVEX_SAVE.save(save);
  }

  function getWeaponStats(weapon) {
    if (!weapon) {
      return {
        damage: 1,
        range: 300,
        accuracy: 50,
        criticalChance: 0,
        penetration: 0
      };
    }

    return {
      damage: Math.max(
        1,
        number(weapon.damage, 1)
      ),

      range: Math.max(
        1,
        number(weapon.range, 300)
      ),

      accuracy: Math.max(
        0,
        Math.min(
          100,
          number(weapon.accuracy, 50)
        )
      ),

      criticalChance: Math.max(
        0,
        Math.min(
          100,
          number(
            weapon.criticalChance,
            0
          )
        )
      ),

      penetration: Math.max(
        0,
        number(
          weapon.penetration,
          0
        )
      )
    };
  }

  function getCombatSummary() {
    const save =
      window.SCORVEX_SAVE?.load?.();

    if (!save) {
      return {
        kills: 0,
        damage: 0,
        shots: 0,
        hits: 0,
        accuracy: 0,
        damageTaken: 0
      };
    }

    const stats = save.stats || {};

    const shots =
      number(stats.shots);

    const hits =
      number(stats.hits);

    return {
      kills: number(stats.kills),
      damage: number(stats.damage),
      shots,
      hits,

      accuracy: shots > 0
        ? Math.round(
            (hits / shots) * 100
          )
        : 0,

      damageTaken:
        number(stats.damageTaken)
    };
  }

  window.SCORVEX_COMBAT = {
    calculateDamage,

    damageEnemy,
    damageBoss,
    damagePlayer,

    healPlayer,
    restoreEnergy,

    useAbility,

    recordShot,
    recordKill,
    recordDamage,

    getWeaponStats,
    getCombatSummary,

    distance,
    getDistanceMultiplier
  };
})();
