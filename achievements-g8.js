(() => {
  "use strict";

  /*
   * SCORVEX G8 — SISTEMA DE LOGROS
   * 50 logros con recompensas virtuales.
   */

  const achievements = {
    first_blood: {
      id: "first_blood",
      name: "Primer combate",
      description: "Derrota a tu primer enemigo.",
      stat: "kills",
      target: 1,
      reward: 1000,
      xp: 50
    },

    hunter10: {
      id: "hunter10",
      name: "Cazador",
      description: "Derrota a 10 enemigos.",
      stat: "kills",
      target: 10,
      reward: 2500,
      xp: 100
    },

    hunter50: {
      id: "hunter50",
      name: "Cazador experto",
      description: "Derrota a 50 enemigos.",
      stat: "kills",
      target: 50,
      reward: 7500,
      xp: 250
    },

    hunter100: {
      id: "hunter100",
      name: "Cazador élite",
      description: "Derrota a 100 enemigos.",
      stat: "kills",
      target: 100,
      reward: 15000,
      xp: 500
    },

    hunter500: {
      id: "hunter500",
      name: "Depredador",
      description: "Derrota a 500 enemigos.",
      stat: "kills",
      target: 500,
      reward: 40000,
      xp: 1200
    },

    hunter1000: {
      id: "hunter1000",
      name: "Leyenda de SCORVEX",
      description: "Derrota a 1000 enemigos.",
      stat: "kills",
      target: 1000,
      reward: 100000,
      xp: 3000
    },

    damage1000: {
      id: "damage1000",
      name: "Primer impacto",
      description: "Inflige 1000 de daño.",
      stat: "damage",
      target: 1000,
      reward: 1500,
      xp: 75
    },

    damage10000: {
      id: "damage10000",
      name: "Destructor",
      description: "Inflige 10000 de daño.",
      stat: "damage",
      target: 10000,
      reward: 10000,
      xp: 300
    },

    damage50000: {
      id: "damage50000",
      name: "Máquina de combate",
      description: "Inflige 50000 de daño.",
      stat: "damage",
      target: 50000,
      reward: 30000,
      xp: 800
    },

    damage100000: {
      id: "damage100000",
      name: "Poder absoluto",
      description: "Inflige 100000 de daño.",
      stat: "damage",
      target: 100000,
      reward: 75000,
      xp: 2000
    },

    damage500000: {
      id: "damage500000",
      name: "Fuerza Omega",
      description: "Inflige 500000 de daño.",
      stat: "damage",
      target: 500000,
      reward: 200000,
      xp: 5000
    },

    shots100: {
      id: "shots100",
      name: "Entrenamiento",
      description: "Realiza 100 disparos.",
      stat: "shots",
      target: 100,
      reward: 1500,
      xp: 75
    },

    shots1000: {
      id: "shots1000",
      name: "Tirador",
      description: "Realiza 1000 disparos.",
      stat: "shots",
      target: 1000,
      reward: 7000,
      xp: 250
    },

    shots5000: {
      id: "shots5000",
      name: "Experto en armas",
      description: "Realiza 5000 disparos.",
      stat: "shots",
      target: 5000,
      reward: 20000,
      xp: 600
    },

    hits100: {
      id: "hits100",
      name: "Buena puntería",
      description: "Consigue 100 impactos.",
      stat: "hits",
      target: 100,
      reward: 3000,
      xp: 100
    },

    hits1000: {
      id: "hits1000",
      name: "Precisión avanzada",
      description: "Consigue 1000 impactos.",
      stat: "hits",
      target: 1000,
      reward: 15000,
      xp: 500
    },

    ability10: {
      id: "ability10",
      name: "Poder desbloqueado",
      description: "Usa 10 habilidades.",
      stat: "abilities",
      target: 10,
      reward: 3000,
      xp: 100
    },

    ability50: {
      id: "ability50",
      name: "Maestro de habilidades",
      description: "Usa 50 habilidades.",
      stat: "abilities",
      target: 50,
      reward: 10000,
      xp: 350
    },

    ability100: {
      id: "ability100",
      name: "Dominio energético",
      description: "Usa 100 habilidades.",
      stat: "abilities",
      target: 100,
      reward: 25000,
      xp: 750
    },

    boss1: {
      id: "boss1",
      name: "Cazador de jefes",
      description: "Derrota a tu primer jefe.",
      stat: "bosses",
      target: 1,
      reward: 15000,
      xp: 500
    },

    boss3: {
      id: "boss3",
      name: "Destructor de jefes",
      description: "Derrota a 3 jefes.",
      stat: "bosses",
      target: 3,
      reward: 40000,
      xp: 1200
    },

    boss10: {
      id: "boss10",
      name: "Pesadilla de los jefes",
      description: "Derrota a 10 jefes.",
      stat: "bosses",
      target: 10,
      reward: 100000,
      xp: 3000
    },

    victory1: {
      id: "victory1",
      name: "Primera victoria",
      description: "Consigue tu primera victoria.",
      stat: "victories",
      target: 1,
      reward: 5000,
      xp: 200
    },

    victory5: {
      id: "victory5",
      name: "Veterano",
      description: "Consigue 5 victorias.",
      stat: "victories",
      target: 5,
      reward: 15000,
      xp: 500
    },

    victory20: {
      id: "victory20",
      name: "Campeón",
      description: "Consigue 20 victorias.",
      stat: "victories",
      target: 20,
      reward: 50000,
      xp: 1500
    },

    victory50: {
      id: "victory50",
      name: "Leyenda",
      description: "Consigue 50 victorias.",
      stat: "victories",
      target: 50,
      reward: 150000,
      xp: 4000
    },

    purchases10: {
      id: "purchases10",
      name: "Coleccionista",
      description: "Realiza 10 compras.",
      stat: "purchases",
      target: 10,
      reward: 5000,
      xp: 150
    },

    purchases50: {
      id: "purchases50",
      name: "Gran coleccionista",
      description: "Realiza 50 compras.",
      stat: "purchases",
      target: 50,
      reward: 25000,
      xp: 700
    },

    playtime60: {
      id: "playtime60",
      name: "Constancia",
      description: "Juega durante 60 minutos.",
      stat: "playTime",
      target: 3600,
      reward: 5000,
      xp: 200
    },

    playtime300: {
      id: "playtime300",
      name: "Veterano SCORVEX",
      description: "Juega durante 5 horas.",
      stat: "playTime",
      target: 18000,
      reward: 25000,
      xp: 800
    },

    level5: {
      id: "level5",
      name: "Soldado",
      description: "Alcanza el nivel 5.",
      stat: "level",
      target: 5,
      reward: 5000,
      xp: 100
    },

    level10: {
      id: "level10",
      name: "Combatiente",
      description: "Alcanza el nivel 10.",
      stat: "level",
      target: 10,
      reward: 10000,
      xp: 250
    },

    level25: {
      id: "level25",
      name: "Élite",
      description: "Alcanza el nivel 25.",
      stat: "level",
      target: 25,
      reward: 30000,
      xp: 750
    },

    level50: {
      id: "level50",
      name: "Maestro",
      description: "Alcanza el nivel 50.",
      stat: "level",
      target: 50,
      reward: 75000,
      xp: 2000
    },

    level100: {
      id: "level100",
      name: "Nivel Omega",
      description: "Alcanza el nivel 100.",
      stat: "level",
      target: 100,
      reward: 250000,
      xp: 5000
    },

    score10000: {
      id: "score10000",
      name: "Puntuación alta",
      description: "Obtén 10000 puntos.",
      stat: "score",
      target: 10000,
      reward: 5000,
      xp: 200
    },

    score100000: {
      id: "score100000",
      name: "Puntuación extrema",
      description: "Obtén 100000 puntos.",
      stat: "score",
      target: 100000,
      reward: 50000,
      xp: 1500
    },

    score1000000: {
      id: "score1000000",
      name: "Rey de SCORVEX",
      description: "Obtén 1 millón de puntos.",
      stat: "score",
      target: 1000000,
      reward: 250000,
      xp: 5000
    },

    damageTaken1000: {
      id: "damageTaken1000",
      name: "Aguante",
      description: "Recibe 1000 de daño y sigue luchando.",
      stat: "damageTaken",
      target: 1000,
      reward: 3000,
      xp: 100
    },

    damageTaken10000: {
      id: "damageTaken10000",
      name: "Superviviente",
      description: "Recibe 10000 de daño.",
      stat: "damageTaken",
      target: 10000,
      reward: 15000,
      xp: 500
    },

    mission5: {
      id: "mission5",
      name: "Cumplidor",
      description: "Completa 5 misiones.",
      stat: "missionsCompleted",
      target: 5,
      reward: 10000,
      xp: 300
    },

    mission20: {
      id: "mission20",
      name: "Especialista",
      description: "Completa 20 misiones.",
      stat: "missionsCompleted",
      target: 20,
      reward: 40000,
      xp: 1200
    }
  };

  function getSave() {
    return window.SCORVEX_SAVE?.load
      ? window.SCORVEX_SAVE.load()
      : null;
  }

  function getStatValue(save, stat) {
    if (!save) return 0;

    if (stat === "level") {
      return Number(save.level || 0);
    }

    if (stat === "score") {
      return Number(save.score || 0);
    }

    if (save.stats && stat in save.stats) {
      return Number(save.stats[stat] || 0);
    }

    return 0;
  }

  function getAchievementState(save, id) {
    save = save || getSave();

    if (!save) {
      return {
        progress: 0,
        target: achievements[id]?.target || 0,
        completed: false,
        claimed: false
      };
    }

    if (!save.achievements) {
      save.achievements = {};
    }

    const data = save.achievements[id] || {};
    const achievement = achievements[id];

    if (!achievement) {
      return null;
    }

    const progress = getStatValue(save, achievement.stat);

    return {
      progress,
      target: achievement.target,
      completed: progress >= achievement.target,
      claimed: Boolean(data.claimed)
    };
  }

  function update() {
    const save = getSave();

    if (!save) return [];

    if (!save.achievements) {
      save.achievements = {};
    }

    const newlyCompleted = [];

    Object.values(achievements).forEach(a => {
      const state = getAchievementState(save, a.id);

      if (!save.achievements[a.id]) {
        save.achievements[a.id] = {
          progress: state.progress,
          claimed: false
        };
      }

      save.achievements[a.id].progress = state.progress;

      if (
        state.completed &&
        !save.achievements[a.id].notified
      ) {
        save.achievements[a.id].notified = true;
        newlyCompleted.push(a);
      }
    });

    if (window.SCORVEX_SAVE?.save) {
      window.SCORVEX_SAVE.save(save);
    }

    return newlyCompleted;
  }

  function claim(id) {
    const save = getSave();
    const achievement = achievements[id];

    if (!save || !achievement) {
      return {
        success: false,
        message: "Logro no encontrado."
      };
    }

    if (!save.achievements) {
      save.achievements = {};
    }

    const state = getAchievementState(save, id);

    if (!state.completed) {
      return {
        success: false,
        message: "Todavía no has completado este logro."
      };
    }

    if (state.claimed) {
      return {
        success: false,
        message: "Este logro ya fue reclamado."
      };
    }

    save.achievements[id] = {
      progress: state.progress,
      claimed: true,
      notified: true
    };

    save.coins = Number(save.coins || 0) + achievement.reward;

    if (window.SCORVEX_PROGRESSION?.addXP) {
      window.SCORVEX_PROGRESSION.addXP(achievement.xp);
    } else {
      save.xp = Number(save.xp || 0) + achievement.xp;
    }

    if (window.SCORVEX_SAVE?.save) {
      window.SCORVEX_SAVE.save(save);
    }

    return {
      success: true,
      message: `🏆 ${achievement.name} reclamado`,
      reward: achievement.reward,
      xp: achievement.xp
    };
  }

  function get(id) {
    return achievements[id] || null;
  }

  function getAll() {
    return Object.values(achievements);
  }

  function getCompleted() {
    const save = getSave();

    return getAll().filter(a => {
      const state = getAchievementState(save, a.id);
      return state?.completed;
    });
  }

  function getClaimable() {
    const save = getSave();

    return getAll().filter(a => {
      const state = getAchievementState(save, a.id);
      return state?.completed && !state?.claimed;
    });
  }

  function getProgress(id) {
    const save = getSave();
    return getAchievementState(save, id);
  }

  function getStats() {
    const all = getAll();
    const completed = getCompleted();
    const claimable = getClaimable();

    return {
      total: all.length,
      completed: completed.length,
      remaining: all.length - completed.length,
      claimable: claimable.length,
      percentage: all.length
        ? Math.round((completed.length / all.length) * 100)
        : 0
    };
  }

  function reset() {
    const save = getSave();

    if (!save) return false;

    save.achievements = {};

    if (window.SCORVEX_SAVE?.save) {
      window.SCORVEX_SAVE.save(save);
    }

    return true;
  }

  window.SCORVEX_ACHIEVEMENTS = {
    achievements,
    update,
    claim,
    get,
    getAll,
    getCompleted,
    getClaimable,
    getProgress,
    getStats,
    reset
  };

  // Actualización inicial.
  setTimeout(() => {
    update();
  }, 100);
})();
