export function initSubHeader(rootElement) {
    if (!rootElement) {
        return;
    }

    const subNavButtons = document.querySelector('subnav-button');

    subNavButtons.forEach(buttonElement => {
        buttonElement.addEventListener("click", () => {

            console.log("[subNav] teste");
        });
    });
}