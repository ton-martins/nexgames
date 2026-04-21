import { refreshIcons } from "../../core/storefrontUtils.js";

const subHeaderContent = {
    navigationLabel: "Navegação principal da loja",
    items: [
        { id: "home", label: "Home" },
        { id: "rpg", label: "RPG" },
        { id: "action", label: "Ação" },
        { id: "adventure", label: "Aventura" },
        { id: "sports", label: "Esportes" },
        { id: "puzzle", label: "Puzzle" },
        { id: "indie", label: "Indie" },
        { id: "offers", label: "Ofertas" },
    ],
};

function createSubHeaderItemMarkup(item) {
    return `
        <button
            class="subnav-button"
            type="button"
            data-sub-header-item="${item.id}"
        >
            <span>${item.label}</span>
            <i data-lucide="chevron-down"></i>
        </button>
    `;
}

function renderSubHeader(rootElement) {
    const navElement = rootElement.querySelector(".sub-header");
    const contentElement = rootElement.querySelector("#sub-header-content");

    if (!navElement || !contentElement) {
        return;
    }

    navElement.setAttribute("aria-label", subHeaderContent.navigationLabel);

    contentElement.innerHTML = subHeaderContent.items
        .map((item) => createSubHeaderItemMarkup(item))
        .join("");
}

export function initSubHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    renderSubHeader(rootElement);
    refreshIcons();
}
