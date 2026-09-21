(() => {
  "use strict";

  let ctx = null;
  let master = null;

  let musicOn = true;
  let sfxOn = true;

  let musicVolume = 0.025;
  let soundVolume = 0.08;

  let musicTimer = null;
  let musicIndex = 0;

  function init() {
    if (ctx) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;

    if (!AudioCtx) {
      console.warn("SCORVEX G8: Web Audio no disponible.");
      return;
    }

    ctx = new AudioCtx();

    master = ctx.createGain();
    master.gain.value = 0.12;

    master.connect(ctx.destination);
  }

  function ensureAudio() {
    init();

    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    return !!ctx;
  }

  function tone(
    frequency,
    duration = 0.08,
    type = "sine",
    volume = soundVolume,
    slideTo = null
  ) {
    if (!sfxOn) return;
    if (!ensureAudio()) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
      Math.max(20, frequency),
      ctx.currentTime
    );

    if (slideTo !== null) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(20, slideTo),
        ctx.currentTime + duration
      );
    }

    gain.gain.setValueAtTime(
      Math.max(0.001, volume),
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(master);

    oscillator.start();

    oscillator.stop(
      ctx.currentTime + duration
    );
  }

  function noise(duration = 0.05, volume = 0.025) {
    if (!sfxOn) return;
    if (!ensureAudio()) return;

    const bufferSize = Math.floor(
      ctx.sampleRate * duration
    );

    const buffer = ctx.createBuffer(
      1,
      bufferSize,
      ctx.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;

    gain.gain.setValueAtTime(
      volume,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );

    source.connect(gain);
    gain.connect(master);

    source.start();
  }

  function shoot() {
    tone(
      180,
      0.045,
      "sawtooth",
      soundVolume * 0.8,
      95
    );

    noise(
      0.025,
      soundVolume * 0.12
    );
  }

  function ability() {
    tone(
      300,
      0.14,
      "triangle",
      soundVolume,
      650
    );

    setTimeout(() => {
      tone(
        600,
        0.16,
        "triangle",
        soundVolume * 0.8,
        950
      );
    }, 70);
  }

  function heal() {
    tone(
      520,
      0.12,
      "sine",
      soundVolume * 0.7,
      760
    );

    setTimeout(() => {
      tone(
        760,
        0.16,
        "sine",
        soundVolume * 0.55,
        1000
      );
    }, 80);
  }

  function purchase() {
    tone(
      520,
      0.07,
      "sine",
      soundVolume * 0.8,
      650
    );

    setTimeout(() => {
      tone(
        780,
        0.1,
        "sine",
        soundVolume * 0.8,
        1000
      );
    }, 65);
  }

  function startMusic() {
    if (!musicOn) return;
    if (musicTimer) return;
    if (!ensureAudio()) return;

    const notes = [
      110,
      147,
      165,
      220,
      165,
      147,
      123,
      196
    ];

    musicIndex = 0;

    musicTimer = setInterval(() => {
      if (!musicOn || !ctx) return;

      const frequency =
        notes[musicIndex % notes.length];

      musicIndex++;

      tone(
        frequency,
        0.13,
        "triangle",
        musicVolume
      );
    }, 240);
  }

  function stopMusic() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  function setMusicEnabled(value) {
    musicOn = !!value;

    if (musicOn) {
      startMusic();
    } else {
      stopMusic();
    }
  }

  function setSoundEnabled(value) {
    sfxOn = !!value;
  }

  function setMusicVolume(value) {
    musicVolume = Math.max(
      0,
      Math.min(0.15, Number(value) || 0)
    );
  }

  function setSoundVolume(value) {
    soundVolume = Math.max(
      0,
      Math.min(0.2, Number(value) || 0)
    );
  }

  function play(name) {
    const sounds = {
      shoot,
      ability,
      heal,
      purchase
    };

    if (sounds[name]) {
      sounds[name]();
    }
  }

  window.SCORVEX_AUDIO = {
    init,
    startMusic,
    stopMusic,

    shoot,
    ability,
    heal,
    purchase,

    setMusicEnabled,
    setSoundEnabled,

    setMusicVolume,
    setSoundVolume,

    play
  };

  // Inicializa el audio solamente después
  // de una interacción del usuario.
  window.addEventListener(
    "pointerdown",
    () => {
      init();
    },
    { once: true }
  );

  window.addEventListener(
    "keydown",
    () => {
      init();
    },
    { once: true }
  );
})();
