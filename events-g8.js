(() => {
  "use strict";

  /*
   * SCORVEX G8 — SISTEMA DE EVENTOS
   *
   * Eventos dinámicos:
   * - Oleada de enemigos
   * - Sobrecarga de energía
   * - Recompensa de suministros
   * - Enemigos élite
   * - Tormenta Omega
   * - Jefe especial
   *
   * Todo funciona con recursos virtuales del juego.
   */

  const EVENT_DURATION = 30000;

  const EVENT_TYPES = {
    enemyRush: {
      id: "enemyRush",
      name: "⚡ OLEADA DE ENEMIGOS",
      description: "Una gran cantidad de enemigos aparece.",
      duration: EVENT_DURATION,
      reward: 5000,
      xp: 250
    },

    energySurge: {
      id: "energySurge",
      name: "🔋 SOBRECARGA DE ENERGÍA",
      description: "La energía del jugador se regenera más rápido.",
      duration: EVENT_DURATION,
      reward: 4000,
      xp: 200
    },

    supplyDrop: {
      id: "supplyDrop",
      name: "📦 SUMINISTROS",
      description: "Aparece un suministro especial.",
      duration: 20000,
      reward: 7500,
      xp: 300
    },

    eliteHunt: {
      id: "eliteHunt",
      name: "💠 CAZA ÉLITE",
      description: "Aparecen enemigos con estadísticas mejoradas.",
      duration: EVENT_DURATION,
      reward: 10000,
      xp: 450
    },

    omegaStorm: {
      id: "omegaStorm",
      name: "🌌 TORMENTA OMEGA",
      description: "El mapa entra en un estado de energía extrema.",
      duration: 25000,
      reward: 15000,
      xp: 600
    },

    bossAlert: {
      id: "bossAlert",
      name: "👑 ALERTA DE JEFE",
      description: "Un jefe especial entra en combate.",
      duration: 45000,
      reward: 25000,
      xp: 1000
    }
  };

  let activeEvent = null;
  let eventHistory = [];
  let eventTimer = null;

  function getSave() {
    return window.SCORVEX_SAVE?.load
      ? window.SCORVEX_SAVE.load()
      : null;
  }

  function notify(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  function getRandomEvent() {
    const list = Object.values(EVENT_TYPES);

    return list[
      Math.floor(Math.random() * list.length)
    ];
  }

  function getEvent(id) {
    return EVENT_TYPES[id] || null;
  }

  function getAllEvents() {
    return Object.values(EVENT_TYPES);
  }

  function isActive() {
    return activeEvent !== null;
  }

  function getActiveEvent() {
    return activeEvent
      ? { ...activeEvent }
      : null;
  }

  function start(id = null, options = {}) {
    if (activeEvent) {
      return {
        success: false,
        message: "Ya hay un evento activo.",
        event: activeEvent
      };
    }

    const template = id
      ? getEvent(id)
      : getRandomEvent();

    if (!template) {
      return {
        success: false,
        message: "Evento no encontrado."
      };
    }

    const now = Date.now();

    activeEvent = {
      id: template.id,
      name: template.name,
      description: template.description,
      startedAt: now,
      endsAt: now + (
        Number(options.duration) > 0
          ? Number(options.duration)
          : template.duration
      ),
      duration: Number(options.duration) > 0
        ? Number(options.duration)
        : template.duration,
      reward: template.reward,
      xp: template.xp,
      kills: 0,
      damage: 0,
      completed: false
    };

    eventHistory.unshift({
      id: activeEvent.id,
      startedAt: activeEvent.startedAt
    });

    if (eventHistory.length > 20) {
      eventHistory.length = 20;
    }

    applyStartEffects(activeEvent);

    notify(`EVENTO: ${activeEvent.name}`);

    clearTimeout(eventTimer);

    eventTimer = setTimeout(() => {
      finish(activeEvent.id);
    }, activeEvent.duration);

    return {
      success: true,
      event: getActiveEvent()
    };
  }

  function applyStartEffects(event) {
    if (!event) return;

    const save = getSave();

    if (!save) return;

    if (!save.eventData) {
      save.eventData = {};
    }

    save.eventData.activeEvent = event.id;

    if (window.SCORVEX_SAVE?.save) {
      window.SCORVEX_SAVE.save(save);
    }
  }

  function applyEndEffects(event) {
    if (!event) return;

    const save = getSave();

    if (!save) return;

    if (save.eventData) {
      save.eventData.activeEvent = null;
    }

    if (window.SCORVEX_SAVE?.save) {
      window.SCORVEX_SAVE.save(save);
    }
  }

  function finish(id = null) {
    if (!activeEvent) {
      return {
        success: false,
        message: "No hay ningún evento activo."
      };
    }

    if (id && activeEvent.id !== id) {
      return {
        success: false,
        message: "El evento no coincide."
      };
    }

    const event = {
      ...activeEvent,
      completed: true
    };

    clearTimeout(eventTimer);
    eventTimer = null;

    activeEvent = null;

    applyEndEffects(event);

    const save = getSave();

    if (save) {
      save.coins = Number(save.coins || 0) + event.reward;

      if (save.stats) {
        save.stats.eventsCompleted =
          Number(save.stats.eventsCompleted || 0) + 1;
      }

      if (window.SCORVEX_SAVE?.save) {
        window.SCORVEX_SAVE.save(save);
      }
    }

    if (window.SCORVEX_PROGRESSION?.addXP) {
      window.SCORVEX_PROGRESSION.addXP(event.xp);
    }

    notify(
      `🏆 Evento completado: +${event.reward.toLocaleString()} monedas`
    );

    return {
      success: true,
      event,
      reward: event.reward,
      xp: event.xp
    };
  }

  function cancel() {
    if (!activeEvent) {
      return false;
    }

    clearTimeout(eventTimer);
    eventTimer = null;

    const event = activeEvent;

    activeEvent = null;

    applyEndEffects(event);

    return true;
  }

  function addKill(amount = 1) {
    if (!activeEvent) return;

    amount = Math.max(0, Number(amount) || 0);

    activeEvent.kills += amount;
  }

  function addDamage(amount = 0) {
    if (!activeEvent) return;

    amount = Math.max(0, Number(amount) || 0);

    activeEvent.damage += amount;
  }

  function getRemainingTime() {
    if (!activeEvent) return 0;

    return Math.max(
      0,
      activeEvent.endsAt - Date.now()
    );
  }

  function getRemainingSeconds() {
    return Math.ceil(
      getRemainingTime() / 1000
    );
  }

  function getProgress() {
    if (!activeEvent) return 0;

    const elapsed =
      Date.now() - activeEvent.startedAt;

    const progress =
      elapsed / activeEvent.duration;

    return Math.max(
      0,
      Math.min(1, progress)
    );
  }

  function getHistory() {
    return eventHistory.map(event => ({
      ...event
    }));
  }

  function clearHistory() {
    eventHistory = [];
  }

  function hasEffect(effect) {
    if (!activeEvent) return false;

    switch (effect) {
      case "energyBoost":
        return activeEvent.id === "energySurge";

      case "eliteEnemies":
        return activeEvent.id === "eliteHunt";

      case "omegaStorm":
        return activeEvent.id === "omegaStorm";

      case "enemyRush":
        return activeEvent.id === "enemyRush";

      case "bossAlert":
        return activeEvent.id === "bossAlert";

      case "supplyDrop":
        return activeEvent.id === "supplyDrop";

      default:
        return false;
    }
  }

  function getEffectMultiplier(effect) {
    if (!activeEvent) return 1;

    switch (effect) {
      case "energyRecovery":
        return hasEffect("energyBoost")
          ? 3
          : 1;

      case "enemyHealth":
        return hasEffect("eliteEnemies")
          ? 1.5
          : 1;

      case "enemyDamage":
        return hasEffect("eliteEnemies")
          ? 1.25
          : 1;

      case "enemySpawn":
        return hasEffect("enemyRush")
          ? 2.5
          : 1;

      case "omegaPower":
        return hasEffect("omegaStorm")
          ? 1.5
          : 1;

      default:
        return 1;
    }
  }

  function update() {
    if (!activeEvent) return null;

    if (Date.now() >= activeEvent.endsAt) {
      return finish(activeEvent.id);
    }

    return getActiveEvent();
  }

  function draw(ctx, canvasWidth, canvasHeight) {
    if (!ctx || !activeEvent) return;

    const progress = getProgress();
    const remaining = getRemainingSeconds();

    ctx.save();

    // Barra superior del evento.
    const barWidth = Math.min(
      420,
      Math.max(220, canvasWidth * 0.5)
    );

    const barX =
      (canvasWidth - barWidth) / 2;

    const barY = 14;

    ctx.fillStyle = "rgba(5,12,25,0.85)";
    ctx.fillRect(
      barX,
      barY,
      barWidth,
      52
    );

    ctx.strokeStyle = "rgba(0,210,255,0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      barX,
      barY,
      barWidth,
      52
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      activeEvent.name,
      canvasWidth / 2,
      barY + 19
    );

    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(
      barX + 15,
      barY + 29,
      barWidth - 30,
      8
    );

    ctx.fillStyle = "#00d9ff";
    ctx.fillRect(
      barX + 15,
      barY + 29,
      (barWidth - 30) * (1 - progress),
      8
    );

    ctx.fillStyle = "#bdefff";
    ctx.font = "12px Arial";

    ctx.fillText(
      `${remaining}s`,
      canvasWidth / 2,
      barY + 48
    );

    ctx.restore();
  }

  // Evento automático cada cierto tiempo.
  function scheduleRandomEvent(delay = 45000) {
    setTimeout(() => {
      if (!activeEvent) {
        start();
      }

      scheduleRandomEvent(
        50000 + Math.random() * 30000
      );
    }, delay);
  }

  function reset() {
    cancel();
    clearHistory();
  }

  window.SCORVEX_EVENTS = {
    types: EVENT_TYPES,

    getEvent,
    getAllEvents,
    getRandomEvent,

    start,
    finish,
    cancel,

    isActive,
    getActiveEvent,

    addKill,
    addDamage,

    getRemainingTime,
    getRemainingSeconds,
    getProgress,

    getHistory,
    clearHistory,

    hasEffect,
    getEffectMultiplier,

    update,
    draw,

    scheduleRandomEvent,
    reset
  };

  // Comprobación periódica del evento.
  setInterval(() => {
    update();
  }, 1000);
})();
