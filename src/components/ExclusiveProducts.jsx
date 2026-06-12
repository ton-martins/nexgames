import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Eye, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import FeedbackPopup from "./FeedbackPopup";
import ModalProduct from "./shared/ModalProduct";
import ProductArtwork from "./shared/ProductArtwork";
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
	if (search) params.set("search", search);
	if (category) params.set("categoria", category);
	return params.toString();
}

function sanitizeDescription(description) {
	const normalizedDescription = (description || "")
		.trim()
		.replace(/^"+|"+$/g, "");

	return normalizedDescription || "Jogo disponível no catálogo digital da NexGames.";
}

function buildExclusiveProduct(game, index) {
	const palette = EXCLUSIVE_PALETTES[index % EXCLUSIVE_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${game.nome}-${index}`,
		id: game.id ?? null,
		nome: game.nome ?? "Jogo em destaque",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		descricao: sanitizeDescription(game.descricao),
		ano: game.ano ?? null,
		image: game.image ?? null,
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
		.sort((a, b) => {
			const priceDifference = getDiscountedPrice(b) - getDiscountedPrice(a);
			if (priceDifference !== 0) return priceDifference;
			return Number(b.ano ?? 0) - Number(a.ano ?? 0);
		})
		.slice(0, 4)
		.map((game, index) => buildExclusiveProduct(game, index));
}

export default function ExclusiveProducts({ games = [] }) {
	const navigate = useNavigate();
	const cartAnimationTimeoutRef = useRef(null);

	const [selectedProduct, setSelectedProduct] = useState(null);
	const [addingCartKey, setAddingCartKey] = useState("");
	const [addedCartKey, setAddedCartKey] = useState("");
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const exclusiveProducts = useMemo(() => buildExclusiveProducts(games), [games]);
	const featuredProduct = exclusiveProducts[0] ?? null;

	useEffect(() => {
		return () => {
			if (cartAnimationTimeoutRef.current) {
				window.clearTimeout(cartAnimationTimeoutRef.current);
			}
		};
	}, []);

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

	function closePopup() {
		setPopupState({
			open: false,
			title: "",
			message: "",
		});
	}

	function navigateToLogin(product) {
		navigate("/login", {
			state: product
				? {
						pendingProduct: {
							nome: product.nome,
							ano: product.ano ?? null,
						},
					}
				: undefined,
		});
	}

	function handleCatalogNavigation(action = {}) {
		const search = buildSearchParams(action);
		navigate({
			pathname: "/",
			search: search ? `?${search}` : "",
		});
	}

	function handleCardKeyDown(event, product) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleOpenProductPage(product, event);
		}
	}

	function handleOpenProductPreview(product, event) {
		event?.stopPropagation?.();
		setSelectedProduct(product);
	}

	function handleOpenProductPage(product, event) {
		event?.stopPropagation?.();

		if (!isAuthenticated()) {
			navigateToLogin(product);
			return;
		}

		if (!product?.id) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível abrir este produto agora. Atualize a página e tente novamente.",
			});
			return;
		}
		navigate(`/product/${product.id}`);
	}

	async function handleAddToCart(product, event) {
		event?.stopPropagation?.();

		if (!isAuthenticated()) {
			navigateToLogin();
			return;
		}

		if (!product?.id) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível adicionar este jogo ao carrinho agora. Atualize a página e tente novamente.",
			});
			return;
		}

		setAddingCartKey(product.key);

		try {
			await addToCart(product.id);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
			setAddedCartKey(product.key);
			if (cartAnimationTimeoutRef.current) {
				window.clearTimeout(cartAnimationTimeoutRef.current);
			}
			cartAnimationTimeoutRef.current = window.setTimeout(() => {
				setAddedCartKey("");
			}, 900);
		} catch {
			setPopupState({
				open: true,
				title: "Não foi possível adicionar ao carrinho",
				message:
					"Verifique se o produto já está no carrinho ou tente novamente em instantes.",
			});
		} finally {
			setAddingCartKey("");
		}
	}

	async function handleAddToWishlist(product, event) {
		event?.stopPropagation?.();

		if (!isAuthenticated()) {
			navigateToLogin();
			return;
		}

		if (!product?.id) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível adicionar este jogo aos favoritos agora. Atualize a página e tente novamente.",
			});
			return;
		}

		try {
			await addToWishlist(product.id);
			window.dispatchEvent(new Event("nexgames:wishlist-updated"));
		} catch {
			setPopupState({
				open: true,
				title: "Não foi possível adicionar aos favoritos",
				message:
					"Verifique se o jogo já está na sua lista de desejos ou tente novamente em instantes.",
			});
		}
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
								handleCatalogNavigation({ category: featuredProduct.category })
							}
							className="!h-[42px] !min-w-0 !rounded-[var(--radius-medium)] !bg-[color:var(--surface-color)] !px-[18px] md:!w-fit"
						>
							{EXCLUSIVE_CONTENT.buttonLabel}
						</SecondaryButton>

						<button
							type="button"
							onClick={(event) => handleOpenProductPage(featuredProduct, event)}
							className="bg-transparent p-0 text-left"
						>
							<ProductArtwork
								image={featuredProduct.image}
								alt={featuredProduct.nome}
								primaryLabel={EXCLUSIVE_CONTENT.mediaSecondaryLabel}
								secondaryLabel={EXCLUSIVE_CONTENT.mediaPrimaryLabel}
								className="mt-1.5 min-h-[220px] xl:min-h-[280px]"
								labelPositionClassName="bottom-5 left-5"
								secondaryLabelClassName="text-base leading-[1.05]"
								placeholderClassName="relative h-[72%] w-[54%] rounded-[22px] border border-white/35"
								placeholderStyle={{
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
									transform: "rotate(-14deg)",
									boxShadow: "var(--shadow-float)",
								}}
								glowClassName="absolute aspect-square w-[68%] rounded-full bg-white/45 blur-lg"
								startColor={EXCLUSIVE_CONTENT.startColor}
								endColor={EXCLUSIVE_CONTENT.endColor}
							/>
						</button>
					</article>

					<div className="grid content-center gap-[18px] p-[26px] max-md:p-5">
						<div className="grid gap-[18px] md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
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

							<button
								type="button"
								onClick={() =>
									handleCatalogNavigation({ category: featuredProduct.category })
								}
								className="inline-flex items-center gap-2 self-start bg-transparent p-0 text-sm font-bold text-[color:var(--text-primary-color)] transition hover:text-[color:var(--secondary-color)] md:justify-self-end"
							>
								{EXCLUSIVE_CONTENT.headingActionLabel}
								<ArrowRight size={18} />
							</button>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{exclusiveProducts.map((product, index) => {
								const isHighlighted = index === exclusiveProducts.length - 1;

								return (
									<div
										key={product.key}
										role="button"
										tabIndex={0}
										onClick={(event) => handleOpenProductPage(product, event)}
										onKeyDown={(event) => handleCardKeyDown(event, product)}
										className={`flex min-h-[170px] cursor-pointer flex-col gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] p-[18px] text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] hover:shadow-[var(--shadow-medium)] ${
											isHighlighted ? "shadow-[var(--shadow-medium)]" : ""
										}`}
									>
										<div className="grid w-full gap-2">
											<div className="flex items-center justify-between gap-2.5">
												<span className="inline-flex min-w-[58px] items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-[5px] text-[10px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
													{product.badge}
												</span>

												<div className="flex items-center gap-2">
													<button
														type="button"
														aria-label={`Adicionar ${product.nome} aos favoritos`}
														onClick={(event) => handleAddToWishlist(product, event)}
														className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--border-primary-color)] hover:text-[color:var(--text-primary-color)]"
													>
														<Heart size={18} />
													</button>

													<button
														type="button"
														aria-label={`Visualizar ${product.nome}`}
														onClick={(event) => handleOpenProductPreview(product, event)}
														className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--border-primary-color)] hover:text-[color:var(--text-primary-color)]"
													>
														<Eye size={18} />
													</button>
												</div>
											</div>

											<span className="text-xs text-[color:var(--text-muted-color)]">
												{product.categoria}
											</span>
											<strong className="text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
												{product.nome}
											</strong>
										</div>

										<ProductArtwork
											image={product.image}
											alt={product.nome}
											primaryLabel={product.mediaSecondaryLabel}
											secondaryLabel={product.mediaPrimaryLabel}
											className="min-h-[132px]"
											labelPositionClassName="bottom-4 left-4"
											secondaryLabelClassName="text-base leading-[1.05]"
											startColor={product.startColor}
											endColor={product.endColor}
											placeholderStyle={{
												background:
													"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
												transform: "rotate(-14deg)",
												boxShadow: "var(--shadow-float)",
											}}
										/>

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
												aria-label={`Adicionar ${product.nome} ao carrinho`}
												onClick={(event) => handleAddToCart(product, event)}
												className={`transition-all duration-200 ${
													addingCartKey === product.key ? "opacity-70" : ""
												} ${
													addedCartKey === product.key
														? "scale-110 shadow-[var(--shadow-medium)]"
														: ""
												}`}
											/>
										</div>
									</div>
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
				onPrimaryAction={() => handleAddToCart(selectedProduct)}
				onSecondaryAction={() => handleOpenProductPage(selectedProduct)}
			/>

			<FeedbackPopup
				open={popupState.open}
				title={popupState.title}
				message={popupState.message}
				onClose={closePopup}
			/>
		</section>
	);
}
