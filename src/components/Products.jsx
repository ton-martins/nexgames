import { useEffect, useMemo, useState } from "react";
import {
	ArrowRight,
	CalendarDays,
	Eye,
	Heart,
	ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalProduct from "./shared/ModalProduct";
import TertiaryButton from "./shared/TertiaryButton";

const PRODUCTS_SECTION_LIST = [
	{
		id: "featured",
		title: "Lançamentos e destaques",
		description:
			"Uma prateleira pensada para destacar grandes estreias, edições premium e jogos que puxam a vitrine principal da NexGames.",
		type: "recent",
	},
	{
		id: "promotion",
		title: "Promoções e oportunidades",
		description:
			"Campanhas com maior apelo comercial para destacar descontos agressivos, ofertas limitadas e boas oportunidades do catálogo.",
		type: "promotion",
	},
	{
		id: "launches",
		title: "Novidades para sua próxima jogatina",
		description:
			"Uma seleção com jogos recentes e títulos fortes para manter a home com cara de loja atualizada e pronta para conversão.",
		type: "curated",
	},
];

const PRODUCTS_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#ffb4bc", endColor: "#fff2f3" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
	{ startColor: "#ffc78d", endColor: "#fff6ed" },
	{ startColor: "#a7f3d0", endColor: "#effcf7" },
];

function createGameKey(game) {
	return [game?.nome, game?.empresaNome, game?.ano].filter(Boolean).join("::");
}

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

function sortByRecent(gameA, gameB) {
	const yearDifference = Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0);

	if (yearDifference !== 0) {
		return yearDifference;
	}

	return getDiscountedPrice(gameB) - getDiscountedPrice(gameA);
}

function sortByPromotion(gameA, gameB) {
	const discountDifference =
		Number(gameB.desconto ?? 0) - Number(gameA.desconto ?? 0);

	if (discountDifference !== 0) {
		return discountDifference;
	}

	return sortByRecent(gameA, gameB);
}

function sortByCurated(gameA, gameB) {
	const priceDifference = getDiscountedPrice(gameB) - getDiscountedPrice(gameA);

	if (priceDifference !== 0) {
		return priceDifference;
	}

	return sortByRecent(gameA, gameB);
}

