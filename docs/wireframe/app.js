import { initHeader } from "./components/Header/header.js";
import { initHero } from "./components/Hero/hero.js";
import { initTopHeader } from "./components/TopHeader/topHeader.js";
import { loadComponent } from "./core/loadComponent.js";

async function initializeWireframe() {
    await loadComponent({
        rootSelector: "#top-header-root",
        htmlPath: "./components/TopHeader/topHeader.html",
        cssPath: "./components/TopHeader/topHeader.css",
        onLoaded: initTopHeader,
    });

    await loadComponent({
        rootSelector: "#header-root",
        htmlPath: "./components/Header/header.html",
        cssPath: "./components/Header/header.css",
        onLoaded: initHeader,
    });

    await loadComponent({
        rootSelector: "#sub-header-root",
        htmlPath: "./components/SubHeader/subHeader.html",
        cssPath: "./components/SubHeader/subHeader.css",
        onLoaded: initHeader,
    });

    await loadComponent({
        rootSelector: "#hero-root",
        htmlPath: "./components/Hero/hero.html",
        cssPath: "./components/Hero/hero.css",
        onLoaded: initHero,
    });
}

initializeWireframe();
