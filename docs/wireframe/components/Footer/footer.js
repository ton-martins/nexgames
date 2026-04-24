import { refreshIcons } from "../../core/storefrontUtils.js";

export const footerContactContent = {
    phoneLabel: "Fale com a loja",
    phoneValue: "(71) 3333-2026",
    addressText: "Rua da Vitrine Digital, 404 - Salvador - BA",
    copyrightText: "Copyright © 2026 NexGames. Todos os direitos reservados.",
};

export const footerColumnList = [
    {
        title: "Institucional",
        linkList: ["Sobre a loja", "Política de privacidade", "Termos de uso", "Fale conosco"],
    },
    {
        title: "Catálogo",
        linkList: ["Lançamentos", "Mais vendidos", "Promoções", "Gift cards"],
    },
    {
        title: "Suporte",
        linkList: ["Minha conta", "Pedidos", "Pagamentos", "Ajuda e FAQ"],
    },
];

const socialIconNameList = [
    "globe",
    "message-circle",
    "shield-check",
    "shopping-bag",
    "star",
    "trophy",
];

function renderFooter(shellElement) {
    if (!shellElement) {
        return;
    }

    shellElement.innerHTML = `
        <div class="footer-main">
            <div class="footer-brand-column">
                <button class="footer-logo" type="button">
                    <span class="footer-logo-text">
                        Nexgames<span>.</span>
                    </span>
                </button>

                <div class="footer-support">
                    <div>
                        <i data-lucide="headphones"></i>
                        <span>${footerContactContent.phoneLabel}</span>
                    </div>
                    <div>
                        <strong>${footerContactContent.phoneValue}</strong>
                    </div>
                </div>

                <div class="footer-contact">
                    <strong>Contato</strong>
                    <p>${footerContactContent.addressText}</p>
                </div>

                <div class="footer-social-row">
                    ${socialIconNameList.map((iconName) => `
                        <button type="button" aria-label="Rede social da loja">
                            <i data-lucide="${iconName}"></i>
                        </button>
                    `).join("")}
                </div>
            </div>

            ${footerColumnList.map((column) => `
                <div class="footer-links-column">
                    <h3>${column.title}</h3>
                    <nav>
                        ${column.linkList.map((linkLabel) => `
                            <button type="button">${linkLabel}</button>
                        `).join("")}
                    </nav>
                </div>
            `).join("")}
        </div>

        <div class="footer-bottom">
            <span>${footerContactContent.copyrightText}</span>
            <div class="footer-payment-badges">
                <span>DISCOVER</span>
                <span>mastercard</span>
                <span>PayPal</span>
                <span>Skrill</span>
                <span>VISA</span>
            </div>
        </div>
    `;
}

export function initFooter(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#footer-shell");
    renderFooter(shellElement);
    refreshIcons();
}