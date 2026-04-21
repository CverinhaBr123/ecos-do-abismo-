const characters = [
  {
    id: 'dwarf',
    name: 'Guerreiro Anão',
    role: 'Combate físico versátil',
    shortRole: 'Duas armas ou mão única pesada',
    image: 'assets/images/characters/guerreiro_anao.png',
    summary: 'Um guerreiro de baixa estatura, agressivo e versátil. Alterna entre combos rápidos com duas armas e golpes mais lentos com uma arma pesada. Controla inimigos atacando suas pernas e cresce em poder com Carisma.',
    weapon: 'Duas armas ou arma pesada de mão única',
    item: 'Bracelete de Honra',
    active: 'Fúria — aumenta velocidade de ataque e força por alguns segundos.',
    passive: 'Quanto mais Carisma ele possui, mais forte fica.',
    ultimate: 'Companheiro de Batalha — invoca um gato para ajudar no combate.',
    strength: 'Hitbox menor, ótima pressão corpo a corpo, debilita pernas e derruba inimigos com facilidade.',
    weakness: 'Golpes normais não finalizam diretamente os inimigos, exigindo execução ou dano complementar.',
    stats: {
      Vida: 8,
      Força: 8,
      Velocidade: 6,
      Controle: 8,
      Técnica: 7,
      Mobilidade: 6
    }
  },
  {
    id: 'pony',
    name: 'Pônei Mágico',
    role: 'Magia em área e mobilidade',
    shortRole: 'Sonhos, natureza e controle',
    image: 'assets/images/characters/ponei_magico.png',
    summary: 'Uma heroína original de sonhos e natureza. Dança pelo campo de batalha espalhando pó encantado, marcas lunares e magia em área. É evasiva, técnica e muito forte contra grupos.',
    weapon: 'Relíquia mágica floral-lunar',
    item: 'Sino dos Sonhos',
    active: 'Dança do Crepúsculo — investida giratória com dano em área e marca mágica.',
    passive: 'Pó dos Sonhos — cria rastros encantados que desaceleram e acumulam sonolência.',
    ultimate: 'Jardim do Sono — grande área encantada que reduz velocidade e induz sono.',
    strength: 'Altíssima mobilidade, excelente dano em área e ótimo controle de grupo.',
    weakness: 'Frágil e dependente de espaço para se mover; sofre se for encurralada.',
    stats: {
      Vida: 5,
      Magia: 9,
      Velocidade: 9,
      Controle: 8,
      Técnica: 8,
      Resistência: 4
    }
  },
  {
    id: 'necromancer',
    name: 'Necromante',
    role: 'Invocação e domínio de campo',
    shortRole: 'Maldições, servos e desgaste',
    image: 'assets/images/characters/necromante.png',
    summary: 'Um conjurador sombrio que controla a luta à distância com maldições, essência sombria e invocações. Cresce durante o combate e domina lutas longas com muito controle.',
    weapon: 'Cajado Sepulcral',
    item: 'Grimório das Cinzas',
    active: 'Mão dos Mortos — mãos espectrais prendem e desaceleram inimigos.',
    passive: 'Essência Roubada — inimigos marcados deixam energia para fortalecer feitiços e servos.',
    ultimate: 'Exército do Crepúsculo — invoca servos espectrais para dominar o campo.',
    strength: 'Controle muito alto, invocações úteis e excelente pressão em combates longos.',
    weakness: 'Baixa mobilidade e muita vulnerabilidade quando inimigos chegam perto demais.',
    stats: {
      Vida: 5,
      Magia: 9,
      Invocação: 10,
      Controle: 9,
      Mobilidade: 4,
      Resistência: 5
    }
  }
];

