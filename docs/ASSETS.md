# Assets do jogo

## Fundo customizado da tela inicial

Para trocar o fundo do menu, coloque sua imagem neste caminho exato:

```text
assets/images/menu/fundo_inicial_custom.png
```

Depois abra `js/asset-config.js` e altere:

```js
enableCustomMenuBackground: true
```

Recomendação:

- proporção 16:9
- resolução mínima de 1920x1080
- PNG, JPG ou WebP convertido para PNG com esse nome
- manter o assunto principal mais para o centro ou esquerda, pois o menu fica à direita no desktop

Se esse arquivo não existir, o jogo usa automaticamente:

```text
assets/images/menu/tela_inicial.png
```

## Música da tela inicial

Para ativar a música do menu, coloque o MP3 neste caminho exato:

```text
assets/audio/menu-theme.mp3
```

Depois abra `js/asset-config.js` e altere:

```js
enableMenuMusic: true
```

O navegador só permite tocar áudio depois de uma interação do jogador, então a música começa automaticamente no primeiro clique ou tecla dentro do jogo.

Antes de publicar, registre a origem da música em `docs/asset_credits.md`.

## Músicas da seleção de personagens

Quando os três arquivos estiverem prontos, use estes caminhos:

```text
assets/audio/characters/dwarf-theme.mp3
assets/audio/characters/pony-theme.mp3
assets/audio/characters/necromancer-theme.mp3
```

Depois preencha `characterMusic` em `js/asset-config.js`:

```js
characterMusic: {
  dwarf: 'assets/audio/characters/dwarf-theme.mp3',
  pony: 'assets/audio/characters/pony-theme.mp3',
  necromancer: 'assets/audio/characters/necromancer-theme.mp3'
}
```

Enquanto esses caminhos estiverem vazios, a seleção continua usando a música do menu.

## Personagens animados no mapa

Os arquivos atuais em `assets/images/map-sprites/` são standees temporários. Eles deixam o herói aparecer no mapa, mas não têm caminhada real por frames. Para os personagens parecerem mais vivos em 2,5D, precisamos trocar esses arquivos por sprite sheets ou sequências de frames.

Pacote mínimo por personagem:

```text
idle
walk
run
cast ou attack
hit
death
```

Direções:

```text
mínimo: 4 direções diagonais isométricas
ideal: 8 direções
```

Recomendações técnicas:

- fundo transparente
- mesmo tamanho de frame em toda a animação
- pés/pivô sempre no mesmo ponto
- personagem centralizado no frame
- sombra separada ou consistente
- nomes previsíveis, por exemplo `dwarf_walk_se_00.png`

Se o personagem for criado em 3D, o melhor caminho para este jogo 2,5D é renderizar o modelo em sprites. Assim mantemos aparência de personagem 3D, mas o jogo continua leve no navegador.

## Arte do primeiro mapa

O primeiro mapa jogável usa uma imagem pintada como base:

```text
assets/images/maps/atrio_correntes_map01.png
```

Essa imagem funciona como cenário 2,5D completo. O código cria por cima dela uma área invisível de movimento e bloqueadores para altar, mesas, baús, paredes e objetos grandes.

Quando formos evoluir para combate mais preciso, existem dois caminhos:

- manter a imagem única e melhorar a malha de colisão manual
- transformar a sala em tilemap/props separados, idealmente em Phaser
