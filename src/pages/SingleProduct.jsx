import { useEffect, useMemo, useState } from "react";
import {
	CalendarDays,
	ChevronRight,
	Compass,
	MessageCircle,
	ShoppingBag,
	Star,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../../services/cartService";
import { getGameById, getPublicGames } from "../../services/gameService";
import { getGameRatingSummary } from "../../services/ratingService";
import FeedbackPopup from "../components/FeedbackPopup";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RecommendedProducts from "../components/RecommendedProducts";
import SubHeader from "../components/SubHeader";
import TopHeader from "../components/TopHeader";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import PrimaryButton from "../components/shared/PrimaryButton";
import SecondaryButton from "../components/shared/SecondaryButton";

function sanitizeDescription(description) {
	const normalizedDescription = (description || "")
		.trim()
		.replace(/^"+|"+$/g, "");

	if (!normalizedDescription) {
		return "Jogo disponível no catálogo digital da NexGames.";
	}

	return normalizedDescription;
}

function formatReviewDate(date) {
	if (!date) {
		return "Avaliação recente";
	}

	try {
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}).format(new Date(date));
	} catch {
		return "Avaliação recente";
	}
}

function findCatalogGame(product, catalogGames) {
	if (!product || catalogGames.length === 0) {
		return null;
	}

	return (
		catalogGames.find(
			(game) =>
				game.nome === product.nome &&
				(game.ano === product.ano || !game.ano || !product.ano)
		) ||
		catalogGames.find((game) => game.nome === product.nome) ||
		null
	);
}

function buildProductView(product, catalogGames) {
	if (!product) {
		return null;
	}

	const catalogGame = findCatalogGame(product, catalogGames);
	const discount = Number(product.desconto ?? 0);
	const currentPrice = getDiscountedPrice(product);
	const originalPrice = Number(product.preco ?? 0);
	const hasDiscount = discount > 0 && currentPrice < originalPrice;

	return {
		...product,
		descricao: sanitizeDescription(product.descricao),
		categoria: catalogGame?.categoria ?? "Catálogo digital",
		empresaNome: catalogGame?.empresaNome ?? "NexGames",
		precoAtual: currentPrice,
		precoOriginal: hasDiscount ? originalPrice : null,
		badge: hasDiscount ? `-${discount}%` : "Disponível",
	};
}

function buildRecommendedCatalog(product, catalogGames) {
	if (!product || catalogGames.length === 0) {
		return catalogGames;
	}

	const prioritizedGames = [...catalogGames].sort((gameA, gameB) => {
		const sameCategoryScoreA = gameA.categoria === product.categoria ? 1 : 0;
		const sameCategoryScoreB = gameB.categoria === product.categoria ? 1 : 0;

		if (sameCategoryScoreB !== sameCategoryScoreA) {
			return sameCategoryScoreB - sameCategoryScoreA;
		}

		return Number(gameB.ano ?? 0) - Number(gameA.ano ?? 0);
	});

	return prioritizedGames.filter((game) => game.nome !== product.nome);
}

function RatingStars({ value = 0 }) {
	const roundedValue = Math.round(Number(value || 0));

	return (
		<div className="flex items-center gap-1 text-[color:var(--rating-color)]">
			{Array.from({ length: 5 }).map((_, index) => (
				<Star
					key={index}
					size={16}
					fill={index < roundedValue ? "currentColor" : "none"}
				/>
			))}
		</div>
	);
}

