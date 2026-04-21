# Publicar no GitHub Pages

Este projeto é um site estático: `index.html`, `css/`, `js/` e `assets/`.
Não precisa de build para publicar.

## Caminho recomendado

1. Crie um repositório no GitHub, por exemplo `ecos-do-abismo`.
2. Envie para a raiz do repositório estes arquivos e pastas:
   - `index.html`
   - `css/`
   - `js/`
   - `assets/`
   - `docs/`
   - `README.md`
   - `.nojekyll`
   - `.gitignore`
   - `.gitattributes`
   - `legacy/` é opcional; ela guarda versões antigas e não é necessária para o jogo rodar.
3. No GitHub, abra `Settings > Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha a branch `main` e a pasta `/(root)`.
6. Salve e aguarde o endereço publicado.

O endereço ficará parecido com:

```text
https://seu-usuario.github.io/ecos-do-abismo/
```

## Observações

- O arquivo `.nojekyll` evita que o GitHub Pages tente processar o projeto como Jekyll.
- Os caminhos do jogo são relativos, então funcionam tanto abrindo `index.html` localmente quanto no GitHub Pages.
- Se o repositório for público, qualquer pessoa com o link poderá jogar.
- Evite subir arquivos muito grandes. Para música de menu, prefira MP3 otimizado.
