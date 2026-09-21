(() => {
  "use strict";

  const ARMORS = {
    none: {
      id: "none",
      name: "Sin armadura",
      defense: 0,
      energy: 0,
      speed: 1,
      price: 0
    },

    light: {
      id: "light",
      name: "Armadura Ligera",
      defense: 8,
      energy: 5,
      speed: 1.08,
      price: 2500
    },

    tactical: {
      id: "tactical",
      name: "Armadura Táctica",
      defense: 16,
      energy: 10,
      speed: 1,
      price: 7000
    },

    heavy: {
      id: "heavy",
      name: "Armadura Pesada",
      defense: 28,
      energy: 18,
      speed: 0.9,
      price: 15000
    },

    omega: {
      id: "omega",
      name: "Armadura Omega",
      defense: 60,
      energy: 35,
      speed: 0.86,
      price: 50000
    }
  };

  const CONSUMABLES = {
    medkit: {
      id: "medkit",
      name: "Medkit",
      description: "Recupera puntos de vida.",
      max: 20,
      heal: 50
    },

    energyKit: {
      id: "energyKit",
      name: "Kit de Energía",
      description: "Recupera energía.",
      max: 20,
      energy: 40
    },

    shieldKit: {
      id: "shieldKit",
      name: "Kit de Escudo",
      description: "Activa protección temporal.",
      max: 10,
      shield: 40
    },

    repairKit: {
      id: "repairKit",
      name: "Kit de Reparación",
      description: "Repara parte de la armadura.",
      max: 10,
      repair: 25
    },

    grenade: {
      id: "grenade",
      name: "Granada",
      description: "Dispositivo ofensivo del juego.",
      max: 20,
      damage: 120
    }
  };

  function getSave() {
    return SCORVEX_SAVE.load();
  }

  function save(data) {
    SCORVEX_SAVE.save(data);
  }

  function getArmor(id) {
    return (
      ARMORS[id] ||
      ARMORS.none
    );
  }

  function getConsumable(id) {
    return (
      CONSUMABLES[id] ||
      null
    );
  }

  function getArmorDefense(id) {
    return getArmor(id).defense || 0;
  }

  function equipWeapon(id) {
    const data = getSave();

    if (
      !Array.isArray(
        data.ownedWeapons
      )
    ) {
      data.ownedWeapons = [];
    }

    if (
      !data.ownedWeapons.includes(id)
    ) {
      return false;
    }

    if (
      !SCORVEX_WEAPONS?.[id]
    ) {
      return false;
    }

    data.weapon = id;

    save(data);

    return true;
  }

  function equipAbility(id) {
    const data = getSave();

    if (
      !Array.isArray(
        data.ownedAbilities
      )
    ) {
      data.ownedAbilities = [];
    }

    if (
      !data.ownedAbilities.includes(id)
    ) {
      return false;
    }

    if (
      !SCORVEX_ABILITIES?.[id]
    ) {
      return false;
    }

    data.ability = id;

    save(data);

    return true;
  }

  function equipArmor(id) {
    const armor =
      getArmor(id);

    if (!armor) {
      return false;
    }

    const data = getSave();

    data.armor = id;

    save(data);

    return true;
  }

  function useMedkit(player) {
    if (!player) {
      return false;
    }

    const data = getSave();

    const amount =
      Math.max(
        0,
        Number(data.medkits) || 0
      );

    if (
      amount <= 0 ||
      player.hp >= player.maxHp
    ) {
      return false;
    }

    const healAmount =
      CONSUMABLES.medkit.heal;

    player.hp = Math.min(
      player.maxHp,
      player.hp + healAmount
    );

    data.medkits =
      amount - 1;

    save(data);

    if (
      window.SCORVEX_AUDIO
    ) {
      SCORVEX_AUDIO.heal();
    }

    return true;
  }

  function useEnergy(player) {
    if (!player) {
      return false;
    }

    const data = getSave();

    const amount =
      Math.max(
        0,
        Number(data.energyKits) || 0
      );

    if (
      amount <= 0 ||
      player.energy >=
        player.maxEnergy
    ) {
      return false;
    }

    const restore =
      CONSUMABLES.energyKit.energy;

    player.energy =
      Math.min(
        player.maxEnergy,
        player.energy + restore
      );

    data.energyKits =
      amount - 1;

    save(data);

    return true;
  }

  function useShield(player) {
    if (!player) {
      return false;
    }

    const data = getSave();

    const amount =
      Math.max(
        0,
        Number(data.shieldKits) || 0
      );

    if (amount <= 0) {
      return false;
    }

    player.shield =
      Math.max(
        player.shield || 0,
        CONSUMABLES.shieldKit.shield
      );

    data.shieldKits =
      amount - 1;

    save(data);

    return true;
  }

  function useRepair(player) {
    if (!player) {
      return false;
    }

    const data = getSave();

    const amount =
      Math.max(
        0,
        Number(data.repairKits) || 0
      );

    if (amount <= 0) {
      return false;
    }

    const armor =
      getArmor(data.armor);

    if (!armor || armor.defense <= 0) {
      return false;
    }

    player.armorDurability =
      Math.min(
        100,
        (player.armorDurability ??
          100) +
          CONSUMABLES.repairKit.repair
      );

    data.repairKits =
      amount - 1;

    save(data);

    return true;
  }

  function useGrenade() {
    const data = getSave();

    const amount =
      Math.max(
        0,
        Number(data.grenades) || 0
      );

    if (amount <= 0) {
      return false;
    }

    data.grenades =
      amount - 1;

    save(data);

    return true;
  }

  function addItem(id, amount = 1) {
    const data = getSave();

    const values = {
      medkit: "medkits",
      energyKit: "energyKits",
      shieldKit: "shieldKits",
      repairKit: "repairKits",
      grenade: "grenades"
    };

    const key = values[id];

    if (!key) {
      return false;
    }

    const item =
      getConsumable(id);

    data[key] =
      Math.min(
        item.max,
        Math.max(
          0,
          Number(data[key]) || 0
        ) + Math.max(
          0,
          Number(amount) || 0
        )
      );

    save(data);

    return true;
  }

  function removeItem(id, amount = 1) {
    const data = getSave();

    const values = {
      medkit: "medkits",
      energyKit: "energyKits",
      shieldKit: "shieldKits",
      repairKit: "repairKits",
      grenade: "grenades"
    };

    const key = values[id];

    if (!key) {
      return false;
    }

    const current =
      Math.max(
        0,
        Number(data[key]) || 0
      );

    const value =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (current < value) {
      return false;
    }

    data[key] =
      current - value;

    save(data);

    return true;
  }

  function getInventory() {
    const data = getSave();

    return {
      weapon:
        data.weapon,

      ability:
        data.ability,

      armor:
        data.armor || "none",

      medkits:
        data.medkits || 0,

      energyKits:
        data.energyKits || 0,

      shieldKits:
        data.shieldKits || 0,

      repairKits:
        data.repairKits || 0,

      grenades:
        data.grenades || 0,

      ownedWeapons:
        [...(
          data.ownedWeapons || []
        )],

      ownedAbilities:
        [...(
          data.ownedAbilities || []
        )]
    };
  }

  function getStats() {
    const data =
      getSave();

    const weapon =
      SCORVEX_WEAPONS?.[
        data.weapon
      ];

    const ability =
      SCORVEX_ABILITIES?.[
        data.ability
      ];

    const armor =
      getArmor(data.armor);

    return {
      weapon,
      ability,
      armor,

      defense:
        armor.defense,

      speed:
        armor.speed,

      energyBonus:
        armor.energy
    };
  }

  function clearConsumables() {
    const data = getSave();

    data.medkits = 0;
    data.energyKits = 0;
    data.shieldKits = 0;
    data.repairKits = 0;
    data.grenades = 0;

    save(data);

    return true;
  }

  window.SCORVEX_INVENTORY = {
    armors: ARMORS,

    consumables:
      CONSUMABLES,

    getArmor,

    getConsumable,

    getArmorDefense,

    equipWeapon,

    equipAbility,

    equipArmor,

    useMedkit,

    useEnergy,

    useShield,

    useRepair,

    useGrenade,

    addItem,

    removeItem,

    getInventory,

    getStats,

    clearConsumables
  };
})();
