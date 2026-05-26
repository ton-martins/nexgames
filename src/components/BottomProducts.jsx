import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalProduct from "./shared/ModalProduct";

const COLUMN_CONFIG_LIST = [
	{
		id: "featured",
		title: "Produtos em destaque",
		type: "recent",
	},
	{
		id: "bestsellers",
		title: "Mais vendidos",
		type: "premium",
	},
	{
		id: "promotion",
		title: "Em promoção",
		type: "promotion",
	},
];

const BOTTOM_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
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

function buildRowProduct(game, index) {
	const palette = BOTTOM_PALETTES[index % BOTTOM_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${game.nome}-${index}`,
		nome: game.nome ?? "Jogo em destaque",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		descricao: sanitizeDescription(game.descricao),
		ano: game.ano ?? null,
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Destaque",
		search: game.nome ?? "",
		category: game.categoria ?? "",
		startColor: palette.startColor,
		endColor: palette.endColor,
	};
}

function buildColumns(games) {
	const recentGames = [...games]
		.sort((gameA, gameB) => Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0))
		.slice(0, 3);
	const premiumGames = [...games]
		.sort((gameA, gameB) => getDiscountedPrice(gameB) - getDiscountedPrice(gameA))
		.slice(0, 3);
	const promotionGames = games
		.filter((game) => Number(game.desconto ?? 0) > 0)
		.sort((gameA, gameB) => Number(gameB.desconto ?? 0) - Number(gameA.desconto ?? 0))
		.slice(0, 3);

	return COLUMN_CONFIG_LIST.map((column) => {
		const sourceGames =
			column.type === "promotion"
				? promotionGames
				: column.type === "premium"
					? premiumGames
					: recentGames;

		return {
			...column,
			products: sourceGames.map((game, index) => buildRowProduct(game, index)),
		};
	}).filter((column) => column.products.length > 0);
}

function buildFeaturedAdProduct(games) {
	const sourceGame =
		[...games].sort(
			(gameA, gameB) => getDiscountedPrice(gameB) - getDiscountedPrice(gameA)
		)[0] || null;

	if (!sourceGame) {
		return null;
	}

	return buildRowProduct(sourceGame, 0);
}

export default function BottomProducts({ games = [] }) {
	const navigate = useNavigate();
	const [selectedProduct, setSelectedProduct] = useState(null);

	const columns = useMemo(() => buildColumns(games), [games]);
	const featuredAdProduct = useMemo(() => buildFeaturedAdProduct(games), [games]);

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

	if (!columns.length || !featuredAdProduct) {
		return null;
	}

	return (
		<section className="mt-[var(--section-spacing)]">
			<div className="app-container grid gap-[22px] xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="grid gap-[18px] xl:grid-cols-3">
					{columns.map((column) => (
						<article
							key={column.id}
							className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-muted-color)] p-[22px] shadow-[var(--shadow-soft)]"
						>
							<div className="mb-4">
								<h3 className="m-0 text-lg font-bold text-[color:var(--text-primary-color)]">
									{column.title}
								</h3>
							</div>

							<div>
								{column.products.map((product, index) => (
									<button
										key={product.key}
										type="button"
										onClick={() => setSelectedProduct(product)}
										className={`grid w-full grid-cols-[82px_minmax(0,1fr)] items-center gap-[14px] bg-transparent py-3 text-left ${
											index < column.products.length - 1
												? "border-b border-[color:var(--border-light-color)]"
												: ""
										}`}
									>
										<div
											className="relative flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-[var(--radius-medium)]"
											style={{
												background: `linear-gradient(135deg, color-mix(in srgb, ${product.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${product.endColor} 88%, var(--surface-soft-color)))`,
											}}
										>
											<div
												className="h-[58%] w-[52%] rounded-[18px] border border-white/35"
												style={{
													background:
														"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
													transform: "rotate(-14deg)",
												}}
											/>
										</div>

										<div className="grid gap-1.5">
											<span className="text-xs text-[color:var(--text-muted-color)]">
												{product.categoria}
											</span>
											<strong className="text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
												{product.nome}
											</strong>
											<div className="flex items-center gap-2">
												<span
													className={`text-[24px] font-normal leading-none ${
														product.precoOriginal
															? "text-[color:var(--danger-color)]"
															: "text-[color:var(--text-primary-color)]"
													}`}
												>
													{formatCurrency(product.precoAtual)}
												</span>
												{product.precoOriginal ? (
													<small className="text-xs text-[color:var(--text-muted-color)] line-through">
														{formatCurrency(product.precoOriginal)}
													</small>
												) : null}
											</div>
										</div>
									</button>
								))}
							</div>
						</article>
					))}
				</div>

				<aside
					className="grid content-start gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-muted-color)] p-[22px] transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)]"
					onClick={() => setSelectedProduct(featuredAdProduct)}
				>
					<span className="text-xs uppercase text-[color:var(--text-muted-color)]">
						{featuredAdProduct.badge}
					</span>
					<strong className="text-2xl leading-[1.05] text-[color:var(--text-primary-color)]">
						{featuredAdProduct.nome}
					</strong>

					<div
						className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-[var(--radius-large)]"
						style={{
							background: `linear-gradient(135deg, color-mix(in srgb, ${featuredAdProduct.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${featuredAdProduct.endColor} 88%, var(--surface-soft-color)))`,
						}}
					>
						<div
							className="h-[66%] w-[56%] rounded-[22px] border border-white/35"
							style={{
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
								transform: "rotate(-14deg)",
							}}
						/>

						<div className="absolute bottom-[18px] left-[18px] grid gap-0.5 text-[color:var(--text-inverse-color)]">
							<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
								{featuredAdProduct.empresaNome}
							</span>
							<strong className="text-[15px] leading-[1.05]">
								{featuredAdProduct.categoria}
							</strong>
						</div>
					</div>
				</aside>
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
