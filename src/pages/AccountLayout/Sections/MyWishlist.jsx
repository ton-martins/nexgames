import { useEffect, useMemo, useState } from "react";
import { Eye, HeartOff, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../../services/cartService";
import {
	getWishlist,
	removeFromWishlist,
} from "../../../../services/wishlistService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";
import SecondaryButton from "../../../components/shared/SecondaryButton";
import { formatCurrency } from "../../../helpers/currency";

function getWishlistGameId(item) {
	return item?.jogo?.id ?? item?.fkJogo ?? null;
}

function getWishlistGameName(item) {
	return item?.jogo?.nome || `Jogo #${getWishlistGameId(item) || "--"}`;
}

function getWishlistGameDescription(item) {
	return (
		item?.jogo?.descricao ||
		"Este item foi salvo na sua lista de favoritos para você acompanhar depois."
	);
}

function getWishlistGamePrice(item) {
	return Number(item?.jogo?.preco ?? 0);
}

export default function MyWishlist() {
	const navigate = useNavigate();
	const [wishlistItems, setWishlistItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [updatingKey, setUpdatingKey] = useState("");
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const items = useMemo(() => wishlistItems.filter(Boolean), [wishlistItems]);

	useEffect(() => {
		loadWishlist();
	}, []);

	async function loadWishlist() {
		setIsLoading(true);

		try {
			const data = await getWishlist();
			setWishlistItems(Array.isArray(data) ? data : []);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível carregar seus favoritos",
				message:
					error?.message ||
					"Tente novamente em instantes para buscar sua lista de desejos.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	function closePopup() {
		setPopupState({
			open: false,
			title: "",
			message: "",
		});
	}

	function handleOpenProduct(item) {
		const gameId = getWishlistGameId(item);

		if (!gameId) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível abrir este jogo agora. Tente novamente em instantes.",
			});
			return;
		}

		navigate(`/product/${gameId}`);
	}

	async function handleRemove(item) {
		const gameId = getWishlistGameId(item);

		if (!gameId) {
			return;
		}

		setUpdatingKey(`remove-${gameId}`);

		try {
			await removeFromWishlist(gameId);
			window.dispatchEvent(new Event("nexgames:wishlist-updated"));
			setWishlistItems((current) =>
				current.filter((wishlistItem) => getWishlistGameId(wishlistItem) !== gameId)
			);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível remover dos favoritos",
				message:
					error?.message ||
					"Tente novamente em instantes para atualizar sua lista.",
			});
		} finally {
			setUpdatingKey("");
		}
	}

	async function handleAddToCart(item) {
		const gameId = getWishlistGameId(item);

		if (!gameId) {
			return;
		}

		setUpdatingKey(`cart-${gameId}`);

		try {
			await addToCart(gameId);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
			setPopupState({
				open: true,
				title: "Jogo adicionado ao carrinho",
				message: `${getWishlistGameName(item)} foi enviado para o seu carrinho.`,
			});
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível adicionar ao carrinho",
				message:
					error?.message ||
					"Verifique se o jogo já está no carrinho e tente novamente.",
			});
		} finally {
			setUpdatingKey("");
		}
	}

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="h-[260px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]"
					/>
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<>
				<section className="rounded-[var(--radius-large)] border border-dashed border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-6 py-10 text-center">
					<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
						Sua lista de favoritos está vazia
					</h2>
					<p className="mt-3 text-sm leading-7 text-[color:var(--text-muted-color)]">
						Explore a Home da NexGames e salve os jogos que você quer acompanhar.
					</p>
					<div className="mt-6 flex justify-center">
						<PrimaryButton onClick={() => navigate("/")}>
							Explorar a loja
						</PrimaryButton>
					</div>
				</section>

				<FeedbackPopup
					open={popupState.open}
					title={popupState.title}
					message={popupState.message}
					onClose={closePopup}
				/>
			</>
		);
	}

	return (
		<>
			<div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
				{items.map((item) => {
					const gameId = getWishlistGameId(item);
					const isRemoving = updatingKey === `remove-${gameId}`;
					const isAddingToCart = updatingKey === `cart-${gameId}`;

					return (
						<article
							key={item.id ?? gameId}
							className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-lg font-black text-[color:var(--text-primary-color)]">
										{getWishlistGameName(item)}
									</h2>
									<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
										{getWishlistGameDescription(item)}
									</p>
								</div>

								<span className="rounded-full bg-[color:var(--primary-soft-color)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--primary-color)]">
									Favorito
								</span>
							</div>

							<div className="flex items-center justify-between rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-4 py-3">
								<span className="text-sm text-[color:var(--text-muted-color)]">Preço atual</span>
								<strong className="text-base text-[color:var(--text-primary-color)]">
									{formatCurrency(getWishlistGamePrice(item))}
								</strong>
							</div>

							<div className="grid gap-3">
								<PrimaryButton
									icon={ShoppingCart}
									className="!min-w-0"
									onClick={() => handleAddToCart(item)}
									disabled={isAddingToCart}
								>
									{isAddingToCart ? "Adicionando..." : "Adicionar ao carrinho"}
								</PrimaryButton>

								<div className="grid gap-3 sm:grid-cols-2">
									<SecondaryButton
										icon={Eye}
										className="!min-w-0"
										onClick={() => handleOpenProduct(item)}
									>
										Ver produto
									</SecondaryButton>

									<SecondaryButton
										icon={HeartOff}
										className="!min-w-0"
										onClick={() => handleRemove(item)}
										disabled={isRemoving}
									>
										{isRemoving ? "Removendo..." : "Remover"}
									</SecondaryButton>
								</div>
							</div>
						</article>
					);
				})}
			</div>

			<FeedbackPopup
				open={popupState.open}
				title={popupState.title}
				message={popupState.message}
				onClose={closePopup}
			/>
		</>
	);
}
