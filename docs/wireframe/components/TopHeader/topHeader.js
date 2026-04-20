export function initTopHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    const utilityButtons = rootElement.querySelectorAll("[data-top-header-link]");

    utilityButtons.forEach((buttonElement) => {
        buttonElement.addEventListener("click", () => {
            console.log("[TopHeader] teste");
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
