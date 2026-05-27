import { useEffect, useState } from "react";
import { ReceiptText } from "lucide-react";
import { getSales } from "../../../../services/saleService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import { formatCurrency } from "../../../helpers/currency";

function formatSaleDate(dateValue) {
	if (!dateValue) {
		return "Data indisponível";
	}

	try {
		return new Intl.DateTimeFormat("pt-BR", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(dateValue));
	} catch {
		return dateValue;
	}
}

export default function Order() {
	const [sales, setSales] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		let isMounted = true;

		async function loadSales() {
			setIsLoading(true);

			try {
				const data = await getSales();

				if (!isMounted) {
					return;
				}

				setSales(Array.isArray(data) ? data : []);
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setPopupState({
					open: true,
					title: "Não foi possível carregar seus pedidos",
					message:
						error?.message ||
						"Tente novamente em instantes para consultar seu histórico.",
				});
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadSales();

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

	if (isLoading) {
		return (
			<div className="grid gap-4">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="h-[132px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]"
					/>
				))}
			</div>
		);
	}

	if (!sales.length) {
		return (
			<>
				<section className="rounded-[var(--radius-large)] border border-dashed border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] px-6 py-10 text-center">
					<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
						Você ainda não possui pedidos
					</h2>
					<p className="mt-3 text-sm leading-7 text-[color:var(--text-muted-color)]">
						Assim que você concluir uma compra, ela aparecerá aqui com os detalhes da venda.
					</p>
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
			<div className="grid gap-4">
				{sales.map((sale) => (
					<article
						key={sale.id}
						className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5 md:grid-cols-[auto_minmax(0,1fr)_auto]"
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
							<ReceiptText size={22} />
						</div>

						<div>
							<h2 className="text-lg font-black text-[color:var(--text-primary-color)]">
								Pedido #{sale.id}
							</h2>
							<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
								Realizado em {formatSaleDate(sale.data)}.
							</p>

							<div className="mt-3 flex flex-wrap gap-3 text-sm">
								<span className="rounded-full bg-[color:var(--surface-color)] px-3 py-1 text-[color:var(--text-muted-color)]">
									{sale.quantidade} item(ns)
								</span>
								<span className="rounded-full bg-[color:var(--surface-color)] px-3 py-1 text-[color:var(--text-muted-color)]">
									Venda concluída
								</span>
							</div>
						</div>

						<div className="flex items-center justify-between gap-4 md:block md:text-right">
							<span className="block text-sm text-[color:var(--text-muted-color)]">
								Valor total
							</span>
							<strong className="text-xl font-black text-[color:var(--text-primary-color)]">
								{formatCurrency(sale.valorTotal)}
							</strong>
						</div>
					</article>
				))}
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
