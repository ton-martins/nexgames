import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import ModalProduct from "./shared/ModalProduct";
import SecondaryButton from "./shared/SecondaryButton";
import TertiaryButton from "./shared/TertiaryButton";

const EXCLUSIVE_CONTENT = {
	overline: "NexGames Pro",
	titleBanner: "Eleve seu setup com títulos de elite",
	descriptionBanner:
		"Uma seleção feita para quem gosta de montar biblioteca com RPG, ação, narrativa forte e experiências premium do entretenimento gamer.",
	titleCards: "Lote exclusivo",
	descriptionCards:
		"Mergulhe em mundos onde cada escolha molda o destino. Uma curadoria focada em narrativas viscerais, mistérios sombrios e personagens inesquecíveis.",
	buttonLabel: "Desbloquear coleção",
	headingOverline: "Biblioteca organizada",
	headingActionLabel: "Ver tudo",
	mediaPrimaryLabel: "Biblioteca gamer",
	mediaSecondaryLabel: "Seleção premium",
	startColor: "#fed700",
	endColor: "#f7f9fc",
};

const EXCLUSIVE_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
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

function buildExclusiveProduct(game, index) {
	const palette = EXCLUSIVE_PALETTES[index % EXCLUSIVE_PALETTES.length];
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
		badge: hasDiscount ? `-${discount}%` : "Exclusivo",
		search: game.nome ?? "",
		category: game.categoria ?? "",
		startColor: palette.startColor,
		endColor: palette.endColor,
		mediaPrimaryLabel: EXCLUSIVE_CONTENT.mediaPrimaryLabel,
		mediaSecondaryLabel: EXCLUSIVE_CONTENT.mediaSecondaryLabel,
	};
}

function buildExclusiveProducts(games) {
	return [...games]
		.sort((gameA, gameB) => {
			const priceDifference =
				getDiscountedPrice(gameB) - getDiscountedPrice(gameA);

			if (priceDifference !== 0) {
				return priceDifference;
			}

			return Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0);
		})
		.slice(0, 4)
		.map((game, index) => buildExclusiveProduct(game, index));
}

