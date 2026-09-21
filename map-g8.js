(() => {
  "use strict";

  /*
   * SCORVEX G8 — SISTEMA DE MAPA
   * Mapa original para el modo de combate.
   *
   * Incluye:
   * - Sectores
   * - Zonas de combate
   * - Obstáculos
   * - Puntos de aparición
   * - Portales
   * - Límites del mapa
   * - Selección de sector
   */

  const MAP_WIDTH = 1800;
  const MAP_HEIGHT = 1100;

  const SECTORS = {
    alpha: {
      id: "alpha",
      name: "Sector Alpha",
      description: "Zona urbana abandonada.",
      x: 0,
      y: 0,
      width: 600,
      height: 550,
      difficulty: 1,
      color: "#1677ff"
    },

    beta: {
      id: "beta",
      name: "Sector Beta",
      description: "Zona industrial de alto riesgo.",
      x: 600,
      y: 0,
      width: 600,
      height: 550,
      difficulty: 2,
      color: "#8d5cff"
    },

    gamma: {
      id: "gamma",
      name: "Sector Gamma",
      description: "Área de energía experimental.",
      x: 1200,
      y: 0,
      width: 600,
      height: 550,
      difficulty: 3,
      color: "#ff3d71"
    },

    delta: {
      id: "delta",
      name: "Sector Delta",
      description: "Territorio de combate pesado.",
      x: 0,
      y: 550,
      width: 600,
      height: 550,
      difficulty: 4,
      color: "#ff9f1c"
    },

    epsilon: {
      id: "epsilon",
      name: "Sector Epsilon",
      description: "Zona táctica avanzada.",
      x: 600,
      y: 550,
      width: 600,
      height: 550,
      difficulty: 5,
      color: "#19d17f"
    },

    omega: {
      id: "omega",
      name: "Sector Omega",
      description: "Centro de energía Omega.",
      x: 1200,
      y: 550,
      width: 600,
      height: 550,
      difficulty: 6,
      color: "#ffd43b"
    }
  };

  const SPAWN_POINTS = [
    { id: "spawn_01", x: 80, y: 80 },
    { id: "spawn_02", x: 1720, y: 80 },
    { id: "spawn_03", x: 80, y: 1020 },
    { id: "spawn_04", x: 1720, y: 1020 },
    { id: "spawn_05", x: 900, y: 80 },
    { id: "spawn_06", x: 900, y: 1020 },
    { id: "spawn_07", x: 80, y: 550 },
    { id: "spawn_08", x: 1720, y: 550 }
  ];

  const OBSTACLES = [
    {
      id: "wall_01",
      x: 180,
      y: 160,
      width: 180,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_02",
      x: 420,
      y: 320,
      width: 35,
      height: 180,
      type: "wall"
    },

    {
      id: "wall_03",
      x: 720,
      y: 140,
      width: 230,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_04",
      x: 980,
      y: 300,
      width: 35,
      height: 210,
      type: "wall"
    },

    {
      id: "wall_05",
      x: 1300,
      y: 160,
      width: 240,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_06",
      x: 1480,
      y: 350,
      width: 35,
      height: 170,
      type: "wall"
    },

    {
      id: "wall_07",
      x: 170,
      y: 720,
      width: 220,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_08",
      x: 430,
      y: 850,
      width: 35,
      height: 170,
      type: "wall"
    },

    {
      id: "wall_09",
      x: 700,
      y: 690,
      width: 240,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_10",
      x: 970,
      y: 850,
      width: 35,
      height: 180,
      type: "wall"
    },

    {
      id: "wall_11",
      x: 1300,
      y: 700,
      width: 240,
      height: 35,
      type: "wall"
    },

    {
      id: "wall_12",
      x: 1480,
      y: 850,
      width: 35,
      height: 170,
      type: "wall"
    },

    {
      id: "center_wall_01",
      x: 780,
      y: 470,
      width: 240,
      height: 35,
      type: "energy-wall"
    },

    {
      id: "center_wall_02",
      x: 780,
      y: 595,
      width: 240,
      height: 35,
      type: "energy-wall"
    }
  ];

  const PORTALS = [
    {
      id: "portal_alpha",
      from: "alpha",
      to: "beta",
      x: 580,
      y: 270,
      targetX: 620,
      targetY: 270
    },

    {
      id: "portal_beta",
      from: "beta",
      to: "gamma",
      x: 1180,
      y: 270,
      targetX: 1220,
      targetY: 270
    },

    {
      id: "portal_delta",
      from: "delta",
      to: "epsilon",
      x: 580,
      y: 820,
      targetX: 620,
      targetY: 820
    },

    {
      id: "portal_epsilon",
      from: "epsilon",
      to: "omega",
      x: 1180,
      y: 820,
      targetX: 1220,
      targetY: 820
    },

    {
      id: "portal_center",
      from: "epsilon",
      to: "omega",
      x: 900,
      y: 520,
      targetX: 900,
      targetY: 580
    }
  ];

  function getSector(id) {
    return SECTORS[id] || SECTORS.alpha;
  }

  function getAllSectors() {
    return Object.values(SECTORS);
  }

  function getSectorAt(x, y) {
    for (const sector of Object.values(SECTORS)) {
      if (
        x >= sector.x &&
        x <= sector.x + sector.width &&
        y >= sector.y &&
        y <= sector.y + sector.height
      ) {
        return sector;
      }
    }

    return SECTORS.alpha;
  }

  function getSectorForWave(wave) {
    wave = Math.max(1, Number(wave) || 1);

    if (wave <= 3) return SECTORS.alpha;
    if (wave <= 6) return SECTORS.beta;
    if (wave <= 10) return SECTORS.gamma;
    if (wave <= 15) return SECTORS.delta;
    if (wave <= 20) return SECTORS.epsilon;

    return SECTORS.omega;
  }

  function getDifficulty(wave) {
    return getSectorForWave(wave).difficulty;
  }

  function getSpawnPoints() {
    return SPAWN_POINTS.map(point => ({ ...point }));
  }

  function getRandomSpawnPoint(options = {}) {
    const exclude = Array.isArray(options.exclude)
      ? options.exclude
      : [];

    const available = SPAWN_POINTS.filter(
      point => !exclude.includes(point.id)
    );

    const list = available.length
      ? available
      : SPAWN_POINTS;

    return {
      ...list[Math.floor(Math.random() * list.length)]
    };
  }

  function getSectorSpawnPoints(sectorId) {
    const sector = getSector(sectorId);

    return SPAWN_POINTS.filter(point => {
      return (
        point.x >= sector.x &&
        point.x <= sector.x + sector.width &&
        point.y >= sector.y &&
        point.y <= sector.y + sector.height
      );
    });
  }

  function getObstacles() {
    return OBSTACLES.map(obstacle => ({ ...obstacle }));
  }

  function getPortals() {
    return PORTALS.map(portal => ({ ...portal }));
  }

  function getPortalAt(x, y, radius = 30) {
    return PORTALS.find(portal => {
      return Math.hypot(portal.x - x, portal.y - y) <= radius;
    }) || null;
  }

  function teleportThroughPortal(entity, portal) {
    if (!entity || !portal) {
      return false;
    }

    entity.x = portal.targetX;
    entity.y = portal.targetY;

    return true;
  }

  function clampPosition(entity, radius = 20) {
    if (!entity) return entity;

    const r = Math.max(0, Number(radius) || 0);

    entity.x = Math.max(
      r,
      Math.min(MAP_WIDTH - r, Number(entity.x) || r)
    );

    entity.y = Math.max(
      r,
      Math.min(MAP_HEIGHT - r, Number(entity.y) || r)
    );

    return entity;
  }

  function isInsideObstacle(x, y, radius = 0) {
    const r = Math.max(0, Number(radius) || 0);

    return OBSTACLES.some(obstacle => {
      return (
        x + r > obstacle.x &&
        x - r < obstacle.x + obstacle.width &&
        y + r > obstacle.y &&
        y - r < obstacle.y + obstacle.height
      );
    });
  }

  function resolveObstacleCollision(entity, radius = 20) {
    if (!entity) return entity;

    const r = Math.max(0, Number(radius) || 0);

    for (const obstacle of OBSTACLES) {
      const closestX = Math.max(
        obstacle.x,
        Math.min(entity.x, obstacle.x + obstacle.width)
      );

      const closestY = Math.max(
        obstacle.y,
        Math.min(entity.y, obstacle.y + obstacle.height)
      );

      const dx = entity.x - closestX;
      const dy = entity.y - closestY;
      const distance = Math.hypot(dx, dy);

      if (distance < r) {
        if (Math.abs(dx) > Math.abs(dy)) {
          entity.x =
            dx >= 0
              ? obstacle.x + obstacle.width + r
              : obstacle.x - r;
        } else {
          entity.y =
            dy >= 0
              ? obstacle.y + obstacle.height + r
              : obstacle.y - r;
        }
      }
    }

    return clampPosition(entity, r);
  }

  function canMoveTo(x, y, radius = 20) {
    if (
      x < radius ||
      y < radius ||
      x > MAP_WIDTH - radius ||
      y > MAP_HEIGHT - radius
    ) {
      return false;
    }

    return !isInsideObstacle(x, y, radius);
  }

  function distanceToCenter(x, y) {
    return Math.hypot(
      x - MAP_WIDTH / 2,
      y - MAP_HEIGHT / 2
    );
  }

  function getMapInfo() {
    return {
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      sectors: getAllSectors(),
      obstacles: getObstacles(),
      portals: getPortals(),
      spawnPoints: getSpawnPoints()
    };
  }

  function draw(ctx, camera = { x: 0, y: 0 }) {
    if (!ctx) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();

    ctx.translate(-camera.x, -camera.y);

    // Fondo.
    ctx.fillStyle = "#061225";
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Cuadrícula.
    ctx.strokeStyle = "rgba(80,180,255,0.07)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= MAP_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }

    for (let y = 0; y <= MAP_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    // Sectores.
    Object.values(SECTORS).forEach(sector => {
      ctx.fillStyle = `${sector.color}10`;
      ctx.fillRect(
        sector.x,
        sector.y,
        sector.width,
        sector.height
      );

      ctx.strokeStyle = `${sector.color}55`;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        sector.x,
        sector.y,
        sector.width,
        sector.height
      );

      ctx.fillStyle = `${sector.color}aa`;
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        sector.name,
        sector.x + 20,
        sector.y + 32
      );
    });

    // Obstáculos.
    OBSTACLES.forEach(obstacle => {
      ctx.fillStyle =
        obstacle.type === "energy-wall"
          ? "#5c4cff"
          : "#172b42";

      ctx.strokeStyle =
        obstacle.type === "energy-wall"
          ? "#a58cff"
          : "#3d6289";

      ctx.lineWidth = 2;

      ctx.fillRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );

      ctx.strokeRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
    });

    // Portales.
    PORTALS.forEach(portal => {
      ctx.save();

      ctx.beginPath();
      ctx.arc(
        portal.x,
        portal.y,
        24,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(0,210,255,0.18)";
      ctx.fill();

      ctx.strokeStyle = "#00d9ff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        portal.x,
        portal.y,
        13,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    });

    // Puntos de aparición.
    SPAWN_POINTS.forEach(point => {
      ctx.save();

      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#20e3ff";
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();

    // Evita warnings por variables no usadas en algunos navegadores.
    void width;
    void height;
  }

  window.SCORVEX_MAP = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,

    sectors: SECTORS,
    spawnPoints: SPAWN_POINTS,
    obstacles: OBSTACLES,
    portals: PORTALS,

    getSector,
    getAllSectors,
    getSectorAt,
    getSectorForWave,
    getDifficulty,

    getSpawnPoints,
    getRandomSpawnPoint,
    getSectorSpawnPoints,

    getObstacles,
    getPortals,
    getPortalAt,

    teleportThroughPortal,

    clampPosition,
    isInsideObstacle,
    resolveObstacleCollision,
    canMoveTo,

    distanceToCenter,
    getMapInfo,
    draw
  };
})();
