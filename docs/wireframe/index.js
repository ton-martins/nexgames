const botaoBuscaMobile = document.getElementById("mobile-search-toggle");
const formularioBusca = document.getElementById("search-form");
const botaoBannerAnterior = document.getElementById("hero-prev");
const botaoProximoBanner = document.getElementById("hero-next");
const containerPontosBanner = document.getElementById("hero-dots");
const elementoTextoSuperior = document.getElementById("hero-eyebrow");
const elementoTituloBanner = document.getElementById("hero-title");
const elementoDescricaoBanner = document.getElementById("hero-description");
const elementoTextoBotaoPrincipal = document.getElementById("hero-primary-button");
const elementoSeloVisual = document.getElementById("hero-visual-badge");
const elementoTituloVisual = document.getElementById("hero-visual-title");
const elementoSubtituloVisual = document.getElementById("hero-visual-subtitle");

const listaBanners = [
    {
        textoSuperior: "Curadoria NexGames",
        titulo: "Jogos digitais com entrega imediata",
        descricao: "Estrutura principal da home pensada para destacar campanhas, colecoes e promocoes sazonais.",
        textoBotao: "Comprar agora",
        seloVisual: "RPG",
        tituloVisual: "Colecao destaque",
        subtituloVisual: "Banner visual do wireframe",
    },
    {
        textoSuperior: "Ofertas da semana",
        titulo: "Aproveite campanhas com descontos de destaque",
        descricao: "Espaco voltado para promocoes sazonais com foco em conversao, busca e navegacao rapida.",
        textoBotao: "Ver ofertas",
        seloVisual: "Oferta",
        tituloVisual: "Semana especial",
        subtituloVisual: "Jogos e bundles em promocao",
    },
    {
        textoSuperior: "Biblioteca gamer",
        titulo: "Monte sua vitrine com categorias, ranking e relatorios",
        descricao: "Banner principal pensado para reforcar navegacao, organizacao do catalogo e visibilidade dos dados.",
        textoBotao: "Explorar catalogo",
        seloVisual: "Ranking",
        tituloVisual: "Painel estrategico",
        subtituloVisual: "Layout pronto para escalar",
    },
];

let indiceBannerAtual = 0;

function renderizarBannerPrincipal() {
    const bannerAtual = listaBanners[indiceBannerAtual];

    if (
        !bannerAtual
        || !containerPontosBanner
        || !elementoTextoSuperior
        || !elementoTituloBanner
        || !elementoDescricaoBanner
        || !elementoTextoBotaoPrincipal
        || !elementoSeloVisual
        || !elementoTituloVisual
        || !elementoSubtituloVisual
    ) {
        return;
    }

    elementoTextoSuperior.textContent = bannerAtual.textoSuperior;
    elementoTituloBanner.textContent = bannerAtual.titulo;
    elementoDescricaoBanner.textContent = bannerAtual.descricao;
    elementoTextoBotaoPrincipal.textContent = bannerAtual.textoBotao;
    elementoSeloVisual.textContent = bannerAtual.seloVisual;
    elementoTituloVisual.textContent = bannerAtual.tituloVisual;
    elementoSubtituloVisual.textContent = bannerAtual.subtituloVisual;

    containerPontosBanner.innerHTML = "";

    listaBanners.forEach((_, indiceBanner) => {
        const ponto = document.createElement("button");
        ponto.type = "button";
        ponto.className = indiceBanner === indiceBannerAtual ? "hero-dot is-active" : "hero-dot";
        ponto.setAttribute("aria-label", `Ir para o banner ${indiceBanner + 1}`);
        ponto.addEventListener("click", () => {
            indiceBannerAtual = indiceBanner;
            renderizarBannerPrincipal();
        });

        containerPontosBanner.appendChild(ponto);
    });
}

if (botaoBuscaMobile && formularioBusca) {
    botaoBuscaMobile.addEventListener("click", () => {
        formularioBusca.classList.toggle("is-open");
    });
}

if (botaoBannerAnterior && botaoProximoBanner) {
    botaoBannerAnterior.addEventListener("click", () => {
        indiceBannerAtual = (indiceBannerAtual - 1 + listaBanners.length) % listaBanners.length;
        renderizarBannerPrincipal();
    });

    botaoProximoBanner.addEventListener("click", () => {
        indiceBannerAtual = (indiceBannerAtual + 1) % listaBanners.length;
        renderizarBannerPrincipal();
    });
}

renderizarBannerPrincipal();

if (window.lucide) {
    window.lucide.createIcons();
}
