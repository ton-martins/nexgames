export function initSubHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    const subNavButtons = rootElement.querySelectorAll(".subnav-button");

    subNavButtons.forEach((buttonElement) => {
        buttonElement.addEventListener("click", () => {
            console.log(`[SubHeader] clique em: ${buttonElement.textContent.trim()}`);
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
