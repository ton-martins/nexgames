import { useEffect, useMemo } from "react";
import {
	ArrowRight,
	Package2,
	ShoppingBag,
	Trash2,
	X,
} from "lucide-react";
import { formatCurrency, getDiscountedPrice } from "../../helpers/currency";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

function buildCartItemLabel(item) {
	if (item?.jogo?.categoria) {
		return item.jogo.categoria;
	}

	return "Jogo digital";
}

function buildCartItemCompany(item) {
	if (item?.jogo?.empresaNome) {
		return item.jogo.empresaNome;
	}

	return "NexGames";
}

function buildCartItemPrice(item) {
	return getDiscountedPrice(item?.jogo);
}

function buildCartItemOriginalPrice(item) {
	const currentPrice = buildCartItemPrice(item);
	const originalPrice = Number(item?.jogo?.preco ?? 0);
	const hasDiscount = currentPrice < originalPrice;

	return hasDiscount ? originalPrice : null;
}

export default function ModalCart({
	open = false,
	cart = null,
	isAuthenticated = false,
	isLoading = false,
	isUpdating = false,
	onClose,
	onLogin,
	onRemoveItem,
	onViewCart,
	onCheckout,
}) {
	const items = useMemo(() => {
		return Array.isArray(cart?.itens) ? cart.itens : [];
	}, [cart]);

	const subtotal = useMemo(() => {
		return items.reduce((total, item) => total + buildCartItemPrice(item), 0);
	}, [items]);

	useEffect(() => {
		if (!open) {
			return undefined;
		}

		function handleEscape(event) {
			if (event.key === "Escape") {
				onClose?.();
			}
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleEscape);
		};
	}, [onClose, open]);

	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[110]">
			<button
				type="button"
				aria-label="Fechar carrinho"
				onClick={onClose}
				className="absolute inset-0 animate-[fade-in_180ms_ease-out] bg-[color:var(--overlay-color)] backdrop-blur-[2px]"
			/>

			<aside
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-cart-title"
				className="absolute right-0 top-0 flex h-full w-full max-w-[420px] animate-[cart-drawer-in_220ms_ease-out] flex-col border-l border-[color:var(--border-color)] bg-[color:var(--surface-color)] shadow-[var(--shadow-large)]"
			>
				<div className="flex items-center justify-between border-b border-[color:var(--border-color)] px-5 py-4">
					<div>
						<h2
							id="modal-cart-title"
							className="m-0 text-lg font-bold text-[color:var(--text-primary-color)]"
						>
							Seu carrinho
						</h2>
						<span className="text-sm text-[color:var(--text-muted-color)]">
							{items.length} {items.length === 1 ? "item" : "itens"}
						</span>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Fechar carrinho"
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:bg-[color:var(--surface-soft-color)] hover:text-[color:var(--text-primary-color)]"
					>
						<X size={18} />
					</button>
				</div>

				{isLoading ? (
					<div className="grid flex-1 content-start gap-4 px-5 py-5">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-3 animate-pulse"
							>
								<div className="h-[88px] rounded-[var(--radius-medium)] bg-[color:var(--border-color)]" />
								<div className="grid gap-2">
									<div className="h-3 w-20 rounded-full bg-[color:var(--border-color)]" />
									<div className="h-5 w-36 rounded-full bg-[color:var(--border-color)]" />
									<div className="h-4 w-28 rounded-full bg-[color:var(--border-color)]" />
									<div className="h-4 w-16 rounded-full bg-[color:var(--border-color)]" />
								</div>
							</div>
						))}
					</div>
				) : items.length > 0 ? (
					<>
						<div className="flex-1 overflow-y-auto px-5 py-5">
							<div className="grid gap-3">
								{items.map((item, index) => {
									const currentPrice = buildCartItemPrice(item);
									const originalPrice = buildCartItemOriginalPrice(item);

									return (
										<article
											key={item.id ?? `${item.fkJogo}-${index}`}
											className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-[var(--radius-large)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] p-3"
										>
											<div
												className="relative flex h-[88px] items-center justify-center overflow-hidden rounded-[var(--radius-medium)]"
												style={{
													background:
														"linear-gradient(135deg, color-mix(in srgb, var(--primary-light-color) 58%, var(--surface-color)), var(--surface-soft-color))",
												}}
											>
												<div
													className="h-[56%] w-[52%] rounded-[16px] border border-white/35"
													style={{
														background:
															"linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.14) 100%)",
														transform: "rotate(-14deg)",
													}}
												/>
											</div>

											<div className="grid gap-2">
												<div className="flex items-start justify-between gap-2">
													<div className="grid gap-0.5">
														<span className="text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
															{buildCartItemLabel(item)}
														</span>
														<strong className="text-sm leading-[1.25] text-[color:var(--text-primary-color)]">
															{item?.jogo?.nome ?? "Jogo no carrinho"}
														</strong>
													</div>

													<button
														type="button"
														onClick={() => onRemoveItem?.(item)}
														disabled={isUpdating}
														aria-label={`Remover ${item?.jogo?.nome ?? "item"} do carrinho`}
														className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] transition hover:border-[color:var(--danger-color)] hover:text-[color:var(--danger-color)] disabled:cursor-not-allowed disabled:opacity-60"
													>
														<Trash2 size={16} />
													</button>
												</div>

												<span className="text-xs text-[color:var(--text-muted-color)]">
													{buildCartItemCompany(item)}
												</span>

												<div className="flex items-center gap-2">
													<strong
														className={`text-base font-bold ${
															originalPrice
																? "text-[color:var(--danger-color)]"
																: "text-[color:var(--text-primary-color)]"
														}`}
													>
														{formatCurrency(currentPrice)}
													</strong>
													{originalPrice ? (
														<span className="text-xs text-[color:var(--text-muted-color)] line-through">
															{formatCurrency(originalPrice)}
														</span>
													) : null}
												</div>
											</div>
										</article>
									);
								})}
							</div>
						</div>

						<div className="border-t border-[color:var(--border-color)] px-5 py-5">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div className="grid gap-0.5">
									<span className="text-sm text-[color:var(--text-muted-color)]">
										Subtotal
									</span>
									<strong className="text-[28px] font-black leading-none text-[color:var(--text-primary-color)]">
										{formatCurrency(subtotal)}
									</strong>
								</div>

								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
									<ShoppingBag size={22} />
								</div>
							</div>

							<div className="grid gap-3">
								<PrimaryButton
									icon={ArrowRight}
									iconPosition="right"
									onClick={onCheckout}
									className="!min-w-0 !w-full"
								>
									Finalizar compra
								</PrimaryButton>

								<SecondaryButton
									icon={Package2}
									onClick={onViewCart}
									className="!min-w-0 !w-full"
								>
									Ver carrinho completo
								</SecondaryButton>
							</div>
						</div>
					</>
				) : isAuthenticated ? (
					<div className="grid flex-1 content-center justify-items-center gap-4 px-6 text-center">
						<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--surface-soft-color)] text-[color:var(--primary-color)]">
							<ShoppingBag size={32} />
						</div>

						<div className="grid gap-2">
							<strong className="text-xl text-[color:var(--text-primary-color)]">
								Seu carrinho está vazio
							</strong>
							<p className="m-0 text-sm leading-6 text-[color:var(--text-muted-color)]">
								Adicione jogos ao carrinho para acompanhar seus próximos pedidos.
							</p>
						</div>

						<PrimaryButton
							icon={ArrowRight}
							iconPosition="right"
							onClick={onClose}
							className="!min-w-0"
						>
							Continuar comprando
						</PrimaryButton>
					</div>
				) : (
					<div className="grid flex-1 content-center justify-items-center gap-4 px-6 text-center">
						<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--surface-soft-color)] text-[color:var(--primary-color)]">
							<ShoppingBag size={32} />
						</div>

						<div className="grid gap-2">
							<strong className="text-xl text-[color:var(--text-primary-color)]">
								Entre para ver seu carrinho
							</strong>
							<p className="m-0 text-sm leading-6 text-[color:var(--text-muted-color)]">
								Faça login para salvar itens, revisar seu carrinho e seguir para o checkout.
							</p>
						</div>

						<PrimaryButton
							icon={ArrowRight}
							iconPosition="right"
							onClick={onLogin}
							className="!min-w-0"
						>
							Entrar
						</PrimaryButton>
					</div>
				)}
			</aside>
		</div>
	);
}
