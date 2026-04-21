import { getProductsByIds } from "../../data/storeData.js";
import {
    calculateDiscountPercentage,
    formatCurrency,
    refreshIcons,
} from "../../core/storefrontUtils.js";

const exclusiveProductsContent = {
    overline: "NexGames Pro",
    titleBanner: "Eleve seu setup com títulos de elite",
    descriptionBanner: "Uma seleção feita para quem gosta de montar biblioteca com RPG, ação, narrativa forte e experiências premium do entretenimento gamer.",
    titleCards: "Lote exclusivo",
    descriptionCards: "Mergulhe em mundos onde cada escolha molda o destino. Uma curadoria focada em narrativas viscerais, mistérios sombrios e personagens inesquecíveis.",
    buttonLabel: "Desbloquear Coleção",
    mediaPrimaryLabel: "Biblioteca gamer",
    mediaSecondaryLabel: "Seleção premium",
    startColor: "#fed700",
    endColor: "#f7f9fc",
    productIds: [
        "baldurs-gate-3",
        "elden-ring",
        "last-of-us-part-1",
        "enigma-do-medo",
    ],
};

const exclusiveProducts = getProductsByIds(exclusiveProductsContent.productIds);

function createVisualMarkup() {
    return `
        <article class="exclusive-products-visual-panel">
            <span class="exclusive-products-overline">${exclusiveProductsContent.overline}</span>
            <h2 class="exclusive-products-title">${exclusiveProductsContent.titleBanner}</h2>
            <p class="exclusive-products-description">${exclusiveProductsContent.descriptionBanner}</p>

            <button class="exclusive-products-button" type="button">
                ${exclusiveProductsContent.buttonLabel}
            </button>

            <div
                class="exclusive-products-media"
                style="--exclusive-products-start-color: ${exclusiveProductsContent.startColor}; --exclusive-products-end-color: ${exclusiveProductsContent.endColor};"
            >
                <div class="exclusive-products-media-glow"></div>
                <div class="exclusive-products-media-shape"></div>
                <div class="exclusive-products-media-labels">
                    <span>${exclusiveProductsContent.mediaSecondaryLabel}</span>
                    <strong>${exclusiveProductsContent.mediaPrimaryLabel}</strong>
                </div>
            </div>
        </article>
    `;
}

function createCompactProductMarkup(product, isHighlighted = false) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;

    return `
        <button
            class="exclusive-products-product-card${isHighlighted ? " is-highlighted" : ""}"
            type="button"
            data-product-id="${product.id}"
        >
            <div class="exclusive-products-product-content">
                <div class="exclusive-products-product-top">
                    <span class="exclusive-products-product-badge">${badgeLabel}</span>
                    <div class="exclusive-products-product-actions" aria-hidden="true">
                        <span class="exclusive-products-product-icon-button">
                            <i data-lucide="heart"></i>
                        </span>
                        <span class="exclusive-products-product-icon-button">
                            <i data-lucide="eye"></i>
                        </span>
                    </div>
                </div>

                <span class="exclusive-products-product-category">${product.category}</span>
                <strong class="exclusive-products-product-title">${product.title}</strong>

                <div
                    class="exclusive-products-product-media"
                    style="--split-product-start-color: ${product.startColor}; --split-product-end-color: ${product.endColor};"
                >
                    <div class="exclusive-products-product-shape"></div>
                    <div class="exclusive-products-product-labels">
                        <span>${product.mediaSecondaryLabel}</span>
                        <strong>${product.mediaPrimaryLabel}</strong>
                    </div>
                </div>

                <div class="exclusive-products-product-footer">
                    <div class="exclusive-products-product-price">
                        <strong class="${discountPercentage > 0 ? "is-sale" : ""}">${formatCurrency(product.price)}</strong>
                        ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                    </div>
                    <span class="exclusive-products-product-cart" aria-hidden="true">
                        <i data-lucide="shopping-bag"></i>
                    </span>
                </div>
            </div>
        </button>
    `;
}

function renderExclusiveProducts(layoutElement) {
    if (!layoutElement) {
        return;
    }

    layoutElement.innerHTML = `
        ${createVisualMarkup()}

        <div class="exclusive-products-content-panel">
            <div class="exclusive-products-heading">
                <div>
                    <span class="exclusive-products-heading-overline">Biblioteca organizada</span>
                    <h2>${exclusiveProductsContent.titleCards}</h2>
                    <p>${exclusiveProductsContent.descriptionCards}</p>
                </div>

                <button class="exclusive-products-heading-action" type="button">
                    Ver tudo
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>

            <div class="exclusive-products-product-grid">
                ${exclusiveProducts.map((product, productIndex) => createCompactProductMarkup(product, productIndex === 3)).join("")}
            </div>

            <div class="exclusive-products-dots" aria-hidden="true">
                <span class="is-active"></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
}

export function initExclusiveProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const layoutElement = rootElement.querySelector("#exclusive-products-layout");

    renderExclusiveProducts(layoutElement);
    refreshIcons();

    rootElement.addEventListener("click", (event) => {
        const productCard = event.target.closest("[data-product-id]");

        if (productCard) {
            const selectedProduct = exclusiveProducts.find((product) => product.id === productCard.dataset.productId);

            if (selectedProduct) {
                console.log(`[ExclusiveProducts] abrir produto: ${selectedProduct.title}`);
            }
        }
    });
}
