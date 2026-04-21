import { getProductsByIds, productShelfSectionList } from "../../data/storeData.js";
import {
    calculateDiscountPercentage,
    formatCurrency,
    refreshIcons,
} from "../../core/storefrontUtils.js";

const productSections = productShelfSectionList.map((section) => ({
    ...section,
    products: getProductsByIds(section.productIds),
}));

const productMap = new Map(
    productSections.flatMap((section) => section.products.map((product) => [product.id, product]))
);

function createBadgeLabel(product) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);

    return discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;
}

function createProductMediaMarkup(product, mediaClassName = "products-media") {
    return `
        <div
            class="${mediaClassName}"
            style="--product-start-color: ${product.startColor}; --product-end-color: ${product.endColor};"
        >
            <div class="products-shape"></div>
            <div class="products-media-labels">
                <span>${product.mediaSecondaryLabel}</span>
                <strong>${product.mediaPrimaryLabel}</strong>
            </div>
        </div>
    `;
}

function createFeaturedProductMarkup(product) {
    const badgeLabel = createBadgeLabel(product);
    const hasPromotion = calculateDiscountPercentage(product.price, product.oldPrice) > 0;

    return `
        <button class="products-featured-card" type="button" data-product-id="${product.id}">
            <div class="products-card-top">
                <span class="products-card-badge">${badgeLabel}</span>
                <div class="products-card-actions" aria-hidden="true">
                    <span class="products-card-icon">
                        <i data-lucide="heart"></i>
                    </span>
                    <span class="products-card-icon">
                        <i data-lucide="eye"></i>
                    </span>
                </div>
            </div>

            <span class="products-card-category">${product.category}</span>
            <strong class="products-featured-title">${product.title}</strong>
            <p class="products-featured-description">${product.description}</p>

            ${createProductMediaMarkup(product, "products-featured-media")}

            <div class="products-card-rating">
                <i data-lucide="star"></i>
                <span>${product.rating.toFixed(1)}</span>
                <small>(${product.reviewCount})</small>
            </div>

            <div class="products-card-footer">
                <div class="products-card-price">
                    <strong class="${hasPromotion ? "is-sale" : ""}">${formatCurrency(product.price)}</strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>

                <span class="products-card-cart" aria-hidden="true">
                    <i data-lucide="shopping-bag"></i>
                </span>
            </div>
        </button>
    `;
}

function createCompactProductMarkup(product) {
    const badgeLabel = createBadgeLabel(product);
    const hasPromotion = calculateDiscountPercentage(product.price, product.oldPrice) > 0;

    return `
        <button class="products-compact-card" type="button" data-product-id="${product.id}">
            <div class="products-compact-content">
                <div class="products-card-top">
                    <span class="products-compact-badge">${badgeLabel}</span>
                    <div class="products-card-actions" aria-hidden="true">
                        <span class="products-card-icon">
                            <i data-lucide="heart"></i>
                        </span>
                        <span class="products-card-icon">
                            <i data-lucide="eye"></i>
                        </span>
                    </div>
                </div>

                <span class="products-card-category">${product.category}</span>
                <strong class="products-compact-title">${product.title}</strong>

                ${createProductMediaMarkup(product, "products-compact-media")}

                <div class="products-compact-footer">
                    <div class="products-card-price products-card-price--compact">
                        <strong class="${hasPromotion ? "is-sale" : ""}">${formatCurrency(product.price)}</strong>
                        ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                    </div>

                    <span class="products-card-cart" aria-hidden="true">
                        <i data-lucide="shopping-bag"></i>
                    </span>
                </div>
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

            <div class="products-shelf">
                ${createFeaturedProductMarkup(section.products[0])}

                <div class="products-compact-grid">
                    ${section.products.slice(1, 7).map((product) => createCompactProductMarkup(product)).join("")}
                </div>
            </div>

            <div class="products-dots-row" aria-hidden="true">
                <span class="is-active"></span>
                <span></span>
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
