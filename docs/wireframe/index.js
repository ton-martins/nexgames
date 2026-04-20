const mobileSearchToggle = document.getElementById("mobile-search-toggle");
const searchForm = document.getElementById("search-form");

const heroSlider = document.getElementById("hero-slider");
const heroOverline = document.getElementById("hero-overline");
const heroTitle = document.getElementById("hero-title");
const heroPrimaryLabel = document.getElementById("hero-primary-label");
const heroMedia = document.getElementById("hero-media");
const heroMediaSecondaryLabel = document.getElementById("hero-media-secondary-label");
const heroMediaPrimaryLabel = document.getElementById("hero-media-primary-label");
const heroDots = document.getElementById("hero-dots");
const heroPrevButton = document.getElementById("hero-prev");
const heroNextButton = document.getElementById("hero-next");

const promoBannerRow = document.getElementById("promo-banner-row");
const benefitsStrip = document.getElementById("benefits-strip");
const tabButtonsRow = document.getElementById("tab-buttons-row");
const catalogGrid = document.getElementById("catalog-grid");

const heroSlides = [
    {
        overline: "COMPRE O QUE VOCÊ CURTE",
        titleLines: ["CONSOLES E JOGOS", "COM ENTREGA DIGITAL", "ATÉ 40% OFF"],
        primaryLabel: "Comprar agora",
        mediaSecondaryLabel: "COMPRE O QUE VOCÊ CURTE",
        mediaPrimaryLabel: "CONSOLES E JOGOS",
        startColor: "#fde26c",
        endColor: "#f5f7fa",
    },
    {
        overline: "CURADORIA NEXGAMES",
        titleLines: ["ACESSÓRIOS, KEYS", "E OFERTAS DA SEMANA", "NA MESMA VITRINE"],
        primaryLabel: "Ver ofertas",
        mediaSecondaryLabel: "CURADORIA NEXGAMES",
        mediaPrimaryLabel: "OFERTAS DA SEMANA",
        startColor: "#85d6ff",
        endColor: "#f4f7fb",
    },
    {
        overline: "MONTE SUA BIBLIOTECA",
        titleLines: ["RPG, AÇÃO E INDIES", "EM UM LAYOUT", "PRONTO PARA ESCALAR"],
        primaryLabel: "Explorar catálogo",
        mediaSecondaryLabel: "MONTE SUA BIBLIOTECA",
        mediaPrimaryLabel: "RPG, AÇÃO E INDIES",
        startColor: "#9ce6b3",
        endColor: "#f5f7fb",
    },
];

const promoBanners = [
    {
        titleTop: "Descubra as melhores",
        titleMain: "ofertas",
        titleBottom: "em RPG e aventura",
        buttonLabel: "Comprar agora",
        mediaSecondaryLabel: "OFERTAS",
        mediaPrimaryLabel: "RPG",
        startColor: "#fff6d6",
        endColor: "#f5f5f5",
    },
    {
        titleTop: "Jogos digitais",
        titleMain: "prontos",
        titleBottom: "para entrega imediata",
        buttonLabel: "Ver catálogo",
        mediaSecondaryLabel: "DIGITAL",
        mediaPrimaryLabel: "KEYS",
        startColor: "#e8f6ff",
        endColor: "#f6f7f9",
    },
    {
        titleTop: "Acessórios gamer",
        titleMain: "em alta",
        titleBottom: "para setup e console",
        buttonLabel: "Explorar",
        mediaSecondaryLabel: "SETUP",
        mediaPrimaryLabel: "GEAR",
        startColor: "#e9fff2",
        endColor: "#f6f7f9",
    },
    {
        titleTop: "Curadoria NexGames",
        titleMain: "premium",
        titleBottom: "para vitrine e lançamentos",
        buttonLabel: "Ver seleção",
        mediaSecondaryLabel: "CURADORIA",
        mediaPrimaryLabel: "PREMIUM",
        startColor: "#f0ecff",
        endColor: "#f6f7f9",
    },
];

