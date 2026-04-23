const brandNameList = [
    "PlayStation",
    "Xbox",
    "Steam",
    "Ubisoft",
    "Epic Games",
];

function renderBrand(shellElement) {
    if (!shellElement) {
        return;
    }

    shellElement.innerHTML = brandNameList.map((brandName) => `
        <span class="brand-item">${brandName}</span>
    `).join("");
}

export function initBrands(rootElement) {
    if (!rootElement) {
        return;
    }

    const shellElement = rootElement.querySelector("#brand-shell");
    renderBrand(shellElement);
}