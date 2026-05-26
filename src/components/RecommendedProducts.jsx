import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalProduct from "./shared/ModalProduct";
import TertiaryButton from "./shared/TertiaryButton";

const RECOMMENDED_CONTENT = {
	title: "Recomendados para você",
};

const RECOMMENDED_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#ffb4bc", endColor: "#fff2f3" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
	{ startColor: "#ffc78d", endColor: "#fff6ed" },
	{ startColor: "#a7f3d0", endColor: "#effcf7" },
];

const RECOMMENDED_BANNER_PALETTES = [
	{ startColor: "#dff6ff", endColor: "#f7f9fc" },
	{ startColor: "#fff0d6", endColor: "#f7f9fc" },
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

function buildRecommendedProduct(game, index) {
	const palette = RECOMMENDED_PALETTES[index % RECOMMENDED_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${game.nome}-${index}`,
		nome: game.nome ?? "Jogo recomendado",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		descricao: sanitizeDescription(game.descricao),
		ano: game.ano ?? null,
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Para você",
		search: game.nome ?? "",
		category: game.categoria ?? "",
		startColor: palette.startColor,
		endColor: palette.endColor,
	};
}

function buildRecommendedProducts(games) {
	const uniqueByCategory = new Map();

	[...games]
		.sort((gameA, gameB) => Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0))
		.forEach((game) => {
			const categoryKey = game.categoria || game.nome;

			if (!uniqueByCategory.has(categoryKey)) {
				uniqueByCategory.set(categoryKey, game);
			}
		});

	const selectedGames = [...uniqueByCategory.values()];

	if (selectedGames.length < 7) {
		const knownNames = new Set(selectedGames.map((game) => game.nome));

		[...games]
			.sort((gameA, gameB) => getDiscountedPrice(gameB) - getDiscountedPrice(gameA))
			.forEach((game) => {
				if (selectedGames.length >= 7 || knownNames.has(game.nome)) {
					return;
				}

				selectedGames.push(game);
				knownNames.add(game.nome);
			});
	}

	return selectedGames
		.slice(0, 7)
		.map((game, index) => buildRecommendedProduct(game, index));
}

function buildRecommendedBanners(games) {
	const categories = [...new Set(games.map((game) => game.categoria).filter(Boolean))];
	const companies = [...new Set(games.map((game) => game.empresaNome).filter(Boolean))];

	return [
		{
			id: "banner-genre",
			title: categories[0]
				? `Destaques de ${categories[0]} para ampliar sua coleção`
				: "Campanhas sazonais para ampliar sua coleção",
			subtitle: categories[0]
				? `Espaço promocional pronto para destacar jogos de ${categories[0]} e oportunidades sazonais do catálogo digital.`
				: "Espaço promocional pronto para destacar oportunidades sazonais e jogos fortes do catálogo digital.",
			mediaPrimaryLabel: categories[0] || "Saldo gamer",
			mediaSecondaryLabel: "Campanha",
			startColor: RECOMMENDED_BANNER_PALETTES[0].startColor,
			endColor: RECOMMENDED_BANNER_PALETTES[0].endColor,
		},
		{
			id: "banner-publisher",
			title: companies[0]
				? `Universo ${companies[0]} em evidência`
				: "Setup, streaming e universo geek",
			subtitle: companies[0]
				? `Banner pronto para campanhas editoriais, coleções temáticas e destaques ligados à publisher ${companies[0]}.`
				: "Banners reutilizáveis para acessórios, colecionáveis e destaques do ecossistema gamer e de entretenimento.",
			mediaPrimaryLabel: companies[0] || "Setup gamer",
			mediaSecondaryLabel: "Banner",
			startColor: RECOMMENDED_BANNER_PALETTES[1].startColor,
			endColor: RECOMMENDED_BANNER_PALETTES[1].endColor,
		},
	];
}

function ProductMedia({ product }) {
	return (
		<div
			className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-[var(--radius-large)]"
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

			<div className="absolute bottom-[18px] left-[18px] grid gap-0.5 text-[color:var(--text-inverse-color)]">
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

export default function RecommendedProducts({ games = [] }) {
	const navigate = useNavigate();
	const [selectedProduct, setSelectedProduct] = useState(null);

	const recommendedProducts = useMemo(() => buildRecommendedProducts(games), [games]);
	const bannerList = useMemo(() => buildRecommendedBanners(games), [games]);

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

	if (!recommendedProducts.length) {
		return null;
	}

	return (
		<section className="mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="mb-[18px] flex flex-wrap items-center justify-between gap-[18px]">
					<h2 className="m-0 text-[25px] font-medium text-[color:var(--text-primary-color)]">
						{RECOMMENDED_CONTENT.title}
					</h2>

					<button
						type="button"
						onClick={() =>
							handleCatalogNavigation({
								category: recommendedProducts[0]?.category,
							})
						}
						className="inline-flex items-center gap-2 bg-transparent p-0 text-sm font-bold text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)]"
					>
						Ver tudo
						<ArrowRight size={18} />
					</button>
				</div>

				<div className="grid auto-cols-[minmax(82%,1fr)] grid-flow-col gap-[12px] overflow-x-auto rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-[12px] shadow-[var(--shadow-soft)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid-cols-2 md:grid-flow-row md:auto-cols-auto md:gap-[18px] md:p-[18px] xl:grid-cols-4 2xl:grid-cols-7">
					{recommendedProducts.map((product) => (
						<button
							key={product.key}
							type="button"
							onClick={() => setSelectedProduct(product)}
							className="flex min-h-full snap-start flex-col gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] px-[18px] pb-[18px] pt-5 text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)]"
						>
							<div className="flex items-center justify-end gap-[10px]">
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

							<ProductMedia product={product} />

							<div className="mt-auto flex items-center justify-between gap-[14px]">
								<div className="grid gap-0.5">
									<strong
										className={`text-[24px] font-normal leading-none ${
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

				<div className="mt-[14px] flex items-center justify-center gap-[10px]">
					<span className="h-2 w-8 rounded-full bg-[color:var(--primary-color)]" />
					<span className="h-2 w-2 rounded-full bg-[color:var(--border-strong-color)]" />
					<span className="h-2 w-2 rounded-full bg-[color:var(--border-strong-color)]" />
				</div>

				<div className="mt-6 grid gap-[22px] xl:grid-cols-2">
					{bannerList.map((banner) => (
						<article
							key={banner.id}
							className="grid gap-5 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-muted-color)] p-[18px] transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)] md:grid-cols-[minmax(0,1fr)_240px] md:items-center md:p-[22px]"
						>
							<div className="grid gap-[6px]">
								<h3 className="m-0 text-[24px] font-bold text-[color:var(--text-primary-color)] max-md:text-[20px]">
									{banner.title}
								</h3>
								<p className="m-0 text-sm text-[color:var(--text-muted-color)]">
									{banner.subtitle}
								</p>
							</div>

							<div
								className="relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-[var(--radius-large)] max-md:min-h-[150px]"
								style={{
									background: `linear-gradient(135deg, color-mix(in srgb, ${banner.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${banner.endColor} 88%, var(--surface-soft-color)))`,
								}}
							>
								<div
									className="relative z-10 h-[62%] w-[52%] rounded-[20px] border border-white/35"
									style={{
										background:
											"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
										transform: "rotate(-14deg)",
									}}
								/>

								<div className="absolute bottom-[18px] left-[18px] grid gap-0.5 text-[color:var(--text-inverse-color)]">
									<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
										{banner.mediaSecondaryLabel}
									</span>
									<strong className="text-[15px] leading-[1.05]">
										{banner.mediaPrimaryLabel}
									</strong>
								</div>
							</div>
						</article>
					))}
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