const benefitItems = [
    {
        icon: "truck",
        title: "Entrega digital",
        text: "Rápida e automática",
    },
    {
        icon: "badge-percent",
        title: "Ofertas ativas",
        text: "Descontos por campanha",
    },
    {
        icon: "refresh-ccw",
        title: "Catálogo dinâmico",
        text: "Atualizado pela API",
    },
    {
        icon: "credit-card",
        title: "Checkout pronto",
        text: "Base para evolução",
    },
    {
        icon: "headset",
        title: "Suporte 24/7",
        text: "Fluxo visual completo",
    },
];

const catalogTabs = [
    { id: "destaques", label: "Em destaque" },
    { id: "promocoes", label: "Em promoção" },
    { id: "avaliacao", label: "Mais bem avaliados" },
];

const catalogProductsByTab = {
    destaques: [
        {
            id: "destaque-1",
            category: "Ação / Aventura",
            title: "Marvel's Spider-Man 2 Deluxe Edition",
            mediaPrimaryLabel: "PlayStation",
            mediaSecondaryLabel: "Deluxe",
            tagLabel: "Destaque",
            rating: 4.9,
            reviewCount: 278,
            price: 249.9,
            oldPrice: 329.9,
            startColor: "#fee46d",
            endColor: "#eef3f8",
        },
        {
            id: "destaque-2",
            category: "RPG",
            title: "Final Fantasy XVI",
            mediaPrimaryLabel: "Square Enix",
            mediaSecondaryLabel: "RPG",
            tagLabel: "Novo",
            rating: 4.8,
            reviewCount: 191,
            price: 199.9,
            oldPrice: 249.9,
            startColor: "#f5edff",
            endColor: "#f7f9fc",
        },
        {
            id: "destaque-3",
            category: "Corrida",
            title: "Forza Horizon 5",
            mediaPrimaryLabel: "Xbox Game Studios",
            mediaSecondaryLabel: "Racing",
            tagLabel: "Hot",
            rating: 4.7,
            reviewCount: 164,
            price: 159.9,
            oldPrice: 219.9,
            startColor: "#e6f7ff",
            endColor: "#f7f9fc",
        },
        {
            id: "destaque-4",
            category: "Terror",
            title: "Resident Evil 4 Remake",
            mediaPrimaryLabel: "Capcom",
            mediaSecondaryLabel: "Remake",
            tagLabel: "Top",
            rating: 4.9,
            reviewCount: 243,
            price: 189.9,
            oldPrice: 239.9,
            startColor: "#ffe5e5",
            endColor: "#f9f7f8",
        },
        {
            id: "destaque-5",
            category: "Esportes",
            title: "EA Sports FC 26",
            mediaPrimaryLabel: "EA Sports",
            mediaSecondaryLabel: "Football",
            tagLabel: "Pré-venda",
            rating: 4.6,
            reviewCount: 117,
            price: 179.9,
            oldPrice: null,
            startColor: "#e8fff1",
            endColor: "#f7f9fc",
        },
        {
            id: "destaque-6",
            category: "Indie",
            title: "Hades II Early Access",
            mediaPrimaryLabel: "Supergiant",
            mediaSecondaryLabel: "Indie",
            tagLabel: "Novo",
            rating: 4.8,
            reviewCount: 205,
            price: 99.9,
            oldPrice: null,
            startColor: "#fff1d9",
            endColor: "#f8f8fa",
        },
    ],
    promocoes: [
        {
            id: "promocao-1",
            category: "RPG",
            title: "Cyberpunk 2077 Ultimate Edition",
            mediaPrimaryLabel: "CD Projekt",
            mediaSecondaryLabel: "Oferta",
            tagLabel: "Oferta",
            rating: 4.7,
            reviewCount: 331,
            price: 119.9,
            oldPrice: 219.9,
            startColor: "#fff1c9",
            endColor: "#f7f9fc",
        },
        {
            id: "promocao-2",
            category: "Aventura",
            title: "Hogwarts Legacy",
            mediaPrimaryLabel: "Warner",
            mediaSecondaryLabel: "Magia",
            tagLabel: "Oferta",
            rating: 4.6,
            reviewCount: 219,
            price: 139.9,
            oldPrice: 249.9,
            startColor: "#e8f1ff",
            endColor: "#f7f9fc",
        },
        {
            id: "promocao-3",
            category: "Luta",
            title: "Mortal Kombat 1 Premium",
            mediaPrimaryLabel: "NetherRealm",
            mediaSecondaryLabel: "Fight",
            tagLabel: "Promo",
            rating: 4.5,
            reviewCount: 153,
            price: 129.9,
            oldPrice: 249.9,
            startColor: "#ffe1df",
            endColor: "#f8f8fa",
        },
        {
            id: "promocao-4",
            category: "Suspense",
            title: "Alan Wake 2 Deluxe",
            mediaPrimaryLabel: "Remedy",
            mediaSecondaryLabel: "Deluxe",
            tagLabel: "Promo",
            rating: 4.8,
            reviewCount: 188,
            price: 149.9,
            oldPrice: 279.9,
            startColor: "#ece8ff",
            endColor: "#f8f8fa",
        },
        {
            id: "promocao-5",
            category: "Soulslike",
            title: "Lies of P",
            mediaPrimaryLabel: "Neowiz",
            mediaSecondaryLabel: "Souls",
            tagLabel: "Oferta",
            rating: 4.7,
            reviewCount: 144,
            price: 109.9,
            oldPrice: 229.9,
            startColor: "#ebfff0",
            endColor: "#f8f8fa",
        },
        {
            id: "promocao-6",
            category: "Terror",
            title: "Dead Space Remake",
            mediaPrimaryLabel: "EA",
            mediaSecondaryLabel: "Remake",
            tagLabel: "Oferta",
            rating: 4.8,
            reviewCount: 201,
            price: 119.9,
            oldPrice: 249.9,
            startColor: "#ffe8d9",
            endColor: "#f8f8fa",
        },
    ],
    avaliacao: [
        {
            id: "avaliacao-1",
            category: "RPG",
            title: "Baldur's Gate 3",
            mediaPrimaryLabel: "Larian",
            mediaSecondaryLabel: "RPG",
            tagLabel: "Top",
            rating: 5.0,
            reviewCount: 412,
            price: 199.9,
            oldPrice: null,
            startColor: "#fff0d1",
            endColor: "#f8f8fa",
        },
        {
            id: "avaliacao-2",
            category: "Ação",
            title: "Elden Ring",
            mediaPrimaryLabel: "FromSoftware",
            mediaSecondaryLabel: "Top",
            tagLabel: "Top",
            rating: 4.9,
            reviewCount: 501,
            price: 179.9,
            oldPrice: 229.9,
            startColor: "#efe7ff",
            endColor: "#f8f8fa",
        },
        {
            id: "avaliacao-3",
            category: "Mundo aberto",
            title: "Red Dead Redemption 2",
            mediaPrimaryLabel: "Rockstar",
            mediaSecondaryLabel: "Classic",
            tagLabel: "Top",
            rating: 4.9,
            reviewCount: 638,
            price: 89.9,
            oldPrice: 149.9,
            startColor: "#ffe4d1",
            endColor: "#f8f8fa",
        },
        {
            id: "avaliacao-4",
            category: "RPG",
            title: "The Witcher 3 Complete Edition",
            mediaPrimaryLabel: "CD Projekt",
            mediaSecondaryLabel: "Classic",
            tagLabel: "Top",
            rating: 4.9,
            reviewCount: 720,
            price: 69.9,
            oldPrice: 129.9,
            startColor: "#e8f7ff",
            endColor: "#f8f8fa",
        },
        {
            id: "avaliacao-5",
            category: "Aventura",
            title: "God of War Ragnarök",
            mediaPrimaryLabel: "Santa Monica",
            mediaSecondaryLabel: "Épico",
            tagLabel: "Top",
            rating: 4.9,
            reviewCount: 367,
            price: 219.9,
            oldPrice: 279.9,
            startColor: "#ebfff1",
            endColor: "#f8f8fa",
        },
        {
            id: "avaliacao-6",
            category: "Indie",
            title: "Hollow Knight",
            mediaPrimaryLabel: "Team Cherry",
            mediaSecondaryLabel: "Indie",
            tagLabel: "Clássico",
            rating: 4.9,
            reviewCount: 594,
            price: 46.9,
            oldPrice: null,
            startColor: "#f4f1ff",
            endColor: "#f8f8fa",
        },
    ],
};

