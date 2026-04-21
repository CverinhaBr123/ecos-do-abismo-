# Ecos do Abismo

Projeto inicial de um RPG roguelike em HTML, CSS e JavaScript.

## Estado atual

Esta versão do projeto já inclui:

- tela de carregamento
- menu principal
- botão `Novo Jogo`
- tela de seleção de personagens
- 3 heróis iniciais com arte própria
- painel com descrição, equipamento, habilidades e atributos base
- salvamento do herói escolhido no `localStorage`
- tela inicial da run
- HUD com profundidade, vida, ecos e tensão
- 3 rotas iniciais clicáveis com risco, recompensa e resolução simples
- primeiro mapa 2,5D jogável para teste de movimentação
- preparo para GitHub Pages
- fundo customizado opcional para a tela inicial
- música automática no menu principal
- preparo para músicas individuais na seleção de personagens

## Estrutura

```text
ecos-do-abismo-codex/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ asset-config.js
│  ├─ map.js
│  └─ game.js
├─ assets/
│  ├─ images/
│     ├─ menu/
│     │  └─ tela_inicial.png
│     └─ characters/
│        ├─ guerreiro_anao.png
│        ├─ ponei_magico.png
│        └─ necromante.png
│  └─ audio/
│     ├─ menu-theme.mp3
│     └─ characters/
├─ docs/
│  └─ project_state.md
└─ legacy/
   ├─ menu_inicial_original.html
   ├─ loading_menu_original.html
   └─ selecao_personagens_original.html
```

## Como abrir

Basta abrir o arquivo `index.html` no navegador.

Se você quiser rodar com um servidor local, qualquer opção simples funciona. Exemplo com VS Code Live Server ou Python:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Publicar no GitHub Pages

O projeto já está preparado para GitHub Pages. Veja o passo a passo em:

```text
docs/GITHUB_PAGES.md
```

Resumo:

1. crie um repositório no GitHub
2. envie `index.html`, `css/`, `js/`, `assets/`, `docs/`, `.nojekyll`, `.gitignore`, `.gitattributes` e `README.md`
3. em `Settings > Pages`, publique a branch `main` usando a pasta `/(root)`

## Trocar fundo e música

Para usar uma nova imagem no fundo inicial, coloque o arquivo em:

```text
assets/images/menu/fundo_inicial_custom.png
```

Depois ative `enableCustomMenuBackground` em:

```text
js/asset-config.js
```

Para usar a música do menu, coloque o MP3 em:

```text
assets/audio/menu-theme.mp3
```

Depois ative `enableMenuMusic` em:

```text
js/asset-config.js
```

O navegador só toca áudio depois de uma ação do jogador, então a trilha começa automaticamente no primeiro clique ou tecla dentro do jogo.

Para músicas individuais na seleção, use estes caminhos:

```text
assets/audio/characters/dwarf-theme.mp3
assets/audio/characters/pony-theme.mp3
assets/audio/characters/necromancer-theme.mp3
```

Depois preencha os caminhos em `js/asset-config.js`.

Registre a origem e a permissão dos assets em:

```text
docs/asset_credits.md
```

## Personagens iniciais

### 1. Guerreiro Anão
- combate físico versátil
- luta com duas armas ou arma pesada de mão única
- habilidade ativa: Fúria
- passiva baseada em Carisma
- ultimate que invoca um gato
- item único: Bracelete de Honra

### 2. Pônei Mágico
- personagem original de sonhos/natureza
- foco em mobilidade, magia em área e controle
- item único: Sino dos Sonhos

### 3. Necromante
- foco em invocações, maldições e domínio de campo
- arma: Cajado Sepulcral
- item único: Grimório das Cinzas

## Próximos passos sugeridos

1. adicionar sprites/frames de caminhada para os heróis
2. criar inimigos simples no Átrio das Correntes
3. implementar dano, colisão de ataque e habilidades
4. adicionar inventário e uso de item único
5. expandir sistema de salas, inimigos e progressão

## Observação

A pasta `legacy/` guarda os HTMLs gerados nas etapas anteriores, caso você queira reaproveitar partes ou comparar a evolução do projeto.
