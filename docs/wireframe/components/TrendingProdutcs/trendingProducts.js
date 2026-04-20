const trendingTabs = [
    { id: "featured", label: "Em destaque" },
    { id: "promotion", label: "Em promoção" },
    { id: "rating", label: "Mais bem avaliados" },
];

const productsByTab = {
    featured: [
        {
            id: "featured-1",
            category: "Ação / Aventura",
            title: "Marvel's Spider-Man 2 Deluxe Edition",
            description: "Versão premium com extras digitais e foco em experiência cinematográfica.",
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
            id: "featured-2",
            category: "RPG",
            title: "Final Fantasy XVI",
            description: "RPG com narrativa épica, combate em tempo real e visual marcante.",
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
            id: "featured-3",
            category: "Corrida",
            title: "Forza Horizon 5",
            description: "Mundo aberto com foco em corridas, coleção de carros e eventos sazonais.",
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
            id: "featured-4",
            category: "Terror",
            title: "Resident Evil 4 Remake",
            description: "Remake com nova direção visual, atmosfera tensa e campanha retrabalhada.",
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
            id: "featured-5",
            category: "Esportes",
            title: "EA Sports FC 26",
            description: "Nova temporada com foco em clubes, Ultimate Team e competitividade online.",
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
            id: "featured-6",
            category: "Indie",
            title: "Hades II Early Access",
            description: "Sequência com combate rápido, direção de arte forte e estrutura roguelike.",
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
    promotion: [
        {
            id: "promotion-1",
            category: "RPG",
            title: "Cyberpunk 2077 Ultimate Edition",
            description: "Pacote completo com expansão e conteúdos extras da edição definitiva.",
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
            id: "promotion-2",
            category: "Aventura",
            title: "Hogwarts Legacy",
            description: "Exploração em mundo mágico com combate, classes e progressão de personagem.",
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
            id: "promotion-3",
            category: "Luta",
            title: "Mortal Kombat 1 Premium",
            description: "Versão premium com personagens extras e foco competitivo.",
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
            id: "promotion-4",
            category: "Suspense",
            title: "Alan Wake 2 Deluxe",
            description: "Narrativa imersiva com terror psicológico e visual cinematográfico.",
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
            id: "promotion-5",
            category: "Soulslike",
            title: "Lies of P",
            description: "Combate técnico, ambientação sombria e progressão inspirada em soulslike.",
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
            id: "promotion-6",
            category: "Terror",
            title: "Dead Space Remake",
            description: "Remake focado em atmosfera, áudio imersivo e tensão constante.",
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
    rating: [
        {
            id: "rating-1",
            category: "RPG",
            title: "Baldur's Gate 3",
            description: "RPG com escolhas profundas, narrativa complexa e altíssima rejogabilidade.",
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
            id: "rating-2",
            category: "Ação",
            title: "Elden Ring",
            description: "Exploração livre, chefes marcantes e um dos maiores destaques da geração.",
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
            id: "rating-3",
            category: "Mundo aberto",
            title: "Red Dead Redemption 2",
            description: "Narrativa forte, mundo vivo e alto nível de acabamento visual.",
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
            id: "rating-4",
            category: "RPG",
            title: "The Witcher 3 Complete Edition",
            description: "Clássico com narrativa lendária, expansões e mapa extenso.",
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
            id: "rating-5",
            category: "Aventura",
            title: "God of War Ragnarök",
            description: "Campanha cinematográfica com combate pesado e direção de arte forte.",
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
            id: "rating-6",
            category: "Indie",
            title: "Hollow Knight",
            description: "Metroidvania aclamado com excelente level design e direção artística.",
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

const productMap = new Map(
    Object.values(productsByTab).flatMap((productList) =>
        productList.map((product) => [product.id, product])
    )
);

let activeTabId = "featured";

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

function createProductMediaMarkup(product) {
    return `
        <div
            class="trending-product-media"
            style="--product-start-color: ${product.startColor}; --product-end-color: ${product.endColor};"
        >
            <div class="trending-product-shape"></div>
            <div class="trending-product-media-labels">
                <span>${product.mediaSecondaryLabel}</span>
                <strong>${product.mediaPrimaryLabel}</strong>
            </div>
        </div>
    `;
}

function createProductCardMarkup(product, productIndex, totalProducts) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;
    const isHighlighted = productIndex === totalProducts - 1;

    return `
        <button
            class="trending-product-card${isHighlighted ? " is-highlighted" : ""}"
            type="button"
            data-product-id="${product.id}"
        >
            <div class="trending-product-top">
                <span class="trending-product-badge">${badgeLabel}</span>

                <div class="trending-product-actions">
                    <span class="trending-icon-button" aria-hidden="true">
                        <i data-lucide="heart"></i>
                    </span>
                    <span class="trending-icon-button" aria-hidden="true">
                        <i data-lucide="eye"></i>
                    </span>
                </div>
            </div>

            <span class="trending-product-category">${product.category}</span>
            <strong class="trending-product-title">${product.title}</strong>

            ${createProductMediaMarkup(product)}

            <div class="trending-product-rating">
                <i data-lucide="star"></i>
                <span>${product.rating.toFixed(1)}</span>
                <small>(${product.reviewCount})</small>
            </div>

            <div class="trending-product-footer">
                <div class="trending-product-price">
                    <strong class="${discountPercentage > 0 ? "price-sale" : ""}">${formatCurrency(product.price)}</strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>

                <span class="trending-cart-button" aria-hidden="true">
                    <i data-lucide="shopping-bag"></i>
                </span>
            </div>
        </button>
    `;
}

function renderTabButtons(rootElement) {
    const tabsRow = rootElement.querySelector("#trending-tabs-row");

    if (!tabsRow) {
        return;
    }

    tabsRow.innerHTML = trendingTabs.map((tab) => `
        <button
            class="trending-tab-button${tab.id === activeTabId ? " is-active" : ""}"
            type="button"
            data-tab-id="${tab.id}"
        >
            ${tab.label}
        </button>
    `).join("");
}

function renderProductsGrid(rootElement) {
    const productsGrid = rootElement.querySelector("#trending-products-grid");
    const activeProductList = productsByTab[activeTabId] || [];

    if (!productsGrid) {
        return;
    }

    productsGrid.innerHTML = activeProductList
        .map((product, productIndex) => createProductCardMarkup(product, productIndex, activeProductList.length))
        .join("");
}

function openProductModal(rootElement, productId) {
    const product = productMap.get(productId);
    const modalOverlay = rootElement.querySelector("#trending-modal-overlay");
    const modalMedia = rootElement.querySelector("#trending-modal-media");
    const modalCategory = rootElement.querySelector("#trending-modal-category");
    const modalTitle = rootElement.querySelector("#trending-modal-title");
    const modalDescription = rootElement.querySelector("#trending-modal-description");
    const modalRating = rootElement.querySelector("#trending-modal-rating");
    const modalTag = rootElement.querySelector("#trending-modal-tag");
    const modalPrice = rootElement.querySelector("#trending-modal-price");
    const modalOldPrice = rootElement.querySelector("#trending-modal-old-price");

    if (
        !product
        || !modalOverlay
        || !modalMedia
        || !modalCategory
        || !modalTitle
        || !modalDescription
        || !modalRating
        || !modalTag
        || !modalPrice
        || !modalOldPrice
    ) {
        return;
    }

    modalMedia.innerHTML = createProductMediaMarkup(product);
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description;
    modalRating.textContent = `${product.rating.toFixed(1)} • ${product.reviewCount} avaliações`;
    modalTag.textContent = product.tagLabel;
    modalPrice.textContent = formatCurrency(product.price);
    modalOldPrice.textContent = product.oldPrice ? formatCurrency(product.oldPrice) : "";

    modalOverlay.hidden = false;
    document.body.classList.add("modal-open");
    refreshIcons();
}

function closeProductModal(rootElement) {
    const modalOverlay = rootElement.querySelector("#trending-modal-overlay");

    if (!modalOverlay) {
        return;
    }

    modalOverlay.hidden = true;
    document.body.classList.remove("modal-open");
}

export function initTrendingProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const modalOverlay = rootElement.querySelector("#trending-modal-overlay");

    renderTabButtons(rootElement);
    renderProductsGrid(rootElement);
    refreshIcons();

    rootElement.addEventListener("click", (event) => {
        const productCard = event.target.closest("[data-product-id]");
        const tabButton = event.target.closest("[data-tab-id]");
        const closeButton = event.target.closest("[data-trending-modal-close]");

        if (tabButton) {
            activeTabId = tabButton.dataset.tabId;
            renderTabButtons(rootElement);
            renderProductsGrid(rootElement);
            refreshIcons();
            return;
        }

        if (productCard) {
            openProductModal(rootElement, productCard.dataset.productId);
            return;
        }

        if (closeButton) {
            closeProductModal(rootElement);
            return;
        }

        if (modalOverlay && event.target === modalOverlay) {
            closeProductModal(rootElement);
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProductModal(rootElement);
        }
    });
}