let activeHeroIndex = 0;
let activeTabId = "destaques";
let heroAutoplayId = null;

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    }).format(value);
}

function calculateDiscountPercentage(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) {
        return 0;
    }

    return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function createMediaPlaceholder({
    variant,
    startColor,
    endColor,
    secondaryLabel,
    primaryLabel,
}) {
    return `
        <div
            class="media-placeholder media-placeholder--${variant}"
            style="--media-start-color: ${startColor}; --media-end-color: ${endColor};"
        >
            <div class="media-glow"></div>
            <div class="media-shape"></div>
            <div class="media-label-group">
                <span>${secondaryLabel}</span>
                <strong>${primaryLabel}</strong>
            </div>
        </div>
    `;
}

function renderHeroSlide() {
    const currentSlide = heroSlides[activeHeroIndex];

    if (
        !currentSlide
        || !heroSlider
        || !heroOverline
        || !heroTitle
        || !heroPrimaryLabel
        || !heroMedia
        || !heroMediaSecondaryLabel
        || !heroMediaPrimaryLabel
        || !heroDots
    ) {
        return;
    }

    heroOverline.textContent = currentSlide.overline;
    heroTitle.innerHTML = currentSlide.titleLines.map((line) => `<span>${line}</span>`).join("");
    heroPrimaryLabel.textContent = currentSlide.primaryLabel;
    heroMediaSecondaryLabel.textContent = currentSlide.mediaSecondaryLabel;
    heroMediaPrimaryLabel.textContent = currentSlide.mediaPrimaryLabel;

    heroSlider.style.setProperty("--hero-start-color", currentSlide.startColor);
    heroSlider.style.setProperty("--hero-end-color", currentSlide.endColor);
    heroMedia.style.setProperty("--media-start-color", currentSlide.startColor);
    heroMedia.style.setProperty("--media-end-color", currentSlide.endColor);

    heroDots.innerHTML = heroSlides.map((_, slideIndex) => `
        <button
            class="hero-dot${slideIndex === activeHeroIndex ? " is-active" : ""}"
            type="button"
            aria-label="Ir para o banner ${slideIndex + 1}"
            data-hero-dot-index="${slideIndex}"
        ></button>
    `).join("");
}

