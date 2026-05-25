import { useEffect, useMemo, useRef, useState } from "react";
import {
	CalendarDays,
	Eye,
	Heart,
	ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalProduct from "./shared/ModalProduct";

const TRENDING_TAB_LIST = [
	{ id: "featured", label: "Em destaque" },
	{ id: "promotion", label: "Em promoção" },
	{ id: "recent", label: "Mais recentes" },
];

const TRENDING_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#ffb4bc", endColor: "#fff2f3" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
	{ startColor: "#ffc78d", endColor: "#fff6ed" },
];

function buildSearchParams({ search, category } = {}) {
	const params = new URLSearchParams();

	if (search) {
		params.set("search", search);
	}

	if (category) {
		params.set("categoria", category);
	}

	return params.toString();
}

function sanitizeDescription(description) {
	const normalizedDescription = (description || "")
		.trim()
		.replace(/^"+|"+$/g, "");

	if (!normalizedDescription) {
		return "Jogo disponível no catálogo digital da NexGames.";
	}

	return normalizedDescription;
}

function buildProductItem(game, index) {
	const palette = TRENDING_PALETTES[index % TRENDING_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${game.nome}-${index}`,
		nome: game.nome ?? "Jogo em destaque",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		ano: game.ano ?? null,
		descricao: sanitizeDescription(game.descricao),
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Novo",
		search: game.nome ?? "",
		category: game.categoria ?? "",
		startColor: palette.startColor,
		endColor: palette.endColor,
	};
}

function buildTabProducts(games) {
	const featuredGames = games.slice(0, 6);
	const discountedGames = games
		.filter((game) => Number(game.desconto ?? 0) > 0)
		.sort((gameA, gameB) => Number(gameB.desconto ?? 0) - Number(gameA.desconto ?? 0))
		.slice(0, 6);
	const recentGames = [...games]
		.sort((gameA, gameB) => Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0))
		.slice(0, 6);

	return {
		featured: featuredGames.map((game, index) => buildProductItem(game, index)),
		promotion: discountedGames.map((game, index) => buildProductItem(game, index)),
		recent: recentGames.map((game, index) => buildProductItem(game, index)),
	};
}

export default function TrendingProducts({ games = [] }) {
	const navigate = useNavigate();
	const activeTabRef = useRef(null);
	const [activeTabId, setActiveTabId] = useState("featured");
	const [selectedProduct, setSelectedProduct] = useState(null);

	const productsByTab = useMemo(() => buildTabProducts(games), [games]);
	const availableTabs = useMemo(() => {
		return TRENDING_TAB_LIST.filter(
			(tab) => (productsByTab[tab.id] || []).length > 0
		);
	}, [productsByTab]);
	const activeProducts = productsByTab[activeTabId] || [];

	useEffect(() => {
		if (!games.length || !availableTabs.length) {
			return;
		}

		if (!availableTabs.some((tab) => tab.id === activeTabId)) {
			setActiveTabId(availableTabs[0].id);
			return;
		}

		if (window.matchMedia("(max-width: 760px)").matches) {
			activeTabRef.current?.scrollIntoView({
				block: "nearest",
				inline: "center",
			});
		}
	}, [activeTabId, availableTabs, games.length]);

	useEffect(() => {
		function handleEscape(event) {
			if (event.key === "Escape") {
				setSelectedProduct(null);
			}
		}

		window.addEventListener("keydown", handleEscape);

		return () => {
			window.removeEventListener("keydown", handleEscape);
		};
	}, []);

	function handleCatalogNavigation(action = {}) {
		const search = buildSearchParams(action);

		navigate({
			pathname: "/",
			search: search ? `?${search}` : "",
		});
	}

	if (!games.length || !availableTabs.length) {
		return null;
	}

	return (
		<section className="mb-[var(--section-spacing-large)] mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="flex items-center justify-center gap-[34px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:justify-start max-md:gap-[14px]">
					{availableTabs.map((tab) => {
						const isActive = tab.id === activeTabId;

						return (
							<button
								key={tab.id}
								ref={isActive ? activeTabRef : null}
								type="button"
								onClick={() => setActiveTabId(tab.id)}
								className={`relative shrink-0 whitespace-nowrap bg-transparent p-0 text-[21px] font-medium transition max-md:text-[18px] ${
									isActive
										? "font-extrabold text-[color:var(--text-primary-color)]"
										: "text-[color:var(--text-muted-color)]"
								}`}
							>
								{tab.label}
								{isActive ? (
									<span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-[60%] rounded-full bg-[color:var(--primary-color)]" />
								) : null}
							</button>
						);
					})}
				</div>

				<div className="grid grid-cols-1 gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-[10px] shadow-[var(--shadow-soft)] md:grid-cols-2 md:gap-[18px] md:p-[12px] xl:grid-cols-4 xl:p-[18px] 2xl:grid-cols-6">
					{activeProducts.map((product, index) => {
						const isHighlighted = index === activeProducts.length - 1;

						return (
							<button
								key={product.key}
								type="button"
								onClick={() => setSelectedProduct(product)}
								className={`relative flex min-h-full flex-col gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] px-6 pb-[18px] pt-5 text-left transition hover:-translate-y-1 hover:border-[color:var(--primary-color)] hover:shadow-[var(--shadow-medium)] ${
									isHighlighted ? "shadow-[var(--shadow-medium)]" : ""
								}`}
							>
								<div className="flex items-center justify-between gap-3">
									<span className="inline-flex min-w-[58px] items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-1.5 text-[11px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
										{product.badge}
									</span>

									<div className="flex items-center gap-2">
										<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)]">
											<Heart size={18} />
										</span>
										<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)]">
											<Eye size={18} />
										</span>
									</div>
								</div>

								<span className="text-xs text-[color:var(--text-muted-color)]">
									{product.categoria}
								</span>

								<strong className="min-h-[36px] text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
									{product.nome}
								</strong>

								<div
									className="relative mt-0.5 flex min-h-[180px] items-center justify-center overflow-hidden rounded-[var(--radius-large)]"
									style={{
										background: `linear-gradient(135deg, color-mix(in srgb, ${product.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${product.endColor} 88%, var(--surface-soft-color)))`,
									}}
								>
									<div className="absolute aspect-square w-[62%] rounded-full bg-white/45 blur-lg" />

									<div
										className="relative z-10 h-[68%] w-[58%] rounded-[22px] border border-white/35"
										style={{
											background:
												"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
											transform: "rotate(-14deg)",
											boxShadow: "var(--shadow-float)",
										}}
									/>

									<div className="absolute bottom-[18px] left-[18px] grid max-w-[62%] gap-0.5 text-[color:var(--text-inverse-color)]">
										<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
											{product.empresaNome}
										</span>
										<strong className="text-[15px] leading-[1.05]">
											{product.categoria}
										</strong>
									</div>
								</div>

								<div className="flex items-center gap-1.5 text-xs text-[color:var(--rating-color)]">
									<CalendarDays size={16} />
									<span>{product.ano || "Catálogo digital"}</span>
									<small className="text-[color:var(--text-muted-color)]">
										({product.empresaNome})
									</small>
								</div>

								<div className="mt-auto flex items-center justify-between gap-[14px]">
									<div className="grid gap-1">
										<strong
											className={`text-base font-bold ${
												product.precoOriginal
													? "text-[color:var(--danger-color)]"
													: "text-[color:var(--text-primary-color)]"
											}`}
										>
											{formatCurrency(product.precoAtual)}
										</strong>
										{product.precoOriginal ? (
											<span className="text-xs text-[color:var(--text-muted-color)] line-through">
												{formatCurrency(product.precoOriginal)}
											</span>
										) : null}
									</div>

									<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--primary-color)] bg-[color:var(--primary-color)] text-[color:var(--text-on-primary-color)]">
										<ShoppingBag size={18} />
									</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<ModalProduct
				product={selectedProduct}
				onClose={() => setSelectedProduct(null)}
				onPrimaryAction={() =>
					handleCatalogNavigation({
						search: selectedProduct?.search,
					})
				}
				onSecondaryAction={() =>
					handleCatalogNavigation({
						category: selectedProduct?.category,
					})
				}
			/>
		</section>
	);
}