const routeOptions = [
  {
    id: 'broken-gate',
    name: 'Portão Rachado',
    danger: 3,
    reward: 'ferro antigo',
    checks: ['Força', 'Técnica', 'Controle'],
    baseDamage: 8,
    echoes: 6,
    summary: 'Uma passagem estreita coberta por runas partidas. Algo empurra do outro lado.',
    success: 'forçou o portão no momento certo e arrancou ecos presos às dobradiças.',
    strain: 'passou pelo portão, mas as runas morderam fundo antes de apagar.'
  },
  {
    id: 'flooded-gallery',
    name: 'Galeria Inundada',
    danger: 2,
    reward: 'atalho oculto',
    checks: ['Mobilidade', 'Velocidade', 'Controle'],
    baseDamage: 6,
    echoes: 4,
    summary: 'Degraus somem sob água escura. Reflexos mostram portas que talvez não existam.',
    success: 'atravessou a galeria sem acordar o lodo adormecido nas paredes.',
    strain: 'achou o atalho, mas a água fria roubou fôlego e sangue no caminho.'
  },
  {
    id: 'ashen-shrine',
    name: 'Santuário Apagado',
    danger: 4,
    reward: 'relíquia instável',
    checks: ['Magia', 'Invocação', 'Controle'],
    baseDamage: 11,
    echoes: 9,
    summary: 'Cinzas flutuam em círculos sobre um altar sem chama. O silêncio pesa como uma mão.',
    success: 'leu o santuário antes da maldição despertar e tomou uma relíquia instável.',
    strain: 'arrancou poder do altar, mas parte da maldição veio junto.'
  }
];

const STORAGE_KEY = 'ecos-do-abismo:selected-character';
const assetConfig = window.ECOS_ASSET_CONFIG || {};
const CUSTOM_MENU_BACKGROUND_PATH = assetConfig.customMenuBackground || 'assets/images/menu/fundo_inicial_custom.png';
const MENU_MUSIC_PATH = assetConfig.menuMusic || 'assets/audio/menu-theme.mp3';
const CHARACTER_MUSIC = assetConfig.characterMusic || {};

const loadingScreen = document.getElementById('loading-screen');
const menuScreen = document.getElementById('menu-screen');
const selectionScreen = document.getElementById('selection-screen');
const runScreen = document.getElementById('run-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const toast = document.getElementById('toast');
const characterList = document.getElementById('character-list');
const detailImage = document.getElementById('detail-image');
const detailRole = document.getElementById('detail-role');
const detailName = document.getElementById('detail-name');
const detailSummary = document.getElementById('detail-summary');
const detailWeapon = document.getElementById('detail-weapon');
const detailItem = document.getElementById('detail-item');
const detailActive = document.getElementById('detail-active');
const detailPassive = document.getElementById('detail-passive');
const detailUltimate = document.getElementById('detail-ultimate');
const detailStrength = document.getElementById('detail-strength');
const detailWeakness = document.getElementById('detail-weakness');
const statsContainer = document.getElementById('stats');
const backToMenu = document.getElementById('back-to-menu');
const confirmCharacter = document.getElementById('confirm-character');
const dontClick = document.getElementById('dont-click');
const runDepth = document.getElementById('run-depth');
const runHealth = document.getElementById('run-health');
const runEchoes = document.getElementById('run-echoes');
const runTension = document.getElementById('run-tension');
const runBackSelection = document.getElementById('run-back-selection');
const runReturnMenu = document.getElementById('run-return-menu');
const runHeroImage = document.getElementById('run-hero-image');
const runHeroRole = document.getElementById('run-hero-role');
const runHeroName = document.getElementById('run-hero-name');
const runHeroItem = document.getElementById('run-hero-item');
const runHeroSummary = document.getElementById('run-hero-summary');
const runHeroStats = document.getElementById('run-hero-stats');
const routeGrid = document.getElementById('route-grid');
const runRoomTitle = document.getElementById('run-room-title');
const runRoomDescription = document.getElementById('run-room-description');
const resolveRoute = document.getElementById('resolve-route');
const runLogList = document.getElementById('run-log-list');

let selectedCharacterId = loadStoredCharacterId() || characters[0].id;
let runState = null;
let currentTrack = null;
let currentTrackKey = '';
let audioUnlocked = false;
const audioFadeIds = new WeakMap();

function setupCustomMenuBackground() {
  if (!assetConfig.enableCustomMenuBackground) return;

  const customBackground = new Image();
  customBackground.onload = () => {
    document.body.classList.add('has-custom-menu-art');
  };
  customBackground.src = CUSTOM_MENU_BACKGROUND_PATH;
}

function loadStoredCharacterId() {
  try {
    const storedId = window.localStorage.getItem(STORAGE_KEY);
    return characters.some((character) => character.id === storedId) ? storedId : null;
  } catch (error) {
    return null;
  }
}

function saveSelectedCharacter(id) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    showToast('Não foi possível salvar a escolha neste navegador.');
  }
}

