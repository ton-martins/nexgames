const loadedStyles = new Set();

export async function loadComponent({
    rootSelector,
    htmlPath,
    cssPath = "",
    onLoaded = () => {},
}) {
    const rootElement = document.querySelector(rootSelector);

    if (!rootElement) {
        return null;
    }

    try {
        const response = await fetch(htmlPath);

        if (!response.ok) {
            throw new Error(`Falha ao carregar o componente: ${htmlPath}`);
        }

        const componentHtml = await response.text();
        rootElement.innerHTML = componentHtml;

        if (cssPath && !loadedStyles.has(cssPath)) {
            const linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            linkElement.href = cssPath;
            document.head.appendChild(linkElement);
            loadedStyles.add(cssPath);
        }

        onLoaded(rootElement);
        return rootElement;
    } catch (error) {
        console.error(error);
        rootElement.innerHTML = "";
        return null;
    }
}
