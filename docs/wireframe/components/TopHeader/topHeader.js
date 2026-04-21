import { refreshIcons } from "../../core/storefrontUtils.js";

const topHeaderContent = {
    welcomeMessage: "Bem-vindo à loja virtual da NexGames",
    navigationLabel: "Navegação utilitária da loja",
    utilityLinks: [
        {
            id: "store-locator",
            label: "Localizar loja",
            iconName: "map-pin",
        },
        {
            id: "track-order",
            label: "Rastrear pedido",
            iconName: "",
        },
        {
            id: "store",
            label: "Loja",
            iconName: "",
        },
        {
            id: "account",
            label: "Minha conta",
            iconName: "",
        },
    ],
};

function createUtilityLinkMarkup(link) {
    const iconMarkup = link.iconName ? `<i data-lucide="${link.iconName}"></i>` : "";

    return `
        <button class="utility-button" type="button" data-top-header-link="${link.id}">
            ${iconMarkup}
            <span>${link.label}</span>
        </button>
    `;
}

function renderTopHeader(rootElement) {
    const welcomeMessageElement = rootElement.querySelector("#top-header-welcome-message");
    const linksContainer = rootElement.querySelector("#top-header-links");

    if (!welcomeMessageElement || !linksContainer) {
        return;
    }

    welcomeMessageElement.textContent = topHeaderContent.welcomeMessage;
    linksContainer.setAttribute("aria-label", topHeaderContent.navigationLabel);
    linksContainer.innerHTML = topHeaderContent.utilityLinks
        .map((link) => createUtilityLinkMarkup(link))
        .join("");
}

export function initTopHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    renderTopHeader(rootElement);
    refreshIcons();
}