function getSelectedCharacter() {
  return characters.find((item) => item.id === selectedCharacterId) || characters[0];
}

function getBestRouteStat(character, route) {
  return route.checks.reduce((best, label) => Math.max(best, character.stats[label] || 0), 0);
}

function showScreen(screenToShow) {
  [loadingScreen, menuScreen, selectionScreen, runScreen].forEach((screen) => {
    if (screen === screenToShow) {
      screen.classList.remove('hidden');
      screen.classList.add('screen--active');
    } else {
      screen.classList.add('hidden');
      screen.classList.remove('screen--active');
    }
  });

  syncAudioForScreen(screenToShow);
}

function getCharacterMusicPath(characterId) {
  return CHARACTER_MUSIC[characterId] || '';
}

function fadeAudio(audio, targetVolume, onComplete) {
  clearInterval(audioFadeIds.get(audio));

  const startVolume = audio.volume;
  const steps = 12;
  let step = 0;

  const fadeId = setInterval(() => {
    step += 1;
    const progress = step / steps;
    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (step >= steps) {
      clearInterval(fadeId);
      audioFadeIds.delete(audio);
      audio.volume = targetVolume;
      if (onComplete) onComplete();
    }
  }, 45);

  audioFadeIds.set(audio, fadeId);
}

async function playTrack(trackKey, source, volume = 0.42) {
  if (!source || !audioUnlocked) return;
  if (currentTrackKey === trackKey && currentTrack && !currentTrack.paused) return;

  const previousTrack = currentTrack;
  if (previousTrack) {
    fadeAudio(previousTrack, 0, () => {
      previousTrack.pause();
      previousTrack.currentTime = 0;
    });
  }

  const nextTrack = new Audio(source);
  nextTrack.loop = true;
  nextTrack.volume = 0;
  currentTrack = nextTrack;
  currentTrackKey = trackKey;

  try {
    await nextTrack.play();
    fadeAudio(nextTrack, volume);
  } catch (error) {
    currentTrack = null;
    currentTrackKey = '';
  }
}

function stopCurrentTrack() {
  if (!currentTrack) return;

  const trackToStop = currentTrack;
  currentTrack = null;
  currentTrackKey = '';
  fadeAudio(trackToStop, 0, () => {
    trackToStop.pause();
    trackToStop.currentTime = 0;
  });
}

function playMenuMusic() {
  if (!assetConfig.enableMenuMusic) return;
  playTrack('menu', MENU_MUSIC_PATH, 0.42);
}

function playSelectionMusic() {
  const characterMusic = getCharacterMusicPath(selectedCharacterId);

  if (characterMusic) {
    playTrack(`character-${selectedCharacterId}`, characterMusic, 0.44);
    return;
  }

  playMenuMusic();
}

function unlockAudio() {
  if (audioUnlocked) return;

  audioUnlocked = true;
  if (menuScreen.classList.contains('screen--active')) {
    playMenuMusic();
  } else if (selectionScreen.classList.contains('screen--active')) {
    playSelectionMusic();
  }
}

