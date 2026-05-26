import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import FeedbackPopup from "./FeedbackPopup";
import ModalProduct from "./shared/ModalProduct";
import PrimaryButton from "./shared/PrimaryButton";
import TertiaryButton from "./shared/TertiaryButton";

const SECTION_TITLE = "Mais vendidos";

const BESTSELLER_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
	{ startColor: "#ffc78d", endColor: "#fff6ed" },
	{ startColor: "#ffb4bc", endColor: "#fff2f3" },
	{ startColor: "#a7f3d0", endColor: "#effcf7" },
];

function createGameKey(game) {
	return [game?.nome, game?.empresaNome, game?.ano].filter(Boolean).join("::");
}

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

function sortByCommercialWeight(gameA, gameB) {
	const discountDifference =
		Number(gameB.desconto ?? 0) - Number(gameA.desconto ?? 0);

	if (discountDifference !== 0) return discountDifference;

	const priceDifference = getDiscountedPrice(gameB) - getDiscountedPrice(gameA);
	if (priceDifference !== 0) return priceDifference;

	return Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0);
}

function buildProductItem(game, index) {
	const palette = BESTSELLER_PALETTES[index % BESTSELLER_PALETTES.length];
	const discount = Number(game.desconto ?? 0);
	const currentPrice = getDiscountedPrice(game);
	const originalPrice = Number(game.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		key: `${createGameKey(game)}-${index}`,
		id: game.id ?? null,
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

function buildBestSellers(games) {
	const orderedGames = [...games].sort(sortByCommercialWeight);

	if (!orderedGames.length) {
		return { featuredProduct: null, products: [] };
	}

	return {
		featuredProduct: buildProductItem(orderedGames[0], 0),
		products: orderedGames
			.slice(1, 7)
			.map((game, index) => buildProductItem(game, index + 1)),
	};
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

export default function BestSellersProducts({ games = [] }) {
	const navigate = useNavigate();
	const cartAnimationTimeoutRef = useRef(null);

	const [selectedProduct, setSelectedProduct] = useState(null);
	const [activeFeaturedProduct, setActiveFeaturedProduct] = useState(null);
	const [addingCartKey, setAddingCartKey] = useState("");
	const [addedCartKey, setAddedCartKey] = useState("");
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const { featuredProduct, products } = useMemo(() => buildBestSellers(games), [games]);

	useEffect(() => {
		setActiveFeaturedProduct(featuredProduct);
	}, [featuredProduct]);

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

	if (!activeFeaturedProduct || !products.length) {
		return null;
	}

	return (
		<section className="mt-[var(--section-spacing)]">
			<div className="app-container">
				<div className="mb-[18px]">
					<h2 className="m-0 text-[25px] font-medium text-[color:var(--text-primary-color)]">
						{SECTION_TITLE}
					</h2>
				</div>

				<div className="grid gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(390px,460px)]">
					<div className="grid gap-[18px] rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-[18px] shadow-[var(--shadow-soft)] md:grid-cols-2 2xl:grid-cols-4">
						{products.map((product) => (
							<div
								key={product.key}
								role="button"
								tabIndex={0}
								onClick={(event) => handleOpenProductPage(product, event)}
								onKeyDown={(event) => handleCardKeyDown(event, product)}
								className="flex min-h-full cursor-pointer flex-col gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] px-6 pb-[18px] pt-5 text-left transition hover:-translate-y-1 hover:border-[color:var(--primary-color)] hover:shadow-[var(--shadow-medium)]"
							>
								<div className="flex items-center justify-between gap-3">
									<span className="inline-flex min-w-[58px] items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] px-[10px] py-1.5 text-[11px] font-extrabold uppercase text-[color:var(--text-primary-color)]">
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

								<strong className="min-h-[36px] text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
									{product.nome}
								</strong>

								<ProductMedia product={product} className="min-h-[180px]" />

								<div className="mt-auto flex items-center justify-between gap-[14px]">
									<div className="grid gap-1">
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
						))}
					</div>

					<article className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-primary-color)] bg-[color:var(--surface-muted-color)] p-6 shadow-[var(--shadow-medium)]">
						<div className="flex items-start justify-between gap-4">
							<div className="grid gap-1">
								<span className="text-xs text-[color:var(--text-muted-color)]">
									{activeFeaturedProduct.categoria}, {activeFeaturedProduct.empresaNome}
								</span>

								<button
									type="button"
									onClick={(event) => handleOpenProductPage(activeFeaturedProduct, event)}
									className="w-fit bg-transparent p-0 text-left text-[22px] font-bold text-[color:var(--text-primary-color)]"
								>
									{activeFeaturedProduct.nome}
								</button>
							</div>

							<div className="flex items-center gap-2">
								<button
									type="button"
									aria-label={`Adicionar ${activeFeaturedProduct.nome} aos favoritos`}
									onClick={(event) =>
										handleAddToWishlist(activeFeaturedProduct, event)
									}
									className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--border-primary-color)] hover:text-[color:var(--text-primary-color)]"
								>
									<Heart size={18} />
								</button>

								<button
									type="button"
									aria-label={`Visualizar ${activeFeaturedProduct.nome}`}
									onClick={(event) =>
										handleOpenProductPreview(activeFeaturedProduct, event)
									}
									className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--border-primary-color)] hover:text-[color:var(--text-primary-color)]"
								>
									<Eye size={18} />
								</button>
							</div>
						</div>

						<button
							type="button"
							onClick={(event) => handleOpenProductPage(activeFeaturedProduct, event)}
							className="bg-transparent p-0 text-left"
						>
							<ProductMedia
								product={activeFeaturedProduct}
								className="min-h-[220px] xl:min-h-[280px]"
							/>
						</button>

						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<strong className="text-[28px] font-normal text-[color:var(--text-primary-color)]">
								{formatCurrency(activeFeaturedProduct.precoAtual)}
							</strong>

							<PrimaryButton
								icon={ShoppingBag}
								onClick={() => handleAddToCart(activeFeaturedProduct)}
								className={`!h-[42px] !min-w-0 !rounded-[var(--radius-medium)] !px-5 md:!w-fit ${
									addingCartKey === activeFeaturedProduct.key ? "opacity-70" : ""
								} ${
									addedCartKey === activeFeaturedProduct.key
										? "scale-110 shadow-[var(--shadow-medium)]"
										: ""
								}`}
							>
								Adicionar ao carrinho
							</PrimaryButton>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							{products.slice(0, 3).map((product) => {
								const isActive = product.key === activeFeaturedProduct.key;

								return (
									<button
										key={product.key}
										type="button"
										onClick={() => setActiveFeaturedProduct(product)}
										className={`rounded-[var(--radius-medium)] border p-0 transition ${
											isActive
												? "border-[color:var(--primary-color)] shadow-[var(--shadow-medium)]"
												: "border-transparent"
										}`}
									>
										<div
											className="relative flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-[var(--radius-medium)]"
											style={{
												background: `linear-gradient(135deg, color-mix(in srgb, ${product.startColor} 82%, var(--surface-color)), color-mix(in srgb, ${product.endColor} 88%, var(--surface-soft-color)))`,
											}}
										>
											<div
												className="h-[60%] w-[54%] rounded-[18px] border border-white/35"
												style={{
													background:
														"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
													transform: "rotate(-14deg)",
												}}
											/>
										</div>
									</button>
								);
							})}
						</div>
					</article>
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
