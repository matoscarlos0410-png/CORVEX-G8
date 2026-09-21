/* =========================================================
   SCORVEX G8
   SAVE SYSTEM
   ========================================================= */

(() => {
  "use strict";

  const SAVE_KEY = "SCORVEX_G8_SAVE";

  /* =======================================================
     GUARDADO PREDETERMINADO
  ======================================================= */

  const DEFAULT_SAVE = {

    version: 8,

    /* ---------------------------------------
       ECONOMÍA
    ---------------------------------------- */

    coins: 50000,
    crystals: 100,

    /* ---------------------------------------
       PROGRESIÓN
    ---------------------------------------- */

    level: 1,
    xp: 0,
    score: 0,

    /* ---------------------------------------
       EQUIPAMIENTO
    ---------------------------------------- */

    weapon: "weapon_0001",
    ability: "nova",

    armor: "none",

    /* ---------------------------------------
       ARMAS
    ---------------------------------------- */

    ownedWeapons: [
      "weapon_0001"
    ],

    /* ---------------------------------------
       HABILIDADES
    ---------------------------------------- */

    ownedAbilities: [
      "nova"
    ],

    /* ---------------------------------------
       ARMADURAS
    ---------------------------------------- */

    ownedArmors: [
      "none"
    ],

    /* ---------------------------------------
       PERSONALIZACIÓN
    ---------------------------------------- */

    ownedCharacters: [
      "scorvex"
    ],

    ownedOutfits: [
      "outfit_default"
    ],

    ownedHelmets: [
      "helmet_none"
    ],

    ownedAccessories: [
      "accessory_none"
    ],

    ownedEffects: [
      "effect_none"
    ],

    ownedColors: [
      "color_default"
    ],

    /* ---------------------------------------
       PERSONALIZACIÓN EQUIPADA
    ---------------------------------------- */

    customization: {

      character: "scorvex",

      outfit: "outfit_default",

      helmet: "helmet_none",

      accessory: "accessory_none",

      effect: "effect_none",

      color: "color_default"

    },

    /* ---------------------------------------
       INVENTARIO
    ---------------------------------------- */

    medkits: 3,

    energyKits: 2,

    shieldKits: 1,

    repairKits: 1,

    grenades: 2,

    /* ---------------------------------------
       PARTIDA
    ---------------------------------------- */

    sector: 1,

    wave: 1,

    kills: 0,

    bossesDefeated: 0,

    /* ---------------------------------------
       ESTADÍSTICAS
    ---------------------------------------- */

    stats: {

      kills: 0,

      bosses: 0,

      abilities: 0,

      shots: 0,

      hits: 0,

      damage: 0,

      damageTaken: 0,

      victories: 0,

      defeats: 0,

      missionsCompleted: 0,

      purchases: 0,

      playTime: 0

    },

    /* ---------------------------------------
       MISIONES
    ---------------------------------------- */

    missions: {},

    /* ---------------------------------------
       LOGROS
    ---------------------------------------- */

    achievements: {},

    /* ---------------------------------------
       CONFIGURACIÓN
    ---------------------------------------- */

    settings: {

      music: true,

      sound: true,

      musicVolume: 0.35,

      soundVolume: 0.65,

      vibration: true,

      quality: "high"

    },

    /* ---------------------------------------
       PERSONALIZACIÓN DE HUD
    ---------------------------------------- */

    hud: {

      scale: 1,

      opacity: 1,

      showDamage: true,

      showMiniMap: true,

      showFPS: false

    },

    /* ---------------------------------------
       RECORDS
    ---------------------------------------- */

    records: {

      highestScore: 0,

      highestWave: 1,

      highestLevel: 1,

      mostKills: 0,

      mostDamage: 0

    }

  };


  /* =======================================================
     UTILIDADES
  ======================================================= */

  function deepClone(object) {

    return JSON.parse(
      JSON.stringify(object)
    );

  }


  function mergeObjects(base, data) {

    const result = deepClone(base);

    if (!data || typeof data !== "object") {

      return result;

    }

    Object.keys(data).forEach(key => {

      if (
        data[key] &&
        typeof data[key] === "object" &&
        !Array.isArray(data[key]) &&
        result[key] &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {

        result[key] = mergeObjects(
          result[key],
          data[key]
        );

      } else {

        result[key] = data[key];

      }

    });

    return result;

  }


  /* =======================================================
     MIGRACIÓN DE GUARDADOS ANTIGUOS
  ======================================================= */

  function migrate(oldData) {

    if (!oldData) {

      return deepClone(DEFAULT_SAVE);

    }

    const data = mergeObjects(
      DEFAULT_SAVE,
      oldData
    );


    /*
     * G5 / G6 / G7
     */

    if (
      data.weapon === "nova" ||
      data.weapon === "plasma" ||
      data.weapon === "shotgun"
    ) {

      data.weapon = "weapon_0001";

    }


    /*
     * Evitar duplicados
     */

    data.ownedWeapons = [
      ...new Set(
        Array.isArray(data.ownedWeapons)
          ? data.ownedWeapons
          : ["weapon_0001"]
      )
    ];


    data.ownedAbilities = [
      ...new Set(
        Array.isArray(data.ownedAbilities)
          ? data.ownedAbilities
          : ["nova"]
      )
    ];


    data.ownedCharacters = [
      ...new Set(
        Array.isArray(data.ownedCharacters)
          ? data.ownedCharacters
          : ["scorvex"]
      )
    ];


    data.ownedOutfits = [
      ...new Set(
        Array.isArray(data.ownedOutfits)
          ? data.ownedOutfits
          : ["outfit_default"]
      )
    ];


    data.ownedHelmets = [
      ...new Set(
        Array.isArray(data.ownedHelmets)
          ? data.ownedHelmets
          : ["helmet_none"]
      )
    ];


    data.ownedAccessories = [
      ...new Set(
        Array.isArray(data.ownedAccessories)
          ? data.ownedAccessories
          : ["accessory_none"]
      )
    ];


    data.ownedEffects = [
      ...new Set(
        Array.isArray(data.ownedEffects)
          ? data.ownedEffects
          : ["effect_none"]
      )
    ];


    data.ownedColors = [
      ...new Set(
        Array.isArray(data.ownedColors)
          ? data.ownedColors
          : ["color_default"]
      )
    ];


    data.version = 8;

    return data;

  }


  /* =======================================================
     CARGAR
  ======================================================= */

  function load() {

    try {

      const raw =
        localStorage.getItem(SAVE_KEY);

      if (!raw) {

        const fresh =
          deepClone(DEFAULT_SAVE);

        localStorage.setItem(
          SAVE_KEY,
          JSON.stringify(fresh)
        );

        return fresh;

      }

      const parsed =
        JSON.parse(raw);

      const migrated =
        migrate(parsed);

      return migrated;

    } catch (error) {

      console.warn(
        "SCORVEX G8: error cargando partida.",
        error
      );

      return deepClone(DEFAULT_SAVE);

    }

  }


  /* =======================================================
     GUARDAR
  ======================================================= */

  function save(data) {

    try {

      const finalData =
        migrate(data);

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(finalData)
      );

      return true;

    } catch (error) {

      console.error(
        "SCORVEX G8: error guardando partida.",
        error
      );

      return false;

    }

  }


  /* =======================================================
     ACTUALIZAR
  ======================================================= */

  function update(changes) {

    const current = load();

    const updated =
      mergeObjects(
        current,
        changes
      );

    save(updated);

    return updated;

  }


  /* =======================================================
     REINICIAR
  ======================================================= */

  function reset() {

    try {

      localStorage.removeItem(
        SAVE_KEY
      );

    } catch (error) {

      console.warn(error);

    }

    const fresh =
      deepClone(DEFAULT_SAVE);

    save(fresh);

    return fresh;

  }


  /* =======================================================
     BORRAR COMPLETAMENTE
  ======================================================= */

  function clear() {

    try {

      localStorage.removeItem(
        SAVE_KEY
      );

      return true;

    } catch (error) {

      console.error(error);

      return false;

    }

  }


  /* =======================================================
     EXISTENCIA
  ======================================================= */

  function exists() {

    return !!localStorage.getItem(
      SAVE_KEY
    );

  }


  /* =======================================================
     EXPORTAR PARTIDA
  ======================================================= */

  function exportSave() {

    const data = load();

    return JSON.stringify(
      data,
      null,
      2
    );

  }


  /* =======================================================
     IMPORTAR PARTIDA
  ======================================================= */

  function importSave(json) {

    try {

      const parsed =
        typeof json === "string"
          ? JSON.parse(json)
          : json;

      const migrated =
        migrate(parsed);

      save(migrated);

      return {

        success: true,

        data: migrated

      };

    } catch (error) {

      return {

        success: false,

        error: error.message

      };

    }

  }


  /* =======================================================
     SUMAR MONEDAS
  ======================================================= */

  function addCoins(amount) {

    amount =
      Math.max(
        0,
        Math.floor(Number(amount) || 0)
      );

    const data = load();

    data.coins += amount;

    save(data);

    return data.coins;

  }


  /* =======================================================
     RESTAR MONEDAS
  ======================================================= */

  function removeCoins(amount) {

    amount =
      Math.max(
        0,
        Math.floor(Number(amount) || 0)
      );

    const data = load();

    if (data.coins < amount) {

      return false;

    }

    data.coins -= amount;

    save(data);

    return true;

  }


  /* =======================================================
     SUMAR CRISTALES
  ======================================================= */

  function addCrystals(amount) {

    amount =
      Math.max(
        0,
        Math.floor(Number(amount) || 0)
      );

    const data = load();

    data.crystals += amount;

    save(data);

    return data.crystals;

  }


  /* =======================================================
     SUMAR XP
  ======================================================= */

  function addXP(amount) {

    amount =
      Math.max(
        0,
        Math.floor(Number(amount) || 0)
      );

    const data = load();

    data.xp += amount;

    let levelUps = 0;

    while (
      data.xp >=
      100 * data.level
    ) {

      data.xp -=
        100 * data.level;

      data.level++;

      levelUps++;

    }

    data.records.highestLevel =
      Math.max(
        data.records.highestLevel,
        data.level
      );

    save(data);

    return {

      level: data.level,

      xp: data.xp,

      levelUps

    };

  }


  /* =======================================================
     ESTADÍSTICAS
  ======================================================= */

  function addStat(
    stat,
    amount = 1
  ) {

    const data = load();

    if (
      typeof data.stats[stat] !==
      "number"
    ) {

      data.stats[stat] = 0;

    }

    data.stats[stat] +=
      Number(amount) || 0;

    /*
     * Records
     */

    if (
      stat === "kills"
    ) {

      data.records.mostKills =
        Math.max(
          data.records.mostKills,
          data.stats.kills
        );

    }

    if (
      stat === "damage"
    ) {

      data.records.mostDamage =
        Math.max(
          data.records.mostDamage,
          data.stats.damage
        );

    }

    save(data);

    return data.stats[stat];

  }


  /* =======================================================
     INVENTARIO
  ======================================================= */

  function addItem(
    item,
    amount = 1
  ) {

    const data = load();

    amount =
      Math.max(
        1,
        Math.floor(amount)
      );

    if (
      typeof data[item] !==
      "number"
    ) {

      data[item] = 0;

    }

    data[item] += amount;

    save(data);

    return data[item];

  }


  function removeItem(
    item,
    amount = 1
  ) {

    const data = load();

    amount =
      Math.max(
        1,
        Math.floor(amount)
      );

    if (
      typeof data[item] !==
      "number"
    ) {

      return false;

    }

    if (
      data[item] <
      amount
    ) {

      return false;

    }

    data[item] -= amount;

    save(data);

    return true;

  }


  /* =======================================================
     EXPONER API
  ======================================================= */

  window.SCORVEX_SAVE = {

    key: SAVE_KEY,

    defaults:
      deepClone(DEFAULT_SAVE),

    load,

    save,

    update,

    reset,

    clear,

    exists,

    export: exportSave,

    import: importSave,

    addCoins,

    removeCoins,

    addCrystals,

    addXP,

    addStat,

    addItem,

    removeItem

  };


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  load();

  console.log(
    "SCORVEX G8 Save System cargado."
  );

})();
