export function initHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    const mobileSearchToggle = rootElement.querySelector('#mobile-search-toggle');
    const searchForm = rootElement.querySelector('#search-form');

    if (mobileSearchToggle && searchForm) {
        mobileSearchToggle.addEventListener("click", () => {
            searchForm.classList.toggle("is-open");
        });

        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("[Header] pesquisa enviada");
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}