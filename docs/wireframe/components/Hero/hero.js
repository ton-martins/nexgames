export function initHero(rootElement) {
    if (!rootElement) {
        return;
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}