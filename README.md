# NexGames

Frontend do e-commerce NexGames, desenvolvido com React e Vite, consumindo a API publicada em `https://api.nexgames.shop`.

O projeto está em fase de estruturação. As páginas e componentes-base já existem como pontos de entrada, e a próxima etapa do desenvolvimento é integrar rotas, autenticação JWT e consumo da API antes da implementação visual completa.

## Stack atual

- React 19
- Vite 8
- Tailwind CSS 4
- React Router DOM
- `lucide-react`
- `jwt-decode`
- ESLint

## API do projeto

- Base pública: `https://api.nexgames.shop/`
- Base URL da aplicação: `https://api.nexgames.shop/api/v1`
- Healthcheck: `https://api.nexgames.shop/check`

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O projeto usa variáveis do Vite. Crie um arquivo `.env` na raiz com base no `.env.example`.

`.env.example`
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=NexGames
VITE_TOKEN_STORAGE_KEY=nexgames_token
```

Para desenvolvimento local com a API rodando na máquina:

`.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=NexGames
VITE_TOKEN_STORAGE_KEY=nexgames_token
```

Se quiser testar o frontend local apontando para a API já publicada:

`.env`
```env
VITE_API_BASE_URL=https://api.nexgames.shop/api/v1
VITE_APP_NAME=NexGames
VITE_TOKEN_STORAGE_KEY=nexgames_token
```

### 3. Subir o projeto

```bash
npm run dev
```

### 4. Build de produção

```bash
npm run build
```

### 5. Preview local da build

```bash
npm run preview
```

### 6. Lint

```bash
npm run lint
```

## Variáveis de ambiente

### Frontend local e produção

- `VITE_API_BASE_URL`: URL base da API consumida pelo frontend
- `VITE_APP_NAME`: nome da aplicação
- `VITE_TOKEN_STORAGE_KEY`: chave usada para persistir o token JWT no navegador

### Produção no EasyPanel

No serviço do frontend, configure pelo menos:

```env
VITE_API_BASE_URL=https://api.nexgames.shop/api/v1
VITE_APP_NAME=NexGames
VITE_TOKEN_STORAGE_KEY=nexgames_token
```

Observações:

- variáveis do frontend precisam começar com `VITE_`
- o frontend nao usa `JWT_SECRET`
- se a URL da API mudar, o frontend precisa de novo build/deploy

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Sobe uma prévia local da build |
| `npm run lint` | Executa o ESLint |

## Organização atual do projeto

```text
nexgames/
  docs/
    wireframe/
  routes/
    AdminRoute.jsx
    AppRoutes.jsx
    ProtectedRoute.jsx
  services/
    api.js
    authService.js
    cartService.js
    categoryService.js
    companyService.js
    gameService.js
    ratingService.js
    reportService.js
    saleService.js
    userService.js
    wishlistService.js
  src/
    assets/
    components/
      BestSellersProducts.jsx
      BottomProducts.jsx
      Brands.jsx
      ExclusiveProducts.jsx
      Footer.jsx
      Header.jsx
      Hero.jsx
      Newsletter.jsx
      Products.jsx
      RecommendedProducts.jsx
      SubHeader.jsx
      TopHeader.jsx
      TrendingProducts.jsx
    pages/
      AdminCompanies.jsx
      AdminGames.jsx
      AdminReports.jsx
      Cart.jsx
      Checkout.jsx
      Home.jsx
      Login.jsx
      MyAccount.jsx
      MyWishlist.jsx
      Order.jsx
      Register.jsx
      SingleProduct.jsx
    App.jsx
    index.css
    main.jsx
  .env.example
  index.html
  package.json
  vite.config.js
```

## Responsabilidade de cada área

- `docs/wireframe/`: referência visual e estrutural da Home em HTML, CSS e JS
- `routes/`: controle das rotas da aplicação e proteção de acesso
- `services/`: consumo da API e preparação dos dados para uso nas páginas e componentes
- `src/components/`: componentes visuais e seções do ecommerce
- `src/pages/`: páginas finais da aplicação
- `src/App.jsx`: ponto de composição principal da aplicação
- `src/main.jsx`: bootstrap do React
- `src/index.css`: entrada global do Tailwind

## Estado atual da base

Hoje o projeto está propositalmente cru para a equipe desenvolver os componentes e páginas com liberdade, mas com a base técnica já preparada para:

- integração com a API publicada
- configuração por `.env`
- roteamento com `react-router-dom`
- leitura de JWT com `jwt-decode`
- separação entre páginas, componentes, rotas e serviços

## Fluxo recomendado de desenvolvimento

1. Configurar `AppRoutes.jsx` e as rotas do frontend.
2. Implementar o cliente base da API em `services/api.js`.
3. Implementar autenticação em `services/authService.js`.
4. Preparar as rotas protegidas em `routes/ProtectedRoute.jsx` e `routes/AdminRoute.jsx`.
5. Integrar as páginas à API.
6. Só depois montar os componentes visuais em cima dos dados normalizados.

## Rotas previstas da aplicação

- `/`
- `/login`
- `/register`
- `/product/:id`
- `/my-wishlist`
- `/cart`
- `/checkout`
- `/order`
- `/my-account`
- `/admin/companies`
- `/admin/games`
- `/admin/reports`

## Convenções para a equipe

- componente visual não deve chamar API diretamente
- chamadas HTTP devem ficar centralizadas em `services/`
- páginas devem orquestrar dados e renderização
- rotas protegidas devem ser tratadas em `routes/`
- a aplicação deve respeitar a API como ela existe hoje, sem assumir endpoints inexistentes

## Deploy do frontend

O frontend será publicado em `https://nexgames.shop`.

Como a aplicação é uma SPA React:

- o serviço precisa servir o `index.html`
- as rotas do frontend devem funcionar com fallback para `index.html`
- a variável `VITE_API_BASE_URL` deve apontar para `https://api.nexgames.shop/api/v1`

## Comandos úteis

Instalar dependências:

```bash
npm install
```

Rodar localmente:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Validar lint:

```bash
npm run lint
```
