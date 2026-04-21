# Mapa 01 — Átrio das Correntes

## Função

Primeiro mapa jogável para testar:

- escala do personagem
- leitura visual do chão e obstáculos
- movimentação com teclado
- câmera seguindo o jogador
- colisão básica antes de inimigos e habilidades

## Fantasia

O Átrio das Correntes é uma antecâmara em ruínas logo depois do portal inicial. A sala tem uma passarela central de pedra quebrada, abismos nas laterais, pilares antigos, braseiros acesos e um portão leste preso por correntes.

## Tamanho

Grade lógica atual:

```text
30 colunas x 22 linhas
```

Cada tile é desenhado em projeção isométrica/2,5D:

```text
76px x 38px
```

## Controles atuais

```text
WASD ou setas: mover
Shift: correr
Espaço: pulso visual de teste
```

## Personalidade visual

- pedra azul-esverdeada
- brilho frio vindo do fundo do abismo
- braseiros alaranjados como contraste
- pilares e paredes elevadas para sensação 2,5D
- névoa e vinheta para esconder bordas duras do protótipo

## Próximos passos do mapa

1. Adicionar sprites de caminhada por personagem.
2. Criar zonas de spawn de inimigos.
3. Colocar portas/saídas reais conectadas a salas futuras.
4. Adicionar interação com o portão leste.
5. Implementar hazards simples, como rachaduras ou fogo.
