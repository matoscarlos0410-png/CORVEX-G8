(() => {
  "use strict";

  const MISSIONS = {
    kills10: {
      id: "kills10",
      name: "Primer contacto",
      description: "Derrota a 10 enemigos.",
      type: "kills",
      target: 10,
      reward: 2500,
      xp: 100
    },

    kills50: {
      id: "kills50",
      name: "Cazador G8",
      description: "Derrota a 50 enemigos.",
      type: "kills",
      target: 50,
      reward: 10000,
      xp: 300
    },

    kills100: {
      id: "kills100",
      name: "Dominio del campo",
      description: "Derrota a 100 enemigos.",
      type: "kills",
      target: 100,
      reward: 25000,
      xp: 700
    },

    damage10000: {
      id: "damage10000",
      name: "Potencia de fuego",
      description: "Inflige 10 000 puntos de daño.",
      type: "damage",
      target: 10000,
      reward: 15000,
      xp: 500
    },

    damage50000: {
      id: "damage50000",
      name: "Fuerza G8",
      description: "Inflige 50 000 puntos de daño.",
      type: "damage",
      target: 50000,
      reward: 40000,
      xp: 1200
    },

    abilities15: {
      id: "abilities15",
      name: "Dominio de energía",
      description: "Utiliza 15 habilidades.",
      type: "abilities",
      target: 15,
      reward: 12000,
      xp: 400
    },

    abilities50: {
      id: "abilities50",
      name: "Maestro de habilidades",
      description: "Utiliza 50 habilidades.",
      type: "abilities",
      target: 50,
      reward: 30000,
      xp: 1000
    },

    bosses1: {
      id: "boss1",
      name: "Cazador de jefes",
      description: "Derrota a 1 jefe.",
      type: "bosses",
      target: 1,
      reward: 30000,
      xp: 1500
    },

    bosses3: {
      id: "bosses3",
      name: "Destructor Omega",
      description: "Derrota a 3 jefes.",
      type: "bosses",
      target: 3,
      reward: 75000,
      xp: 3500
    },

    shots100: {
      id: "shots100",
      name: "Primer cargador",
      description: "Realiza 100 disparos.",
      type: "shots",
      target: 100,
      reward: 3000,
      xp: 150
    },

    shots1000: {
      id: "shots1000",
      name: "Lluvia de fuego",
      description: "Realiza 1000 disparos.",
      type: "shots",
      target: 1000,
      reward: 20000,
      xp: 700
    },

    victories5: {
      id: "victories5",
      name: "Superviviente",
      description: "Consigue 5 victorias.",
      type: "victories",
      target: 5,
      reward: 15000,
      xp: 600
    },

    victories20: {
      id: "victories20",
      name: "Veterano G8",
      description: "Consigue 20 victorias.",
      type: "victories",
      target: 20,
      reward: 50000,
      xp: 2000
    }
  };

  function ensureMissions(save) {
    save.missions ??= {};

    for (const id of Object.keys(MISSIONS)) {
      if (!save.missions[id]) {
        save.missions[id] = {
          progress: 0,
          claimed: false
        };
      }

      save.missions[id].progress =
        Math.max(
          0,
          Number(
            save.missions[id].progress
          ) || 0
        );

      save.missions[id].claimed =
        !!save.missions[id].claimed;
    }

    return save;
  }

  function update(type, amount = 1) {
    const save =
      SCORVEX_SAVE.load();

    ensureMissions(save);

    const value =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (value <= 0) {
      return false;
    }

    let changed = false;

    for (const [id, mission] of Object.entries(MISSIONS)) {
      if (mission.type !== type) {
        continue;
      }

      const progress =
        save.missions[id];

      if (progress.claimed) {
        continue;
      }

      const previous =
        progress.progress;

      progress.progress =
        Math.min(
          mission.target,
          previous + value
        );

      if (
        progress.progress !==
        previous
      ) {
        changed = true;
      }
    }

    if (changed) {
      SCORVEX_SAVE.save(save);
    }

    return changed;
  }

  function getProgress(id) {
    const mission =
      MISSIONS[id];

    if (!mission) {
      return null;
    }

    const save =
      SCORVEX_SAVE.load();

    ensureMissions(save);

    const data =
      save.missions[id];

    return {
      id,
      name: mission.name,
      description:
        mission.description,

      type: mission.type,

      target:
        mission.target,

      progress:
        Math.min(
          mission.target,
          data.progress
        ),

      claimed:
        data.claimed,

      completed:
        data.progress >=
        mission.target
    };
  }

  function isCompleted(id) {
    const data =
      getProgress(id);

    return !!(
      data &&
      data.completed
    );
  }

  function claim(id) {
    const mission =
      MISSIONS[id];

    if (!mission) {
      return {
        success: false,
        message: "Misión no encontrada."
      };
    }

    const save =
      SCORVEX_SAVE.load();

    ensureMissions(save);

    const data =
      save.missions[id];

    if (data.claimed) {
      return {
        success: false,
        message: "Esta misión ya fue reclamada."
      };
    }

    if (
      data.progress <
      mission.target
    ) {
      return {
        success: false,
        message: "La misión todavía no está completa."
      };
    }

    save.coins =
      Math.max(
        0,
        Number(save.coins) || 0
      ) + mission.reward;

    save.xp =
      Math.max(
        0,
        Number(save.xp) || 0
      ) + mission.xp;

    data.claimed = true;

    if (save.stats) {
      save.stats.missionsCompleted =
        (save.stats.missionsCompleted || 0) + 1;
    }

    SCORVEX_SAVE.save(save);

    return {
      success: true,
      message:
        `Misión completada: ${mission.name}`,
      reward: mission.reward,
      xp: mission.xp
    };
  }

  function getAll() {
    const save =
      SCORVEX_SAVE.load();

    ensureMissions(save);

    return Object.values(
      MISSIONS
    ).map(mission => {
      const data =
        save.missions[
          mission.id
        ];

      return {
        ...mission,

        progress:
          Math.min(
            mission.target,
            data.progress
          ),

        claimed:
          data.claimed,

        completed:
          data.progress >=
          mission.target
      };
    });
  }

  function getAvailable() {
    return getAll().filter(
      mission =>
        !mission.claimed
    );
  }

  function getCompleted() {
    return getAll().filter(
      mission =>
        mission.completed
    );
  }

  function getClaimable() {
    return getAll().filter(
      mission =>
        mission.completed &&
        !mission.claimed
    );
  }

  function reset() {
    const save =
      SCORVEX_SAVE.load();

    save.missions = {};

    ensureMissions(save);

    SCORVEX_SAVE.save(save);

    return true;
  }

  function getMissionCount() {
    return Object.keys(
      MISSIONS
    ).length;
  }

  window.SCORVEX_MISSIONS = {
    list: MISSIONS,

    update,

    claim,

    getProgress,

    isCompleted,

    getAll,

    getAvailable,

    getCompleted,

    getClaimable,

    reset,

    getMissionCount
  };
})();