function buildProductItem(game, index) {
	const palette = PRODUCTS_PALETTES[index % PRODUCTS_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${createGameKey(game)}-${index}`,
		nome: game.nome ?? "Jogo em destaque",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		descricao: sanitizeDescription(game.descricao),
		ano: game.ano ?? null,
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Novo",
		search: game.nome ?? "",
		category: game.categoria ?? "",
		startColor: palette.startColor,
		endColor: palette.endColor,
	};
}

function takeUniqueGames(games, usedKeys, limit, compareFn) {
	return [...games]
		.sort(compareFn)
		.filter((game) => !usedKeys.has(createGameKey(game)))
		.slice(0, limit);
}

function buildSectionCatalog(games) {
	const usedKeys = new Set();

	const recentGames = takeUniqueGames(games, usedKeys, 7, sortByRecent);
	recentGames.forEach((game) => usedKeys.add(createGameKey(game)));

	const promotionSource = games.filter((game) => Number(game.desconto ?? 0) > 0);
	const promotionGames = takeUniqueGames(
		promotionSource,
		new Set(),
		7,
		sortByPromotion
	);

	const curatedPrimary = takeUniqueGames(games, usedKeys, 7, sortByCurated);
	const curatedKeys = new Set(curatedPrimary.map(createGameKey));

	if (curatedPrimary.length < 7) {
		const fallbackGames = [...games]
			.sort(sortByCurated)
			.filter((game) => !curatedKeys.has(createGameKey(game)))
			.slice(0, 7 - curatedPrimary.length);

		fallbackGames.forEach((game) => curatedPrimary.push(game));
	}

	return {
		recent: recentGames,
		promotion: promotionGames,
		curated: curatedPrimary,
	};
}

function buildSections(games) {
	const catalog = buildSectionCatalog(games);

	return PRODUCTS_SECTION_LIST.map((section) => {
		const sourceGames =
			section.type === "promotion"
				? catalog.promotion
				: section.type === "curated"
					? catalog.curated
					: catalog.recent;

		const products = sourceGames.map((game, index) => buildProductItem(game, index));

		return {
			...section,
			products,
		};
	}).filter((section) => section.products.length > 0);
}

function ProductMedia({ product, className = "" }) {
	return (
		<div
			className={`relative flex items-center justify-center overflow-hidden rounded-[var(--radius-large)] ${className}`}
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
	);
}

export default function Products({ games = [] }) {
	const navigate = useNavigate();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const sections = useMemo(() => buildSections(games), [games]);

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

	if (!sections.length) {
		return null;
	}

	return (
		<section className="mb-[var(--section-spacing-large)] mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="grid gap-9">
					{sections.map((section) => {
						const featuredProduct = section.products[0];
						const compactProducts = section.products.slice(1, 7);

						if (!featuredProduct) {
							return null;
						}

						return (
							<section key={section.id}>
								<div className="mb-[18px] flex flex-wrap items-end justify-between gap-[18px]">
									<div className="grid gap-1">
										<h2 className="m-0 text-[25px] font-medium leading-[1.1] text-[color:var(--text-primary-color)]">
											{section.title}
										</h2>
										<p className="m-0 text-sm text-[color:var(--text-muted-color)]">
											{section.description}
										</p>
									</div>

									<button
										type="button"
										onClick={() =>
											handleCatalogNavigation({
												category: featuredProduct.category,
											})
										}
										className="inline-flex items-center gap-2 bg-transparent p-0 text-sm font-bold text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
									>
										Ver tudo
										<ArrowRight size={18} />
									</button>
								</div>

								<div className="grid gap-[18px] rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-[18px] shadow-[var(--shadow-soft)] xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
									<button
										type="button"
										onClick={() => setSelectedProduct(featuredProduct)}
										className="flex min-h-full flex-col gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] px-6 pb-[18px] pt-5 text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)]"
									>
										<div className="flex items-center justify-between gap-3">
											<span className="inline-flex min-w-[58px] items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-1.5 text-[11px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
												{featuredProduct.badge}
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
											{featuredProduct.categoria}
										</span>

										<strong className="min-h-[36px] text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
											{featuredProduct.nome}
										</strong>

										<p className="m-0 text-sm leading-[1.45] text-[color:var(--text-muted-color)]">
											{featuredProduct.descricao}
										</p>

										<ProductMedia
											product={featuredProduct}
											className="mt-0.5 min-h-[220px]"
										/>

										<div className="flex items-center gap-1.5 text-xs text-[color:var(--rating-color)]">
											<CalendarDays size={16} />
											<span>{featuredProduct.ano || "Catálogo digital"}</span>
											<small className="text-[color:var(--text-muted-color)]">
												({featuredProduct.empresaNome})
											</small>
										</div>

										<div className="mt-auto flex items-center justify-between gap-[14px]">
											<div className="grid gap-1">
												<strong
													className={`text-[24px] font-normal leading-none ${
														featuredProduct.precoOriginal
															? "text-[color:var(--danger-color)]"
															: "text-[color:var(--text-primary-color)]"
													}`}
												>
													{formatCurrency(featuredProduct.precoAtual)}
												</strong>
												{featuredProduct.precoOriginal ? (
													<span className="text-xs text-[color:var(--text-muted-color)] line-through">
														{formatCurrency(featuredProduct.precoOriginal)}
													</span>
												) : null}
											</div>

											<TertiaryButton
												icon={ShoppingBag}
												size="sm"
												aria-label={`Comprar ${featuredProduct.nome}`}
											/>
										</div>
									</button>

									<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
										{compactProducts.map((product) => (
											<button
												key={product.key}
												type="button"
												onClick={() => setSelectedProduct(product)}
												className="flex min-h-[170px] flex-col gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] p-[18px] text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)]"
											>
												<div className="grid w-full gap-2">
													<div className="flex items-center justify-between gap-3">
														<span className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-[5px] text-[10px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
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

													<strong className="text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
														{product.nome}
													</strong>
												</div>

												<ProductMedia
													product={product}
													className="min-h-[132px]"
												/>

												<div className="mt-auto flex items-center justify-between gap-[14px]">
													<div className="grid gap-1">
														<strong
															className={`text-[22px] font-normal leading-none ${
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

													<TertiaryButton
														icon={ShoppingBag}
														size="sm"
														aria-label={`Comprar ${product.nome}`}
													/>
												</div>
											</button>
										))}
									</div>
								</div>

								<div className="mt-[18px] flex items-center justify-center gap-[10px]">
									<span className="h-2 w-8 rounded-full bg-[color:var(--primary-color)]" />
									<span className="h-2 w-2 rounded-full bg-[color:var(--border-strong-color)]" />
								</div>
							</section>
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
