import { getProductsByIds } from "../../data/storeData.js";
import {
    calculateDiscountPercentage,
    formatCurrency,
    refreshIcons,
} from "../../core/storefrontUtils.js";

export const recommendedSectionContent = {
    title: "Recomendados para você",
    productIds: [
        "spider-man-2",
        "persona-3-reload",
        "god-of-war-ragnarok",
        "hades-2",
        "black-myth-wukong",
        "enigma-do-medo",
        "hollow-knight",
    ],
    bannerList: [
        {
            id: "banner-gift-card",
            title: "Gift cards, créditos e saldo gamer",
            subtitle: "Campanhas prontas para destacar entretenimento digital, plataformas e recargas na mesma vitrine.",
            mediaPrimaryLabel: "Saldo gamer",
            mediaSecondaryLabel: "Campanha",
            startColor: "#dff6ff",
            endColor: "#f7f9fc",
        },
        {
            id: "banner-setup",
            title: "Setup, streaming e universo geek",
            subtitle: "Banners reutilizáveis para acessórios, colecionáveis e destaques do ecossistema gamer e de entretenimento.",
            mediaPrimaryLabel: "Setup gamer",
            mediaSecondaryLabel: "Banner",
            startColor: "#fff0d6",
            endColor: "#f7f9fc",
        },
    ],
};

const recommendedProducts = getProductsByIds(recommendedSectionContent.productIds);

function createRecommendedProductMarkup(product) {
    const discountPercentage = calculateDiscountPercentage(product.price, product.oldPrice);
    const badgeLabel = discountPercentage > 0 ? `-${discountPercentage}%` : product.tagLabel;

    return `
        <button class="recommended-product-card" type="button" data-product-id="${product.id}">
            <div class="recommended-product-top">
                <span class="recommended-product-badge">${badgeLabel}</span>
                
                <div class="recommended-product-actions">
                    <span class="recommended-product-icon" aria-hidden="true">
                        <i data-lucide="heart"></i>
                    </span>
                    <span class="recommended-product-icon" aria-hidden="true">
                        <i data-lucide="eye"></i>
                    </span>
                </div>
            </div>

            <span class="recommended-product-category">${product.category}</span>
            <strong class="recommended-product-title">${product.title}</strong>

            <div 
                class="recommended-product-media"
                style="--recommended-start-color: ${product.startColor}; --recommended-end-color: ${product.endColor}"
            >
                <div class="recommended-product-shape"></div>
                <div class="recommended-product-labels">
                    <span>${product.mediaSecondaryLabel}</span>
                    <strong>${product.mediaPrimaryLabel}</strong>
                </div>
            </div>

            <div class="recommended-product-price">
                <div class="recommended-product-price-values">
                    <strong class="${discountPercentage > 0 ? "is-sale" : ""}">
                        ${formatCurrency(product.price)}
                    </strong>
                    ${product.oldPrice ? `<span>${formatCurrency(product.oldPrice)}</span>` : ""}
                </div>
                <span class="recommended-product-cart" aria-hidden="true">
                    <i data-lucide="shopping-bag"></i>
                </span>
            </div>
        </button>
    `;
}

function createBannerMarkup(banner) {
    return `
        <article class="recommended-banner-card">
            <div class="recommended-banner-copy">
                <h3>${banner.title}</h3>
                <p>${banner.subtitle}</p>
            </div>

            <div 
                class="recommended-banner-media"
                style="--recommended-banner-start-color: ${banner.startColor}; --recommended-banner-end-color: ${banner.endColor};"
            >
                <div class="recommended-banner-shape"></div>
                <div class="recommended-banner-labels">
                    <span>${banner.mediaSecondaryLabel}</span>
                    <strong>${banner.mediaPrimaryLabel}</strong>
                </div>
            </div>
        </article>
    `;
}

function renderRecommendedSection(shellElement) {
    if (!shellElement) {
        return;
    }

    shellElement.innerHTML = `
        <div class="recommended-heading">
            <div>
                <h2>${recommendedSectionContent.title}</h2>
            </div>

            <button class="recommended-action">
                Ver tudo
                <i data-lucide="arrow-right"></i>
            </button>
        </div>

        <div class="recommended-grid-products">
            ${recommendedProducts.map((product) => createRecommendedProductMarkup(product)).join("")}
        </div>

        <div class="recommended-dots" aria-hidden="true">
            <span class="is-active"></span>
            <span></span>
            <span></span>
        </div>

        <div class="recommended-banner">
            ${recommendedSectionContent.bannerList.map((banner) => createBannerMarkup(banner)).join("")}
        </div>
    `;
}

export function initRecommendedProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#recommended-shell");

    renderRecommendedSection(shellElement);
    refreshIcons();
}
