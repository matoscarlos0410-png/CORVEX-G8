/* =========================================================
   SCORVEX G8
   ABILITIES SYSTEM
   ========================================================= */

(() => {
  "use strict";

  const abilities = {

    nova: {
      id: "nova",
      name: "NOVA",
      rarity: "common",
      rarityName: "Común",

      description:
        "Libera una onda de energía alrededor del jugador.",

      energy: 30,
      cooldown: 3,
      power: 85,
      radius: 190,

      effect: "explosion",

      color: "#35b8ff",

      icon: "✦"
    },


    shadow: {
      id: "shadow",
      name: "SHADOW STEP",
      rarity: "rare",
      rarityName: "Rara",

      description:
        "Aumenta temporalmente la velocidad del jugador.",

      energy: 35,
      cooldown: 6,
      power: 0,
      radius: 0,

      effect: "speed",

      duration: 4,

      speedMultiplier: 2,

      color: "#8b6cff",

      icon: "◈"
    },


    plasma: {
      id: "plasma",
      name: "PLASMA BURST",
      rarity: "epic",
      rarityName: "Épica",

      description:
        "Dispara una descarga de plasma que causa gran daño.",

      energy: 45,
      cooldown: 5,
      power: 180,
      radius: 240,

      effect: "plasma",

      color: "#ff4de1",

      icon: "⚡"
    },


    guardian: {
      id: "guardian",
      name: "GUARDIAN",
      rarity: "legendary",
      rarityName: "Legendaria",

      description:
        "Genera un escudo temporal para reducir el daño recibido.",

      energy: 50,
      cooldown: 8,
      power: 0,
      radius: 0,

      effect: "shield",

      duration: 6,

      shield: 75,

      color: "#ffd34d",

      icon: "⬢"
    },


    inferno: {
      id: "inferno",
      name: "INFERNO",
      rarity: "mythic",
      rarityName: "Mítica",

      description:
        "Crea una zona de energía que daña a los enemigos cercanos.",

      energy: 60,
      cooldown: 9,
      power: 260,
      radius: 260,

      effect: "area",

      duration: 5,

      color: "#ff6347",

      icon: "🔥"
    },


    recovery: {
      id: "recovery",
      name: "RECOVERY CORE",
      rarity: "rare",
      rarityName: "Rara",

      description:
        "Recupera una parte de los puntos de vida.",

      energy: 40,
      cooldown: 7,
      power: 60,
      radius: 0,

      effect: "heal",

      color: "#49e68a",

      icon: "+"
    },


    vortex: {
      id: "vortex",
      name: "VORTEX",
      rarity: "epic",
      rarityName: "Épica",

      description:
        "Genera un campo que ralentiza a los enemigos.",

      energy: 55,
      cooldown: 8,
      power: 110,
      radius: 230,

      effect: "slow",

      duration: 5,

      slowMultiplier: 0.35,

      color: "#48d8ff",

      icon: "◎"
    },


    thunder: {
      id: "thunder",
      name: "THUNDER",
      rarity: "legendary",
      rarityName: "Legendaria",

      description:
        "Descarga energía sobre múltiples enemigos.",

      energy: 65,
      cooldown: 10,
      power: 320,
      radius: 320,

      effect: "chain",

      chains: 5,

      color: "#ffe45c",

      icon: "⚡"
    },


    phantom: {
      id: "phantom",
      name: "PHANTOM",
      rarity: "mythic",
      rarityName: "Mítica",

      description:
        "Aumenta temporalmente la evasión del jugador.",

      energy: 55,
      cooldown: 10,
      power: 0,
      radius: 0,

      effect: "evasion",

      duration: 5,

      evasion: 0.5,

      color: "#b56cff",

      icon: "◇"
    },


    omega: {
      id: "omega",
      name: "OMEGA CORE",
      rarity: "omega",
      rarityName: "Omega",

      description:
        "La habilidad definitiva del sistema SCORVEX.",

      energy: 100,
      cooldown: 15,
      power: 650,
      radius: 400,

      effect: "ultimate",

      duration: 4,

      color: "#ffe66d",

      icon: "Ω"
    }

  };


  /* =======================================================
     HABILIDADES ADICIONALES
     ======================================================= */

  const prefixes = [
    "ARC",
    "VOID",
    "CYBER",
    "NOVA",
    "DARK",
    "SOLAR",
    "QUANTUM",
    "OMEGA",
    "STORM",
    "ZERO"
  ];


  const effects = [
    "BLAST",
    "CORE",
    "PULSE",
    "FIELD",
    "WAVE",
    "DRIVE",
    "BURST",
    "STRIKE",
    "SURGE",
    "ZONE"
  ];


  const generatedAbilities = {};

  let counter = 1;


  /* =======================================================
     GENERAR HABILIDADES
  ======================================================= */

  for (let i = 0; i < 80; i++) {

    const prefix =
      prefixes[
        i % prefixes.length
      ];

    const effect =
      effects[
        Math.floor(i / prefixes.length) %
        effects.length
      ];

    const id =
      `ability_${String(counter).padStart(3, "0")}`;

    const power =
      90 +
      (i % 10) * 22;

    const energy =
      25 +
      (i % 8) * 8;

    const radius =
      160 +
      (i % 7) * 30;

    const rarityIndex =
      Math.min(
        7,
        Math.floor(i / 12)
      );

    const rarity =
      [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
        "mythic",
        "ancient",
        "omega"
      ][rarityIndex];


    const rarityData = {
      common: {
        name: "Común",
        color: "#b8c2cc"
      },

      uncommon: {
        name: "Poco común",
        color: "#55d66b"
      },

      rare: {
        name: "Rara",
        color: "#3da5ff"
      },

      epic: {
        name: "Épica",
        color: "#a66cff"
      },

      legendary: {
        name: "Legendaria",
        color: "#ffb52e"
      },

      mythic: {
        name: "Mítica",
        color: "#ff4edb"
      },

      ancient: {
        name: "Ancestral",
        color: "#ff6655"
      },

      omega: {
        name: "Omega",
        color: "#ffe66d"
      }
    }[rarity];


    generatedAbilities[id] = {

      id,

      name:
        `${prefix} ${effect} ${String(i + 1).padStart(2, "0")}`,

      rarity,

      rarityName:
        rarityData.name,

      description:
        `Habilidad especial ${rarityData.name} del sistema SCORVEX G8.`,

      energy,

      cooldown:
        3 + (i % 10),

      power,

      radius,

      duration:
        2 + (i % 5),

      effect:
        i % 4 === 0
          ? "explosion"
          : i % 4 === 1
            ? "area"
            : i % 4 === 2
              ? "slow"
              : "plasma",

      color:
        rarityData.color,

      icon:
        ["✦", "⚡", "◈", "◎", "Ω"][
          i % 5
        ]

    };

    counter++;

  }


  /* =======================================================
     AGREGAR HABILIDADES GENERADAS
  ======================================================= */

  Object.assign(
    abilities,
    generatedAbilities
  );


  /* =======================================================
     OBTENER HABILIDAD
  ======================================================= */

  function getAbility(id) {

    return (
      abilities[id] ||
      abilities.nova
    );

  }


  /* =======================================================
     OBTENER POR RAREZA
  ======================================================= */

  function getByRarity(rarity) {

    return Object.values(
      abilities
    ).filter(
      ability =>
        ability.rarity === rarity
    );

  }


  /* =======================================================
     BUSCAR HABILIDADES
  ======================================================= */

  function search(text) {

    const query =
      String(text || "")
        .toLowerCase()
        .trim();

    if (!query) {

      return Object.values(
        abilities
      );

    }

    return Object.values(
      abilities
    ).filter(
      ability =>
        ability.name
          .toLowerCase()
          .includes(query) ||

        ability.description
          .toLowerCase()
          .includes(query) ||

        ability.rarityName
          .toLowerCase()
          .includes(query)
    );

  }


  /* =======================================================
     HABILIDAD ALEATORIA
  ======================================================= */

  function random() {

    const list =
      Object.values(
        abilities
      );

    return list[
      Math.floor(
        Math.random() *
        list.length
      )
    ];

  }


  /* =======================================================
     HABILIDAD ALEATORIA POR RAREZA
  ======================================================= */

  function randomByRarity(rarity) {

    const list =
      getByRarity(rarity);

    if (!list.length) {

      return null;

    }

    return list[
      Math.floor(
        Math.random() *
        list.length
      )
    ];

  }


  /* =======================================================
     EXPORTAR
  ======================================================= */

  window.SCORVEX_ABILITIES =
    abilities;


  window.getScorvexAbility =
    getAbility;


  window.getScorvexAbilitiesByRarity =
    getByRarity;


  window.searchScorvexAbilities =
    search;


  window.getRandomScorvexAbility =
    random;


  window.getRandomScorvexAbilityByRarity =
    randomByRarity;


  console.log(
    `SCORVEX G8: ${Object.keys(abilities).length} habilidades cargadas.`
  );

})();
