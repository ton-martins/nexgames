import { useEffect, useMemo, useState } from "react";
import {
	BadgeCheck,
	ChevronLeft,
	ChevronRight,
	CircleArrowRight,
	Gift,
	LayoutGrid,
	LifeBuoy,
	ShieldCheck,
	ShoppingCart,
	Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { addToCart } from "../../services/cartService";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import FeedbackPopup from "./FeedbackPopup";
import PrimaryButton from "./shared/PrimaryButton";
import ProductArtwork from "./shared/ProductArtwork";

const HERO_PALETTES = [
	{
		startColor: "#fde26c",
		endColor: "#f5f7fa",
		glowColor: "rgba(254, 215, 0, 0.38)",
	},
	{
		startColor: "#85d6ff",
		endColor: "#f4f7fb",
		glowColor: "rgba(45, 183, 229, 0.34)",
	},
	{
		startColor: "#9ce6b3",
		endColor: "#f5f7fb",
		glowColor: "rgba(80, 196, 120, 0.30)",
	},
];

const HERO_BENEFITS = [
	{
		icon: BadgeCheck,
		title: "Entrega digital",
		description: "Liberação rápida e automática",
	},
	{
		icon: Gift,
		title: "Ofertas ativas",
		description: "Descontos aplicados no catálogo",
	},
	{
		icon: LayoutGrid,
		title: "Catálogo dinâmico",
		description: "Vitrine conectada ao catálogo da loja",
	},
	{
		icon: ShieldCheck,
		title: "Compra segura",
		description: "Fluxo pronto para checkout",
	},
	{
		icon: LifeBuoy,
		title: "Suporte contínuo",
		description: "Estrutura pronta para evolução",
	},
];

function splitTitleLines(title) {
	const normalizedTitle = (title || "").trim().replace(/\s+/g, " ");

	if (!normalizedTitle) {
		return ["Catálogo NexGames", "Disponível agora"];
	}

	const words = normalizedTitle.split(" ");

	if (words.length === 1) {
		return [normalizedTitle, "Disponível agora"];
	}

	const midpoint = Math.ceil(words.length / 2);

	return [
		words.slice(0, midpoint).join(" "),
		words.slice(midpoint).join(" "),
	];
}

function sanitizeDescription(description) {
	const normalizedDescription = (description || "").trim();

	if (!normalizedDescription) {
		return "Jogo disponível no catálogo digital da NexGames.";
	}

	return normalizedDescription.replace(/^"+|"+$/g, "");
}

function buildHeroSlides(games) {
	return games.slice(0, 3).map((game, index) => {
		const palette = HERO_PALETTES[index % HERO_PALETTES.length];
		const [firstLine, secondLine] = splitTitleLines(game.nome);
		const hasDiscount = Number(game.desconto ?? 0) > 0;

		return {
			key: `${game.nome}-${index}`,
			id: game.id ?? null,
			nome: game.nome ?? "Jogo em destaque",
			categoria: game.categoria ?? "",
			empresaNome: game.empresaNome ?? "NexGames",
			description: sanitizeDescription(game.descricao),
			price: formatCurrency(getDiscountedPrice(game)),
			originalPrice: hasDiscount ? formatCurrency(game.preco) : null,
			badge: hasDiscount
				? `${Number(game.desconto)}% OFF`
				: game.categoria || "Destaque",
			search: game.nome ?? "",
			titleLines: [firstLine, secondLine],
			overline: game.categoria
				? `${game.categoria.toUpperCase()} NA NEXGAMES`
				: "DESTAQUE DO CATÁLOGO",
			image: game.image ?? null,
			startColor: palette.startColor,
			endColor: palette.endColor,
			glowColor: palette.glowColor,
		};
	});
}

function buildHeroInfoCards(games) {
	return games.slice(0, 4).map((game, index) => {
		const [firstLine, secondLine] = splitTitleLines(game.nome);
		const palette = HERO_PALETTES[index % HERO_PALETTES.length];

		return {
			key: `${game.nome}-card-${index}`,
			id: game.id ?? null,
			nome: game.nome ?? "Jogo em destaque",
			ano: game.ano ?? null,
			titleTop: (game.categoria || game.empresaNome || "NexGames").toUpperCase(),
			titleMain: firstLine.toUpperCase(),
			titleBottom:
				secondLine.toUpperCase() || formatCurrency(getDiscountedPrice(game)),
			buttonLabel: "Ver jogo",
			image: game.image ?? null,
			startColor: palette.startColor,
			endColor: palette.endColor,
		};
	});
}

export default function Hero({ games = [], catalogGames = [] }) {
	const navigate = useNavigate();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const slides = useMemo(() => buildHeroSlides(games), [games]);
	const infoCards = useMemo(() => {
		const sourceGames = catalogGames.length > 0 ? catalogGames : games;
		return buildHeroInfoCards(sourceGames);
	}, [catalogGames, games]);

	useEffect(() => {
		if (!slides.length) return;
		if (activeIndex < slides.length) return;

		setActiveIndex(0);
	}, [activeIndex, slides.length]);

	useEffect(() => {
		if (slides.length <= 1) return undefined;

		const autoplayId = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % slides.length);
		}, 5000);

		return () => {
			window.clearInterval(autoplayId);
		};
	}, [slides.length]);

	const currentSlide = slides[activeIndex] ?? null;

	function handleHeroCardNavigation(card) {
		if (!isAuthenticated()) {
			navigate("/login", {
				state: {
					redirectTo: card?.id ? `/product/${card.id}` : undefined,
					pendingProduct: {
						nome: card.nome,
						ano: card.ano ?? null,
					},
				},
			});
			return;
		}

		if (!card?.id) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível abrir este jogo agora. Atualize a página e tente novamente.",
			});
			return;
		}

		navigate(`/product/${card.id}`);
	}

	function handleHeroCardKeyDown(event, card) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleHeroCardNavigation(card);
		}
	}

	function handlePrevSlide() {
		setActiveIndex((current) =>
			current === 0 ? slides.length - 1 : current - 1
		);
	}

	function handleNextSlide() {
		setActiveIndex((current) => (current + 1) % slides.length);
	}

	async function handleAddCurrentSlideToCart() {
		if (!isAuthenticated()) {
			navigate("/auth", {
				state: { redirectTo: "/" },
			});
			return;
		}

		if (!currentSlide?.id) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível adicionar este jogo ao carrinho agora. Tente novamente em instantes.",
			});
			return;
		}

		setIsAddingToCart(true);

		try {
			await addToCart(currentSlide.id);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
		} catch {
			setPopupState({
				open: true,
				title: "Não foi possível adicionar ao carrinho",
				message:
					"Verifique se o produto já está no carrinho ou tente novamente em instantes.",
			});
		} finally {
			setIsAddingToCart(false);
		}
	}

	const sliderOverlay =
		"linear-gradient(90deg, var(--hero-overlay-start) 0%, var(--hero-overlay-mid) 34%, var(--hero-overlay-end) 100%)";

	const heroBackground = currentSlide
		? `
			radial-gradient(circle at 80% 24%, ${currentSlide.glowColor} 0%, transparent 34%),
			linear-gradient(118deg, ${currentSlide.startColor} 0%, ${currentSlide.endColor} 62%, var(--surface-soft-color) 100%)
		`
		: "linear-gradient(135deg, var(--surface-soft-color) 0%, var(--surface-color) 100%)";

	if (!currentSlide) {
		return null;
	}

	return (
		<section className="relative bg-[color:var(--background-color)]">
			<div className="app-container">
				<article
					className="relative overflow-hidden rounded-[var(--radius-large)] border border-[color:var(--border-light-color)]"
					style={{
						background: heroBackground,
						boxShadow: "var(--shadow-soft)",
					}}
				>
					<div
						className="pointer-events-none absolute inset-0"
						style={{ background: sliderOverlay }}
					/>

					<div className="relative z-10 grid gap-10 p-6 md:p-8 xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)] xl:items-center xl:px-16 xl:py-14">
						<div className="max-w-[520px] xl:pl-[38px]">
							<span className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-[color:var(--secondary-color)]">
								<Sparkles size={16} />
								{currentSlide.overline}
							</span>

							<h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)] font-light uppercase leading-[0.94] tracking-[-0.05em] text-[color:var(--text-primary-color)]">
								<span className="block">{currentSlide.titleLines[0]}</span>
								<span
									className="mt-1 block font-black text-[color:var(--primary-color)]"
									style={{
										textShadow:
											"0 0 20px color-mix(in srgb, var(--primary-color) 24%, transparent)",
									}}
								>
									{currentSlide.titleLines[1]}
								</span>
							</h1>

							<p className="mt-4 max-w-[460px] text-sm font-medium leading-6 text-[color:var(--text-muted-color)] md:text-base">
								{currentSlide.description}
							</p>

							<div className="mt-6 flex flex-wrap items-end gap-3">
								<strong className="text-3xl font-black text-[color:var(--text-primary-color)] md:text-4xl">
									{currentSlide.price}
								</strong>

								{currentSlide.originalPrice ? (
									<span className="pb-1 text-sm font-semibold text-[color:var(--text-soft-color)] line-through">
										{currentSlide.originalPrice}
									</span>
								) : null}

								<span className="inline-flex rounded-full bg-[color:var(--primary-color)] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[color:var(--text-on-primary-color)]">
									{currentSlide.badge}
								</span>
							</div>

							<div className="mb-4 mt-[30px] flex flex-col gap-[6px] sm:flex-row sm:items-center">
								<PrimaryButton
									icon={ShoppingCart}
									onClick={handleAddCurrentSlideToCart}
									disabled={isAddingToCart}
									className="text-sm font-extrabold"
								>
									{isAddingToCart ? "Adicionando..." : "Adicionar ao carrinho"}
								</PrimaryButton>
							</div>
						</div>

						<div className="relative min-h-[320px]">
							<div
								className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
								style={{ backgroundColor: currentSlide.glowColor }}
							/>

							<ProductArtwork
								image={currentSlide.image}
								alt={currentSlide.nome}
								primaryLabel={currentSlide.empresaNome}
								secondaryLabel={currentSlide.nome}
								className="min-h-[320px] rounded-[var(--radius-medium)]"
								labelPositionClassName="bottom-6 left-6"
								primaryLabelClassName="text-[11px] font-bold uppercase tracking-[0.08em] opacity-90"
								secondaryLabelClassName="text-lg font-black leading-[1.05]"
								placeholderClassName="relative h-[72%] w-[54%] rounded-[22px] border border-white/25"
								placeholderStyle={{
									transform: "rotate(-14deg)",
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 100%)",
									boxShadow: "var(--shadow-float)",
								}}
								startColor={currentSlide.startColor}
								endColor={currentSlide.endColor}
								softGradient={false}
							/>
						</div>
					</div>

					{slides.length > 1 ? (
						<div className="absolute bottom-[26px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-4">
							<button
								type="button"
								onClick={handlePrevSlide}
								aria-label="Banner anterior"
								className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--primary-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<ChevronLeft size={18} />
							</button>

							<div className="flex items-center gap-[10px]">
								{slides.map((slide, index) => (
									<button
										key={slide.key}
										type="button"
										aria-label={`Ir para o banner ${index + 1}`}
										onClick={() => setActiveIndex(index)}
										className={`rounded-full transition-all ${
											index === activeIndex
												? "h-2 w-8 bg-[color:var(--primary-color)]"
												: "h-2 w-2 bg-[color:var(--border-strong-color)]"
										}`}
									/>
								))}
							</div>

							<button
								type="button"
								onClick={handleNextSlide}
								aria-label="Próximo banner"
								className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--primary-color)] hover:text-[color:var(--text-primary-color)]"
							>
								<ChevronRight size={18} />
							</button>
						</div>
					) : null}
				</article>

				<div className="mt-7 flex snap-x snap-mandatory gap-[22px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible md:pb-0 md:snap-none md:grid-cols-2 xl:grid-cols-4">
					{infoCards.map((card) => (
						<article
							key={card.key}
							role="button"
							tabIndex={0}
							onClick={() => handleHeroCardNavigation(card)}
							onKeyDown={(event) => handleHeroCardKeyDown(event, card)}
							className="grid min-h-[164px] min-w-[292px] shrink-0 snap-start cursor-pointer grid-cols-[46%_minmax(0,1fr)] gap-[10px] rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-color)] p-[18px] text-left transition hover:-translate-y-1 hover:border-[color:var(--border-primary-color)] md:min-w-0"
							style={{ boxShadow: "var(--shadow-soft)" }}
						>
							<ProductArtwork
								image={card.image}
								alt={card.nome}
								className="min-h-[146px]"
								showImageOverlay={false}
								glowClassName="absolute aspect-square w-[62%] rounded-full blur-lg"
								placeholderClassName="relative z-10 h-[62%] w-[56%] rounded-[18px] border border-white/35"
								placeholderStyle={{
									transform: "rotate(-14deg)",
									background:
										"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
								}}
								startColor={card.startColor}
								endColor={card.endColor}
								softGradient={false}
							/>

							<div className="grid content-center gap-0.5">
								<span className="text-[15px] leading-[1.12] uppercase text-[color:var(--text-primary-color)]">
									{card.titleTop}
								</span>
								<strong className="text-[18px] font-black leading-[1.05] uppercase text-[color:var(--text-primary-color)]">
									{card.titleMain}
								</strong>
								<small className="text-[15px] leading-[1.12] uppercase text-[color:var(--text-primary-color)]">
									{card.titleBottom}
								</small>

								<span className="mt-3 inline-flex w-fit items-center gap-2 text-[15px] font-bold text-[color:var(--text-primary-color)]">
									{card.buttonLabel}
									<CircleArrowRight size={16} />
								</span>
							</div>
						</article>
					))}
				</div>

				<div className="mt-[34px] flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] shadow-[var(--shadow-soft)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-hidden md:snap-none md:grid-cols-2 xl:grid-cols-5">
					{HERO_BENEFITS.map((benefit, index) => {
						const Icon = benefit.icon;

						return (
							<article
								key={benefit.title}
								className={`flex min-h-[88px] min-w-[272px] shrink-0 snap-start items-center justify-center gap-[14px] bg-[color:var(--surface-soft-color)] px-[18px] transition hover:bg-[color:var(--surface-color)] md:min-w-0 ${
									index < HERO_BENEFITS.length - 1
										? "border-r border-[color:var(--border-color)] md:border-b md:border-r-0 xl:border-b-0 xl:border-r"
										: ""
								}`}
							>
								<div className="inline-flex h-[42px] w-[42px] items-center justify-center text-[color:var(--primary-color)]">
									<Icon size={20} />
								</div>

								<div>
									<strong className="block text-base font-black text-[color:var(--text-primary-color)]">
										{benefit.title}
									</strong>
									<span className="block text-sm leading-[1.2] text-[color:var(--text-muted-color)]">
										{benefit.description}
									</span>
								</div>
							</article>
						);
					})}
				</div>
			</div>

			<FeedbackPopup
				open={popupState.open}
				title={popupState.title}
				message={popupState.message}
				onClose={() =>
					setPopupState({
						open: false,
						title: "",
						message: "",
					})
				}
			/>
		</section>
	);
}
