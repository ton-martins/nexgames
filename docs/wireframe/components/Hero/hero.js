const heroBannerList = [
    {
        overline: "A SUA LOJA PREFERIDA DE GAMES",
        titleLines: ["CONSOLES E JOGOS", "COM ENTREGA DIGITAL", "ATÉ 40% OFF"],
        primaryLabel: "Comprar agora",
        secondaryLabel: "Ver ofertas",
        mediaSecondaryLabel: "COMPRE O QUE VOCÊ CURTE",
        mediaPrimaryLabel: "CONSOLES E JOGOS",
        startColor: "#fde26c",
        endColor: "#f5f7fa",
    },
    {
        overline: "PLATAFORMA NEXGAMES",
        titleLines: ["ACESSÓRIOS, KEYS", "E OFERTAS DA SEMANA", "NA MESMA VITRINE"],
        primaryLabel: "Ver ofertas",
        secondaryLabel: "Ver produtos",
        mediaSecondaryLabel: "CURADORIA NEXGAMES",
        mediaPrimaryLabel: "OFERTAS DA SEMANA",
        startColor: "#85d6ff",
        endColor: "#f4f7fb",
    },
    {
        overline: "MONTE SUA BIBLIOTECA",
        titleLines: ["RPG, AÇÃO E INDIES", "EM UM LAYOUT", "PRONTO PARA ESCALAR"],
        primaryLabel: "Explorar catálogo",
        secondaryLabel: "Ver destaques",
        mediaSecondaryLabel: "MONTE SUA BIBLIOTECA",
        mediaPrimaryLabel: "RPG, AÇÃO E INDIES",
        startColor: "#9ce6b3",
        endColor: "#f5f7fb",
    },
];

const heroInfoCardList = [
    {
        titleTop: "Descubra as melhores",
        titleMain: "ofertas",
        titleBottom: "em RPG e aventura",
        buttonLabel: "Comprar agora",
        startColor: "#fff6d6",
        endColor: "#f5f5f5",
    },
    {
        titleTop: "Jogos digitais",
        titleMain: "prontos",
        titleBottom: "para entrega imediata",
        buttonLabel: "Ver catálogo",
        startColor: "#e8f6ff",
        endColor: "#f6f7f9",
    },
    {
        titleTop: "Acessórios gamer",
        titleMain: "em alta",
        titleBottom: "para setup e console",
        buttonLabel: "Explorar",
        startColor: "#e9fff2",
        endColor: "#f6f7f9",
    },
    {
        titleTop: "Curadoria NexGames",
        titleMain: "premium",
        titleBottom: "para vitrine e lançamentos",
        buttonLabel: "Ver seleção",
        startColor: "#f0ecff",
        endColor: "#f6f7f9",
    },
];

let activeHeroBannerIndex = 0;
let heroAutoplayId = null;

function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function createHeroVisualMarkup(banner) {
    return `
        <div
            class="hero-media-card"
            style="--hero-card-start-color: ${banner.startColor}; --hero-card-end-color: ${banner.endColor};"
        >
            <div class="hero-media-glow"></div>
            <div class="hero-media-shape"></div>
            <div class="hero-media-labels">
                <span>${banner.mediaSecondaryLabel}</span>
                <strong>${banner.mediaPrimaryLabel}</strong>
            </div>
        </div>
    `;
}

function renderHeroInfoCards(infoCardsContainer) {
    if (!infoCardsContainer) {
        return;
    }

    infoCardsContainer.innerHTML = heroInfoCardList.map((card) => `
        <article class="hero-info-card">
            <div
                class="hero-info-card-media"
                style="--card-start-color: ${card.startColor}; --card-end-color: ${card.endColor};"
                aria-hidden="true"
            >
                <div class="hero-info-card-shape"></div>
            </div>

            <div class="hero-info-card-copy">
                <span>${card.titleTop}</span>
                <strong>${card.titleMain}</strong>
                <small>${card.titleBottom}</small>

                <button class="hero-info-card-link" type="button">
                    ${card.buttonLabel}
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </article>
    `).join("");
}

function renderHeroBanner(rootElement) {
    const heroSlider = rootElement.querySelector("#hero-slider");
    const heroOverline = rootElement.querySelector("#hero-overline");
    const heroTitle = rootElement.querySelector("#hero-title");
    const heroPrimaryLabel = rootElement.querySelector("#hero-primary-label");
    const heroSecondaryLabel = rootElement.querySelector("#hero-secondary-label");
    const heroVisual = rootElement.querySelector("#hero-visual");
    const heroDots = rootElement.querySelector("#hero-dots");

    const currentBanner = heroBannerList[activeHeroBannerIndex];

    if (!heroSlider || !heroOverline || !heroTitle || !heroPrimaryLabel || !heroVisual || !heroDots || !currentBanner) {
        return;
    }

    heroOverline.textContent = currentBanner.overline;
    heroTitle.innerHTML = currentBanner.titleLines.map((line) => `<span>${line}</span>`).join("");
    heroPrimaryLabel.textContent = currentBanner.primaryLabel;
    heroSecondaryLabel.textContent = currentBanner.secondaryLabel;
    heroVisual.innerHTML = createHeroVisualMarkup(currentBanner);

    heroSlider.style.setProperty("--hero-end-color", currentBanner.endColor);

    heroDots.innerHTML = heroBannerList.map((_, bannerIndex) => `
        <button
            class="hero-dot${bannerIndex === activeHeroBannerIndex ? " is-active" : ""}"
            type="button"
            aria-label="Ir para o banner ${bannerIndex + 1}"
            data-hero-dot-index="${bannerIndex}"
        ></button>
    `).join("");

    refreshIcons();
}

function moveHeroBanner(rootElement, direction) {
    activeHeroBannerIndex = (activeHeroBannerIndex + direction + heroBannerList.length) % heroBannerList.length;
    renderHeroBanner(rootElement);
}

function startHeroAutoplay(rootElement) {
    if (heroBannerList.length <= 1) {
        return;
    }

    window.clearInterval(heroAutoplayId);

    heroAutoplayId = window.setInterval(() => {
        moveHeroBanner(rootElement, 1);
    }, 5000);
}

export function initHero(rootElement) {
    if (!rootElement) {
        return;
    }

    const infoCardsContainer = rootElement.querySelector("#hero-info-cards");
    const heroPrevButton = rootElement.querySelector("#hero-prev");
    const heroNextButton = rootElement.querySelector("#hero-next");
    const heroDots = rootElement.querySelector("#hero-dots");

    renderHeroInfoCards(infoCardsContainer);
    renderHeroBanner(rootElement);
    startHeroAutoplay(rootElement);

    if (heroPrevButton) {
        heroPrevButton.addEventListener("click", () => {
            moveHeroBanner(rootElement, -1);
            startHeroAutoplay(rootElement);
        });
    }

    if (heroNextButton) {
        heroNextButton.addEventListener("click", () => {
            moveHeroBanner(rootElement, 1);
            startHeroAutoplay(rootElement);
        });
    }

    if (heroDots) {
        heroDots.addEventListener("click", (event) => {
            const targetDot = event.target.closest("[data-hero-dot-index]");

            if (!targetDot) {
                return;
            }

            activeHeroBannerIndex = Number(targetDot.dataset.heroDotIndex);
            renderHeroBanner(rootElement);
            startHeroAutoplay(rootElement);
        });
    }
}
