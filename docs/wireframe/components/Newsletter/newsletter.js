import { refreshIcons } from "../../core/storefrontUtils.js";

const newsletterContent = {
    title: "Assine a newsletter gamer",
    subtitle: "Receba cupons, novidades e promoções do universo dos games e do entretenimento digital.",
    placeholder: "Digite seu melhor e-mail",
    buttonLabel: "Cadastrar",
};

function renderNewsletter(shellElement) {
    if (!shellElement) {
        return;
    }

    shellElement.innerHTML = `
        <div class="newsletter-content">
            <div class="newsletter-text-block">
                <div class="newsletter-title">
                    <i data-lucide="send"></i>
                    <strong>${newsletterContent.title}</strong>
                </div
                <span>${newsletterContent.subtitle}</span>
            </div>

            <form class="newsletter-form" id="newsletter-form">
                <input type="email" placeholder="${newsletterContent.placeholder}" />
                <button type="submit">${newsletterContent.buttonLabel}</button>
            </form>
        </div>
    `;
}

export function initNewsletter(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#newsletter-shell");
    renderNewsletter(shellElement);
    refreshIcons();

}
