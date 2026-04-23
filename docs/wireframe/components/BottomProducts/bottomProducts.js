import { getProductById, getProductsByIds} from "../../data/storeData.js";
import { formatCurrency } from "../../core/storefrontUtils.js";

const bottomProductsSectionContent = {
    columnList: [
        {
            title: "Produtos em destaque",
            productIds: [
                "spider-man-2",
                "last-of-us-part-1",
                "black-myth-wukong",
            ],
            highlightPromotionalPrice: false,
        },
        {
            title: "Mais vendidos",
            productIds: [
                "baldurs-gate-3",
                "elden-ring",
                "red-dead-redemption-2",
            ],
            highlightPromotionalPrice: false,
        },
        {
            title: "Em promoção",
            productIds: [
                "cyberpunk-2077",
                "hogwarts-legacy",
                "dead-space-remake",
            ],
            highlightPromotionalPrice: true,
        },
    ],
    featuredAdProductId: "enigma-do-medo",
};

function createProductRowMarkup(product, highlightPromotionalPrice = false) {
    const shouldShowOldPrice = highlightPromotionalPrice && product.oldPrice;

    return `
        <button class="bottom-products-row" type="button" data-product-id="${product.id}">
            <div
                class="bottom-products-row-media"
                style="--bottom-row-start-color: ${product.startColor}; --bottom-row-end-color: ${product.endColor};"
            >
                <div class="bottom-products-row-shape"></div>
            </div>

            <div class="bottom-products-row-content">
                <span>${product.category}</span>
                <strong>${product.title}</strong>
                <div class="bottom-products-row-price${shouldShowOldPrice ? " is-promotional" : ""}">
                    <span>${formatCurrency(product.price)}</span>
                    ${shouldShowOldPrice ? `<small>${formatCurrency(product.oldPrice)}</small>` : ""}
                </div>
            </div>
        </button>
    `;
}

function renderBottomProductsSection(shellElement) {
    if (!shellElement) {
        return;
    }

    const featuredAdProduct = getProductById(bottomProductsSectionContent.featuredAdProductId);

    shellElement.innerHTML = `
        <div class="bottom-products-columns">
            ${bottomProductsSectionContent.columnList.map((column) => `
                <article class="bottom-products-column-card">
                    <div class="bottom-products-column-heading">
                        <h3>${column.title}</h3>
                    </div>

                    <div class="bottom-products-column-rows">
                        ${getProductsByIds(column.productIds).map((product) => createProductRowMarkup(product, column.highlightPromotionalPrice)).join("")}
                    </div>
                </article>
            `).join("")}
        </div>

        <aside class="bottom-products-ad-card" data-product-id="${featuredAdProduct?.id || ""}">
            <span>${featuredAdProduct?.tagLabel || "Destaque"}</span>
            <strong>${featuredAdProduct?.title || "Produto em destaque"}</strong>

            <div
                class="bottom-products-ad-media"
                style="--bottom-ad-start-color: ${featuredAdProduct?.startColor || "#dff6ff"}; --bottom-ad-end-color: ${featuredAdProduct?.endColor || "#f7f9fc"};"
            >
                <div class="bottom-products-ad-shape"></div>
                <div class="bottom-products-ad-labels">
                    <span>${featuredAdProduct?.mediaSecondaryLabel || "Loja virtual"}</span>
                    <strong>${featuredAdProduct?.mediaPrimaryLabel || "NexGames"}</strong>
                </div>
            </div>
        </aside>
    `;
}

export function initBottomProducts(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#bottom-products-shell");
    renderBottomProductsSection(shellElement);

}