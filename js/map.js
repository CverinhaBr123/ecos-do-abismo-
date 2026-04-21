(function () {
  const TILE_WIDTH = 76;
  const TILE_HEIGHT = 38;
  const MAP_WIDTH = 30;
  const MAP_HEIGHT = 22;
  const PASSABLE_TILES = new Set(['floor', 'cracked', 'entry', 'exit']);

  const characterColors = {
    dwarf: {
      body: '#d6a451',
      glow: 'rgba(236, 216, 173, 0.55)',
      shadow: 'rgba(0, 0, 0, 0.48)'
    },
    pony: {
      body: '#c7a2ff',
      glow: 'rgba(199, 162, 255, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.42)'
    },
    necromancer: {
      body: '#73e0bd',
      glow: 'rgba(115, 224, 189, 0.42)',
      shadow: 'rgba(0, 0, 0, 0.54)'
    }
  };

  const characterSpritePaths = {
    dwarf: 'assets/images/map-sprites/dwarf.png',
    pony: 'assets/images/map-sprites/pony.png',
    necromancer: 'assets/images/map-sprites/necromancer.png'
  };

  const characterSpriteSettings = {
    dwarf: { scale: 0.72, anchorY: 230 },
    pony: { scale: 0.7, anchorY: 224 },
    necromancer: { scale: 0.76, anchorY: 236 }
  };

  const abilityConfigs = {
    dwarf: {
      name: 'Fúria',
      cooldown: 1.2,
      color: 'rgba(255, 157, 65, 0.82)',
      accent: 'rgba(255, 220, 142, 0.95)'
    },
    pony: {
      name: 'Dança do Crepúsculo',
      cooldown: 1.6,
      color: 'rgba(199, 162, 255, 0.78)',
      accent: 'rgba(134, 255, 248, 0.82)'
    },
    necromancer: {
      name: 'Mão dos Mortos',
      cooldown: 1.8,
      color: 'rgba(115, 224, 189, 0.76)',
      accent: 'rgba(169, 96, 255, 0.8)'
    }
  };

  let canvas = null;
  let ctx = null;
  let statusElement = null;
  let abilityNameElement = null;
  let abilityStateElement = null;
  let animationFrame = null;
  let running = false;
  let listenersReady = false;
  let activeCharacter = null;
  let lastTime = 0;
  let pulse = 0;
  let statusText = '';
  let cssWidth = 0;
  let cssHeight = 0;
  let abilityCooldown = 0;
  const abilityEffects = [];
  const characterSprites = new Map();

  const keys = new Set();
  const camera = { x: 0, y: 0 };
  const player = {
    x: 5.5,
    y: 13.5,
    facingX: 1,
    facingY: -1,
    moving: false
  };

  const map = createMap();

  function createMap() {
    const tiles = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill('void'));

    function setTile(x, y, type) {
      if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return;
      tiles[y][x] = type;
    }

    function fillRect(x, y, width, height, type) {
      for (let row = y; row < y + height; row += 1) {
        for (let col = x; col < x + width; col += 1) {
          setTile(col, row, type);
        }
      }
    }

    fillRect(4, 8, 21, 8, 'floor');
    fillRect(2, 11, 5, 4, 'entry');
    fillRect(24, 9, 5, 5, 'floor');
    fillRect(11, 5, 8, 4, 'floor');
    fillRect(13, 15, 8, 4, 'floor');

    [
      [8, 11], [12, 9], [15, 13], [18, 8], [21, 12],
      [6, 14], [17, 17], [23, 10], [24, 13], [14, 6]
    ].forEach(([x, y]) => setTile(x, y, 'cracked'));

    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      for (let x = 0; x < MAP_WIDTH; x += 1) {
        if (tiles[y][x] !== 'void') continue;

        const nearFloor = [
          [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
          [x + 1, y + 1], [x - 1, y - 1]
        ].some(([nx, ny]) => tiles[ny] && PASSABLE_TILES.has(tiles[ny][nx]));

        if (nearFloor) setTile(x, y, 'wall');
      }
    }

    [
      [8, 8], [8, 15], [12, 6], [18, 6], [21, 15], [25, 9], [25, 14]
    ].forEach(([x, y]) => setTile(x, y, 'pillar'));

    [
      [5, 9], [5, 15], [22, 8], [22, 15], [27, 11]
    ].forEach(([x, y]) => setTile(x, y, 'brazier'));

    setTile(4, 13, 'entry');
    setTile(28, 11, 'exit');
    setTile(27, 11, 'floor');
    setTile(26, 11, 'floor');

    return tiles;
  }

  function start(options) {
    canvas = document.getElementById('map-canvas');
    statusElement = document.getElementById('map-status');
    abilityNameElement = document.getElementById('map-ability-name');
    abilityStateElement = document.getElementById('map-ability-state');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    activeCharacter = options.character;
    loadCharacterSprite(activeCharacter);
    resetPlayer(activeCharacter);
    abilityCooldown = 0;
    abilityEffects.length = 0;
    updateAbilityHud();
    setupListeners();
    resize();

    running = true;
    lastTime = performance.now();
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    keys.clear();
    cancelAnimationFrame(animationFrame);
  }

  function resetPlayer(character) {
    const starts = {
      dwarf: { x: 5.5, y: 13.5 },
      pony: { x: 5.5, y: 12.5 },
      necromancer: { x: 5.5, y: 14.5 }
    };

    const startPosition = starts[character.id] || starts.dwarf;
    player.x = startPosition.x;
    player.y = startPosition.y;
    player.facingX = 1;
    player.facingY = -1;
    player.moving = false;

    const world = tileToWorld(player.x, player.y);
    camera.x = world.x;
    camera.y = world.y;
  }

  function loadCharacterSprite(character) {
    if (!character || characterSprites.has(character.id)) return;

    const image = new Image();
    image.onload = () => {
      characterSprites.set(character.id, {
        image,
        ready: true
      });
    };
    image.onerror = () => {
      characterSprites.set(character.id, {
        image: null,
        ready: false
      });
    };
    characterSprites.set(character.id, {
      image,
      ready: false
    });
    image.src = characterSpritePaths[character.id] || character.image;
  }

  function setupListeners() {
    if (listenersReady) return;
    listenersReady = true;

    window.addEventListener('resize', resize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  }

  function resize() {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssWidth = Math.max(1, rect.width);
    cssHeight = Math.max(1, rect.height);
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
    }
  }

  function handleKeyDown(event) {
    if (!isRunScreenActive()) return;

    if (isMovementKey(event.key) || isAbilityKey(event.key)) {
      event.preventDefault();
    }

    keys.add(event.key.toLowerCase());
    if (isAbilityKey(event.key) && !event.repeat) castAbility();
  }

  function handleKeyUp(event) {
    keys.delete(event.key.toLowerCase());
  }

  function isMovementKey(key) {
    return [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
      'Shift'
    ].includes(key);
  }

  function isAbilityKey(key) {
    return [' ', 'j', 'J', '1'].includes(key);
  }

  function isRunScreenActive() {
    const runScreen = document.getElementById('run-screen');
    return Boolean(runScreen && runScreen.classList.contains('screen--active'));
  }

  function loop(time) {
    if (!running) return;

    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    update(dt);
    render();
    animationFrame = requestAnimationFrame(loop);
  }

  function update(dt) {
    let moveX = 0;
    let moveY = 0;

    if (keys.has('w') || keys.has('arrowup')) {
      moveX -= 1;
      moveY -= 1;
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      moveX += 1;
      moveY += 1;
    }
    if (keys.has('a') || keys.has('arrowleft')) {
      moveX -= 1;
      moveY += 1;
    }
    if (keys.has('d') || keys.has('arrowright')) {
      moveX += 1;
      moveY -= 1;
    }

    const length = Math.hypot(moveX, moveY);
    player.moving = length > 0;

    if (length > 0) {
      moveX /= length;
      moveY /= length;
      player.facingX = moveX;
      player.facingY = moveY;

      const speed = keys.has('shift') ? 5.3 : 3.4;
      tryMove(moveX * speed * dt, moveY * speed * dt);
    }

    if (pulse > 0) pulse = Math.max(0, pulse - dt * 2.4);
    if (abilityCooldown > 0) abilityCooldown = Math.max(0, abilityCooldown - dt);
    updateAbilityEffects(dt);

    const world = tileToWorld(player.x, player.y);
    camera.x += (world.x - camera.x) * 0.12;
    camera.y += (world.y - camera.y - 18) * 0.12;
    updateAbilityHud();
    updateStatus();
  }

  function castAbility() {
    const ability = abilityConfigs[activeCharacter.id] || abilityConfigs.dwarf;
    if (abilityCooldown > 0) return;

    abilityCooldown = ability.cooldown;
    pulse = 1;

    if (activeCharacter.id === 'dwarf') {
      castDwarfAbility(ability);
    } else if (activeCharacter.id === 'pony') {
      castPonyAbility(ability);
    } else {
      castNecromancerAbility(ability);
    }
  }

  function castDwarfAbility(ability) {
    const direction = normalizedFacing();
    const dash = 0.82;
    tryMove(direction.x * dash, direction.y * dash);

    abilityEffects.push({
      type: 'slash',
      x: player.x + direction.x * 0.55,
      y: player.y + direction.y * 0.55,
      dirX: direction.x,
      dirY: direction.y,
      age: 0,
      duration: 0.42,
      color: ability.color,
      accent: ability.accent
    });
  }

  function castPonyAbility(ability) {
    const direction = normalizedFacing();
    const dash = 0.48;
    tryMove(direction.x * dash, direction.y * dash);

    abilityEffects.push({
      type: 'dream-burst',
      x: player.x,
      y: player.y,
      age: 0,
      duration: 0.74,
      color: ability.color,
      accent: ability.accent
    });
  }

  function castNecromancerAbility(ability) {
    const direction = normalizedFacing();

    abilityEffects.push({
      type: 'spectral-hand',
      x: player.x + direction.x * 0.35,
      y: player.y + direction.y * 0.35,
      dirX: direction.x,
      dirY: direction.y,
      age: 0,
      duration: 0.86,
      color: ability.color,
      accent: ability.accent
    });
  }

  function updateAbilityEffects(dt) {
    for (let i = abilityEffects.length - 1; i >= 0; i -= 1) {
      const effect = abilityEffects[i];
      effect.age += dt;

      if (effect.type === 'spectral-hand') {
        const speed = 5.6;
        effect.x += effect.dirX * speed * dt;
        effect.y += effect.dirY * speed * dt;
      }

      if (effect.age >= effect.duration) abilityEffects.splice(i, 1);
    }
  }

  function normalizedFacing() {
    const length = Math.hypot(player.facingX, player.facingY) || 1;
    return {
      x: player.facingX / length,
      y: player.facingY / length
    };
  }

  function updateAbilityHud() {
    if (!abilityNameElement || !abilityStateElement || !activeCharacter) return;

    const ability = abilityConfigs[activeCharacter.id] || abilityConfigs.dwarf;
    abilityNameElement.textContent = ability.name;
    abilityStateElement.textContent = abilityCooldown > 0
      ? `${abilityCooldown.toFixed(1)}s`
      : 'Pronta';
  }

  function tryMove(dx, dy) {
    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (canStandAt(nextX, player.y)) player.x = nextX;
    if (canStandAt(player.x, nextY)) player.y = nextY;
  }

  function canStandAt(x, y) {
    const radius = 0.24;
    const samples = [
      [x - radius, y - radius],
      [x + radius, y - radius],
      [x - radius, y + radius],
      [x + radius, y + radius],
      [x, y]
    ];

    return samples.every(([sx, sy]) => PASSABLE_TILES.has(tileAt(sx, sy)));
  }

  function tileAt(x, y) {
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    if (tileX < 0 || tileY < 0 || tileX >= MAP_WIDTH || tileY >= MAP_HEIGHT) return 'void';
    return map[tileY][tileX];
  }

  function updateStatus() {
    const tile = tileAt(player.x, player.y);
    const reachedExit = tile === 'exit';
    statusText = reachedExit
      ? 'portao leste alcancado'
      : `x:${player.x.toFixed(1)} y:${player.y.toFixed(1)} ${player.moving ? 'movendo' : 'parado'}`;

    if (statusElement) statusElement.textContent = statusText;
  }

  function render() {
    if (!ctx) return;

    ctx.clearRect(0, 0, cssWidth, cssHeight);
    drawBackdrop();

    const drawables = [];

    for (let y = 0; y < MAP_HEIGHT; y += 1) {
      for (let x = 0; x < MAP_WIDTH; x += 1) {
        const tile = map[y][x];
        if (tile === 'void') continue;
        drawables.push({
          sort: x + y,
          draw: () => drawTile(x, y, tile)
        });
      }
    }

    drawables.push({
      sort: player.x + player.y + 0.25,
      draw: drawPlayer
    });

    abilityEffects.forEach((effect) => {
      drawables.push({
        sort: effect.x + effect.y + 0.35,
        draw: () => drawAbilityEffect(effect)
      });
    });

    drawables.sort((a, b) => a.sort - b.sort);
    drawables.forEach((item) => item.draw());
    drawForegroundFog();
  }

  function drawBackdrop() {
    const gradient = ctx.createLinearGradient(0, 0, 0, cssHeight);
    gradient.addColorStop(0, '#031016');
    gradient.addColorStop(0.45, '#061013');
    gradient.addColorStop(1, '#020407');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = 'rgba(45, 205, 196, 0.05)';
    for (let i = 0; i < 8; i += 1) {
      const x = ((i * 173) % 1000) / 1000 * cssWidth;
      const y = ((i * 311) % 1000) / 1000 * cssHeight;
      ctx.beginPath();
      ctx.arc(x, y, 90 + i * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawTile(x, y, type) {
    const point = tileToScreen(x + 0.5, y + 0.5);

    if (!isOnScreen(point.x, point.y, 130)) return;

    if (type === 'wall') {
      drawRaisedDiamond(point.x, point.y, 18, {
        top: '#151b1c',
        left: '#070a0c',
        right: '#0d1517',
        stroke: 'rgba(134,255,248,0.08)'
      });
      return;
    }

    if (type === 'pillar') {
      drawRaisedDiamond(point.x, point.y, 54, {
        top: '#232b2a',
        left: '#080c0d',
        right: '#111b1c',
        stroke: 'rgba(236,216,173,0.16)'
      });
      drawPillarCap(point.x, point.y - 54);
      return;
    }

    if (type === 'brazier') {
      drawDiamond(point.x, point.y, '#192224', 'rgba(236,216,173,0.18)');
      drawBrazier(point.x, point.y - 5);
      return;
    }

    const palette = {
      floor: ['#182629', 'rgba(134,255,248,0.08)'],
      cracked: ['#202423', 'rgba(236,216,173,0.14)'],
      entry: ['#1b2b2b', 'rgba(134,255,248,0.16)'],
      exit: ['#203330', 'rgba(158,230,165,0.42)']
    };

    const [fill, stroke] = palette[type] || palette.floor;
    drawDiamond(point.x, point.y, fill, stroke);

    if (type === 'cracked') drawCracks(point.x, point.y, x, y);
    if (type === 'exit') drawExitGlow(point.x, point.y);
  }

  function drawDiamond(x, y, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x, y - TILE_HEIGHT / 2);
    ctx.lineTo(x + TILE_WIDTH / 2, y);
    ctx.lineTo(x, y + TILE_HEIGHT / 2);
    ctx.lineTo(x - TILE_WIDTH / 2, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawRaisedDiamond(x, y, height, colors) {
    const topY = y - height;

    ctx.beginPath();
    ctx.moveTo(x - TILE_WIDTH / 2, topY);
    ctx.lineTo(x, topY + TILE_HEIGHT / 2);
    ctx.lineTo(x, y + TILE_HEIGHT / 2);
    ctx.lineTo(x - TILE_WIDTH / 2, y);
    ctx.closePath();
    ctx.fillStyle = colors.left;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + TILE_WIDTH / 2, topY);
    ctx.lineTo(x, topY + TILE_HEIGHT / 2);
    ctx.lineTo(x, y + TILE_HEIGHT / 2);
    ctx.lineTo(x + TILE_WIDTH / 2, y);
    ctx.closePath();
    ctx.fillStyle = colors.right;
    ctx.fill();

    drawDiamond(x, topY, colors.top, colors.stroke);
  }

  function drawPillarCap(x, y) {
    ctx.fillStyle = 'rgba(236, 216, 173, 0.08)';
    ctx.fillRect(x - 18, y - 3, 36, 6);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(x - 12, y + 4, 24, 6);
  }

  function drawBrazier(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#0b0c0d';
    ctx.fillRect(-14, 5, 28, 8);
    ctx.fillStyle = '#2f2216';
    ctx.fillRect(-10, -2, 20, 9);

    const flamePulse = 0.75 + Math.sin(performance.now() / 130) * 0.25;
    ctx.fillStyle = `rgba(255, 139, 53, ${0.55 + flamePulse * 0.25})`;
    ctx.beginPath();
    ctx.ellipse(0, -6, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd186';
    ctx.beginPath();
    ctx.moveTo(0, -28 - flamePulse * 4);
    ctx.quadraticCurveTo(12, -10, 2, 0);
    ctx.quadraticCurveTo(-10, -10, 0, -28 - flamePulse * 4);
    ctx.fill();
    ctx.restore();
  }

  function drawCracks(x, y, tileX, tileY) {
    ctx.strokeStyle = 'rgba(0,0,0,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const offset = hash(tileX, tileY) * 10 - 5;
    ctx.moveTo(x - 16, y + offset);
    ctx.lineTo(x - 3, y + 2);
    ctx.lineTo(x + 15, y - offset * 0.35);
    ctx.stroke();
  }

  function drawExitGlow(x, y) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gradient = ctx.createRadialGradient(x, y, 8, x, y, 80);
    gradient.addColorStop(0, 'rgba(134,255,248,0.24)');
    gradient.addColorStop(1, 'rgba(134,255,248,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawAbilityEffect(effect) {
    if (effect.type === 'slash') {
      drawSlashEffect(effect);
    } else if (effect.type === 'dream-burst') {
      drawDreamBurstEffect(effect);
    } else if (effect.type === 'spectral-hand') {
      drawSpectralHandEffect(effect);
    }
  }

  function drawSlashEffect(effect) {
    const progress = effect.age / effect.duration;
    const point = tileToScreen(effect.x, effect.y);
    const angle = Math.atan2(effect.dirY + effect.dirX, effect.dirX - effect.dirY);
    const alpha = 1 - progress;

    ctx.save();
    ctx.translate(point.x, point.y - 20);
    ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = effect.accent;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, 34 + progress * 28, -0.9, 0.9);
    ctx.stroke();
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 16;
    ctx.globalAlpha = alpha * 0.36;
    ctx.beginPath();
    ctx.arc(0, 0, 42 + progress * 34, -0.75, 0.75);
    ctx.stroke();
    ctx.restore();
  }

  function drawDreamBurstEffect(effect) {
    const progress = effect.age / effect.duration;
    const point = tileToScreen(effect.x, effect.y);
    const radiusX = 32 + progress * 110;
    const radiusY = 14 + progress * 46;
    const alpha = 1 - progress;

    ctx.save();
    ctx.translate(point.x, point.y + 4);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = effect.accent;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 9; i += 1) {
      const angle = i * 0.7 + progress * 4;
      const x = Math.cos(angle) * radiusX * 0.82;
      const y = Math.sin(angle) * radiusY * 0.82;
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpectralHandEffect(effect) {
    const progress = effect.age / effect.duration;
    const point = tileToScreen(effect.x, effect.y);
    const alpha = Math.sin(progress * Math.PI);

    ctx.save();
    ctx.translate(point.x, point.y - 18);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = effect.color;
    ctx.strokeStyle = effect.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 26, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 6, -16);
      ctx.quadraticCurveTo(i * 8, -34 - Math.abs(i) * 3, i * 12, -42);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer() {
    const colors = characterColors[activeCharacter.id] || characterColors.dwarf;
    const point = tileToScreen(player.x, player.y);
    const bob = player.moving ? Math.sin(performance.now() / 90) * 3 : 0;
    const sprite = characterSprites.get(activeCharacter.id);

    ctx.save();
    ctx.translate(point.x, point.y + bob);

    ctx.fillStyle = colors.shadow;
    ctx.beginPath();
    ctx.ellipse(0, 13, 23, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    if (pulse > 0) {
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 6, 34 + (1 - pulse) * 34, 16 + (1 - pulse) * 16, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (sprite && sprite.ready && sprite.image) {
      drawCharacterSprite(sprite.image, colors);
      ctx.restore();
      return;
    }

    drawFallbackPlayer(colors);
    ctx.restore();
  }

  function drawCharacterSprite(image, colors) {
    const settings = characterSpriteSettings[activeCharacter.id] || characterSpriteSettings.dwarf;
    const scale = settings.scale;
    const spriteWidth = image.width * scale;
    const spriteHeight = image.height * scale;
    const drawX = -spriteWidth / 2;
    const drawY = -(settings.anchorY * scale) + 18;
    const lean = player.moving ? player.facingX * 0.035 : 0;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(0, -30, 8, 0, -30, 54);
    glow.addColorStop(0, colors.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -30, 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.transform(1, lean, 0, 1, 0, 0);
    ctx.drawImage(image, drawX, drawY, spriteWidth, spriteHeight);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 10, 19, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawFallbackPlayer(colors) {
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
    glow.addColorStop(0, colors.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 1, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.body;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -27);
    ctx.lineTo(17, -3);
    ctx.lineTo(7, 20);
    ctx.lineTo(-7, 20);
    ctx.lineTo(-17, -3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,0.42)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(player.facingX * 16, player.facingY * 10 + 5);
    ctx.stroke();
  }

  function drawForegroundFog() {
    const gradient = ctx.createRadialGradient(
      cssWidth * 0.5,
      cssHeight * 0.48,
      Math.min(cssWidth, cssHeight) * 0.15,
      cssWidth * 0.5,
      cssHeight * 0.5,
      Math.max(cssWidth, cssHeight) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.48)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);
  }

  function tileToWorld(x, y) {
    return {
      x: (x - y) * (TILE_WIDTH / 2),
      y: (x + y) * (TILE_HEIGHT / 2)
    };
  }

  function tileToScreen(x, y) {
    const world = tileToWorld(x, y);
    return {
      x: world.x - camera.x + cssWidth / 2,
      y: world.y - camera.y + cssHeight / 2
    };
  }

  function isOnScreen(x, y, margin) {
    return x > -margin && y > -margin && x < cssWidth + margin && y < cssHeight + margin;
  }

  function hash(x, y) {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  window.EcosMap = {
    start,
    stop,
    getState() {
      return {
        running,
        player: { x: player.x, y: player.y },
        tile: tileAt(player.x, player.y),
        statusText,
        abilityCooldown,
        abilityEffects: abilityEffects.length
      };
    }
  };
})();
