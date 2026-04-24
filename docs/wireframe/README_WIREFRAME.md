# NexGames Wireframe

Projeto de wireframe da vitrine da **NexGames**, construído em **HTML, CSS e JavaScript modular** para validar layout, fluxo visual e composição das seções antes da implementação final no frontend principal.

Este projeto funciona como uma camada de prototipação navegável: os componentes são carregados dinamicamente, compartilham um catálogo central de produtos e simulam interações reais da loja, como carrossel, tabs, modais e blocos promocionais.

```text
docs/wireframe/app.html
```

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Vite
- Lucide via CDN
- DOM API
- `Intl.NumberFormat`

## Como executar o projeto

Instale as dependências:

```bash
npm install
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse o wireframe usando a URL exibida pelo `npm run dev` e acrescente a rota do arquivo:

```text
[URL_DO_SERVIDOR]/docs/wireframe/app.html
```


## Estrutura de diretório

```text
docs/
  wireframe/
    README_WIREFRAME.md
    app.html
    app.js
    app.css
    components/
      TopHeader/
      Header/
      SubHeader/
      Hero/
      TrendingProdutcs/
      ExclusiveProducts/
      Products/
      BestSellersProducts/
      RecommendedProducts/
      Brands/
      BottomProducts/
      Newsletter/
      Footer/
    core/
      loadComponent.js
      storefrontUtils.js
    data/
      storeData.js
```

Responsabilidades principais:

- `app.html`: define os pontos de montagem (`root`) da página e carrega o script principal do wireframe.
- `app.js`: orquestra o carregamento sequencial de cada seção da home.
- `app.css`: centraliza variáveis visuais globais, espaçamentos, botões e regras base compartilhadas.
- `components/`: organiza cada bloco visual em uma tríade `html/css/js`, facilitando manutenção e troca isolada de seções.
- `core/loadComponent.js`: busca o HTML do componente, injeta no DOM, adiciona o CSS apenas uma vez e executa o `init` correspondente.
- `core/storefrontUtils.js`: concentra utilitários de moeda, desconto e atualização dos ícones Lucide.
- `data/storeData.js`: atua como catálogo central do wireframe, com lookup por `id` para evitar repetição de dados entre prateleiras e campanhas.

## Fluxo do wireframe

1. `app.html` cria uma sequência de containers vazios que representam a ordem visual da home.
2. `app.js` chama `loadComponent()` para cada seção, do topo ao rodapé.
3. `loadComponent()` faz `fetch` do `html`, injeta o markup no `root`, registra o `css` da seção e executa o `init*`.
4. O `init*` de cada componente monta o conteúdo final:
   - com configuração local, quando a seção é institucional ou estrutural;
   - com dados de `storeData.js`, quando a seção depende de produtos.
5. Após renderizar o markup dinâmico, os ícones são recriados com `refreshIcons()`.
6. Os componentes interativos ativam seus comportamentos locais, como:
   - autoplay e navegação do `Hero`;
   - tabs e modal em `TrendingProdutcs`;
   - modal de produto em `Products`;
   - cliques simulados e CTAs nas demais vitrines.

## Camadas do wireframe

### `components`

É a camada visual do protótipo. Cada pasta representa uma seção real da loja virtual e contém:

- `*.html`: estrutura base da seção.
- `*.css`: estilo isolado do bloco.
- `*.js`: conteúdo, renderização dinâmica e eventos da seção.

Os componentes seguem dois padrões principais:

- componentes de estrutura e navegação, como `TopHeader`, `Header`, `SubHeader`, `Newsletter` e `Footer`;
- componentes de vitrine, como `TrendingProdutcs`, `ExclusiveProducts`, `Products`, `BestSellersProducts`, `RecommendedProducts` e `BottomProducts`.

### `core`

É a camada de infraestrutura do wireframe:

- `loadComponent.js` padroniza o carregamento de componentes e evita duplicação de CSS.
- `storefrontUtils.js` mantém regras compartilhadas entre seções, reduzindo código repetido nas vitrines.

### `data`

É a fonte única de produtos do protótipo:

- o catálogo central descreve preço, desconto, categoria, avaliação, cores e labels visuais;
- as seções não duplicam objetos de produto, apenas referenciam listas de `ids`;
- `getProductById()` e `getProductsByIds()` garantem reuso consistente do mesmo item em blocos diferentes.

## Características principais do projeto

- O wireframe é modular sem depender de React, o que acelera iteração visual e validação de layout.
- A home é montada por carregamento progressivo de seções, espelhando uma composição próxima de um ecommerce real.
- O catálogo compartilhado permite reutilizar o mesmo produto em promoções, destaques, best sellers e recomendações sem duplicar dados.
- A interface simula mídia de produto com gradientes, formas e labels, sem depender de imagens finais para validar hierarquia visual.
- O protótipo já inclui interações importantes da experiência de compra, como carrossel, tabs, modais e CTAs.
- A estrutura foi pensada para servir como referência de migração para a aplicação principal em React.