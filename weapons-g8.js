/* =========================================================
   SCORVEX G8
   WEAPONS SYSTEM
   1000 ARMAS
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  const TOTAL_WEAPONS = 1000;

  const rarities = [
    {
      id: "common",
      name: "Común",
      multiplier: 1,
      color: "#b8c2cc",
      chance: 42
    },

    {
      id: "uncommon",
      name: "Poco común",
      multiplier: 1.15,
      color: "#55d66b",
      chance: 25
    },

    {
      id: "rare",
      name: "Rara",
      multiplier: 1.35,
      color: "#3da5ff",
      chance: 15
    },

    {
      id: "epic",
      name: "Épica",
      multiplier: 1.7,
      color: "#a66cff",
      chance: 9
    },

    {
      id: "legendary",
      name: "Legendaria",
      multiplier: 2.1,
      color: "#ffb52e",
      chance: 5
    },

    {
      id: "mythic",
      name: "Mítica",
      multiplier: 2.7,
      color: "#ff4edb",
      chance: 2.5
    },

    {
      id: "ancient",
      name: "Ancestral",
      multiplier: 3.5,
      color: "#ff6655",
      chance: 1
    },

    {
      id: "omega",
      name: "Omega",
      multiplier: 5,
      color: "#ffe66d",
      chance: 0.5
    }
  ];


  /* =======================================================
     TIPOS DE ARMAS
  ======================================================= */

  const weaponTypes = [

    {
      id: "pistol",
      name: "Pistola",
      damage: 28,
      range: 360,
      accuracy: 86,
      magazine: 15,
      fireRate: 260
    },

    {
      id: "smg",
      name: "Subfusil",
      damage: 24,
      range: 300,
      accuracy: 72,
      magazine: 35,
      fireRate: 90
    },

    {
      id: "rifle",
      name: "Fusil",
      damage: 42,
      range: 520,
      accuracy: 88,
      magazine: 30,
      fireRate: 150
    },

    {
      id: "assault",
      name: "Fusil de asalto",
      damage: 48,
      range: 560,
      accuracy: 84,
      magazine: 36,
      fireRate: 125
    },

    {
      id: "shotgun",
      name: "Escopeta",
      damage: 115,
      range: 210,
      accuracy: 58,
      magazine: 8,
      fireRate: 720
    },

    {
      id: "sniper",
      name: "Francotirador",
      damage: 180,
      range: 900,
      accuracy: 97,
      magazine: 5,
      fireRate: 1200
    },

    {
      id: "marksman",
      name: "Tirador",
      damage: 105,
      range: 760,
      accuracy: 94,
      magazine: 12,
      fireRate: 500
    },

    {
      id: "lmg",
      name: "Ametralladora",
      damage: 38,
      range: 500,
      accuracy: 70,
      magazine: 80,
      fireRate: 105
    },

    {
      id: "energy",
      name: "Arma de energía",
      damage: 62,
      range: 650,
      accuracy: 91,
      magazine: 40,
      fireRate: 130
    },

    {
      id: "omega",
      name: "Arma Omega",
      damage: 150,
      range: 1000,
      accuracy: 99,
      magazine: 50,
      fireRate: 80
    }

  ];


  /* =======================================================
     NOMBRES
  ======================================================= */

  const prefixes = [

    "Shadow",
    "Nova",
    "Titan",
    "Vortex",
    "Phantom",
    "Inferno",
    "Omega",
    "Specter",
    "Raven",
    "Storm",
    "Cyber",
    "Neon",
    "Void",
    "Apex",
    "Quantum",
    "Dark",
    "Solar",
    "Lunar",
    "Crimson",
    "Frost",
    "Thunder",
    "Eclipse",
    "Venom",
    "Ghost",
    "Zero",
    "Hyper",
    "Chaos",
    "Pulse",
    "Blaze",
    "Core"

  ];


  const cores = [

    "X",
    "GX",
    "V8",
    "G8",
    "RX",
    "ZX",
    "MK",
    "NX",
    "EX",
    "VX",
    "AX",
    "QX",
    "TX",
    "KX",
    "MX",
    "SX",
    "DX",
    "PX",
    "LX",
    "OX"

  ];


  const suffixes = [

    "Prime",
    "Ultra",
    "Pro",
    "Elite",
    "Strike",
    "Force",
    "Hunter",
    "Breaker",
    "Destroyer",
    "Reaper",
    "Guardian",
    "Predator",
    "Phantom",
    "Dominion",
    "Core",
    "Zero",
    "Infinity",
    "Overdrive",
    "Omega"

  ];


  /* =======================================================
     ICONOS SVG
  ======================================================= */

  function weaponIcon(type, rarity) {

    const r =
      rarities.find(x => x.id === rarity);

    const color =
      r ? r.color : "#ffffff";

    let shape = "";

    switch (type) {

      case "pistol":

        shape = `
          <rect x="42" y="48"
                width="70"
                height="22"
                rx="7"/>
          <path d="M72 70 L92 70 L86 108 L66 108 Z"/>
        `;

        break;


      case "smg":

        shape = `
          <rect x="30" y="45"
                width="105"
                height="24"
                rx="8"/>
          <path d="M64 69 L92 69 L84 108 L60 108 Z"/>
          <rect x="112" y="35"
                width="12"
                height="18"/>
        `;

        break;


      case "rifle":
      case "assault":

        shape = `
          <rect x="22" y="45"
                width="120"
                height="20"
                rx="6"/>
          <rect x="125" y="38"
                width="35"
                height="8"
                rx="4"/>
          <path d="M55 65 L88 65 L80 110 L56 110 Z"/>
          <rect x="28" y="38"
                width="42"
                height="7"
                rx="3"/>
        `;

        break;


      case "shotgun":

        shape = `
          <rect x="20" y="48"
                width="145"
                height="19"
                rx="6"/>
          <rect x="25" y="42"
                width="135"
                height="6"
                rx="3"/>
          <path d="M68 67 L100 67 L88 110 L62 110 Z"/>
        `;

        break;


      case "sniper":

        shape = `
          <rect x="15" y="49"
                width="150"
                height="15"
                rx="5"/>
          <rect x="35" y="39"
                width="82"
                height="8"
                rx="4"/>
          <circle cx="128"
                  cy="43"
                  r="10"/>
          <path d="M65 64 L98 64 L88 108 L61 108 Z"/>
        `;

        break;


      case "marksman":

        shape = `
          <rect x="18" y="48"
                width="145"
                height="17"
                rx="5"/>
          <rect x="40" y="39"
                width="70"
                height="7"
                rx="3"/>
          <path d="M62 65 L96 65 L86 106 L62 106 Z"/>
        `;

        break;


      case "lmg":

        shape = `
          <rect x="18" y="46"
                width="150"
                height="25"
                rx="7"/>
          <rect x="30" y="38"
                width="95"
                height="7"
                rx="3"/>
          <path d="M55 71 L92 71 L82 112 L55 112 Z"/>
          <circle cx="133"
                  cy="84"
                  r="16"/>
        `;

        break;


      case "energy":

        shape = `
          <path d="
            M20 60
            L72 35
            L160 48
            L110 70
            L160 82
            L72 90
            Z"/>
          <circle cx="78"
                  cy="63"
                  r="16"/>
        `;

        break;


      case "omega":

        shape = `
          <path d="
            M15 62
            L55 30
            L165 48
            L125 62
            L165 76
            L55 94
            Z"/>
          <circle cx="82"
                  cy="62"
                  r="22"/>
          <path d="
            M72 62
            L82 47
            L92 62
            L82 77
            Z"/>
        `;

        break;


      default:

        shape = `
          <rect x="25"
                y="45"
                width="135"
                height="25"
                rx="8"/>
        `;

    }


    return `
      <svg
        viewBox="0 0 180 125"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Icono de arma"
      >

        <defs>

          <linearGradient
            id="g_${rarity}"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >

            <stop
              offset="0%"
              stop-color="${color}"
            />

            <stop
              offset="100%"
              stop-color="#ffffff"
            />

          </linearGradient>

        </defs>

        <g
          fill="url(#g_${rarity})"
          stroke="${color}"
          stroke-width="2"
        >

          ${shape}

        </g>

        <circle
          cx="90"
          cy="62"
          r="58"
          fill="none"
          stroke="${color}"
          stroke-opacity=".12"
          stroke-width="3"
        />

      </svg>
    `;

  }


  /* =======================================================
     GENERAR RAREZA
  ======================================================= */

  function randomRarity(index) {

    /*
     * Las primeras armas garantizan
     * variedad para la progresión inicial.
     */

    if (index === 1) {

      return "common";

    }

    const roll =
      Math.random() * 100;

    let total = 0;

    for (const rarity of rarities) {

      total += rarity.chance;

      if (roll <= total) {

        return rarity.id;

      }

    }

    return "common";

  }


  /* =======================================================
     GENERAR ARMAS
  ======================================================= */

  const weapons = {};


  for (
    let i = 1;
    i <= TOTAL_WEAPONS;
    i++
  ) {

    const type =
      weaponTypes[
        (i - 1) %
        weaponTypes.length
      ];


    const rarityId =
      randomRarity(i);


    const rarity =
      rarities.find(
        r => r.id === rarityId
      );


    const prefix =
      prefixes[
        (i * 7) %
        prefixes.length
      ];


    const core =
      cores[
        (i * 11) %
        cores.length
      ];


    const suffix =
      suffixes[
        (i * 13) %
        suffixes.length
      ];


    const level =
      Math.floor(
        (i - 1) / 100
      ) + 1;


    const multiplier =
      rarity.multiplier *
      (1 + level * 0.025);


    const damage =
      Math.round(
        type.damage *
        multiplier
      );


    const range =
      Math.round(
        type.range *
        (1 + level * 0.01)
      );


    const accuracy =
      Math.min(
        99,
        Math.round(
          type.accuracy +
          (rarity.multiplier - 1) * 8 +
          level * 0.15
        )
      );


    const magazine =
      Math.round(
        type.magazine *
        (1 + (rarity.multiplier - 1) * 0.35)
      );


    const fireRate =
      Math.max(
        45,
        Math.round(
          type.fireRate /
          Math.max(
            1,
            rarity.multiplier * 0.9
          )
        )
      );


    const price =
      Math.round(
        (
          400 +
          damage * 22 +
          range * 2 +
          magazine * 12
        ) *
        rarity.multiplier *
        (1 + level * 0.18)
      );


    const id =
      `weapon_${String(i).padStart(4, "0")}`;


    const name =
      `${prefix} ${core} ${suffix}`;


    weapons[id] = {

      id,

      name,

      type: type.id,

      typeName: type.name,

      rarity: rarity.id,

      rarityName: rarity.name,

      rarityColor: rarity.color,

      level,

      damage,

      range,

      accuracy,

      magazine,

      fireRate,

      price,

      criticalChance:
        Math.min(
          50,
          Math.round(
            4 +
            rarity.multiplier * 3 +
            level * 0.2
          )
        ),

      penetration:
        Math.round(
          5 +
          rarity.multiplier * 7 +
          level * 0.5
        ),

      stability:
        Math.min(
          99,
          Math.round(
            type.accuracy +
            rarity.multiplier * 4
          )
        ),

      icon:
        weaponIcon(
          type.id,
          rarity.id
        ),

      description:
        `${rarity.name} ${type.name} de la serie SCORVEX G8. Diseñada para operaciones de combate virtuales.`

    };

  }


  /* =======================================================
     ARMAS ESPECIALES
  ======================================================= */

  weapons.weapon_0001 = {

    ...weapons.weapon_0001,

    name: "SCORVEX G8",

    type: "assault",

    typeName: "Fusil de asalto",

    rarity: "common",

    rarityName: "Común",

    damage: 48,

    range: 560,

    accuracy: 88,

    magazine: 36,

    fireRate: 125,

    price: 0,

    criticalChance: 7,

    penetration: 10,

    stability: 90,

    icon:
      weaponIcon(
        "assault",
        "common"
      ),

    description:
      "El arma inicial de SCORVEX. Equilibrada y preparada para comenzar la misión."

  };


  /* =======================================================
     FUNCIONES
  ======================================================= */

  function getWeapon(id) {

    return weapons[id] || null;

  }


  function getByRarity(rarity) {

    return Object.values(
      weapons
    ).filter(
      weapon =>
        weapon.rarity === rarity
    );

  }


  function getByType(type) {

    return Object.values(
      weapons
    ).filter(
      weapon =>
        weapon.type === type
    );

  }


  function search(text) {

    const query =
      String(text || "")
        .trim()
        .toLowerCase();

    if (!query) {

      return Object.values(
        weapons
      );

    }

    return Object.values(
      weapons
    ).filter(
      weapon =>
        weapon.name
          .toLowerCase()
          .includes(query) ||

        weapon.typeName
          .toLowerCase()
          .includes(query) ||

        weapon.rarityName
          .toLowerCase()
          .includes(query)
    );

  }


  function getRandom() {

    const list =
      Object.values(
        weapons
      );

    return list[
      Math.floor(
        Math.random() *
        list.length
      )
    ];

  }


  function getRandomByRarity(
    rarity
  ) {

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


  function getRandomByType(
    type
  ) {

    const list =
      getByType(type);

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

  window.SCORVEX_WEAPONS =
    weapons;


  window.SCORVEX_STARTER_WEAPON =
    "weapon_0001";


  window.getScorvexWeapon =
    getWeapon;


  window.getScorvexWeaponsByRarity =
    getByRarity;


  window.getScorvexWeaponsByType =
    getByType;


  window.searchScorvexWeapons =
    search;


  window.getRandomScorvexWeapon =
    getRandom;


  window.getRandomScorvexWeaponByRarity =
    getRandomByRarity;


  window.getRandomScorvexWeaponByType =
    getRandomByType;


  window.SCORVEX_WEAPON_RARITIES =
    rarities;


  window.SCORVEX_WEAPON_TYPES =
    weaponTypes;


  console.log(
    `SCORVEX G8: ${Object.keys(weapons).length} armas cargadas.`
  );

})();
