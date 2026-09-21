/* =========================================================
   SCORVEX G8
   CHARACTER & CUSTOMIZATION SYSTEM
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     RAREZAS
  ======================================================= */

  const rarityData = {

    common: {
      name: "Común",
      color: "#b8c2cc",
      multiplier: 1
    },

    uncommon: {
      name: "Poco común",
      color: "#55d66b",
      multiplier: 1.15
    },

    rare: {
      name: "Rara",
      color: "#3da5ff",
      multiplier: 1.35
    },

    epic: {
      name: "Épica",
      color: "#a66cff",
      multiplier: 1.7
    },

    legendary: {
      name: "Legendaria",
      color: "#ffb52e",
      multiplier: 2.1
    },

    mythic: {
      name: "Mítica",
      color: "#ff4edb",
      multiplier: 2.7
    },

    ancient: {
      name: "Ancestral",
      color: "#ff6655",
      multiplier: 3.5
    },

    omega: {
      name: "Omega",
      color: "#ffe66d",
      multiplier: 5
    }

  };


  /* =======================================================
     PERSONAJES
  ======================================================= */

  const characters = {

    scorvex: {

      id: "scorvex",

      name: "SCORVEX",

      type: "character",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      health: 100,

      speed: 3.6,

      energy: 100,

      description:
        "Operador principal del proyecto SCORVEX G8."

    },

    sentinel: {

      id: "sentinel",

      name: "SENTINEL",

      type: "character",

      rarity: "rare",

      rarityName: "Rara",

      price: 8500,

      health: 115,

      speed: 3.4,

      energy: 105,

      description:
        "Especialista defensivo equipado para resistir enfrentamientos prolongados."

    },

    phantom: {

      id: "phantom",

      name: "PHANTOM",

      type: "character",

      rarity: "epic",

      rarityName: "Épica",

      price: 15000,

      health: 95,

      speed: 4.1,

      energy: 120,

      description:
        "Operador veloz especializado en movilidad."

    },

    titan: {

      id: "titan",

      name: "TITAN",

      type: "character",

      rarity: "legendary",

      rarityName: "Legendaria",

      price: 28000,

      health: 150,

      speed: 2.8,

      energy: 100,

      description:
        "Unidad pesada con gran resistencia."

    },

    omega: {

      id: "omega",

      name: "OMEGA",

      type: "character",

      rarity: "omega",

      rarityName: "Omega",

      price: 75000,

      health: 180,

      speed: 4.2,

      energy: 150,

      description:
        "Unidad experimental de máximo nivel."

    }

  };


  /* =======================================================
     TRAJES
  ======================================================= */

  const outfits = {

    outfit_default: {

      id: "outfit_default",

      name: "Traje estándar",

      type: "outfit",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      bonus: 0,

      description:
        "Traje táctico estándar."

    },

    outfit_tactical: {

      id: "outfit_tactical",

      name: "Táctico G8",

      type: "outfit",

      rarity: "rare",

      rarityName: "Rara",

      price: 6500,

      bonus: 5,

      description:
        "Traje táctico reforzado."

    },

    outfit_shadow: {

      id: "outfit_shadow",

      name: "Shadow",

      type: "outfit",

      rarity: "epic",

      rarityName: "Épica",

      price: 12000,

      bonus: 8,

      description:
        "Traje diseñado para operaciones de alta movilidad."

    },

    outfit_inferno: {

      id: "outfit_inferno",

      name: "Inferno",

      type: "outfit",

      rarity: "legendary",

      rarityName: "Legendaria",

      price: 24000,

      bonus: 12,

      description:
        "Traje de combate de energía avanzada."

    },

    outfit_omega: {

      id: "outfit_omega",

      name: "Omega Armor",

      type: "outfit",

      rarity: "omega",

      rarityName: "Omega",

      price: 60000,

      bonus: 20,

      description:
        "Armadura experimental de última generación."

    }

  };


  /* =======================================================
     CASCOS
  ======================================================= */

  const helmets = {

    helmet_none: {

      id: "helmet_none",

      name: "Sin casco",

      type: "helmet",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      defense: 0

    },

    helmet_tactical: {

      id: "helmet_tactical",

      name: "Casco táctico",

      type: "helmet",

      rarity: "uncommon",

      rarityName: "Poco común",

      price: 3500,

      defense: 5

    },

    helmet_sentinel: {

      id: "helmet_sentinel",

      name: "Sentinel Helmet",

      type: "helmet",

      rarity: "rare",

      rarityName: "Rara",

      price: 7500,

      defense: 10

    },

    helmet_phantom: {

      id: "helmet_phantom",

      name: "Phantom Visor",

      type: "helmet",

      rarity: "epic",

      rarityName: "Épica",

      price: 14000,

      defense: 14

    },

    helmet_omega: {

      id: "helmet_omega",

      name: "Omega Helmet",

      type: "helmet",

      rarity: "omega",

      rarityName: "Omega",

      price: 45000,

      defense: 25

    }

  };


  /* =======================================================
     ACCESORIOS
  ======================================================= */

  const accessories = {

    accessory_none: {

      id: "accessory_none",

      name: "Sin accesorio",

      type: "accessory",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      bonus: 0

    },

    accessory_radio: {

      id: "accessory_radio",

      name: "Radio G8",

      type: "accessory",

      rarity: "uncommon",

      rarityName: "Poco común",

      price: 2500,

      bonus: 3

    },

    accessory_scanner: {

      id: "accessory_scanner",

      name: "Scanner",

      type: "accessory",

      rarity: "rare",

      rarityName: "Rara",

      price: 6000,

      bonus: 6

    },

    accessory_core: {

      id: "accessory_core",

      name: "Energy Core",

      type: "accessory",

      rarity: "epic",

      rarityName: "Épica",

      price: 11000,

      bonus: 10

    },

    accessory_omega: {

      id: "accessory_omega",

      name: "Omega Core",

      type: "accessory",

      rarity: "omega",

      rarityName: "Omega",

      price: 40000,

      bonus: 18

    }

  };


  /* =======================================================
     EFECTOS
  ======================================================= */

  const effects = {

    effect_none: {

      id: "effect_none",

      name: "Sin efecto",

      type: "effect",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      color: "#ffffff"

    },

    effect_blue: {

      id: "effect_blue",

      name: "Aura Azul",

      type: "effect",

      rarity: "rare",

      rarityName: "Rara",

      price: 5000,

      color: "#35b8ff"

    },

    effect_purple: {

      id: "effect_purple",

      name: "Aura Violeta",

      type: "effect",

      rarity: "epic",

      rarityName: "Épica",

      price: 10000,

      color: "#a66cff"

    },

    effect_fire: {

      id: "effect_fire",

      name: "Aura Inferno",

      type: "effect",

      rarity: "legendary",

      rarityName: "Legendaria",

      price: 20000,

      color: "#ff6347"

    },

    effect_omega: {

      id: "effect_omega",

      name: "Omega Energy",

      type: "effect",

      rarity: "omega",

      rarityName: "Omega",

      price: 50000,

      color: "#ffe66d"

    }

  };


  /* =======================================================
     COLORES
  ======================================================= */

  const colors = {

    color_default: {

      id: "color_default",

      name: "Blanco",

      type: "color",

      rarity: "common",

      rarityName: "Común",

      price: 0,

      value: "#e8f4ff"

    },

    color_blue: {

      id: "color_blue",

      name: "Azul",

      type: "color",

      rarity: "uncommon",

      rarityName: "Poco común",

      price: 1500,

      value: "#35b8ff"

    },

    color_red: {

      id: "color_red",

      name: "Rojo",

      type: "color",

      rarity: "rare",

      rarityName: "Rara",

      price: 3000,

      value: "#ff4d5a"

    },

    color_purple: {

      id: "color_purple",

      name: "Violeta",

      type: "color",

      rarity: "epic",

      rarityName: "Épica",

      price: 6000,

      value: "#a66cff"

    },

    color_gold: {

      id: "color_gold",

      name: "Dorado",

      type: "color",

      rarity: "legendary",

      rarityName: "Legendaria",

      price: 12000,

      value: "#ffd34d"

    },

    color_omega: {

      id: "color_omega",

      name: "Omega",

      type: "color",

      rarity: "omega",

      rarityName: "Omega",

      price: 30000,

      value: "#ffe66d"

    }

  };


  /* =======================================================
     UNIR TODO
  ======================================================= */

  const allCharacters = {

    ...characters,

    ...outfits,

    ...helmets,

    ...accessories,

    ...effects,

    ...colors

  };


  /* =======================================================
     OBTENER OBJETO
  ======================================================= */

  function getCharacter(id) {

    return allCharacters[id] || null;

  }


  /* =======================================================
     OBTENER POR TIPO
  ======================================================= */

  function getByType(type) {

    return Object.values(
      allCharacters
    ).filter(
      item =>
        item.type === type
    );

  }


  /* =======================================================
     OBTENER POR RAREZA
  ======================================================= */

  function getByRarity(rarity) {

    return Object.values(
      allCharacters
    ).filter(
      item =>
        item.rarity === rarity
    );

  }


  /* =======================================================
     BUSCAR
  ======================================================= */

  function search(text) {

    const query =
      String(text || "")
        .trim()
        .toLowerCase();

    if (!query) {

      return Object.values(
        allCharacters
      );

    }

    return Object.values(
      allCharacters
    ).filter(
      item =>
        item.name
          .toLowerCase()
          .includes(query) ||

        item.type
          .toLowerCase()
          .includes(query) ||

        item.rarityName
          .toLowerCase()
          .includes(query)
    );

  }


  /* =======================================================
     CALCULAR BONIFICACIONES
  ======================================================= */

  function getBonuses(customization) {

    customization =
      customization || {};

    const character =
      characters[
        customization.character
      ] || characters.scorvex;

    const outfit =
      outfits[
        customization.outfit
      ] || outfits.outfit_default;

    const helmet =
      helmets[
        customization.helmet
      ] || helmets.helmet_none;

    const accessory =
      accessories[
        customization.accessory
      ] || accessories.accessory_none;


    return {

      health:
        character.health +
        (outfit.bonus || 0) +
        (helmet.defense || 0),

      speed:
        character.speed,

      energy:
        character.energy +
        (accessory.bonus || 0),

      defense:
        helmet.defense || 0

    };

  }


  /* =======================================================
     GENERAR DATOS VISUALES
  ======================================================= */

  function getVisual(customization) {

    customization =
      customization || {};

    const character =
      characters[
        customization.character
      ] || characters.scorvex;

    const outfit =
      outfits[
        customization.outfit
      ] || outfits.outfit_default;

    const helmet =
      helmets[
        customization.helmet
      ] || helmets.helmet_none;

    const accessory =
      accessories[
        customization.accessory
      ] || accessories.accessory_none;

    const effect =
      effects[
        customization.effect
      ] || effects.effect_none;

    const color =
      colors[
        customization.color
      ] || colors.color_default;


    return {

      character,

      outfit,

      helmet,

      accessory,

      effect,

      color,

      bodyColor:
        color.value,

      auraColor:
        effect.color

    };

  }


  /* =======================================================
     EXPORTAR
  ======================================================= */

  window.SCORVEX_CHARACTERS =
    allCharacters;

  window.SCORVEX_CHARACTER_TYPES = {

    characters,

    outfits,

    helmets,

    accessories,

    effects,

    colors

  };

  window.SCORVEX_RARITY_DATA =
    rarityData;

  window.getScorvexCharacter =
    getCharacter;

  window.getScorvexCharactersByType =
    getByType;

  window.getScorvexCharactersByRarity =
    getByRarity;

  window.searchScorvexCharacters =
    search;

  window.getScorvexCharacterBonuses =
    getBonuses;

  window.getScorvexCharacterVisual =
    getVisual;


  console.log(
    `SCORVEX G8: ${Object.keys(allCharacters).length} objetos de personalización cargados.`
  );

})();