function syncAudioForScreen(screenToShow) {
  if (!audioUnlocked) return;

  if (screenToShow === menuScreen) {
    playMenuMusic();
  } else if (screenToShow === selectionScreen) {
    playSelectionMusic();
  } else if (screenToShow === runScreen) {
    stopCurrentTrack();
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function renderCharacterCards() {
  characterList.innerHTML = '';

  characters.forEach((character) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `character-card${character.id === selectedCharacterId ? ' active' : ''}`;
    button.dataset.id = character.id;
    button.innerHTML = `
      <img src="${character.image}" alt="${character.name}" />
      <div>
        <p class="eyebrow">${character.role}</p>
        <h3>${character.name}</h3>
        <p>${character.shortRole}</p>
      </div>
    `;

    button.addEventListener('click', () => {
      selectedCharacterId = character.id;
      renderCharacterCards();
      renderCharacterDetail();
      playSelectionMusic();
    });

    characterList.appendChild(button);
  });
}

function renderCharacterDetail() {
  const character = getSelectedCharacter();
  if (!character) return;

  detailImage.src = character.image;
  detailImage.alt = character.name;
  detailRole.textContent = `${character.role} • ${character.shortRole}`;
  detailName.textContent = character.name;
  detailSummary.textContent = character.summary;
  detailWeapon.textContent = character.weapon;
  detailItem.textContent = character.item;
  detailActive.textContent = character.active;
  detailPassive.textContent = character.passive;
  detailUltimate.textContent = character.ultimate;
  detailStrength.textContent = character.strength;
  detailWeakness.textContent = character.weakness;

  statsContainer.innerHTML = '';
  Object.entries(character.stats).forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span>${label}</span>
      <div class="stat-track"><div class="stat-fill" style="width: ${value * 10}%"></div></div>
      <span>${value}</span>
    `;
    statsContainer.appendChild(row);
  });
}

function createRunState(character) {
  const baseHealth = character.stats.Vida || character.stats.Resistência || 5;

  return {
    characterId: character.id,
    depth: 1,
    health: baseHealth * 12 + 28,
    maxHealth: baseHealth * 12 + 28,
    echoes: 0,
    tension: 0,
    selectedRouteId: routeOptions[0].id,
    log: [`${character.name} atravessou o portal e entrou na primeira câmara.`]
  };
}

function renderMiniStats(character) {
  runHeroStats.innerHTML = '';
  Object.entries(character.stats).slice(0, 6).forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'mini-stat';
    item.innerHTML = `
      <span>${label}</span>
      <strong>${value}</strong>
    `;
    runHeroStats.appendChild(item);
  });
}

function renderRoutes(character) {
  routeGrid.innerHTML = '';

  routeOptions.forEach((route) => {
    const aptitude = getBestRouteStat(character, route);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `route-option${route.id === runState.selectedRouteId ? ' active' : ''}`;
    button.dataset.id = route.id;
    button.innerHTML = `
      <div>
        <p class="eyebrow">Risco ${route.danger}</p>
        <h4>${route.name}</h4>
        <p>${route.summary}</p>
      </div>
      <div class="route-meta">
        <span>Teste ${aptitude}</span>
        <span>${route.reward}</span>
      </div>
    `;

    button.addEventListener('click', () => {
      runState.selectedRouteId = route.id;
      renderRunScreen();
    });

    routeGrid.appendChild(button);
  });
}

function renderRunScreen() {
  if (!runState) return;

  const character = characters.find((item) => item.id === runState.characterId);
  const selectedRoute = routeOptions.find((route) => route.id === runState.selectedRouteId) || routeOptions[0];

  runDepth.textContent = runState.depth;
  runHealth.textContent = `${Math.max(runState.health, 0)}/${runState.maxHealth}`;
  runEchoes.textContent = runState.echoes;
  runTension.textContent = runState.tension;

  runHeroImage.src = character.image;
  runHeroImage.alt = character.name;
  runHeroRole.textContent = character.role;
  runHeroName.textContent = character.name;
  runHeroItem.textContent = character.item;
  runHeroSummary.textContent = character.summary;
  renderMiniStats(character);

  runRoomTitle.textContent = selectedRoute.name;
  runRoomDescription.textContent = selectedRoute.summary;
  resolveRoute.disabled = runState.health <= 0;
  resolveRoute.textContent = runState.health <= 0 ? 'Run encerrada' : 'Explorar rota';

  renderRoutes(character);

  runLogList.innerHTML = '';
  runState.log.slice(0, 6).forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    runLogList.appendChild(item);
  });
}

function startRun(character) {
  selectedCharacterId = character.id;
  saveSelectedCharacter(character.id);
  runState = createRunState(character);
  renderRunScreen();
  showScreen(runScreen);
  showToast(`${character.name} entrou no abismo.`);
}

function resolveSelectedRoute() {
  if (!runState || runState.health <= 0) return;

  const character = characters.find((item) => item.id === runState.characterId);
  const route = routeOptions.find((item) => item.id === runState.selectedRouteId) || routeOptions[0];
  const aptitude = getBestRouteStat(character, route);
  const mitigation = Math.max(0, aptitude - route.danger);
  const damage = Math.max(1, route.baseDamage + runState.depth * 2 - mitigation);
  const echoesGained = route.echoes + Math.floor(aptitude / 2);
  const cleanPass = aptitude >= route.danger + 5;

  runState.health -= damage;
  runState.echoes += echoesGained;
  runState.tension += route.danger;

  if (runState.health <= 0) {
    runState.log.unshift(`${character.name} ${route.strain} A run terminou na profundidade ${runState.depth}.`);
    showToast('A run caiu. O abismo fica com esta tentativa.');
  } else {
    const result = cleanPass ? route.success : route.strain;
    runState.log.unshift(`${character.name} ${result} +${echoesGained} ecos, -${damage} vida.`);
    runState.depth += 1;
  }

  renderRunScreen();
}

function startLoadingSequence() {
  const messages = [
    'Invocando os ecos perdidos...',
    'Acendendo as tochas esquecidas...',
    'Reunindo os heróis iniciais...',
    'Preparando a descida ao abismo...',
    'O portal está pronto.'
  ];

  let progress = 0;
  let step = 0;

  function tick() {
    progress += Math.random() * 16 + 8;
    if (progress > 100) progress = 100;

    loadingBar.style.width = `${progress}%`;
    loadingText.textContent = messages[Math.min(step, messages.length - 1)];
    step += 1;

    if (progress < 100) {
      setTimeout(tick, 420 + Math.random() * 260);
    } else {
      setTimeout(() => showScreen(menuScreen), 850);
    }
  }

  setTimeout(tick, 500);
}

function setupMenuActions() {
  document.querySelectorAll('[data-toast]').forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.toast));
  });

  document.querySelector('[data-action="new-game"]').addEventListener('click', () => {
    unlockAudio();
    showScreen(selectionScreen);
  });

  dontClick.addEventListener('click', () => {
    document.body.animate(
      [
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0px)' }
      ],
      { duration: 420, easing: 'ease-in-out' }
    );
    showToast('Eu avisei. Algo respondeu lá de baixo.');
  });

  backToMenu.addEventListener('click', () => {
    showScreen(menuScreen);
  });

  confirmCharacter.addEventListener('click', () => {
    startRun(getSelectedCharacter());
  });

  runBackSelection.addEventListener('click', () => {
    showScreen(selectionScreen);
  });

  runReturnMenu.addEventListener('click', () => {
    showScreen(menuScreen);
  });

  resolveRoute.addEventListener('click', () => {
    resolveSelectedRoute();
  });
}

window.addEventListener('load', () => {
  setupCustomMenuBackground();
  renderCharacterCards();
  renderCharacterDetail();
  setupMenuActions();
  startLoadingSequence();
});

window.addEventListener('pointerdown', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });
