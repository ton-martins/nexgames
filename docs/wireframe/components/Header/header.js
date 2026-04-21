import { refreshIcons } from "../../core/storefrontUtils.js";

const headerContent = {
    brandAriaLabel: "Ir para a página inicial",
    brandLabel: "Nexgames",

    mobileSearchAriaLabel: "Abrir pesquisa",

    departmentButtonAriaLabel: "Abrir departamentos",
    departmentButtonLabel: "Abrir departamentos",

    searchPlaceholder: "Buscar jogos, categorias ou publishers",
    searchCategoryLabel: "Selecionar categoria",
    searchButtonAriaLabel: "Pesquisar",
    searchCategories: [
        "Todas as categorias",
        "RPG",
        "Ação",
        "Aventura",
        "Esportes",
    ],

    actionsAriaLabel: "Ações da conta",
    actionButtons: [
        {
            id: "recent",
            type: "icon",
            label: "Recentes",
            ariaLabel: "Itens vistos recentemente",
            iconName: "refresh-ccw",
            badgeCount: 2,
        },
        {
            id: "favorites",
            type: "icon",
            label: "Favoritos",
            ariaLabel: "Lista de favoritos",
            iconName: "heart",
            badgeCount: 4,
        },
        {
            id: "account",
            type: "account",
            label: "Conta",
            ariaLabel: "Conta",
            iconName: "user",
        },
        {
            id: "cart",
            type: "cart",
            label: "Carrinho",
            ariaLabel: "Carrinho",
            iconName: "shopping-bag",
            badgeCount: 3,
            totalLabel: "R$ 279,90",
        },
    ],
};

function createHeaderActionMarkup(actionButton) {
    if (actionButton.type === "account") {
        return `
            <button
                class="account-action-button"
                type="button"
                aria-label="${actionButton.ariaLabel}"
                data-header-action="${actionButton.id}"
            >
                <i data-lucide="${actionButton.iconName}"></i>
                <small class="account-action-label">${actionButton.label}</small>
            </button>
        `;
    }

    if (actionButton.type === "cart") {
        return `
            <button
                class="cart-action-button"
                type="button"
                aria-label="${actionButton.ariaLabel}"
                data-header-action="${actionButton.id}"
            >
                <i data-lucide="${actionButton.iconName}"></i>
                <span class="badge-counter">${actionButton.badgeCount}</span>
                <strong class="total-cart-text">${actionButton.totalLabel}</strong>
            </button>
        `;
    }

    return `
        <button
            class="action-icon-button"
            type="button"
            aria-label="${actionButton.ariaLabel}"
            data-header-action="${actionButton.id}"
        >
            <i data-lucide="${actionButton.iconName}"></i>
            <span class="badge-counter">${actionButton.badgeCount}</span>
        </button>
    `;
}

function renderHeader(rootElement) {
    const brandButton = rootElement.querySelector("#header-brand-button");
    const brandPrimary = rootElement.querySelector("#header-brand-primary");
    const mobileSearchToggle = rootElement.querySelector("#mobile-search-toggle");
    const departmentButton = rootElement.querySelector("#header-department-button");
    const searchField = rootElement.querySelector("#header-search-field");
    const searchCategoryLabel = rootElement.querySelector("#header-search-category-label");
    const searchCategorySelect = rootElement.querySelector("#header-search-category-select");
    const searchButton = rootElement.querySelector("#header-search-button");
    const headerActions = rootElement.querySelector("#header-actions");

    if (
        !brandButton ||
        !brandPrimary ||
        !mobileSearchToggle ||
        !departmentButton ||
        !searchField ||
        !searchCategoryLabel ||
        !searchCategorySelect ||
        !searchButton ||
        !headerActions
    ) {
        return;
    }

    brandButton.setAttribute("aria-label", headerContent.brandAriaLabel);
    brandPrimary.textContent = headerContent.brandLabel;

    mobileSearchToggle.setAttribute("aria-label", headerContent.mobileSearchAriaLabel);
    mobileSearchToggle.innerHTML = `<i data-lucide="search"></i>`;

    departmentButton.setAttribute("aria-label", headerContent.departmentButtonAriaLabel);
    departmentButton.innerHTML = `
        <i data-lucide="menu"></i>
        <span class="screen-reader-only">${headerContent.departmentButtonLabel}</span>
    `;

    searchField.placeholder = headerContent.searchPlaceholder;
    searchCategoryLabel.textContent = headerContent.searchCategoryLabel;
    searchCategorySelect.innerHTML = headerContent.searchCategories
        .map((category) => `<option>${category}</option>`)
        .join("");

    searchButton.setAttribute("aria-label", headerContent.searchButtonAriaLabel);
    searchButton.innerHTML = `<i data-lucide="search"></i>`;

    headerActions.setAttribute("aria-label", headerContent.actionsAriaLabel);
    headerActions.innerHTML = headerContent.actionButtons
        .map((actionButton) => createHeaderActionMarkup(actionButton))
        .join("");
}

export function initHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    renderHeader(rootElement);
    refreshIcons();
}
