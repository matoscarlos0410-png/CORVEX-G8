(() => {
  "use strict";

  /*
   * ============================================================
   * SCORVEX G8 — MOTOR PRINCIPAL
   * ============================================================
   *
   * Conecta:
   * - Jugador
   * - Armas
   * - Habilidades
   * - Enemigos
   * - IA
   * - Jefes
   * - Mapa
   * - Eventos
   * - Combate
   * - Inventario
   * - Misiones
   * - Logros
   * - Progresión
   * - Audio
   * - Guardado
   *
   * Controles:
   * W A S D / flechas = movimiento
   * Mouse = apuntar
   * Click = disparar
   * Espacio = habilidad
   * P = pausar
   */

  const $ = id => document.getElementById(id);

  let canvas = null;
  let ctx = null;

  let player = null;
  let enemies = [];
  let boss = null;

  let running = false;
  let paused = false;

  let keys = {};
  let mouse = {
    x: 0,
    y: 0,
    down: false
  };

  let wave = 1;
  let score = 0;

  let spawnClock = 0;
  let waveClock = 0;

  let lastTime = 0;
  let animationFrame = 0;

  let save = null;

  let gameStats = {
    shots: 0,
    hits: 0,
    kills: 0,
    damage: 0,
    damageTaken: 0,
    bosses: 0
  };

  /* ============================================================
     UTILIDADES
     ============================================================ */

  function num(value, fallback = 0) {
    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  function random(min, max) {
    return Math.random() *
      (max - min) +
      min;
  }

  function toast(message) {
    const element = $("toast");

    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
      element.classList.remove("show");
    }, 2000);
  }

  function refreshSave() {
    if (window.SCORVEX_SAVE?.load) {
      save =
        window.SCORVEX_SAVE.load();
    }

    return save;
  }

  /* ============================================================
     INTERFAZ
     ============================================================ */

  function refreshUI() {
    refreshSave();

    if (!save) return;

    if ($("coins")) {
      $("coins").textContent =
        num(save.coins).toLocaleString();
    }

    if ($("crystals")) {
      $("crystals").textContent =
        num(save.crystals).toLocaleString();
    }

    if ($("level")) {
      $("level").textContent =
        num(save.level, 1);
    }

    const weapon =
      window.getScorvexWeapon
        ? window.getScorvexWeapon(
            save.weapon
          )
        : window.SCORVEX_WEAPONS?.[
            save.weapon
          ];

    if ($("weaponName")) {
      $("weaponName").textContent =
        weapon?.name ||
        "SCORVEX G8";
    }

    if ($("weaponStats") && weapon) {
      $("weaponStats").textContent =
        `Daño ${weapon.damage} · ` +
        `Precisión ${weapon.accuracy} · ` +
        `Cargador ${weapon.magazine}`;
    }

    const requiredXP =
      window.SCORVEX_PROGRESSION
        ?.getRequiredXP
        ? window.SCORVEX_PROGRESSION
            .getRequiredXP(
              num(save.level, 1)
            )
        : Math.max(
            100,
            num(save.level, 1) * 100
          );

    const xp =
      num(save.xp);

    const xpPercent =
      requiredXP > 0
        ? clamp(
            xp / requiredXP * 100,
            0,
            100
          )
        : 0;

    if ($("xpBar")) {
      $("xpBar").style.width =
        `${xpPercent}%`;
    }

    if ($("xpText")) {
      $("xpText").textContent =
        `${Math.round(xp)} / ${Math.round(requiredXP)} XP`;
    }
  }

  function refreshGameUI() {
    if (!player) return;

    const hp =
      clamp(
        num(player.hp),
        0,
        num(player.maxHp, 100)
      );

    const energy =
      clamp(
        num(player.energy),
        0,
        num(player.maxEnergy, 100)
      );

    if ($("hpText")) {
      $("hpText").textContent =
        `${Math.round(hp)}/${Math.round(player.maxHp)}`;
    }

    if ($("energyText")) {
      $("energyText").textContent =
        `${Math.round(energy)}/${Math.round(player.maxEnergy)}`;
    }

    if ($("hpBar")) {
      $("hpBar").style.width =
        `${player.maxHp > 0
          ? hp / player.maxHp * 100
          : 0}%`;
    }

    if ($("energyBar")) {
      $("energyBar").style.width =
        `${player.maxEnergy > 0
          ? energy / player.maxEnergy * 100
          : 0}%`;
    }

    if ($("wave")) {
      $("wave").textContent =
        wave;
    }

    if ($("score")) {
      $("score").textContent =
        Math.round(score).toLocaleString();
    }

    if ($("enemyCount")) {
      $("enemyCount").textContent =
        enemies.filter(
          e => e && e.alive
        ).length +
        (boss?.alive ? 1 : 0);
    }
  }

  /* ============================================================
     PANELES
     ============================================================ */

  function openPanel(name) {
    const modal =
      $("modal");

    const content =
      $("modalContent");

    if (!modal || !content) return;

    let html = "";

    refreshSave();

    if (name === "inventory") {
      html = renderInventory();
    }

    else if (name === "shop") {
      html = renderShop();
    }

    else if (name === "missions") {
      html = renderMissions();
    }

    else if (name === "achievements") {
      html = renderAchievements();
    }

    else if (name === "characters") {
      html = renderCharacters();
    }

    else {
      html = renderSettings();
    }

    content.innerHTML = html;
    modal.hidden = false;

    bindPanelButtons(name);
  }

  function renderInventory() {
    const owned =
      save?.ownedWeapons || [];

    let items = owned
      .map(id =>
        window.getScorvexWeapon
          ? window.getScorvexWeapon(id)
          : window.SCORVEX_WEAPONS?.[id]
      )
      .filter(Boolean);

    items = items.slice(0, 80);

    return `
      <h2>🎒 Inventario G8</h2>

      <p class="muted">
        Arma equipada:
        ${
          window.getScorvexWeapon
            ? (
                window.getScorvexWeapon(
                  save.weapon
                )?.name ||
                save.weapon
              )
            : save.weapon
        }
      </p>

      <div class="cards">
        ${
          items.map(weapon => `
            <div class="card">
              <h3 class="rarity-${weapon.rarity}">
                ${weapon.name}
              </h3>

              <p>
                ${weapon.rarityName}
                · ${weapon.type}
              </p>

              <p>
                Daño ${weapon.damage}
                · Alcance ${weapon.range}
              </p>

              <button
                data-equip="${weapon.id}"
              >
                ${
                  save.weapon === weapon.id
                    ? "EQUIPADA"
                    : "EQUIPAR"
                }
              </button>
            </div>
          `).join("")
        }
      </div>
    `;
  }

  function renderShop() {
    const weapons =
      window.SCORVEX_WEAPONS
        ? Object.values(
            window.SCORVEX_WEAPONS
          )
        : [];

    return `
      <h2>🛒 Tienda SCORVEX G8</h2>

      <p class="muted">
        Economía totalmente virtual.
      </p>

      <div class="cards">
        ${
          weapons
            .filter(w => w.price > 0)
            .slice(0, 60)
            .map(weapon => `
              <div class="card">

                <h3 class="rarity-${weapon.rarity}">
                  ${weapon.name}
                </h3>

                <p>
                  ${weapon.rarityName}
                  · ${weapon.type}
                </p>

                <p>
                  🪙
                  ${num(
                    weapon.price
                  ).toLocaleString()}
                </p>

                <button
                  data-buy="${weapon.id}"
                >
                  COMPRAR
                </button>

              </div>
            `)
            .join("")
        }
      </div>
    `;
  }

  function renderMissions() {
    const missions =
      window.SCORVEX_MISSIONS
        ?.list || {};

    return `
      <h2>🎯 Misiones</h2>

      <div class="cards">
        ${
          Object.entries(missions)
            .map(([id, mission]) => {

              const data =
                save?.missions?.[id] ||
                {
                  progress: 0,
                  claimed: false
                };

              const progress =
                num(data.progress);

              const completed =
                progress >=
                mission.target;

              return `
                <div class="card">

                  <h3>
                    ${mission.name}
                  </h3>

                  <p>
                    ${mission.description}
                  </p>

                  <p>
                    Progreso:
                    ${progress}/${mission.target}
                  </p>

                  <p>
                    🪙
                    ${num(
                      mission.reward
                    ).toLocaleString()}
                  </p>

                  <button
                    data-claim="${id}"
                    ${
                      !completed ||
                      data.claimed
                        ? "disabled"
                        : ""
                    }
                  >
                    ${
                      data.claimed
                        ? "RECLAMADA"
                        : completed
                          ? "RECLAMAR"
                          : "EN PROGRESO"
                    }
                  </button>

                </div>
              `;
            })
            .join("")
        }
      </div>
    `;
  }

  function renderAchievements() {
    const achievements =
      window.SCORVEX_ACHIEVEMENTS
        ?.getAll
        ? window.SCORVEX_ACHIEVEMENTS
            .getAll()
        : [];

    return `
      <h2>🏆 Logros</h2>

      <div class="cards">
        ${
          achievements
            .map(a => {

              const state =
                window.SCORVEX_ACHIEVEMENTS
                  ?.getProgress
                  ? window.SCORVEX_ACHIEVEMENTS
                      .getProgress(a.id)
                  : {
                      progress: 0,
                      completed: false,
                      claimed: false
                    };

              const progress =
                num(state?.progress);

              const percent =
                clamp(
                  progress /
                    Math.max(
                      1,
                      a.target
                    ) *
                    100,
                  0,
                  100
                );

              return `
                <div class="card">

                  <h3>
                    ${a.name}
                  </h3>

                  <p>
                    ${a.description}
                  </p>

                  <p>
                    ${progress}/${a.target}
                  </p>

                  <div class="xp-track">
                    <div
                      class="xp-fill"
                      style="width:${percent}%"
                    ></div>
                  </div>

                  <p>
                    🪙
                    ${num(
                      a.reward
                    ).toLocaleString()}
                    · ${a.xp} XP
                  </p>

                  ${
                    state?.completed &&
                    !state?.claimed
                      ? `
                        <button
                          data-achievement="${a.id}"
                        >
                          RECLAMAR
                        </button>
                      `
                      : `
                        <small>
                          ${
                            state?.claimed
                              ? "✓ RECLAMADO"
                              : "EN PROGRESO"
                          }
                        </small>
                      `
                  }

                </div>
              `;
            })
            .join("")
        }
      </div>
    `;
  }

  function renderCharacters() {
    const characters =
      window.SCORVEX_CHARACTERS
        ? Object.values(
            window.SCORVEX_CHARACTERS
          )
        : [];

    return `
      <h2>🧍 Personalización</h2>

      <div class="cards">
        ${
          characters
            .map(character => `
              <div class="card">

                <h3
                  class="rarity-${character.rarity}"
                >
                  ${character.name}
                </h3>

                <p>
                  ${character.type}
                </p>

                <p>
                  ${character.description || ""}
                </p>

                <button
                  data-character="${character.id}"
                >
                  EQUIPAR
                </button>

              </div>
            `)
            .join("")
        }
      </div>
    `;
  }

  function renderSettings() {
    return `
      <h2>⚙️ Ajustes G8</h2>

      <div class="cards">

        <div class="card">

          <h3>🔊 Audio</h3>

          <button id="musicToggle">
            Alternar música
          </button>

          <button id="soundToggle">
            Alternar sonidos
          </button>

        </div>

        <div class="card">

          <h3>💾 Partida</h3>

          <button id="saveGame">
            GUARDAR
          </button>

          <button id="exportGame">
            EXPORTAR GUARDADO
          </button>

          <button id="resetSave">
            RESTABLECER PARTIDA
          </button>

        </div>

      </div>
    `;
  }

  function bindPanelButtons(name) {
    const content =
      $("modalContent");

    if (!content) return;

    content
      .querySelectorAll("[data-equip]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.equip;

            if (
              window.SCORVEX_INVENTORY
                ?.equipWeapon
            ) {
              window.SCORVEX_INVENTORY
                .equipWeapon(id);

              refreshUI();

              openPanel("inventory");

              toast("🔫 Arma equipada");
            }
          }
        );
      });

    content
      .querySelectorAll("[data-buy]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.buy;

            if (
              window.SCORVEX_SHOP?.buy
            ) {
              const result =
                window.SCORVEX_SHOP
                  .buy(id);

              toast(
                result?.message ||
                "Compra realizada"
              );

              refreshUI();

              openPanel(name);
            }
          }
        );
      });

    content
      .querySelectorAll("[data-claim]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.claim;

            const result =
              window.SCORVEX_MISSIONS
                ?.claim
                ? window.SCORVEX_MISSIONS
                    .claim(id)
                : false;

            toast(
              result
                ? "🏆 Recompensa reclamada"
                : "No disponible"
            );

            refreshUI();

            openPanel("missions");
          }
        );
      });

    content
      .querySelectorAll(
        "[data-achievement]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.achievement;

            const result =
              window.SCORVEX_ACHIEVEMENTS
                ?.claim
                ? window.SCORVEX_ACHIEVEMENTS
                    .claim(id)
                : null;

            toast(
              result?.message ||
              "No disponible"
            );

            refreshUI();

            openPanel("achievements");
          }
        );
      });

    content
      .querySelectorAll(
        "[data-character]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.character;

            const current =
              SCORVEX_SAVE.load();

            current.customization =
              current.customization ||
              {};

            current.customization.character =
              id;

            SCORVEX_SAVE.save(
              current
            );

            toast(
              "🧍 Personaje equipado"
            );

            refreshUI();
          }
        );
      });

    $("musicToggle")
      ?.addEventListener(
        "click",
        () => {

          const current =
            SCORVEX_SAVE.load();

          current.settings =
            current.settings || {};

          current.settings.music =
            !current.settings.music;

          SCORVEX_SAVE.save(
            current
          );

          SCORVEX_AUDIO
            ?.setMusicEnabled
            ?.(
              current.settings.music
            );

          toast(
            current.settings.music
              ? "🎵 Música activada"
              : "🎵 Música desactivada"
          );
        }
      );

    $("soundToggle")
      ?.addEventListener(
        "click",
        () => {

          const current =
            SCORVEX_SAVE.load();

          current.settings =
            current.settings || {};

          current.settings.sound =
            !current.settings.sound;

          SCORVEX_SAVE.save(
            current
          );

          SCORVEX_AUDIO
            ?.setSoundEnabled
            ?.(
              current.settings.sound
            );

          toast(
            current.settings.sound
              ? "🔊 Sonidos activados"
              : "🔇 Sonidos desactivados"
          );
        }
      );

    $("saveGame")
      ?.addEventListener(
        "click",
        () => {

          SCORVEX_SAVE.save(
            SCORVEX_SAVE.load()
          );

          toast(
            "💾 Partida guardada"
          );
        }
      );

    $("exportGame")
      ?.addEventListener(
        "click",
        () => {

          if (
            SCORVEX_SAVE?.export
          ) {
            const data =
              SCORVEX_SAVE.export();

            try {
              const blob =
                new Blob(
                  [data],
                  {
                    type:
                      "application/json"
                  }
                );

              const url =
                URL.createObjectURL(
                  blob
                );

              const a =
                document.createElement(
                  "a"
                );

              a.href = url;
              a.download =
                "scorvex-g8-save.json";

              a.click();

              URL.revokeObjectURL(
                url
              );

              toast(
                "💾 Guardado exportado"
              );
            } catch {
              toast(
                "No se pudo exportar"
              );
            }
          }
        }
      );

    $("resetSave")
      ?.addEventListener(
        "click",
        () => {

          const confirmed =
            window.confirm(
              "¿Restablecer toda la partida?"
            );

          if (!confirmed) {
            return;
          }

          SCORVEX_SAVE.reset();

          location.reload();
        }
      );
  }

  /* ============================================================
     ENEMIGOS
     ============================================================ */

  function spawnEnemy() {
    if (!canvas) return;

    const types = [
      "scout",
      "striker",
      "sniper",
      "drone",
      "hunter",
      "guardian",
      "tank"
    ];

    const type =
      types[
        Math.floor(
          Math.random() *
          types.length
        )
      ];

    let spawn;

    if (
      window.SCORVEX_MAP
        ?.getRandomSpawnPoint
    ) {
      spawn =
        window.SCORVEX_MAP
          .getRandomSpawnPoint();
    } else {
      spawn = {
        x: random(
          30,
          canvas.clientWidth - 30
        ),
        y: random(
          30,
          canvas.clientHeight - 30
        )
      };
    }

    const enemy =
      window.createScorvexEnemy
        ? window.createScorvexEnemy(
            type,
            spawn
          )
        : null;

    if (!enemy) return;

    const difficulty =
      window.SCORVEX_MAP
        ?.getDifficulty
        ? window.SCORVEX_MAP
            .getDifficulty(wave)
        : 1;

    const elite =
      window.SCORVEX_EVENTS
        ?.hasEffect?.(
          "eliteEnemies"
        );

    if (elite) {
      enemy.maxHp *= 1.5;
      enemy.hp =
        enemy.maxHp;

      enemy.damage *= 1.25;
    }

    enemy.hp *=
      1 +
      (difficulty - 1) *
        0.08;

    enemy.maxHp =
      enemy.hp;

    enemies.push(enemy);
  }

  function spawnBoss() {
    if (boss?.alive) {
      return;
    }

    const ids = [
      "titan",
      "overlord",
      "omega"
    ];

    let index = 0;

    if (wave >= 25) {
      index = 2;
    } else if (wave >= 15) {
      index = 1;
    }

    const id =
      ids[index];

    if (
      window.createScorvexBoss
    ) {
      boss =
        window.createScorvexBoss(
          id,
          {
            x:
              canvas.clientWidth / 2,
            y: 80
          }
        );

      toast(
        `👑 JEFE: ${boss.name}`
      );
    }
  }

  /* ============================================================
     DISPARO
     ============================================================ */

  function getWeapon() {
    refreshSave();

    if (!save) return null;

    return window.getScorvexWeapon
      ? window.getScorvexWeapon(
          save.weapon
        )
      : window.SCORVEX_WEAPONS?.[
          save.weapon
        ];
  }

  function shoot() {
    if (
      !running ||
      paused ||
      !player ||
      !player.alive
    ) {
      return;
    }

    const weapon =
      getWeapon();

    if (!weapon) return;

    gameStats.shots++;

    const targetX =
      mouse.x;

    const targetY =
      mouse.y;

    const angle =
      Math.atan2(
        targetY - player.y,
        targetX - player.x
      );

    player.angle =
      angle;

    let target = null;
    let bestDistance =
      Infinity;

    const allTargets = [
      ...enemies,
      ...(boss?.alive
        ? [boss]
        : [])
    ];

    for (
      const enemy of allTargets
    ) {
      if (
        !enemy ||
        enemy.alive === false
      ) {
        continue;
      }

      const dx =
        enemy.x -
        player.x;

      const dy =
        enemy.y -
        player.y;

      const d =
        Math.hypot(dx, dy);

      if (
        d >
        num(
          weapon.range,
          300
        )
      ) {
        continue;
      }

      const targetAngle =
        Math.atan2(
          dy,
          dx
        );

      let difference =
        Math.abs(
          targetAngle -
          angle
        );

      if (difference > Math.PI) {
        difference =
          Math.PI * 2 -
          difference;
      }

      const accuracy =
        clamp(
          num(
            weapon.accuracy,
            70
          ),
          1,
          100
        );

      const cone =
        (1 -
          accuracy / 100) *
          0.35 +
        0.025;

      if (
        difference <= cone &&
        d < bestDistance
      ) {
        target = enemy;
        bestDistance = d;
      }
    }

    if (target) {
      const dealt =
        window.SCORVEX_COMBAT
          ?.damageEnemy
          ? window.SCORVEX_COMBAT
              .damageEnemy(
                target,
                weapon.damage,
                player,
                {
                  weapon
                }
              )
          : 0;

      if (dealt > 0) {
        gameStats.hits++;
        gameStats.damage +=
          dealt;

        player.damage =
          num(player.damage) +
          dealt;

        if (
          window.SCORVEX_COMBAT
            ?.recordDamage
        ) {
          window.SCORVEX_COMBAT
            .recordDamage(
              dealt
            );
        }

        if (
          window.SCORVEX_EVENTS
            ?.addDamage
        ) {
          window.SCORVEX_EVENTS
            .addDamage(
              dealt
            );
        }
      }

      if (
        target.alive === false ||
        target.hp <= 0
      ) {
        defeatTarget(
          target
        );
      }
    }

    if (
      window.SCORVEX_AUDIO
        ?.shoot
    ) {
      window.SCORVEX_AUDIO
        .shoot();
    }

    const current =
      SCORVEX_SAVE.load();

    current.stats =
      current.stats || {};

    current.stats.shots =
      num(current.stats.shots) +
      1;

    current.stats.hits =
      num(current.stats.hits) +
      (
        target
          ? 1
          : 0
      );

    SCORVEX_SAVE.save(
      current
    );
  }

  function defeatTarget(target) {
    if (!target) return;

    const reward =
      num(target.reward, 0);

    const xp =
      num(target.xp, 0);

    if (target === boss) {
      gameStats.bosses++;

      const current =
        SCORVEX_SAVE.load();

      current.stats =
        current.stats || {};

      current.stats.bosses =
        num(
          current.stats.bosses
        ) + 1;

      current.stats.kills =
        num(
          current.stats.kills
        ) + 1;

      current.score =
        num(
          current.score
        ) + reward;

      SCORVEX_SAVE.save(
        current
      );

      score += reward;

      if (
        window.SCORVEX_PROGRESSION
          ?.addXP
      ) {
        window.SCORVEX_PROGRESSION
          .addXP(xp);
      }

      if (
        window.SCORVEX_EVENTS
          ?.addKill
      ) {
        window.SCORVEX_EVENTS
          .addKill(1);
      }

      boss = null;

      toast(
        `👑 JEFE DERROTADO · +${reward.toLocaleString()}`
      );

      return;
    }

    const current =
      SCORVEX_SAVE.load();

    current.stats =
      current.stats || {};

    current.stats.kills =
      num(
        current.stats.kills
      ) + 1;

    current.score =
      num(
        current.score
      ) + reward;

    SCORVEX_SAVE.save(
      current
    );

    score += reward;

    if (
      window.SCORVEX_MISSIONS
        ?.update
    ) {
      window.SCORVEX_MISSIONS
        .update(
          "kills",
          1
        );
    }

    if (
      window.SCORVEX_PROGRESSION
        ?.addXP
    ) {
      window.SCORVEX_PROGRESSION
        .addXP(xp);
    }

    if (
      window.SCORVEX_EVENTS
        ?.addKill
    ) {
      window.SCORVEX_EVENTS
        .addKill(1);
    }

    toast(
      `+${reward.toLocaleString()} puntos`
    );
  }

  /* ============================================================
     HABILIDAD
     ============================================================ */

  function useAbility() {
    if (
      !running ||
      paused ||
      !player
    ) {
      return;
    }

    refreshSave();

    const ability =
      window.getScorvexAbility
        ? window.getScorvexAbility(
            save?.ability ||
            "nova"
          )
        : window.SCORVEX_ABILITIES?.[
            save?.ability ||
            "nova"
          ];

    if (!ability) {
      return;
    }

    const result =
      window.SCORVEX_PLAYER
        ?.useAbility
        ? window.SCORVEX_PLAYER
            .useAbility(
              player,
              enemies
            )
        : null;

    if (
      !result?.success
    ) {
      toast(
        result?.message ||
        "No puedes usar la habilidad"
      );

      return;
    }

    if (
      window.SCORVEX_AUDIO
        ?.ability
    ) {
      window.SCORVEX_AUDIO
        .ability();
    }

    const current =
      SCORVEX_SAVE.load();

    current.stats =
      current.stats || {};

    current.stats.abilities =
      num(
        current.stats
          .abilities
      ) + 1;

    current.stats.damage =
      num(
        current.stats.damage
      ) +
      num(result.damage);

    SCORVEX_SAVE.save(
      current
    );

    if (
      window.SCORVEX_MISSIONS
        ?.update
    ) {
      window.SCORVEX_MISSIONS
        .update(
          "abilities",
          1
        );

      window.SCORVEX_MISSIONS
        .update(
          "damage",
          num(result.damage)
        );
    }

    toast(
      `⚡ ${ability.name} · ${Math.round(result.damage)} daño`
    );
  }

  /* ============================================================
     ACTUALIZACIÓN
     ============================================================ */

  function update(dt, now) {
    if (
      !player ||
      !running ||
      paused
    ) {
      return;
    }

    /* Movimiento */

    let dx = 0;
    let dy = 0;

    if (
      keys.w ||
      keys.ArrowUp
    ) {
      dy -= 1;
    }

    if (
      keys.s ||
      keys.ArrowDown
    ) {
      dy += 1;
    }

    if (
      keys.a ||
      keys.ArrowLeft
    ) {
      dx -= 1;
    }

    if (
      keys.d ||
      keys.ArrowRight
    ) {
      dx += 1;
    }

    if (dx !== 0 || dy !== 0) {
      window.SCORVEX_PLAYER
        ?.move(
          player,
          dx,
          dy,
          dt
        );
    }

    /* Apuntar */

    if (canvas) {
      const rect =
        canvas.getBoundingClientRect();

      player.angle =
        Math.atan2(
          mouse.y -
            player.y,
          mouse.x -
            player.x
        );

      void rect;
    }

    /* Jugador */

    window.SCORVEX_PLAYER
      ?.update(
        player,
        dt
      );

    /* Enemigos */

    for (
      const enemy of enemies
    ) {
      if (
        !enemy ||
        !enemy.alive
      ) {
        continue;
      }

      if (
        window.SCORVEX_AI
          ?.update
      ) {
        window.SCORVEX_AI
          .update(
            enemy,
            player,
            dt,
            now
          );
      }

      const d =
        Math.hypot(
          enemy.x -
            player.x,
          enemy.y -
            player.y
        );

      if (
        d <=
        num(enemy.radius, 20) +
        player.radius
      ) {
        if (
          now -
          num(
            enemy.lastAttack,
            0
          ) >
          num(
            enemy.rate,
            1000
          )
        ) {
          const dealt =
            window.SCORVEX_PLAYER
              ?.takeDamage
              ? window.SCORVEX_PLAYER
                  .takeDamage(
                    player,
                    enemy.damage
                  )
              : 0;

          enemy.lastAttack =
            now;

          gameStats.damageTaken +=
            dealt;

          if (
            player.hp <= 0
          ) {
            gameOver();
            return;
          }
        }
      }
    }

    /* Jefe */

    if (
      boss &&
      boss.alive
    ) {
      if (
        window.SCORVEX_AI
          ?.update
      ) {
        window.SCORVEX_AI
          .update(
            boss,
            player,
            dt,
            now
          );
      }

      const d =
        Math.hypot(
          boss.x -
            player.x,
          boss.y -
            player.y
        );

      if (
        d <=
        num(boss.radius, 60) +
        player.radius
      ) {
        if (
          now -
          num(
            boss.lastAttack,
            0
          ) >
          num(
            boss.rate,
            1000
          )
        ) {
          window.SCORVEX_PLAYER
            ?.takeDamage(
              player,
              boss.damage
            );

          boss.lastAttack =
            now;
        }
      }
    }

    /* Aparición de enemigos */

    spawnClock -=
      dt * 16.67;

    if (
      spawnClock <= 0
    ) {
      const rush =
        window.SCORVEX_EVENTS
          ?.hasEffect?.(
            "enemyRush"
          );

      const amount =
        rush ? 2 : 1;

      for (
        let i = 0;
        i < amount;
        i++
      ) {
        spawnEnemy();
      }

      spawnClock =
        Math.max(
          350,
          1100 -
          wave * 30
        );
    }

    /* Cambio de oleada */

    waveClock +=
      dt * 16.67;

    const living =
      enemies.filter(
        e =>
          e &&
          e.alive
      ).length;

    if (
      living === 0 &&
      waveClock > 2500
    ) {
      nextWave();
    }

    /* Regeneración */

    if (
      player.alive
    ) {
      window.SCORVEX_PLAYER
        ?.regenerateEnergy(
          player,
          dt
        );
    }

    /* Eventos */

    window.SCORVEX_EVENTS
      ?.update?.();

    /* Limpiar enemigos */

    enemies =
      enemies.filter(
        enemy =>
          enemy &&
          (
            enemy.alive ||
            num(enemy.hp) > 0
          )
      );

    refreshGameUI();
  }

  function nextWave() {
    wave++;
    waveClock = 0;

    refreshSave();

    if (save) {
      save.wave =
        wave;

      save.sector =
        window.SCORVEX_MAP
          ?.getSectorForWave
          ? window.SCORVEX_MAP
              .getSectorForWave(
                wave
              ).id
          : save.sector;

      SCORVEX_SAVE.save(
        save
      );
    }

    toast(
      `⚡ OLEADA ${wave}`
    );

    if (
      wave % 10 === 0
    ) {
      spawnBoss();
    }

    const amount =
      Math.min(
        8,
        2 +
        Math.floor(
          wave / 3
        )
      );

    for (
      let i = 0;
      i < amount;
      i++
    ) {
      spawnEnemy();
    }
  }

  /* ============================================================
     DIBUJADO
     ============================================================ */

  function draw() {
    if (!ctx || !canvas) {
      return;
    }

    const width =
      canvas.clientWidth;

    const height =
      canvas.clientHeight;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    /* Fondo */

    ctx.fillStyle =
      "#061225";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    /* Cuadrícula */

    ctx.strokeStyle =
      "rgba(0,170,255,0.08)";

    ctx.lineWidth = 1;

    for (
      let x = 0;
      x < width;
      x += 50
    ) {
      ctx.beginPath();

      ctx.moveTo(
        x,
        0
      );

      ctx.lineTo(
        x,
        height
      );

      ctx.stroke();
    }

    for (
      let y = 0;
      y < height;
      y += 50
    ) {
      ctx.beginPath();

      ctx.moveTo(
        0,
        y
      );

      ctx.lineTo(
        width,
        y
      );

      ctx.stroke();
    }

    /* Obstáculos */

    if (
      window.SCORVEX_MAP
        ?.getObstacles
    ) {
      const obstacles =
        window.SCORVEX_MAP
          .getObstacles();

      obstacles.forEach(
        obstacle => {

          ctx.fillStyle =
            obstacle.type ===
            "energy-wall"
              ? "#3b2b82"
              : "#142a43";

          ctx.strokeStyle =
            obstacle.type ===
            "energy-wall"
              ? "#9b86ff"
              : "#3f678e";

          ctx.lineWidth = 2;

          ctx.fillRect(
            obstacle.x * 0.5,
            obstacle.y * 0.5,
            obstacle.width,
            obstacle.height
          );

          ctx.strokeRect(
            obstacle.x * 0.5,
            obstacle.y * 0.5,
            obstacle.width,
            obstacle.height
          );
        }
      );
    }

    /* Enemigos */

    enemies.forEach(
      enemy => {

        if (
          !enemy ||
          !enemy.alive
        ) {
          return;
        }

        const x =
          enemy.x;

        const y =
          enemy.y;

        const radius =
          num(
            enemy.radius,
            18
          );

        ctx.save();

        ctx.translate(
          x,
          y
        );

        ctx.rotate(
          num(
            enemy.rotation
          )
        );

        /* Cuerpo */

        ctx.fillStyle =
          enemy.color ||
          "#ff4d6d";

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /* Visor */

        ctx.fillStyle =
          "#07101d";

        ctx.fillRect(
          0,
          -4,
          radius + 12,
          8
        );

        ctx.restore();

        /* Barra de vida */

        const hpRatio =
          clamp(
            num(enemy.hp) /
              Math.max(
                1,
                num(enemy.maxHp)
              ),
            0,
            1
          );

        ctx.fillStyle =
          "#182333";

        ctx.fillRect(
          x - radius,
          y - radius - 10,
          radius * 2,
          4
        );

        ctx.fillStyle =
          "#32e56e";

        ctx.fillRect(
          x - radius,
          y - radius - 10,
          radius * 2 *
            hpRatio,
          4
        );
      }
    );

    /* Jefe */

    if (
      boss &&
      boss.alive
    ) {
      const x =
        boss.x;

      const y =
        boss.y;

      const radius =
        num(
          boss.radius,
          60
        );

      ctx.save();

      ctx.translate(
        x,
        y
      );

      ctx.rotate(
        performance.now() /
        1000
      );

      ctx.strokeStyle =
        "#ffd43b";

      ctx.lineWidth = 5;

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        radius + 8,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.fillStyle =
        "#ff4d71";

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle =
        "#101828";

      ctx.fillRect(
        5,
        -5,
        radius + 18,
        10
      );

      ctx.restore();

      const bossRatio =
        clamp(
          num(boss.hp) /
            Math.max(
              1,
              num(boss.maxHp)
            ),
          0,
          1
        );

      ctx.fillStyle =
        "#25131b";

      ctx.fillRect(
        x - radius,
        y - radius - 16,
        radius * 2,
        7
      );

      ctx.fillStyle =
        "#ffd43b";

      ctx.fillRect(
        x - radius,
        y - radius - 16,
        radius * 2 *
          bossRatio,
        7
      );

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "bold 14px Arial";

      ctx.textAlign =
        "center";

      ctx.fillText(
        boss.name ||
        "BOSS",
        x,
        y -
          radius -
          22
      );
    }

    /* Jugador */

    if (
      player &&
      player.alive
    ) {
      ctx.save();

      ctx.translate(
        player.x,
        player.y
      );

      ctx.rotate(
        player.angle
      );

      /* Efecto de invulnerabilidad */

      if (
        player.invulnerable
      ) {
        ctx.strokeStyle =
          "#00d9ff";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          player.radius + 8,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }

      /* Cuerpo */

      ctx.fillStyle =
        "#e8f4ff";

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        player.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /* Núcleo */

      ctx.fillStyle =
        "#00aaff";

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        7,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /* Arma */

      ctx.fillStyle =
        "#d8e7f5";

      ctx.fillRect(
        10,
        -4,
        28,
        8
      );

      ctx.restore();
    }

    /* Mira */

    ctx.save();

    ctx.strokeStyle =
      "rgba(255,255,255,0.8)";

    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(
      mouse.x - 8,
      mouse.y
    );

    ctx.lineTo(
      mouse.x + 8,
      mouse.y
    );

    ctx.moveTo(
      mouse.x,
      mouse.y - 8
    );

    ctx.lineTo(
      mouse.x,
      mouse.y + 8
    );

    ctx.stroke();

    ctx.restore();

    /* Evento */

    if (
      window.SCORVEX_EVENTS
        ?.draw
    ) {
      window.SCORVEX_EVENTS.draw(
        ctx,
        width,
        height
      );
    }

    if (paused) {
      ctx.fillStyle =
        "rgba(0,0,0,0.55)";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        "bold 30px Arial";

      ctx.textAlign =
        "center";

      ctx.fillText(
        "PAUSA",
        width / 2,
        height / 2
      );
    }
  }

  /* ============================================================
     TAMAÑO DEL CANVAS
     ============================================================ */

  function resize() {
    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    const dpr =
      Math.min(
        2,
        window.devicePixelRatio || 1
      );

    canvas.width =
      Math.max(
        1,
        Math.round(
          rect.width * dpr
        )
      );

    canvas.height =
      Math.max(
        1,
        Math.round(
          rect.height * dpr
        )
      );

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    if (player) {
      player.x =
        clamp(
          player.x,
          player.radius,
          rect.width -
            player.radius
        );

      player.y =
        clamp(
          player.y,
          player.radius,
          rect.height -
            player.radius
        );
    }
  }

  /* ============================================================
     INICIAR PARTIDA
     ============================================================ */

  function startGame() {
    if (!canvas) {
      canvas =
        $("gameCanvas");
    }

    if (!canvas) {
      toast(
        "No se encontró el área de juego."
      );

      return;
    }

    ctx =
      canvas.getContext(
        "2d"
      );

    if (!ctx) {
      toast(
        "No se pudo iniciar el motor gráfico."
      );

      return;
    }

    refreshSave();

    player =
      window.SCORVEX_PLAYER
        ?.create
        ? window.SCORVEX_PLAYER
            .create(canvas)
        : {
            x:
              canvas.clientWidth /
              2,
            y:
              canvas.clientHeight /
              2,
            radius: 18,
            hp: 100,
            maxHp: 100,
            energy: 100,
            maxEnergy: 100,
            speed: 3,
            angle: 0,
            alive: true
          };

    enemies = [];
    boss = null;

    wave =
      num(
        save?.wave,
        1
      );

    score =
      num(
        save?.score,
        0
      );

    spawnClock = 0;
    waveClock = 0;

    gameStats = {
      shots: 0,
      hits: 0,
      kills: 0,
      damage: 0,
      damageTaken: 0,
      bosses: 0
    };

    running = true;
    paused = false;

    $("menu") &&
      ($("menu").hidden = true);

    $("game") &&
      ($("game").hidden = false);

    resize();

    if (
      window.SCORVEX_AUDIO
        ?.init
    ) {
      window.SCORVEX_AUDIO.init();
    }

    if (
      window.SCORVEX_AUDIO
        ?.startMusic
    ) {
      window.SCORVEX_AUDIO
        .startMusic();
    }

    for (
      let i = 0;
      i < 3;
      i++
    ) {
      spawnEnemy();
    }

    lastTime =
      performance.now();

    cancelAnimationFrame(
      animationFrame
    );

    animationFrame =
      requestAnimationFrame(
        loop
      );

    toast(
      "⚔️ ¡COMIENZA LA MISIÓN!"
    );
  }

  /* ============================================================
     PAUSA
     ============================================================ */

  function togglePause() {
    if (!running) return;

    paused =
      !paused;

    toast(
      paused
        ? "⏸️ Juego pausado"
        : "▶️ Juego reanudado"
    );

    if (!paused) {
      lastTime =
        performance.now();
    }
  }

  /* ============================================================
     FIN DE PARTIDA
     ============================================================ */

  function gameOver() {
    if (!running) return;

    running = false;
    paused = false;

    refreshSave();

    if (save) {
      save.stats =
        save.stats || {};

      save.stats.defeats =
        num(
          save.stats.defeats
        ) + 1;

      save.score =
        Math.max(
          num(save.score),
          score
        );

      SCORVEX_SAVE.save(
        save
      );
    }

    if (
      window.SCORVEX_AUDIO
        ?.stopMusic
    ) {
      window.SCORVEX_AUDIO
        .stopMusic();
    }

    toast(
      "💥 MISIÓN TERMINADA"
    );

    setTimeout(
      () => {
        if ($("game")) {
          $("game").hidden =
            true;
        }

        if ($("menu")) {
          $("menu").hidden =
            false;
        }

        refreshUI();
      },
      1200
    );
  }

  /* ============================================================
     BUCLE PRINCIPAL
     ============================================================ */

  function loop(time) {
    if (!running) {
      draw();
      return;
    }

    const dt =
      Math.min(
        2,
        Math.max(
          0,
          (time - lastTime) /
            16.67
        )
      );

    lastTime =
      time;

    if (!paused) {
      update(
        dt,
        time
      );
    }

    draw();

    animationFrame =
      requestAnimationFrame(
        loop
      );
  }

  /* ============================================================
     CONTROLES
     ============================================================ */

  window.addEventListener(
    "keydown",
    event => {

      keys[event.key] =
        true;

      if (
        event.key === " " ||
        event.code ===
          "Space"
      ) {
        event.preventDefault();

        useAbility();
      }

      if (
        event.key.toLowerCase() ===
        "p"
      ) {
        togglePause();
      }
    }
  );

  window.addEventListener(
    "keyup",
    event => {
      keys[event.key] =
        false;
    }
  );

  window.addEventListener(
    "resize",
    resize
  );

  /* Mouse */

  function updateMouse(event) {
    if (!canvas) return;

    const rect =
      canvas.getBoundingClientRect();

    mouse.x =
      event.clientX -
      rect.left;

    mouse.y =
      event.clientY -
      rect.top;
  }

  function bindCanvas() {
    if (!canvas) return;

    canvas.addEventListener(
      "pointermove",
      updateMouse
    );

    canvas.addEventListener(
      "pointerdown",
      event => {

        updateMouse(event);

        mouse.down =
          true;

        shoot();
      }
    );

    window.addEventListener(
      "pointerup",
      () => {
        mouse.down =
          false;
      }
    );
  }

  /* ============================================================
     BOTONES
     ============================================================ */

  function bindButtons() {
    $("startBtn")
      ?.addEventListener(
        "click",
        () => {

          $("boot") &&
            ($("boot").hidden =
              true);

          $("cover") &&
            ($("cover").hidden =
              true);

          $("app") &&
            ($("app").hidden =
              false);

          refreshUI();

          if (
            window.SCORVEX_AUDIO
              ?.init
          ) {
            window.SCORVEX_AUDIO
              .init();
          }
        }
      );

    $("playBtn")
      ?.addEventListener(
        "click",
        startGame
      );

    $("pauseBtn")
      ?.addEventListener(
        "click",
        togglePause
      );

    $("abilityBtn")
      ?.addEventListener(
        "click",
        useAbility
      );

    $("medkitBtn")
      ?.addEventListener(
        "click",
        () => {

          if (!player) return;

          const result =
            window.SCORVEX_INVENTORY
              ?.useMedkit
              ? window.SCORVEX_INVENTORY
                  .useMedkit(
                    player
                  )
              : false;

          toast(
            result
              ? "❤️ Medkit usado"
              : "No puedes usarlo"
          );
        }
      );

    $("energyBtn")
      ?.addEventListener(
        "click",
        () => {

          if (!player) return;

          const result =
            window.SCORVEX_INVENTORY
              ?.useEnergy
              ? window.SCORVEX_INVENTORY
                  .useEnergy(
                    player
                  )
              : false;

          toast(
            result
              ? "🔋 Energía restaurada"
              : "No puedes usarlo"
          );
        }
      );

    $("closeModal")
      ?.addEventListener(
        "click",
        () => {

          if ($("modal")) {
            $("modal").hidden =
              true;
          }
        }
      );

    document
      .querySelectorAll(
        "[data-panel]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            openPanel(
              button.dataset
                .panel
            );
          }
        );
      });
  }

  /* ============================================================
     AUTO-DISPARO
     ============================================================ */

  function autoShootLoop() {
    if (
      running &&
      !paused &&
      mouse.down
    ) {
      shoot();
    }

    requestAnimationFrame(
      autoShootLoop
    );
  }

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */

  function init() {
    canvas =
      $("gameCanvas");

    bindButtons();
    bindCanvas();

    refreshUI();

    setTimeout(
      () => {

        if ($("boot")) {
          $("boot").hidden =
            true;
        }

      },
      900
    );

    autoShootLoop();
  }

  init();

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  window.SCORVEX_GAME = {
    start: startGame,
    pause: togglePause,

    isRunning: () =>
      running,

    isPaused: () =>
      paused,

    getPlayer: () =>
      player,

    getEnemies: () =>
      enemies,

    getBoss: () =>
      boss,

    getWave: () =>
      wave,

    getScore: () =>
      score,

    shoot,
    useAbility,

    nextWave,

    refreshUI,
    refreshGameUI
  };
})();