function moveHeroSlide(direction) {
    activeHeroIndex = (activeHeroIndex + direction + heroSlides.length) % heroSlides.length;
    renderHeroSlide();
}

function startHeroAutoplay() {
    if (heroSlides.length <= 1) {
        return;
    }

    window.clearInterval(heroAutoplayId);
    heroAutoplayId = window.setInterval(() => {
        moveHeroSlide(1);
    }, 5000);
}

function renderPromoBanners() {
    if (!promoBannerRow) {
        return;
    }

    promoBannerRow.innerHTML = promoBanners.map((banner) => `
        <article class="promo-banner-card">
            ${createMediaPlaceholder({
                variant: "promo",
                startColor: banner.startColor,
                endColor: banner.endColor,
                secondaryLabel: banner.mediaSecondaryLabel,
                primaryLabel: banner.mediaPrimaryLabel,
            })}

            <div class="promo-banner-copy">
                <span>${banner.titleTop}</span>
                <strong>${banner.titleMain}</strong>
                <small>${banner.titleBottom}</small>

                <button class="promo-banner-link" type="button">
                    ${banner.buttonLabel}
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </article>
    `).join("");
}

function renderBenefits() {
    if (!benefitsStrip) {
        return;
    }

    benefitsStrip.innerHTML = benefitItems.map((benefit) => `
        <article class="benefit-item">
            <i data-lucide="${benefit.icon}"></i>
            <div>
                <strong>${benefit.title}</strong>
                <span>${benefit.text}</span>
            </div>
        </article>
    `).join("");
}

