import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../../../../services/cartService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";
import SecondaryButton from "../../../components/shared/SecondaryButton";
import { formatCurrency, getDiscountedPrice } from "../../../helpers/currency";

function getCartItemGameId(item) {
	return item?.jogo?.id ?? item?.fkJogo ?? null;
}

function getCartItemPrice(item) {
	return getDiscountedPrice(item?.jogo);
}

export default function Cart() {
	const navigate = useNavigate();
	const [cart, setCart] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [removingKey, setRemovingKey] = useState("");
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const items = useMemo(() => cart?.itens ?? [], [cart]);
	const subtotal = useMemo(() => {
		return items.reduce((total, item) => total + getCartItemPrice(item), 0);
	}, [items]);

	useEffect(() => {
		loadCart();
	}, []);

	async function loadCart() {
		setIsLoading(true);

		try {
			const data = await getCart();
			setCart(data);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível carregar o carrinho",
				message:
					error?.message ||
					"Tente novamente em instantes para buscar seus itens.",
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
		const gameId = getCartItemGameId(item);

		if (!gameId) {
			setPopupState({
				open: true,
				title: "Produto indisponível",
				message:
					"Não foi possível abrir este item agora. Tente novamente em instantes.",
			});
			return;
		}

		navigate(`/product/${gameId}`);
	}

	async function handleRemoveItem(item) {
		const gameId = getCartItemGameId(item);

		if (!gameId) {
			return;
		}

		setRemovingKey(String(gameId));

		try {
			await removeFromCart(gameId);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
			await loadCart();
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível remover o item",
				message:
					error?.message ||
					"Tente novamente em instantes para atualizar o carrinho.",
			});
		} finally {
			setRemovingKey("");
		}
	}

	if (isLoading) {
		return (
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<div className="h-[360px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				<div className="h-[280px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
			</div>
		);
	}

	if (!items.length) {
		return (
			<>
				<section className="rounded-[var(--radius-large)] border border-dashed border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-6 py-10 text-center">
					<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
						Seu carrinho está vazio
					</h2>
					<p className="mt-3 text-sm leading-7 text-[color:var(--text-muted-color)]">
						Adicione jogos ao carrinho para continuar com o checkout.
					</p>
					<div className="mt-6 flex justify-center">
						<PrimaryButton onClick={() => navigate("/")}>
							Voltar para a loja
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
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<section className="grid gap-4">
					{items.map((item) => {
						const gameId = getCartItemGameId(item);
						const isRemoving = removingKey === String(gameId);

						return (
							<article
								key={item.id ?? gameId}
								className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<h2 className="text-lg font-black text-[color:var(--text-primary-color)]">
											{item?.jogo?.nome || `Jogo #${gameId}`}
										</h2>
										<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
											{item?.jogo?.descricao ||
												"Item adicionado ao seu carrinho ativo da NexGames."}
										</p>
									</div>

									<strong className="text-lg text-[color:var(--text-primary-color)]">
										{formatCurrency(getCartItemPrice(item))}
									</strong>
								</div>

								<div className="grid gap-3 sm:grid-cols-2">
									<SecondaryButton
										icon={Eye}
										className="!min-w-0"
										onClick={() => handleOpenProduct(item)}
									>
										Ver produto
									</SecondaryButton>

									<SecondaryButton
										icon={Trash2}
										className="!min-w-0"
										onClick={() => handleRemoveItem(item)}
										disabled={isRemoving}
									>
										{isRemoving ? "Removendo..." : "Remover"}
									</SecondaryButton>
								</div>
							</article>
						);
					})}
				</section>

				<aside className="grid content-start gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5">
					<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
						Resumo do carrinho
					</h2>

					<div className="grid gap-3 text-sm">
						<div className="flex items-center justify-between rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-4 py-3">
							<span className="text-[color:var(--text-muted-color)]">Itens</span>
							<strong>{items.length}</strong>
						</div>

						<div className="flex items-center justify-between rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-4 py-3">
							<span className="text-[color:var(--text-muted-color)]">Subtotal</span>
							<strong>{formatCurrency(subtotal)}</strong>
						</div>
					</div>

					<div className="grid gap-3">
						<PrimaryButton onClick={() => navigate("/checkout")}>
							Ir para o checkout
						</PrimaryButton>

						<SecondaryButton onClick={() => navigate("/")}>
							Continuar comprando
						</SecondaryButton>
					</div>
				</aside>
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
