# Estado atual do projeto

## Nome do jogo
**Ecos do Abismo**

## Gênero
RPG roguelike em HTML.

## Identidade geral
- dark fantasy
- ruínas antigas
- portal abissal
- progressão por runs
- personagens iniciais com estilos bem distintos

## Telas prontas
- loading screen
- menu principal
- tela de seleção de personagens
- tela inicial da run
- mapa jogável 2,5D: Átrio das Correntes

## Sistemas prontos
- seleção de personagem com persistência em `localStorage`
- HUD inicial da run com profundidade, vida, ecos e tensão
- três rotas iniciais com risco, recompensa e teste baseado nos atributos do personagem
- registro da run com os resultados das ações
- suporte a fundo customizado em `assets/images/menu/fundo_inicial_custom.png`, ativado por `js/asset-config.js`
- música automática do menu usando `assets/audio/menu-theme.mp3`, ativada por `js/asset-config.js`
- preparo para trilhas individuais por personagem na tela de seleção
- arquivos de preparo para GitHub Pages
- movimento por teclado no primeiro mapa
- câmera seguindo o jogador
- colisão básica com paredes, pilares, braseiros e abismos
- primeiras habilidades lançáveis no mapa com `J`, `1` ou `Espaço`
- HUD de habilidade com nome e cooldown

## Personagem 1 — Guerreiro Anão

### Conceito
Combatente de baixa estatura, agressivo e versátil.

### Combate
- duas armas para combos rápidos
- uma arma pesada de mão única para impacto maior

### Habilidade ativa
**Fúria**
- aumenta velocidade de ataque
- aumenta força

### Passiva
- quanto mais Carisma ele tiver, mais forte ele fica

### Ultimate
- chama um gato para ajudar no combate

### Ponto forte
- baixa estatura ajuda a desviar
- ataques nas pernas debilitam inimigos

### Fraqueza
- golpes normais não finalizam inimigos diretamente

### Item único
**Bracelete de Honra**

## Personagem 2 — Pônei Mágico

### Conceito
Personagem original com inspiração de sonhos, natureza, leveza e magia em área.

### Combate
- movimentação alta
- dano em área
- controle de grupo
- estilo técnico e evasivo

### Item único
**Sino dos Sonhos**

### Identidade visual
- lilás
- azul lunar
- branco suave
- flores e motivos lunares

## Personagem 3 — Necromante

### Conceito
Conjurador sombrio focado em invocações, maldições e desgaste.

### Combate
- domínio de campo
- lutas longas
- uso de essência sombria
- servos espectrais

### Arma
**Cajado Sepulcral**

### Item único
**Grimório das Cinzas**

## Próxima etapa mais natural
Depois do protótipo de mapa:
- adicionar sprites/frames de caminhada
- criar inimigos simples no Átrio das Correntes
- conectar dano e colisão real às habilidades iniciais
