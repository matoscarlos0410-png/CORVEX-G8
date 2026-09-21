(() => {
  "use strict";

  const AI_STATE = {
    IDLE: "idle",
    CHASE: "chase",
    ATTACK: "attack",
    RETREAT: "retreat",
    ORBIT: "orbit",
    PATROL: "patrol",
    STUNNED: "stunned"
  };

  function distance(a, b) {
    if (!a || !b) return Infinity;

    return Math.hypot(
      a.x - b.x,
      a.y - b.y
    );
  }

  function direction(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    const d = Math.hypot(dx, dy) || 1;

    return {
      x: dx / d,
      y: dy / d,
      distance: d
    };
  }

  function moveToward(enemy, target, amount) {
    const dir = direction(enemy, target);

    enemy.x += dir.x * amount;
    enemy.y += dir.y * amount;

    return dir;
  }

  function moveAway(enemy, target, amount) {
    const dir = direction(enemy, target);

    enemy.x -= dir.x * amount;
    enemy.y -= dir.y * amount;

    return dir;
  }

  function orbit(enemy, target, amount) {
    const dir = direction(enemy, target);

    enemy.x -= dir.y * amount;
    enemy.y += dir.x * amount;

    return dir;
  }

  function clampEnemy(enemy, width, height) {
    if (!enemy) return;

    const radius = enemy.radius || 15;

    if (Number.isFinite(width)) {
      enemy.x = Math.max(
        radius,
        Math.min(width - radius, enemy.x)
      );
    }

    if (Number.isFinite(height)) {
      enemy.y = Math.max(
        radius,
        Math.min(height - radius, enemy.y)
      );
    }
  }

  function chooseState(enemy, player, now) {
    if (!enemy || !player) {
      return AI_STATE.IDLE;
    }

    if (
      enemy.stun &&
      enemy.stun > now
    ) {
      return AI_STATE.STUNNED;
    }

    const d = distance(enemy, player);

    const range =
      Number(enemy.range) || 250;

    const behavior =
      enemy.behavior || "chase";

    if (behavior === "ranged") {
      if (d < range * 0.45) {
        return AI_STATE.RETREAT;
      }

      if (d <= range) {
        return AI_STATE.ATTACK;
      }

      return AI_STATE.CHASE;
    }

    if (behavior === "orbit") {
      if (d > range) {
        return AI_STATE.CHASE;
      }

      return AI_STATE.ORBIT;
    }

    if (behavior === "tank") {
      if (d <= range) {
        return AI_STATE.ATTACK;
      }

      return AI_STATE.CHASE;
    }

    if (behavior === "attack") {
      if (d <= range) {
        return AI_STATE.ATTACK;
      }

      return AI_STATE.CHASE;
    }

    return AI_STATE.CHASE;
  }

  function update(
    enemy,
    player,
    dt = 1,
    now = performance.now(),
    options = {}
  ) {
    if (!enemy || !player) {
      return Infinity;
    }

    if (!enemy.alive) {
      return Infinity;
    }

    const width =
      options.width ??
      enemy.arenaWidth ??
      null;

    const height =
      options.height ??
      enemy.arenaHeight ??
      null;

    const state =
      chooseState(
        enemy,
        player,
        now
      );

    enemy.aiState = state;

    if (state === AI_STATE.STUNNED) {
      enemy.aiState = AI_STATE.STUNNED;
      return distance(enemy, player);
    }

    const baseSpeed =
      Number(enemy.speed) || 1;

    const slow =
      Number(enemy.slow) || 1;

    const speed =
      baseSpeed *
      slow *
      Math.max(0.1, dt);

    if (state === AI_STATE.CHASE) {
      moveToward(
        enemy,
        player,
        speed
      );
    }

    else if (state === AI_STATE.RETREAT) {
      moveAway(
        enemy,
        player,
        speed
      );
    }

    else if (state === AI_STATE.ORBIT) {
      orbit(
        enemy,
        player,
        speed * 0.8
      );
    }

    else if (state === AI_STATE.ATTACK) {
      /*
       * El enemigo se mantiene en posición
       * mientras el sistema de combate
       * controla el ataque.
       */
      enemy.attackReady =
        !enemy.lastAttack ||
        now - enemy.lastAttack >=
          (enemy.rate || 1000);
    }

    enemy.rotation = Math.atan2(
      player.y - enemy.y,
      player.x - enemy.x
    );

    clampEnemy(
      enemy,
      width,
      height
    );

    return distance(
      enemy,
      player
    );
  }

  function canAttack(
    enemy,
    player,
    now = performance.now()
  ) {
    if (!enemy || !player) {
      return false;
    }

    if (!enemy.alive) {
      return false;
    }

    if (
      enemy.stun &&
      enemy.stun > now
    ) {
      return false;
    }

    const d = distance(
      enemy,
      player
    );

    const range =
      Number(enemy.range) || 250;

    const rate =
      Number(enemy.rate) || 1000;

    const ready =
      !enemy.lastAttack ||
      now - enemy.lastAttack >= rate;

    return d <= range && ready;
  }

  function attack(
    enemy,
    player,
    now = performance.now()
  ) {
    if (
      !canAttack(
        enemy,
        player,
        now
      )
    ) {
      return {
        success: false,
        damage: 0
      };
    }

    enemy.lastAttack = now;

    return {
      success: true,
      damage: Math.max(
        1,
        Number(enemy.damage) || 1
      )
    };
  }

  function reset(enemy) {
    if (!enemy) return;

    enemy.aiState =
      AI_STATE.IDLE;

    enemy.lastAttack = 0;
    enemy.stun = 0;
    enemy.slow = 1;
    enemy.attackReady = false;
  }

  function setTarget(enemy, target) {
    if (!enemy) return false;

    enemy.target = target || null;

    return true;
  }

  function getState(enemy) {
    return (
      enemy?.aiState ||
      AI_STATE.IDLE
    );
  }

  function getStateName(enemy) {
    const state =
      getState(enemy);

    const names = {
      idle: "En espera",
      chase: "Persiguiendo",
      attack: "Atacando",
      retreat: "Retrocediendo",
      orbit: "Rodeando",
      patrol: "Patrullando",
      stunned: "Aturdido"
    };

    return names[state] || "En espera";
  }

  /*
   * Compatibilidad con el game-g8.js
   * original:
   *
   * SCORVEX_AI.update(e, player, dt, now)
   */
  window.SCORVEX_AI = {
    states: AI_STATE,

    update,

    chooseState,

    canAttack,

    attack,

    reset,

    setTarget,

    getState,

    getStateName,

    distance,

    direction,

    moveToward,

    moveAway,

    orbit,

    clampEnemy
  };
})();