function renderTabButtons() {
    if (!tabButtonsRow) {
        return;
    }

    tabButtonsRow.innerHTML = catalogTabs.map((tab) => `
        <button
            class="tab-button${tab.id === activeTabId ? " is-active" : ""}"
            type="button"
            data-tab-id="${tab.id}"
        >
            ${tab.label}
        </button>
    `).join("");
}

function createProductCard(product, productIndex, totalProducts) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;
    const isHighlighted = productIndex === totalProducts - 1;

    return `
        <article class="product-card${isHighlighted ? " is-highlighted" : ""}">
            <div class="product-card-top">
                <span class="product-badge">${badgeLabel}</span>

                <div class="product-quick-actions">
                    <button class="icon-button" type="button" aria-label="Salvar nos favoritos">
                        <i data-lucide="heart"></i>
                    </button>
                    <button class="icon-button" type="button" aria-label="Abrir visualização rápida">
                        <i data-lucide="eye"></i>
                    </button>
                </div>
            </div>

            <button class="product-category-button" type="button">${product.category}</button>
            <button class="product-title-button" type="button">${product.title}</button>
            <button class="product-media-button" type="button" aria-label="Abrir produto ${product.title}">
                ${createMediaPlaceholder({
                    variant: "product",
                    startColor: product.startColor,
                    endColor: product.endColor,
                    secondaryLabel: product.mediaSecondaryLabel,
                    primaryLabel: product.mediaPrimaryLabel,
                })}
            </button>

            <div class="rating-row">
                <i data-lucide="star"></i>
                <span>${product.rating.toFixed(1)}</span>
                <small>(${product.reviewCount})</small>
            </div>

            <div class="price-row">
                <div>
                    <strong class="${discountPercentage > 0 ? "price-sale" : ""}">${formatCurrency(product.price)}</strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>

                <button class="primary-circle-button" type="button" aria-label="Adicionar ao carrinho">
                    <i data-lucide="shopping-bag"></i>
                </button>
            </div>

            ${isHighlighted ? `
                <div class="product-footer-links">
                    <button class="product-footer-link" type="button">
                        <i data-lucide="heart"></i>
                        Favoritar
                    </button>
                    <button class="product-footer-link" type="button">
                        <i data-lucide="eye"></i>
                        Visualizar
                    </button>
                </div>
            ` : ""}
        </article>
    `;
}

function renderCatalogGrid() {
    if (!catalogGrid) {
        return;
    }

    const visibleProducts = catalogProductsByTab[activeTabId] || [];

    catalogGrid.innerHTML = visibleProducts
        .map((product, productIndex) => createProductCard(product, productIndex, visibleProducts.length))
        .join("");
}

if (mobileSearchToggle && searchForm) {
    mobileSearchToggle.addEventListener("click", () => {
        searchForm.classList.toggle("is-open");
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

if (heroPrevButton) {
    heroPrevButton.addEventListener("click", () => {
        moveHeroSlide(-1);
        startHeroAutoplay();
        refreshIcons();
    });
}

if (heroNextButton) {
    heroNextButton.addEventListener("click", () => {
        moveHeroSlide(1);
        startHeroAutoplay();
        refreshIcons();
    });
}

if (heroDots) {
    heroDots.addEventListener("click", (event) => {
        const targetDot = event.target.closest("[data-hero-dot-index]");

        if (!targetDot) {
            return;
        }

        activeHeroIndex = Number(targetDot.dataset.heroDotIndex);
        renderHeroSlide();
        startHeroAutoplay();
        refreshIcons();
    });
}

if (tabButtonsRow) {
    tabButtonsRow.addEventListener("click", (event) => {
        const targetTabButton = event.target.closest("[data-tab-id]");

        if (!targetTabButton) {
            return;
        }

        activeTabId = targetTabButton.dataset.tabId;
        renderTabButtons();
        renderCatalogGrid();
        refreshIcons();
    });
}

renderHeroSlide();
renderPromoBanners();
renderBenefits();
renderTabButtons();
renderCatalogGrid();
refreshIcons();
startHeroAutoplay();
