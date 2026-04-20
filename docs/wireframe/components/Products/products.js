const productSections = [
    {
        id: "featured",
        title: "Em destaque",
        description: "Seleção principal da vitrine com os jogos mais chamativos do catálogo.",
        products: [
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
        ],
    },
    {
        id: "promotion",
        title: "Promoções",
        description: "Campanhas com melhor custo-benefício para destacar descontos ativos.",
        products: [
            {
                id: "promotion-1",
                category: "RPG",
                title: "Cyberpunk 2077 Ultimate Edition",
                description: "Pacote completo com expansão e todos os conteúdos extras da edição.",
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
                description: "Versão premium com conteúdo extra, personagens adicionais e foco competitivo.",
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
        ],
    },
    {
        id: "launches",
        title: "Lançamentos",
        description: "Área pensada para destacar novidades e produtos recém-chegados à vitrine.",
        products: [
            {
                id: "launches-1",
                category: "Esportes",
                title: "EA Sports FC 26",
                description: "Nova temporada com foco em modos competitivos, clubes e atualizações visuais.",
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
                id: "launches-2",
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
            {
                id: "launches-3",
                category: "RPG",
                title: "Dragon's Dogma 2",
                description: "RPG de fantasia com exploração livre, combates dinâmicos e pawns.",
                mediaPrimaryLabel: "Capcom",
                mediaSecondaryLabel: "RPG",
                tagLabel: "Novo",
                rating: 4.5,
                reviewCount: 132,
                price: 229.9,
                oldPrice: null,
                startColor: "#f1ebff",
                endColor: "#f8f8fa",
            },
            {
                id: "launches-4",
                category: "Ação",
                title: "Black Myth: Wukong",
                description: "Ação com combate intenso, ambientação mitológica e visual de alto impacto.",
                mediaPrimaryLabel: "Game Science",
                mediaSecondaryLabel: "Ação",
                tagLabel: "Novo",
                rating: 4.8,
                reviewCount: 209,
                price: 219.9,
                oldPrice: null,
                startColor: "#ffe8d9",
                endColor: "#f8f8fa",
            },
        ],
    },
];

const productMap = new Map(
    productSections.flatMap((section) => section.products.map((product) => [product.id, product]))
);

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
            class="product-media"
            style="--product-start-color: ${product.startColor}; --product-end-color: ${product.endColor};"
        >
            <div class="product-shape"></div>
            <div class="product-media-labels">
                <span>${product.mediaSecondaryLabel}</span>
                <strong>${product.mediaPrimaryLabel}</strong>
            </div>
        </div>
    `;
}

function createProductCardMarkup(product) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;

    return `
        <button class="product-card" type="button" data-product-id="${product.id}">
            <div class="product-top">
                <span class="product-badge">${badgeLabel}</span>
                <span class="product-view" aria-hidden="true">
                    <i data-lucide="eye"></i>
                </span>
            </div>

            <span class="product-category">${product.category}</span>
            <strong class="product-title">${product.title}</strong>

            ${createProductMediaMarkup(product)}

            <div class="product-rating">
                <i data-lucide="star"></i>
                <span>${product.rating.toFixed(1)}</span>
                <small>(${product.reviewCount})</small>
            </div>

            <div class="product-footer">
                <div class="product-price">
                    <strong class="${discountPercentage > 0 ? "price-sale" : ""}">${formatCurrency(product.price)}</strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>

                <span class="product-link">
                    Ver detalhes
                    <i data-lucide="arrow-right"></i>
                </span>
            </div>
        </button>
    `;
}

function renderProductSections(layoutElement) {
    if (!layoutElement) {
        return;
    }

    layoutElement.innerHTML = productSections.map((section) => `
        <section class="products-group">
            <div class="products-header">
                <div class="products-title-block">
                    <h2>${section.title}</h2>
                    <p>${section.description}</p>
                </div>

                <button class="products-action" type="button">
                    Ver tudo
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>

            <div class="products-grid">
                ${section.products.map((product) => createProductCardMarkup(product)).join("")}
            </div>
        </section>
    `).join("");
}

function openProductModal(rootElement, productId) {
    const product = productMap.get(productId);
    const modalOverlay = rootElement.querySelector("#products-modal-overlay");
    const modalMedia = rootElement.querySelector("#products-modal-media");
    const modalCategory = rootElement.querySelector("#products-modal-category");
    const modalTitle = rootElement.querySelector("#products-modal-title");
    const modalDescription = rootElement.querySelector("#products-modal-description");
    const modalRating = rootElement.querySelector("#products-modal-rating");
    const modalTag = rootElement.querySelector("#products-modal-tag");
    const modalPrice = rootElement.querySelector("#products-modal-price");
    const modalOldPrice = rootElement.querySelector("#products-modal-old-price");

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
    const modalOverlay = rootElement.querySelector("#products-modal-overlay");

    if (!modalOverlay) {
        return;
    }

    modalOverlay.hidden = true;
    document.body.classList.remove("modal-open");
}

export function initProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const layoutElement = rootElement.querySelector("#products-layout");
    const modalOverlay = rootElement.querySelector("#products-modal-overlay");

    renderProductSections(layoutElement);
    refreshIcons();

    rootElement.addEventListener("click", (event) => {
        const productCard = event.target.closest("[data-product-id]");
        const closeButton = event.target.closest("[data-products-modal-close]");

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
