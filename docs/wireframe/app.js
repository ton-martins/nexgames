import { initHeader } from "./components/Header/header.js";
import { initHero } from "./components/Hero/hero.js";
import { initProducts } from "./components/Products/products.js";
import { initExclusiveProducts } from "./components/ExclusiveProducts/exclusiveProducts.js";
import { initSubHeader } from "./components/SubHeader/subHeader.js";
import { initTopHeader } from "./components/TopHeader/topHeader.js";
import { initTrendingProducts } from "./components/TrendingProdutcs/trendingProducts.js";
import { loadComponent } from "./core/loadComponent.js";
import { initBestSellersProducts } from "./components/BestSellersProducts/bestSellersProducts.js";

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
        onLoaded: initSubHeader,
    });

    await loadComponent({
        rootSelector: "#hero-root",
        htmlPath: "./components/Hero/hero.html",
        cssPath: "./components/Hero/hero.css",
        onLoaded: initHero,
    });

    await loadComponent({
        rootSelector: "#trending-products-root",
        htmlPath: "./components/TrendingProdutcs/trendingProducts.html",
        cssPath: "./components/TrendingProdutcs/trendingProducts.css",
        onLoaded: initTrendingProducts,
    });

    await loadComponent({
        rootSelector: "#exclusive-products-root",
        htmlPath: "./components/ExclusiveProducts/exclusiveProducts.html",
        cssPath: "./components/ExclusiveProducts/exclusiveProducts.css",
        onLoaded: initExclusiveProducts,
    });

    await loadComponent({
        rootSelector: "#products-root",
        htmlPath: "./components/Products/products.html",
        cssPath: "./components/Products/products.css",
        onLoaded: initProducts,
    });

    await loadComponent({
        rootSelector: "#best-sellers-products-root",
        htmlPath: "./components/BestSellersProducts/bestSellersProducts.html",
        cssPath: "./components/BestSellersProducts/bestSellersProducts.css",
        onLoaded: initBestSellersProducts,
    });
}

initializeWireframe();
