/* =========================================================
   SCORVEX G8
   VIRTUAL SHOP SYSTEM
   ========================================================= */

(() => {
  "use strict";


  /* =======================================================
     OBTENER OBJETO
  ======================================================= */

  function getItem(id) {

    if (
      window.SCORVEX_CHARACTERS &&
      SCORVEX_CHARACTERS[id]
    ) {

      return SCORVEX_CHARACTERS[id];

    }

    if (
      window.SCORVEX_WEAPONS &&
      SCORVEX_WEAPONS[id]
    ) {

      return SCORVEX_WEAPONS[id];

    }

    if (
      window.SCORVEX_ABILITIES &&
      SCORVEX_ABILITIES[id]
    ) {

      return SCORVEX_ABILITIES[id];

    }

    return null;

  }


  /* =======================================================
     OBTENER LISTA DE PROPIEDAD
  ======================================================= */

  function getOwnershipKey(item) {

    if (!item) {

      return null;

    }

    switch (item.type) {

      case "weapon":
        return "ownedWeapons";

      case "ability":
        return "ownedAbilities";

      case "character":
        return "ownedCharacters";

      case "outfit":
        return "ownedOutfits";

      case "helmet":
        return "ownedHelmets";

      case "accessory":
        return "ownedAccessories";

      case "effect":
        return "ownedEffects";

      case "color":
        return "ownedColors";

      default:

        return null;

    }

  }


  /* =======================================================
     COMPROBAR PROPIEDAD
  ======================================================= */

  function owns(id) {

    const item =
      getItem(id);

    if (!item) {

      return false;

    }

    /*
     * Objetos gratuitos pueden
     * considerarse disponibles.
     */

    if (
      Number(item.price || 0) <= 0
    ) {

      return true;

    }

    const key =
      getOwnershipKey(item);

    if (!key) {

      return false;

    }

    const save =
      SCORVEX_SAVE.load();

    return Array.isArray(save[key]) &&
      save[key].includes(id);

  }


  /* =======================================================
     COMPRAR
  ======================================================= */

  function buy(id) {

    const item =
      getItem(id);

    if (!item) {

      return {

        success: false,

        message:
          "Objeto no encontrado."

      };

    }


    const save =
      SCORVEX_SAVE.load();


    const price =
      Math.max(
        0,
        Number(item.price || 0)
      );


    const key =
      getOwnershipKey(item);


    /*
     * Si ya lo tiene
     */

    if (
      key &&
      Array.isArray(save[key]) &&
      save[key].includes(id)
    ) {

      return {

        success: false,

        message:
          "Ya tienes este objeto.",

        item

      };

    }


    /*
     * Objeto gratuito
     */

    if (price === 0) {

      if (key) {

        save[key] ??= [];

        if (!save[key].includes(id)) {

          save[key].push(id);

        }

      }

      SCORVEX_SAVE.save(save);

      return {

        success: true,

        message:
          "Objeto obtenido.",

        item

      };

    }


    /*
     * Comprobar monedas
     */

    if (
      save.coins < price
    ) {

      return {

        success: false,

        message:
          `Necesitas ${price.toLocaleString()} monedas.`,

        item

      };

    }


    /*
     * Restar monedas
     */

    save.coins -= price;


    /*
     * Añadir propiedad
     */

    if (key) {

      save[key] ??= [];

      if (!save[key].includes(id)) {

        save[key].push(id);

      }

    }


    /*
     * Registrar compra
     */

    save.stats ??= {};

    save.stats.purchases =
      Number(
        save.stats.purchases || 0
      ) + 1;


    SCORVEX_SAVE.save(
      save
    );


    /*
     * Sonido
     */

    if (
      window.SCORVEX_AUDIO &&
      typeof SCORVEX_AUDIO.purchase ===
      "function"
    ) {

      SCORVEX_AUDIO.purchase();

    }


    return {

      success: true,

      message:
        `${item.name} comprado.`,

      item,

      price,

      remainingCoins:
        save.coins

    };

  }


  /* =======================================================
     EQUIPAR
  ======================================================= */

  function equip(id) {

    const item =
      getItem(id);

    if (!item) {

      return {

        success: false,

        message:
          "Objeto no encontrado."

      };

    }


    const save =
      SCORVEX_SAVE.load();


    const key =
      getOwnershipKey(item);


    /*
     * Comprobar propiedad
     */

    if (
      Number(item.price || 0) > 0 &&
      (
        !key ||
        !Array.isArray(save[key]) ||
        !save[key].includes(id)
      )
    ) {

      return {

        success: false,

        message:
          "Primero debes comprar este objeto."

      };

    }


    /* ---------------------------------------
       ARMAS
    ---------------------------------------- */

    if (
      item.type === "weapon"
    ) {

      save.weapon =
        item.id;

    }


    /* ---------------------------------------
       HABILIDADES
    ---------------------------------------- */

    else if (
      item.type === "ability"
    ) {

      save.ability =
        item.id;

    }


    /* ---------------------------------------
       PERSONALIZACIÓN
    ---------------------------------------- */

    else if (
      [
        "character",
        "outfit",
        "helmet",
        "accessory",
        "effect",
        "color"
      ].includes(item.type)
    ) {

      save.customization ??= {};

      save.customization[
        item.type
      ] = item.id;

    }


    else {

      return {

        success: false,

        message:
          "Este objeto no se puede equipar."

      };

    }


    SCORVEX_SAVE.save(
      save
    );


    return {

      success: true,

      message:
        `${item.name} equipado.`,

      item

    };

  }


  /* =======================================================
     OBTENER TIENDA DE ARMAS
  ======================================================= */

  function getWeapons() {

    if (
      !window.SCORVEX_WEAPONS
    ) {

      return [];

    }

    return Object.values(
      SCORVEX_WEAPONS
    );

  }


  /* =======================================================
     OBTENER TIENDA DE PERSONALIZACIÓN
  ======================================================= */

  function getCustomization() {

    if (
      !window.SCORVEX_CHARACTERS
    ) {

      return [];

    }

    return Object.values(
      SCORVEX_CHARACTERS
    );

  }


  /* =======================================================
     OBTENER TIENDA COMPLETA
  ======================================================= */

  function getAll() {

    return [

      ...getWeapons(),

      ...getCustomization()

    ];

  }


  /* =======================================================
     FILTRAR POR PRECIO
  ======================================================= */

  function getAffordable() {

    const save =
      SCORVEX_SAVE.load();

    return getAll().filter(
      item =>
        Number(item.price || 0)
        <= save.coins
    );

  }


  /* =======================================================
     FILTRAR POR RAREZA
  ======================================================= */

  function getByRarity(rarity) {

    return getAll().filter(
      item =>
        item.rarity === rarity
    );

  }


  /* =======================================================
     FILTRAR POR TIPO
  ======================================================= */

  function getByType(type) {

    return getAll().filter(
      item =>
        item.type === type
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

      return getAll();

    }


    return getAll().filter(
      item => {

        const name =
          String(
            item.name || ""
          ).toLowerCase();

        const type =
          String(
            item.type || ""
          ).toLowerCase();

        const rarity =
          String(
            item.rarityName || ""
          ).toLowerCase();


        return (
          name.includes(query) ||
          type.includes(query) ||
          rarity.includes(query)
        );

      }
    );

  }


  /* =======================================================
     PRECIO FORMATEADO
  ======================================================= */

  function formatPrice(item) {

    const price =
      Number(item?.price || 0);

    if (price === 0) {

      return "GRATIS";

    }

    return (
      "🪙 " +
      price.toLocaleString()
    );

  }


  /* =======================================================
     ESTADO DEL OBJETO
  ======================================================= */

  function getStatus(id) {

    const item =
      getItem(id);

    if (!item) {

      return "unknown";

    }


    const save =
      SCORVEX_SAVE.load();


    const key =
      getOwnershipKey(item);


    if (
      key &&
      Array.isArray(save[key]) &&
      save[key].includes(id)
    ) {

      if (
        item.type === "weapon" &&
        save.weapon === id
      ) {

        return "equipped";

      }


      if (
        item.type === "ability" &&
        save.ability === id
      ) {

        return "equipped";

      }


      if (
        save.customization &&
        save.customization[item.type] === id
      ) {

        return "equipped";

      }


      return "owned";

    }


    if (
      Number(item.price || 0) === 0
    ) {

      return "free";

    }


    if (
      save.coins >=
      Number(item.price || 0)
    ) {

      return "available";

    }


    return "locked";

  }


  /* =======================================================
     INFORMACIÓN DE TIENDA
  ======================================================= */

  function getItemInfo(id) {

    const item =
      getItem(id);

    if (!item) {

      return null;

    }


    const save =
      SCORVEX_SAVE.load();


    const price =
      Number(item.price || 0);


    return {

      item,

      price,

      formattedPrice:
        formatPrice(item),

      status:
        getStatus(id),

      owned:
        owns(id),

      affordable:
        save.coins >= price,

      coins:
        save.coins

    };

  }


  /* =======================================================
     EXPONER API
  ======================================================= */

  window.SCORVEX_SHOP = {

    getItem,

    getOwnershipKey,

    owns,

    buy,

    equip,

    getWeapons,

    getCustomization,

    getAll,

    getAffordable,

    getByRarity,

    getByType,

    search,

    formatPrice,

    getStatus,

    getItemInfo,

    getSave:
      () => SCORVEX_SAVE.load()

  };


  console.log(
    "SCORVEX G8: tienda virtual cargada."
  );

})();
