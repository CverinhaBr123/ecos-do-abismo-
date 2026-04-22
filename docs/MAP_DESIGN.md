# Mapa 01 — Átrio das Correntes

## Função

Primeiro mapa jogável para testar:

- escala do personagem
- leitura visual do chão e obstáculos
- movimentação com teclado
- câmera seguindo o jogador
- colisão básica antes de inimigos
- primeiras habilidades lançáveis por personagem

## Fantasia

O Átrio das Correntes é uma antecâmara em ruínas logo depois do portal inicial. A sala tem entrada sul, altar central, paredes altas, braseiros, correntes antigas e um portão norte com brilho frio.

## Tamanho

Arte base atual:

```text
assets/images/maps/atrio_correntes_map01.png
```

Dimensão da arte e do mundo jogável:

```text
1254px x 1254px
```

O mapa usa a imagem como camada visual principal e uma malha invisível de navegação por cima. Isso permite testar movimento, câmera, bloqueios e habilidades antes de transformar a arte em tilemap real.

## Controles atuais

```text
WASD ou setas: mover
Shift: correr
J, 1 ou Espaço: lançar habilidade ativa
```

## Habilidades atuais

As habilidades ainda são protótipos visuais, sem dano aplicado porque os inimigos ainda não existem no mapa. Elas já servem para testar direção, alcance, cooldown, leitura no cenário e sensação de cada personagem.

```text
Guerreiro Anão: Fúria
- avanço curto na direção atual
- arco de impacto laranja à frente do herói
- base futura: golpe frontal com empurrão

Pônei Mágico: Dança do Crepúsculo
- avanço leve
- explosão circular lilás/ciano em área
- base futura: controle de grupo e dano em área

Necromante: Mão dos Mortos
- projétil espectral lançado na direção atual
- base futura: maldição, lentidão ou roubo de vida
```

## Personagem no mapa

O mapa já usa sprites temporários em:

```text
assets/images/map-sprites/
```

Eles são recortes das artes atuais dos heróis, pensados para validar escala, posição no tile e leitura do personagem no cenário. A próxima versão ideal é trocar esses standees por sprite sheets de caminhada com direções.

Para o movimento parecer jogo de verdade, cada personagem precisa de frames separados por ação. O pacote mínimo recomendado para 2,5D é:

```text
idle: 4 a 8 frames
walk: 6 a 10 frames
run: 6 a 10 frames
cast/attack: 6 a 12 frames
hit: 3 a 6 frames
death: 8 a 12 frames
direções mínimas: 4 diagonais isométricas
direções ideais: 8 direções
formato: PNG ou WebP com fundo transparente
âncora: pés sempre no mesmo ponto do frame
```

## Personalidade visual

- pedra azul-esverdeada
- brilho frio vindo do fundo do abismo
- braseiros alaranjados como contraste
- paredes, portões, altar e objetos elevados para sensação 2,5D
- névoa e vinheta para esconder bordas duras do protótipo

## Próximos passos do mapa

1. Adicionar sprites de caminhada por personagem.
2. Criar zonas de spawn de inimigos.
3. Colocar portas/saídas reais conectadas a salas futuras.
4. Adicionar interação com o portão leste.
5. Implementar hazards simples, como rachaduras ou fogo.
