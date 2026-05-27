import { useEffect, useMemo, useState } from "react";
import {
	BadgeCheck,
	ChevronRight,
	CreditCard,
	Landmark,
	QrCode,
	ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../../services/cartService";
import { getPublicGames, getStoredPublicGames } from "../../services/gameService";
import { checkout, pay } from "../../services/saleService";
import FeedbackPopup from "../components/FeedbackPopup";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TopHeader from "../components/TopHeader";
import { formatCurrency, getDiscountedPrice } from "../helpers/currency";
import PrimaryButton from "../components/shared/PrimaryButton";
import SecondaryButton from "../components/shared/SecondaryButton";

const PAYMENT_METHODS = [
	{
		id: "cartao",
		label: "Cartão",
		description: "Pagamento imediato com cartão de crédito.",
		icon: CreditCard,
	},
	{
		id: "pix",
		label: "Pix",
		description: "Confirmação rápida para liberar sua compra digital.",
		icon: QrCode,
	},
	{
		id: "boleto",
		label: "Boleto",
		description: "Gere um boleto e conclua o pagamento depois.",
		icon: Landmark,
	},
];

const INITIAL_PAYMENT_FORM = {
	cardholderName: "",
	cardNumber: "",
	cardExpiry: "",
	cardCvv: "",
	payerName: "",
	payerDocument: "",
	payerEmail: "",
};

function getDigits(value) {
	return String(value || "").replace(/\D/g, "");
}

function maskCardNumber(value) {
	return getDigits(value)
		.slice(0, 16)
		.replace(/(\d{4})(?=\d)/g, "$1 ")
		.trim();
}

function maskCardExpiry(value) {
	const digits = getDigits(value).slice(0, 4);

	if (digits.length <= 2) {
		return digits;
	}

	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function maskCardCvv(value) {
	return getDigits(value).slice(0, 4);
}

function maskCpf(value) {
	const digits = getDigits(value).slice(0, 11);

	return digits
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function isValidCardNumber(value) {
	return /^\d{16}$/.test(getDigits(value));
}

function isValidCardExpiry(value) {
	if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
		return false;
	}

	const [month, year] = value.split("/");
	const expiryDate = new Date(
		Number(`20${year}`),
		Number(month),
		0,
		23,
		59,
		59
	);

	return expiryDate.getTime() >= Date.now();
}

function isValidCardCvv(value) {
	return /^\d{3,4}$/.test(getDigits(value));
}

function isValidCpf(value) {
	const cpf = getDigits(value);

	if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
		return false;
	}

	let sum = 0;

	for (let index = 0; index < 9; index += 1) {
		sum += Number(cpf[index]) * (10 - index);
	}

	let remainder = (sum * 10) % 11;

	if (remainder === 10) {
		remainder = 0;
	}

	if (remainder !== Number(cpf[9])) {
		return false;
	}

	sum = 0;

	for (let index = 0; index < 10; index += 1) {
		sum += Number(cpf[index]) * (11 - index);
	}

	remainder = (sum * 10) % 11;

	if (remainder === 10) {
		remainder = 0;
	}

	return remainder === Number(cpf[10]);
}

function getCartItems(cart) {
	return Array.isArray(cart?.itens) ? cart.itens : [];
}

function getCartItemPrice(item) {
	return getDiscountedPrice(item?.jogo);
}

function buildPaymentPayload(method, form) {
	if (method === "cartao") {
		return {
			nomeTitular: form.cardholderName.trim(),
			numeroCartao: getDigits(form.cardNumber),
			validade: form.cardExpiry.trim(),
			cvv: getDigits(form.cardCvv),
		};
	}

	if (method === "pix") {
		return {
			nomePagador: form.payerName.trim(),
			documento: getDigits(form.payerDocument),
		};
	}

	return {
		nomeSacado: form.payerName.trim(),
		documento: getDigits(form.payerDocument),
		email: form.payerEmail.trim(),
	};
}

function validatePaymentForm(method, form) {
	if (method === "cartao") {
		if (!form.cardholderName.trim()) {
			return "Informe o nome impresso no cartão.";
		}

		if (!isValidCardNumber(form.cardNumber)) {
			return "Informe um número de cartão válido com 16 dígitos.";
		}

		if (!isValidCardExpiry(form.cardExpiry)) {
			return "Informe uma validade válida no formato MM/AA.";
		}

		if (!isValidCardCvv(form.cardCvv)) {
			return "Informe um CVV válido com 3 ou 4 dígitos.";
		}

		return "";
	}

	if (!form.payerName.trim()) {
		return "Informe o nome do pagador.";
	}

	if (!isValidCpf(form.payerDocument)) {
		return "Informe um CPF válido do pagador.";
	}

	if (method === "boleto" && !form.payerEmail.trim()) {
		return "Informe o e-mail para receber o boleto.";
	}

	return "";
}

export default function Checkout() {
	const navigate = useNavigate();
	const [catalogGames, setCatalogGames] = useState(() => getStoredPublicGames());
	const [cart, setCart] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("cartao");
	const [paymentForm, setPaymentForm] = useState(INITIAL_PAYMENT_FORM);
	const [completedSale, setCompletedSale] = useState(null);
	const [paymentResult, setPaymentResult] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	const items = useMemo(() => getCartItems(cart), [cart]);
	const subtotal = useMemo(() => {
		return items.reduce((total, item) => total + getCartItemPrice(item), 0);
	}, [items]);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "auto",
		});
	}, []);

	useEffect(() => {
		let isMounted = true;

		async function loadCheckoutData() {
			setIsLoading(true);

			try {
				const [cartData, publicGames] = await Promise.all([
					getCart(),
					getPublicGames().catch(() => getStoredPublicGames()),
				]);

				if (!isMounted) {
					return;
				}

				setCart(cartData);
				setCatalogGames(Array.isArray(publicGames) ? publicGames : []);
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setPopupState({
					open: true,
					title: "Não foi possível carregar o checkout",
					message:
						error?.message ||
						"Tente novamente em instantes para revisar seus itens.",
				});
			} finally {
				if (!isMounted) {
					return;
				}

				setIsLoading(false);
			}
		}

		loadCheckoutData();

		return () => {
			isMounted = false;
		};
	}, []);

	function closePopup() {
		setPopupState({
			open: false,
			title: "",
			message: "",
		});
	}

	function updatePaymentField(fieldName, value) {
		let normalizedValue = value;

		if (fieldName === "cardNumber") {
			normalizedValue = maskCardNumber(value);
		}

		if (fieldName === "cardExpiry") {
			normalizedValue = maskCardExpiry(value);
		}

		if (fieldName === "cardCvv") {
			normalizedValue = maskCardCvv(value);
		}

		if (fieldName === "payerDocument") {
			normalizedValue = maskCpf(value);
		}

		setPaymentForm((current) => ({
			...current,
			[fieldName]: normalizedValue,
		}));
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!items.length) {
			setPopupState({
				open: true,
				title: "Seu carrinho está vazio",
				message: "Adicione um jogo antes de seguir com o pagamento.",
			});
			return;
		}

		const validationMessage = validatePaymentForm(paymentMethod, paymentForm);

		if (validationMessage) {
			setPopupState({
				open: true,
				title: "Pagamento incompleto",
				message: validationMessage,
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const payResponse = await pay({
				metodo: paymentMethod,
				dados: buildPaymentPayload(paymentMethod, paymentForm),
			});

			const checkoutResponse = await checkout();

			if (!checkoutResponse?.venda) {
				setPopupState({
					open: true,
					title: "Não foi possível concluir a compra",
					message:
						checkoutResponse?.message ||
						"O checkout não retornou uma venda válida. Tente novamente.",
				});
				return;
			}

			setPaymentResult(payResponse?.resultado ?? null);
			setCompletedSale(checkoutResponse.venda);
			setCart(null);
			window.dispatchEvent(new Event("nexgames:cart-updated"));
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível concluir a compra",
				message:
					error?.message ||
					"Ocorreu um erro ao processar o pagamento. Tente novamente.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
			<TopHeader />
			<Header games={catalogGames} />

			<main className="pb-[var(--section-spacing-large)]">
				<div className="app-container py-8">
					<nav
						aria-label="Breadcrumb"
						className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-muted-color)]"
					>
						<Link
							to="/"
							className="transition hover:text-[color:var(--text-primary-color)]"
						>
							Home
						</Link>
						<ChevronRight size={16} />
						<Link
							to="/cart"
							className="transition hover:text-[color:var(--text-primary-color)]"
						>
							Carrinho
						</Link>
						<ChevronRight size={16} />
						<span className="text-[color:var(--text-primary-color)]">
							Checkout
						</span>
					</nav>

					{isLoading ? (
						<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
							<div className="h-[540px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-color)]" />
							<div className="h-[420px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-color)]" />
						</div>
					) : completedSale ? (
						<section
							className="grid gap-6 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 md:p-8"
							style={{ boxShadow: "var(--shadow-soft)" }}
						>
							<div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--secondary-color)]">
								<BadgeCheck size={28} />
							</div>

							<div className="grid gap-3">
								<span className="text-xs font-black uppercase tracking-[0.08em] text-[color:var(--secondary-color)]">
									Compra concluída
								</span>
								<h1 className="m-0 text-3xl font-black text-[color:var(--text-primary-color)]">
									Pagamento confirmado com sucesso
								</h1>
								<p className="m-0 max-w-3xl text-sm leading-7 text-[color:var(--text-muted-color)]">
									Sua compra foi concluída e os itens já seguiram para o fluxo de
									liberação digital. Você pode consultar os detalhes na sua área
									de pedidos.
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div className="rounded-[var(--radius-medium)] bg-[color:var(--surface-soft-color)] px-4 py-4">
									<span className="block text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Pedido
									</span>
									<strong className="mt-2 block text-lg text-[color:var(--text-primary-color)]">
										#{completedSale.id}
									</strong>
								</div>

								<div className="rounded-[var(--radius-medium)] bg-[color:var(--surface-soft-color)] px-4 py-4">
									<span className="block text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Total
									</span>
									<strong className="mt-2 block text-lg text-[color:var(--text-primary-color)]">
										{formatCurrency(completedSale.valorTotal)}
									</strong>
								</div>

								<div className="rounded-[var(--radius-medium)] bg-[color:var(--surface-soft-color)] px-4 py-4">
									<span className="block text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Método
									</span>
									<strong className="mt-2 block text-lg text-[color:var(--text-primary-color)]">
										{paymentResult?.metodo || paymentMethod}
									</strong>
								</div>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<PrimaryButton onClick={() => navigate("/account/orders")}>
									Ver meus pedidos
								</PrimaryButton>

								<SecondaryButton onClick={() => navigate("/")}>
									Voltar para a loja
								</SecondaryButton>
							</div>
						</section>
					) : !items.length ? (
						<section
							className="rounded-[var(--radius-large)] border border-dashed border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-6 py-10 text-center"
							style={{ boxShadow: "var(--shadow-soft)" }}
						>
							<h1 className="text-2xl font-black text-[color:var(--text-primary-color)]">
								Seu carrinho está vazio
							</h1>
							<p className="mt-3 text-sm leading-7 text-[color:var(--text-muted-color)]">
								Adicione jogos ao carrinho antes de seguir para o checkout.
							</p>
							<div className="mt-6 flex justify-center">
								<PrimaryButton onClick={() => navigate("/")}>
									Voltar para a loja
								</PrimaryButton>
							</div>
						</section>
					) : (
						<form
							onSubmit={handleSubmit}
							className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
						>
							<section
								className="grid gap-6 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 md:p-8"
								style={{ boxShadow: "var(--shadow-soft)" }}
							>
								<div className="grid gap-3">
									<span className="text-xs font-black uppercase tracking-[0.08em] text-[color:var(--secondary-color)]">
										Finalização segura
									</span>
									<h1 className="m-0 text-3xl font-black text-[color:var(--text-primary-color)]">
										Escolha a forma de pagamento
									</h1>
									<p className="m-0 text-sm leading-7 text-[color:var(--text-muted-color)]">
										Seu checkout usa o carrinho ativo da NexGames. Assim que o
										pagamento for confirmado, a compra será concluída.
									</p>
								</div>

								<div className="grid gap-4 md:grid-cols-3">
									{PAYMENT_METHODS.map((method) => {
										const Icon = method.icon;
										const isActive = paymentMethod === method.id;

										return (
											<button
												key={method.id}
												type="button"
												onClick={() => setPaymentMethod(method.id)}
												className={`grid gap-2 rounded-[var(--radius-large)] border p-4 text-left transition ${
													isActive
														? "border-[color:var(--primary-color)] bg-[color:var(--primary-soft-color)]"
														: "border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] hover:border-[color:var(--primary-color)]"
												}`}
											>
												<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-color)] text-[color:var(--primary-color)]">
													<Icon size={18} />
												</div>
												<strong className="text-base text-[color:var(--text-primary-color)]">
													{method.label}
												</strong>
												<span className="text-sm leading-6 text-[color:var(--text-muted-color)]">
													{method.description}
												</span>
											</button>
										);
									})}
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									{paymentMethod === "cartao" ? (
										<>
											<label className="grid gap-2 md:col-span-2">
												<span className="text-sm font-semibold">
													Nome impresso no cartão
												</span>
												<input
													type="text"
													autoComplete="cc-name"
													value={paymentForm.cardholderName}
													onChange={(event) =>
														updatePaymentField(
															"cardholderName",
															event.target.value
														)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>

											<label className="grid gap-2 md:col-span-2">
												<span className="text-sm font-semibold">
													Número do cartão
												</span>
												<input
													type="text"
													inputMode="numeric"
													autoComplete="cc-number"
													maxLength={19}
													placeholder="0000 0000 0000 0000"
													value={paymentForm.cardNumber}
													onChange={(event) =>
														updatePaymentField(
															"cardNumber",
															event.target.value
														)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>

											<label className="grid gap-2">
												<span className="text-sm font-semibold">Validade</span>
												<input
													type="text"
													inputMode="numeric"
													autoComplete="cc-exp"
													maxLength={5}
													placeholder="MM/AA"
													value={paymentForm.cardExpiry}
													onChange={(event) =>
														updatePaymentField(
															"cardExpiry",
															event.target.value
														)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>

											<label className="grid gap-2">
												<span className="text-sm font-semibold">CVV</span>
												<input
													type="text"
													inputMode="numeric"
													autoComplete="cc-csc"
													maxLength={4}
													placeholder="123"
													value={paymentForm.cardCvv}
													onChange={(event) =>
														updatePaymentField("cardCvv", event.target.value)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>
										</>
									) : (
										<>
											<label className="grid gap-2 md:col-span-2">
												<span className="text-sm font-semibold">
													Nome do pagador
												</span>
												<input
													type="text"
													value={paymentForm.payerName}
													onChange={(event) =>
														updatePaymentField("payerName", event.target.value)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>

											<label className="grid gap-2">
												<span className="text-sm font-semibold">CPF</span>
												<input
													type="text"
													inputMode="numeric"
													maxLength={14}
													placeholder="000.000.000-00"
													value={paymentForm.payerDocument}
													onChange={(event) =>
														updatePaymentField(
															"payerDocument",
															event.target.value
														)
													}
													className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
												/>
											</label>

											{paymentMethod === "boleto" ? (
												<label className="grid gap-2">
													<span className="text-sm font-semibold">
														E-mail para recebimento
													</span>
													<input
														type="email"
														value={paymentForm.payerEmail}
														onChange={(event) =>
															updatePaymentField(
																"payerEmail",
																event.target.value
															)
														}
														className="h-[52px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
													/>
												</label>
											) : (
												<div className="grid content-center rounded-[var(--radius-large)] border border-dashed border-[color:var(--border-color)] px-4 py-4 text-sm leading-6 text-[color:var(--text-muted-color)]">
													No Pix, a confirmação é simulada e o pedido segue para
													checkout imediatamente.
												</div>
											)}
										</>
									)}
								</div>

								<div className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-5 py-4">
									<div className="flex items-start gap-3">
										<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-color)] text-[color:var(--secondary-color)]">
											<ShieldCheck size={18} />
										</div>
										<div className="grid gap-1">
											<strong className="text-sm text-[color:var(--text-primary-color)]">
												Compra protegida
											</strong>
											<p className="m-0 text-sm leading-6 text-[color:var(--text-muted-color)]">
												Depois da confirmação do pagamento, o backend conclui a
												venda usando o carrinho ativo da sua conta.
											</p>
										</div>
									</div>
								</div>
							</section>

							<aside
								className="grid content-start gap-5 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-5"
								style={{ boxShadow: "var(--shadow-soft)" }}
							>
								<div className="grid gap-1">
									<span className="text-xs font-black uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Resumo do pedido
									</span>
									<h2 className="m-0 text-2xl font-black text-[color:var(--text-primary-color)]">
										{items.length} {items.length === 1 ? "item" : "itens"}
									</h2>
								</div>

								<div className="grid gap-3">
									{items.map((item, index) => (
										<div
											key={item.id ?? `${item.fkJogo}-${index}`}
											className="rounded-[var(--radius-medium)] border border-[color:var(--border-light-color)] bg-[color:var(--surface-soft-color)] px-4 py-4"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<strong className="block text-sm text-[color:var(--text-primary-color)]">
														{item?.jogo?.nome || `Jogo #${item.fkJogo}`}
													</strong>
													<span className="mt-1 block text-xs text-[color:var(--text-muted-color)]">
														{item?.jogo?.categoria || "Jogo digital"}
													</span>
												</div>

												<strong className="text-sm text-[color:var(--text-primary-color)]">
													{formatCurrency(getCartItemPrice(item))}
												</strong>
											</div>
										</div>
									))}
								</div>

								<div className="grid gap-3 border-t border-[color:var(--border-color)] pt-4 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-[color:var(--text-muted-color)]">
											Subtotal
										</span>
										<strong>{formatCurrency(subtotal)}</strong>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-[color:var(--text-muted-color)]">
											Entrega
										</span>
										<strong>Digital imediata</strong>
									</div>
								</div>

								<div className="rounded-[var(--radius-medium)] bg-[color:var(--surface-soft-color)] px-4 py-4">
									<div className="flex items-center justify-between gap-3">
										<span className="text-sm font-semibold text-[color:var(--text-muted-color)]">
											Total do pedido
										</span>
										<strong className="text-[28px] font-black leading-none text-[color:var(--text-primary-color)]">
											{formatCurrency(subtotal)}
										</strong>
									</div>
								</div>

								<div className="grid gap-3">
									<PrimaryButton type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Processando..." : "Pagar e concluir compra"}
									</PrimaryButton>

									<SecondaryButton
										type="button"
										onClick={() => navigate("/cart")}
									>
										Voltar para o carrinho
									</SecondaryButton>
								</div>
							</aside>
						</form>
					)}
				</div>
			</main>

			<Footer />

			<FeedbackPopup
				open={popupState.open}
				title={popupState.title}
				message={popupState.message}
				onClose={closePopup}
			/>
		</div>
	);
}
