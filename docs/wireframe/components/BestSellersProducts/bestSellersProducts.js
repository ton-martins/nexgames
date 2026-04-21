import {
    bestSellersSectionContent,
    getProductById,
    getProductsByIds,
} from "../../data/storeData.js";
import {
    calculateDiscountPercentage,
    formatCurrency,
    refreshIcons,
} from "../../core/storefrontUtils.js";

const bestSellersProducts = getProductsByIds(bestSellersSectionContent.productIds);
const featuredBestSellerProduct = getProductById(bestSellersSectionContent.featuredProductId);

function createProductCardMarkup(product) {

    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;

     return `
        <button class="bestseller-product-card" type="button" data-product-id="${product.id}">
            <div class="bestseller-product-top">
                <span class="bestseller-product-badge">${badgeLabel}</span>
                <div class="bestseller-product-actions" aria-hidden="true">
                    <span class="bestseller-product-icon">
                        <i data-lucide="heart"></i>
                    </span>
                    <span class="bestseller-product-icon">
                        <i data-lucide="eye"></i>
                    </span>
                </div>
            </div>

            <span class="bestseller-product-category">${product.category}</span>
            <strong class="bestseller-product-title">${product.title}</strong>

            <div
                class="bestseller-product-media"
                style="--bestseller-start-color: ${product.startColor}; --bestseller-end-color: ${product.endColor};"
            >
                <div class="bestseller-product-shape"></div>
                <div class="bestseller-product-labels">
                    <span>${product.mediaSecondaryLabel}</span>
                    <strong>${product.mediaPrimaryLabel}</strong>
                </div>
            </div>

            <div class="bestseller-product-footer">
                <div class="bestseller-product-price">
                    <strong class="${discountPercentage > 0 ? "is-sale" : ""}">${formatCurrency(product.price)}</strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>
                <span class="bestseller-cart-button" aria-hidden="true">
                    <i data-lucide="shopping-bag"></i>
                </span>
            </div>
        </button>
    `;
}

function createFeaturedPanelMarkup(product) {
    if (!product) {
        return "";
    }

    return `
        <article class="bestseller-featured-panel">
            <span class="bestseller-featured-meta">${product.category}, ${product.mediaPrimaryLabel}</span>
            <button class="bestseller-featured-title" type="button" data-product-id="${product.id}">
                ${product.title}
            </button>

            <div
                class="bestseller-featured-media"
                style="--bestseller-featured-start-color: ${product.startColor}; --bestseller-featured-end-color: ${product.endColor};"
            >
                <div class="bestseller-featured-glow"></div>
                <div class="bestseller-featured-shape"></div>
                <div class="bestseller-featured-labels">
                    <span>${product.mediaSecondaryLabel}</span>
                    <strong>${product.mediaPrimaryLabel}</strong>
                </div>
            </div>

            <div class="bestseller-featured-footer">
                <strong>${formatCurrency(product.price)}</strong>
                <button class="primary-button" type="button" data-product-id="${product.id}">
                    <i data-lucide="shopping-bag"></i>
                    <span>Adicionar ao carrinho</span>
                </button>
            </div>

            <div class="bestseller-thumbnail-row">
                ${bestSellersProducts.slice(0, 3).map((thumbnailProduct) => `
                    <button
                        class="bestseller-thumbnail-button"
                        type="button"
                        data-product-id="${thumbnailProduct.id}"
                    >
                        <div
                            class="bestseller-thumbnail-media"
                            style="--bestseller-thumbnail-start-color: ${thumbnailProduct.startColor}; --bestseller-thumbnail-end-color: ${thumbnailProduct.endColor};"
                        >
                            <div class="bestseller-thumbnail-shape"></div>
                        </div>
                    </button>
                `).join("")}
            </div>
        </article>
    `;
}

function renderBestSellersSection(shellElement) {
    if (!shellElement) {
        return;
    }

    shellElement.innerHTML = `
        <div class="bestseller-heading">
            <h2>${bestSellersSectionContent.title}</h2>
        </div>

        <div class="bestseller-layout">
            <div class="bestseller-grid">
                ${bestSellersProducts.map((product, productIndex) => createProductCardMarkup(product, productIndex === 0)).join("")}
            </div>

            ${createFeaturedPanelMarkup(featuredBestSellerProduct)}
        </div>
    `;
}

export function initBestSellersProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#bestseller-shell");

    renderBestSellersSection(shellElement);
    refreshIcons();

    rootElement.addEventListener("click", (event) => {
        const productButton = event.target.closest("[data-product-id]");

        if (productButton) {
            const selectedProduct = getProductById(productButton.dataset.productId);

            if (selectedProduct) {
                console.log(`[Bestseller] abrir produto: ${selectedProduct.title}`);
            }
        }
    });
}