export default function ExclusiveProducts({ games = [] }) {
	const navigate = useNavigate();
	const [selectedProduct, setSelectedProduct] = useState(null);

	const exclusiveProducts = useMemo(() => buildExclusiveProducts(games), [games]);
	const featuredProduct = exclusiveProducts[0] ?? null;

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

	if (!exclusiveProducts.length || !featuredProduct) {
		return null;
	}

	return (
		<section className="mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="overflow-hidden rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] shadow-[var(--shadow-soft)] xl:grid xl:grid-cols-[minmax(320px,430px)_minmax(0,1fr)]">
					<article
						className="grid content-start gap-[14px] border-b border-[color:var(--border-color)] bg-[color:var(--surface-muted-color)] p-[26px] xl:border-b-0 xl:border-r"
						style={{
							backgroundImage:
								"linear-gradient(180deg, color-mix(in srgb, var(--primary-soft-color) 48%, transparent), var(--surface-soft-color))",
						}}
					>
						<span className="text-[13px] font-extrabold uppercase text-[color:var(--secondary-color)]">
							{EXCLUSIVE_CONTENT.overline}
						</span>

						<h2 className="m-0 text-[30px] leading-[1.08] text-[color:var(--text-primary-color)]">
							{EXCLUSIVE_CONTENT.titleBanner}
						</h2>

						<p className="m-0 text-sm text-[color:var(--text-muted-color)]">
							{EXCLUSIVE_CONTENT.descriptionBanner}
						</p>

						<SecondaryButton
							onClick={() =>
								handleCatalogNavigation({
									category: featuredProduct.category,
								})
							}
							className="!h-[42px] !min-w-0 !rounded-[var(--radius-medium)] !bg-[color:var(--surface-color)] !px-[18px] md:!w-fit"
						>
							{EXCLUSIVE_CONTENT.buttonLabel}
						</SecondaryButton>

						<div
							className="relative mt-1.5 flex min-h-[220px] items-center justify-center overflow-hidden rounded-[var(--radius-large)] xl:min-h-[280px]"
							style={{
								background: `linear-gradient(135deg, color-mix(in srgb, ${EXCLUSIVE_CONTENT.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${EXCLUSIVE_CONTENT.endColor} 88%, var(--surface-soft-color)))`,
							}}
						>
							<div className="absolute aspect-square w-[68%] rounded-full bg-white/45 blur-lg" />

							<div
								className="relative h-[72%] w-[54%] rounded-[22px] border border-white/35"
								style={{
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
									transform: "rotate(-14deg)",
									boxShadow: "var(--shadow-float)",
								}}
							/>

							<div className="absolute bottom-5 left-5 grid gap-0.5 text-[color:var(--text-inverse-color)]">
								<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
									{EXCLUSIVE_CONTENT.mediaSecondaryLabel}
								</span>
								<strong className="text-base leading-[1.05]">
									{EXCLUSIVE_CONTENT.mediaPrimaryLabel}
								</strong>
							</div>
						</div>
					</article>

					<div className="grid content-center gap-[18px] p-[26px] max-md:p-5">
						<div className="flex flex-wrap items-end justify-between gap-[18px]">
							<div className="grid gap-1">
								<span className="text-[13px] font-extrabold uppercase text-[color:var(--secondary-color)]">
									{EXCLUSIVE_CONTENT.headingOverline}
								</span>
								<h2 className="m-0 text-[30px] leading-[1.08] text-[color:var(--text-primary-color)]">
									{EXCLUSIVE_CONTENT.titleCards}
								</h2>
								<p className="m-0 text-sm text-[color:var(--text-muted-color)]">
									{EXCLUSIVE_CONTENT.descriptionCards}
								</p>
							</div>

							<SecondaryButton
								icon={ArrowRight}
								iconPosition="right"
								onClick={() =>
									handleCatalogNavigation({
										category: featuredProduct.category,
									})
								}
								className="!h-[42px] !min-w-0 !rounded-[var(--radius-medium)] !bg-[color:var(--surface-color)] !px-[18px] md:!w-fit"
							>
								{EXCLUSIVE_CONTENT.headingActionLabel}
							</SecondaryButton>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{exclusiveProducts.map((product, index) => {
								const isHighlighted = index === exclusiveProducts.length - 1;

								return (
									<button
										key={product.key}
										type="button"
										onClick={() => setSelectedProduct(product)}
										className={`flex min-h-[170px] flex-col gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] p-[18px] text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)] ${
											isHighlighted ? "shadow-[var(--shadow-medium)]" : ""
										}`}
									>
										<div className="grid w-full gap-2">
											<div className="flex items-center justify-between gap-2.5">
												<span className="inline-flex min-w-[58px] items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-[5px] text-[10px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
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

										<div
											className="relative flex min-h-[132px] items-center justify-center overflow-hidden rounded-[var(--radius-large)]"
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

											<div className="absolute bottom-4 left-4 grid gap-0.5 text-[color:var(--text-inverse-color)]">
												<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
													{product.mediaSecondaryLabel}
												</span>
												<strong className="text-base leading-[1.05]">
													{product.mediaPrimaryLabel}
												</strong>
											</div>
										</div>

										<div className="mt-auto flex items-center justify-between gap-3">
											<div className="grid gap-0.5">
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
								);
							})}
						</div>

						<div className="flex items-center justify-center gap-[10px]">
							<span className="h-2 w-8 rounded-full bg-[color:var(--primary-color)]" />
							<span className="h-2 w-2 rounded-full bg-[color:var(--border-strong-color)]" />
							<span className="h-2 w-2 rounded-full bg-[color:var(--border-strong-color)]" />
						</div>
					</div>
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