export default function SingleProduct() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [catalogGames, setCatalogGames] = useState([]);
	const [product, setProduct] = useState(null);
	const [ratingSummary, setRatingSummary] = useState({
		media: 0,
		totalAvaliacoes: 0,
		avaliacoes: [],
	});
	const [activeTab, setActiveTab] = useState("description");
	const [isLoading, setIsLoading] = useState(true);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [actionMessage, setActionMessage] = useState("");
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const productView = useMemo(() => {
		return buildProductView(product, catalogGames);
	}, [catalogGames, product]);

	const recommendedGames = useMemo(() => {
		return buildRecommendedCatalog(productView, catalogGames);
	}, [catalogGames, productView]);

	useEffect(() => {
		let isMounted = true;

		async function loadPageData() {
			setIsLoading(true);

			try {
				const [gameData, publicGames, ratings] = await Promise.all([
					getGameById(id),
					getPublicGames(),
					getGameRatingSummary(id).catch(() => ({
						media: 0,
						totalAvaliacoes: 0,
						avaliacoes: [],
					})),
				]);

				if (!isMounted) {
					return;
				}

				setProduct(gameData);
				setCatalogGames(Array.isArray(publicGames) ? publicGames : []);
				setRatingSummary(ratings);
			} catch {
				if (!isMounted) {
					return;
				}

				setProduct(null);
				setCatalogGames([]);
				setPopupState({
					open: true,
					title: "Não foi possível carregar o produto",
					message:
						"O jogo solicitado não pôde ser carregado neste momento. Tente novamente em instantes.",
				});
			} finally {
				if (!isMounted) {
					return;
				}

				setIsLoading(false);
			}
		}

		loadPageData();

		return () => {
			isMounted = false;
		};
	}, [id]);

	async function handleAddToCart() {
		if (!productView?.id) {
			return;
		}

		setIsAddingToCart(true);
		setActionMessage("");

		try {
			const response = await addToCart(productView.id);
			setActionMessage(
				response?.message || "Jogo adicionado ao carrinho com sucesso."
			);
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

	function handleCategoryNavigation() {
		if (!productView?.categoria || productView.categoria === "Catálogo digital") {
			navigate("/");
			return;
		}

		navigate(`/?categoria=${encodeURIComponent(productView.categoria)}`);
	}

	const isDescriptionTab = activeTab === "description";

	return (
		<div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
			<TopHeader />
			<Header games={catalogGames} />
			<SubHeader games={catalogGames} />

			<main className="pb-[var(--section-spacing-large)]">
				<div className="app-container py-8">
					<div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-muted-color)]">
						<Link
							to="/"
							className="transition hover:text-[color:var(--text-primary-color)]"
						>
							Home
						</Link>
						<ChevronRight size={16} />
						<span>{productView?.categoria || "Produto"}</span>
						{productView?.nome ? (
							<>
								<ChevronRight size={16} />
								<strong className="font-semibold text-[color:var(--text-primary-color)]">
									{productView.nome}
								</strong>
							</>
						) : null}
					</div>

					{isLoading ? (
						<section className="grid gap-8 rounded-[18px] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 shadow-[var(--shadow-soft)] min-[1181px]:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
							<div className="min-h-[320px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
							<div className="grid content-start gap-4">
								<div className="h-4 w-24 animate-pulse rounded-full bg-[color:var(--surface-soft-color)]" />
								<div className="h-10 w-[70%] animate-pulse rounded-full bg-[color:var(--surface-soft-color)]" />
								<div className="h-20 w-full animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
								<div className="h-10 w-40 animate-pulse rounded-full bg-[color:var(--surface-soft-color)]" />
							</div>
						</section>
					) : productView ? (
						<>
							<section className="grid gap-8 rounded-[18px] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 shadow-[var(--shadow-soft)] min-[1181px]:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
								<div className="relative min-h-[320px] min-[1181px]:min-h-[420px]">
									<div
										className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[var(--radius-large)] min-[1181px]:min-h-[420px]"
										style={{
											background:
												"linear-gradient(135deg, color-mix(in srgb, var(--primary-light-color) 72%, var(--surface-color)), var(--surface-soft-color))",
										}}
									>
										<div className="absolute aspect-square w-[62%] rounded-full bg-white/45 blur-lg" />

										<div
											className="relative z-10 h-[66%] w-[58%] rounded-[22px] border border-white/35"
											style={{
												background:
													"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
												transform: "rotate(-14deg)",
												boxShadow: "var(--shadow-float)",
											}}
										/>

										<div className="absolute bottom-[18px] left-[18px] grid max-w-[62%] gap-0.5 text-[color:var(--text-inverse-color)]">
											<span className="text-[11px] font-bold tracking-[0.08em] opacity-90">
												{productView.empresaNome}
											</span>
											<strong className="text-[15px] leading-[1.05]">
												{productView.categoria}
											</strong>
										</div>
									</div>
								</div>

								<div className="grid content-start gap-[14px]">
									<span className="text-[13px] text-[color:var(--text-muted-color)]">
										{productView.categoria}
									</span>

									<h1 className="m-0 text-[26px] leading-[1.08] text-[color:var(--text-primary-color)] min-[1181px]:text-[36px]">
										{productView.nome}
									</h1>

									<p className="m-0 text-[15px] leading-7 text-[color:var(--text-muted-color)]">
										{productView.descricao}
									</p>

									<div className="flex flex-wrap items-center gap-3">
										<span className="inline-flex items-center gap-2 text-sm text-[color:var(--rating-color)]">
											<CalendarDays size={16} />
											{productView.ano || "Catálogo ativo"} •{" "}
											{productView.empresaNome}
										</span>

										<span className="inline-flex min-h-[34px] items-center rounded-full bg-[color:var(--primary-soft-color)] px-3.5 text-xs font-extrabold uppercase text-[color:var(--text-primary-color)]">
											{productView.badge}
										</span>
									</div>

									<div className="grid gap-1.5">
										<strong className="text-[38px] font-black text-[color:var(--text-primary-color)]">
											{formatCurrency(productView.precoAtual)}
										</strong>

										{productView.precoOriginal ? (
											<span className="text-[color:var(--text-muted-color)] line-through">
												{formatCurrency(productView.precoOriginal)}
											</span>
										) : null}
									</div>

									<div className="mt-1 flex flex-wrap items-center gap-3">
										<PrimaryButton
											icon={ShoppingBag}
											onClick={handleAddToCart}
											disabled={isAddingToCart}
										>
											{isAddingToCart ? "Adicionando..." : "Adicionar ao carrinho"}
										</PrimaryButton>

										<SecondaryButton
											icon={Compass}
											onClick={handleCategoryNavigation}
										>
											Ver categoria
										</SecondaryButton>
									</div>

									{actionMessage ? (
										<p className="m-0 text-sm font-medium text-[color:var(--secondary-color)]">
											{actionMessage}
										</p>
									) : null}
								</div>
							</section>

							<section className="mt-[var(--section-spacing)] rounded-[18px] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 shadow-[var(--shadow-soft)]">
								<div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--border-color)] pb-4">
									<button
										type="button"
										onClick={() => setActiveTab("description")}
										className={`relative rounded-full px-4 py-2 text-sm font-bold transition ${
											isDescriptionTab
												? "bg-[color:var(--primary-soft-color)] text-[color:var(--text-primary-color)]"
												: "text-[color:var(--text-muted-color)] hover:text-[color:var(--text-primary-color)]"
										}`}
									>
										Descrição
									</button>

									<button
										type="button"
										onClick={() => setActiveTab("reviews")}
										className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
											!isDescriptionTab
												? "bg-[color:var(--primary-soft-color)] text-[color:var(--text-primary-color)]"
												: "text-[color:var(--text-muted-color)] hover:text-[color:var(--text-primary-color)]"
										}`}
									>
										<MessageCircle size={16} />
										Avaliações
									</button>
								</div>

								{isDescriptionTab ? (
									<div className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
										<div className="grid gap-4">
											<h2 className="m-0 text-2xl font-bold text-[color:var(--text-primary-color)]">
												Sobre este jogo
											</h2>
											<p className="m-0 text-[15px] leading-8 text-[color:var(--text-muted-color)]">
												{productView.descricao}
											</p>
										</div>

										<div className="rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-5">
											<h3 className="m-0 text-lg font-bold text-[color:var(--text-primary-color)]">
												Detalhes rápidos
											</h3>
											<div className="mt-4 grid gap-3 text-sm">
												<div className="flex items-center justify-between gap-3">
													<span className="text-[color:var(--text-muted-color)]">
														Categoria
													</span>
													<strong>{productView.categoria}</strong>
												</div>
												<div className="flex items-center justify-between gap-3">
													<span className="text-[color:var(--text-muted-color)]">
														Publicadora
													</span>
													<strong>{productView.empresaNome}</strong>
												</div>
												<div className="flex items-center justify-between gap-3">
													<span className="text-[color:var(--text-muted-color)]">
														Ano
													</span>
													<strong>{productView.ano || "Não informado"}</strong>
												</div>
												<div className="flex items-center justify-between gap-3">
													<span className="text-[color:var(--text-muted-color)]">
														Preço
													</span>
													<strong>{formatCurrency(productView.precoAtual)}</strong>
												</div>
											</div>
										</div>
									</div>
								) : (
									<div className="grid gap-6 pt-6">
										<div className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
											<div className="grid gap-2">
												<span className="text-sm uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
													Média geral
												</span>
												<strong className="text-[42px] font-black leading-none text-[color:var(--text-primary-color)]">
													{Number(ratingSummary.media ?? 0).toFixed(1)}
												</strong>
												<RatingStars value={ratingSummary.media} />
											</div>

											<div className="grid gap-2">
												<strong className="text-lg text-[color:var(--text-primary-color)]">
													{ratingSummary.totalAvaliacoes}{" "}
													{ratingSummary.totalAvaliacoes === 1
														? "avaliação"
														: "avaliações"}
												</strong>
												<p className="m-0 text-sm leading-6 text-[color:var(--text-muted-color)]">
													As avaliações ajudam outros jogadores a entender melhor a
													experiência oferecida por este título.
												</p>
											</div>
										</div>

										{ratingSummary.avaliacoes.length > 0 ? (
											<div className="grid gap-4">
												{ratingSummary.avaliacoes.map((review) => (
													<article
														key={review.id}
														className="rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-5"
													>
														<div className="flex flex-wrap items-center justify-between gap-3">
															<RatingStars value={review.nota} />
															<span className="text-sm text-[color:var(--text-muted-color)]">
																{formatReviewDate(review.data)}
															</span>
														</div>
														<p className="mb-0 mt-3 text-[15px] leading-7 text-[color:var(--text-muted-color)]">
															{review.comentario || "Sem comentário escrito."}
														</p>
													</article>
												))}
											</div>
										) : (
											<div className="rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-6 text-center">
												<strong className="text-lg text-[color:var(--text-primary-color)]">
													Este produto ainda não recebeu avaliações
												</strong>
												<p className="mb-0 mt-2 text-sm leading-6 text-[color:var(--text-muted-color)]">
													Seja o primeiro a comprar e compartilhar sua experiência.
												</p>
											</div>
										)}
									</div>
								)}
							</section>
						</>
					) : (
						<section className="rounded-[18px] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-8 text-center shadow-[var(--shadow-soft)]">
							<h1 className="m-0 text-3xl font-bold text-[color:var(--text-primary-color)]">
								Produto não encontrado
							</h1>
							<p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted-color)]">
								O item solicitado não está disponível ou não pôde ser carregado
								com a sessão atual.
							</p>
							<div className="mt-6">
								<SecondaryButton onClick={() => navigate("/")}>
									Voltar para a home
								</SecondaryButton>
							</div>
						</section>
					)}
				</div>

				{!isLoading && productView ? (
					<RecommendedProducts games={recommendedGames} />
				) : null}
			</main>

			<Footer />

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
		</div>
	);
}
