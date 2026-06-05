import { useEffect, useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { addToCart } from "../../services/cartService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import FeedbackPopup from "./FeedbackPopup";
import ModalProduct from "./shared/ModalProduct";

const COLUMN_CONFIG_LIST = [
	{ id: "featured", title: "Produtos em destaque", type: "recent" },
	{ id: "bestsellers", title: "Mais vendidos", type: "premium" },
	{ id: "promotion", title: "Em promoção", type: "promotion" },
];

const BOTTOM_PALETTES = [
	{ startColor: "#fde26c", endColor: "#f5f7fa" },
	{ startColor: "#85d6ff", endColor: "#f4f7fb" },
	{ startColor: "#9ce6b3", endColor: "#f5f7fb" },
	{ startColor: "#d2b8ff", endColor: "#f8f3ff" },
	{ startColor: "#ffc78d", endColor: "#fff6ed" },
];

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
		id: game.id ?? null,
		nome: game.nome ?? "Jogo em destaque",
		categoria: game.categoria ?? "Catálogo digital",
		empresaNome: game.empresaNome ?? "NexGames",
		descricao: sanitizeDescription(game.descricao),
		ano: game.ano ?? null,
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Destaque",
		startColor: palette.startColor,
		endColor: palette.endColor,
	};
}

function buildColumns(games) {
	const recentGames = [...games]
		.sort((a, b) => Number(b.ano ?? 0) - Number(a.ano ?? 0))
		.slice(0, 3);
	const premiumGames = [...games]
		.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a))
		.slice(0, 3);
	const promotionGames = games
		.filter((game) => Number(game.desconto ?? 0) > 0)
		.sort((a, b) => Number(b.desconto ?? 0) - Number(a.desconto ?? 0))
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
		[...games].sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a))[0] ||
		null;

	return sourceGame ? buildRowProduct(sourceGame, 0) : null;
}

export default function BottomProducts({ games = [] }) {
	const navigate = useNavigate();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

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

	function closePopup() {
		setPopupState({
			open: false,
			title: "",
			message: "",
		});
	}

	function closeProductPreview() {
		setSelectedProduct(null);
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

	function handleCardKeyDown(event, product) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleOpenProductPreview(product, event);
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

	async function handleAddToCart(
		product,
		event,
		{ closePreview = false } = {}
	) {
		event?.stopPropagation?.();

		if (closePreview) {
			closeProductPreview();
		}

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

		try {
			const response = await addToCart(product.id);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
			setPopupState({
				open: true,
				title: "Jogo adicionado ao carrinho",
				message:
					response?.message ||
					"O produto foi adicionado ao seu carrinho com sucesso.",
			});
		} catch {
			setPopupState({
				open: true,
				title: "Não foi possível adicionar ao carrinho",
				message:
					"Verifique se o produto já está no carrinho ou tente novamente em instantes.",
			});
		}
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
									<div
										key={product.key}
										role="button"
										tabIndex={0}
										onClick={(event) => handleOpenProductPreview(product, event)}
										onKeyDown={(event) => handleCardKeyDown(event, product)}
										className={`grid w-full cursor-pointer grid-cols-[82px_minmax(0,1fr)] items-center gap-[14px] bg-transparent py-3 text-left transition hover:opacity-90 ${
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
											<div className="grid gap-1.5">
												<span className="text-xs text-[color:var(--text-muted-color)]">
													{product.categoria}
												</span>
												<strong className="text-[15px] font-bold leading-[1.2] text-[color:var(--text-primary-color)]">
													{product.nome}
												</strong>
											</div>

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
									</div>
								))}
							</div>
						</article>
					))}
				</div>

				<aside className="rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-muted-color)] p-[22px] shadow-[var(--shadow-soft)]">
					<div
						role="button"
						tabIndex={0}
						onClick={(event) => handleOpenProductPreview(featuredAdProduct, event)}
						onKeyDown={(event) => handleCardKeyDown(event, featuredAdProduct)}
						className="grid w-full cursor-pointer content-start gap-[10px] text-left transition hover:-translate-y-1"
					>
						<div className="flex items-start justify-between gap-3">
							<div className="grid gap-1">
								<span className="text-xs uppercase text-[color:var(--text-muted-color)]">
									{featuredAdProduct.badge}
								</span>
								<strong className="text-2xl leading-[1.05] text-[color:var(--text-primary-color)]">
									{featuredAdProduct.nome}
								</strong>
							</div>
						</div>

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
					</div>
				</aside>
			</div>

			<ModalProduct
				product={selectedProduct}
				onClose={closeProductPreview}
				onPrimaryAction={() =>
					handleAddToCart(selectedProduct, undefined, { closePreview: true })
				}
				onSecondaryAction={() => handleOpenProductPage(selectedProduct)}
				primaryActionLabel="Adicionar ao carrinho"
				primaryActionIcon={ShoppingCart}
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
