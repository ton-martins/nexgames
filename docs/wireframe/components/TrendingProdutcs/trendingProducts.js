import { getProductsByIds} from "../../data/storeData.js";
import {
    calculateDiscountPercentage,
    formatCurrency,
    refreshIcons,
} from "../../core/storefrontUtils.js";

const trendingTabList = [
    { id: "featured", label: "Em destaque" },
    { id: "promotion", label: "Em promoção" },
    { id: "rating", label: "Mais bem avaliados" },
];

const trendingProductsByTabIds = {
    featured: [
        "spider-man-2",
        "final-fantasy-16",
        "forza-horizon-5",
        "resident-evil-4",
        "ea-sports-fc-26",
        "hades-2",
    ],
    promotion: [
        "cyberpunk-2077",
        "hogwarts-legacy",
        "mortal-kombat-1",
        "alan-wake-2",
        "lies-of-p",
        "dead-space-remake",
    ],
    rating: [
        "baldurs-gate-3",
        "elden-ring",
        "red-dead-redemption-2",
        "the-witcher-3",
        "god-of-war-ragnarok",
        "hollow-knight",
    ],
};

const productsByTab = Object.fromEntries(
    Object.entries(trendingProductsByTabIds).map(([tabId, productIdList]) => [
        tabId,
        getProductsByIds(productIdList),
    ])
);

const productMap = new Map(
    Object.values(productsByTab).flatMap((productList) =>
        productList.map((product) => [product.id, product])
    )
);

let activeTabId = "featured";

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

    tabsRow.innerHTML = trendingTabList.map((tab) => `
        <button
            class="trending-tab-button${tab.id === activeTabId ? " is-active" : ""}"
            type="button"
            data-tab-id="${tab.id}"
        >
            ${tab.label}
        </button>
    `).join("");
}

function syncActiveTabIntoView(rootElement) {
    if (!window.matchMedia("(max-width: 760px)").matches) {
        return;
    }

    const activeTabButton = rootElement.querySelector(".trending-tab-button.is-active");

    if (activeTabButton) {
        activeTabButton.scrollIntoView({
            block: "nearest",
            inline: "center",
        });
    }
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
    syncActiveTabIntoView(rootElement);
    renderProductsGrid(rootElement);
    refreshIcons();

    rootElement.addEventListener("click", (event) => {
        const productCard = event.target.closest("[data-product-id]");
        const tabButton = event.target.closest("[data-tab-id]");
        const closeButton = event.target.closest("[data-trending-modal-close]");

        if (tabButton) {
            activeTabId = tabButton.dataset.tabId;
            renderTabButtons(rootElement);
            syncActiveTabIntoView(rootElement);
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
