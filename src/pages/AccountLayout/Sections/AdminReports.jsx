import { useEffect, useState } from "react";
import { getCompanies } from "../../../../services/companyService";
import { getBestSellingGames } from "../../../../services/reportService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";

export default function AdminReports() {
	const [companies, setCompanies] = useState([]);
	const [reports, setReports] = useState([]);
	const [filters, setFilters] = useState({
		top: "10",
		empresa: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		let isMounted = true;

		async function loadInitialData() {
			setIsLoading(true);

			try {
				const [companiesData, reportsData] = await Promise.all([
					getCompanies(),
					getBestSellingGames({ top: 10 }),
				]);

				if (!isMounted) {
					return;
				}

				setCompanies(Array.isArray(companiesData) ? companiesData : []);
				setReports(Array.isArray(reportsData) ? reportsData : []);
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setPopupState({
					open: true,
					title: "Não foi possível carregar os relatórios",
					message:
						error?.message ||
						"Tente novamente em instantes para acessar os dados de venda.",
				});
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadInitialData();

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

	async function handleFilterSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const data = await getBestSellingGames({
				top: Number(filters.top) || 10,
				empresa: filters.empresa || undefined,
			});

			setReports(Array.isArray(data) ? data : []);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível aplicar o filtro",
				message:
					error?.message ||
					"Tente novamente em instantes para atualizar o relatório.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<div className="grid gap-6">
				<form
					onSubmit={handleFilterSubmit}
					className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5 md:grid-cols-[160px_minmax(0,1fr)_220px]"
				>
					<label className="grid gap-2 text-sm font-semibold">
						<span>Top</span>
						<input
							type="number"
							min="1"
							max="50"
							value={filters.top}
							onChange={(event) =>
								setFilters((current) => ({
									...current,
									top: event.target.value,
								}))
							}
							className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
						/>
					</label>

					<label className="grid gap-2 text-sm font-semibold">
						<span>Empresa</span>
						<select
							value={filters.empresa}
							onChange={(event) =>
								setFilters((current) => ({
									...current,
									empresa: event.target.value,
								}))
							}
							className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
						>
							<option value="">Todas as empresas</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.nome}
								</option>
							))}
						</select>
					</label>

					<div className="flex items-end">
						<PrimaryButton type="submit" className="!min-w-0">
							Atualizar relatório
						</PrimaryButton>
					</div>
				</form>

				{isLoading ? (
					<div className="h-[320px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				) : (
					<div className="overflow-x-auto rounded-[var(--radius-large)] border border-[color:var(--border-color)]">
						<table className="min-w-full border-collapse text-left text-sm">
							<thead className="bg-[color:var(--surface-soft-color)] text-[color:var(--text-muted-color)]">
								<tr>
									<th className="px-4 py-3 font-semibold">Posição</th>
									<th className="px-4 py-3 font-semibold">Jogo</th>
									<th className="px-4 py-3 font-semibold">Empresa</th>
									<th className="px-4 py-3 font-semibold">Total de vendas</th>
								</tr>
							</thead>
							<tbody>
								{reports.map((report, index) => (
									<tr
										key={`${report.nome}-${index}`}
										className="border-t border-[color:var(--border-color)] bg-[color:var(--surface-color)]"
									>
										<td className="px-4 py-4 font-bold text-[color:var(--primary-color)]">
											#{index + 1}
										</td>
										<td className="px-4 py-4">
											<strong className="text-[color:var(--text-primary-color)]">
												{report.nome}
											</strong>
										</td>
										<td className="px-4 py-4 text-[color:var(--text-muted-color)]">
											{report.empresa || "--"}
										</td>
										<td className="px-4 py-4 font-semibold">
											{report.totalVendas}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
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
