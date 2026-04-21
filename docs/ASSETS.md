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

Para ativar o botão de música do menu, coloque o MP3 neste caminho exato:

```text
assets/audio/menu-theme.mp3
```

Depois abra `js/asset-config.js` e altere:

```js
enableMenuMusic: true
```

O navegador só permite tocar áudio depois de um clique do jogador, então a música começa pelo botão `Música`.

Antes de publicar, registre a origem da música em `docs/asset_credits.md`.
