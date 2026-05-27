import { useEffect, useState } from "react";
import { PencilLine, Plus, X, Trash2 } from "lucide-react";
import { getCategories } from "../../../../services/categoryService";
import { getCompanies } from "../../../../services/companyService";
import {
	createGame,
	deleteGame,
	getGames,
	getPublicGames,
	updateGame,
} from "../../../../services/gameService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";
import SecondaryButton from "../../../components/shared/SecondaryButton";
import { formatCurrency } from "../../../helpers/currency";

const INITIAL_FORM = {
	nome: "",
	descricao: "",
	ano: "",
	preco: "",
	desconto: "",
	fkEmpresa: "",
	fkCategoria: "",
};

const inputClassName =
	"h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 text-sm outline-none transition focus:border-[color:var(--primary-color)]";

export default function AdminGames() {
	const [games, setGames] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [categories, setCategories] = useState([]);
	const [form, setForm] = useState(INITIAL_FORM);
	const [editingId, setEditingId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [removingId, setRemovingId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		setIsLoading(true);

		try {
			const [gamesData, companiesData, categoriesData] = await Promise.all([
				getGames(),
				getCompanies(),
				getCategories(),
			]);

			setGames(Array.isArray(gamesData) ? gamesData : []);
			setCompanies(Array.isArray(companiesData) ? companiesData : []);
			setCategories(Array.isArray(categoriesData) ? categoriesData : []);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível carregar a gestão de jogos",
				message:
					error?.message ||
					"Tente novamente em instantes para acessar o catálogo administrativo.",
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

	function resetForm() {
		setForm(INITIAL_FORM);
		setEditingId(null);
	}

	function closeModal() {
		setIsModalOpen(false);
		resetForm();
	}

	function openCreateModal() {
		resetForm();
		setIsModalOpen(true);
	}

	function openEditModal(game) {
		setEditingId(game.id);
		setForm({
			nome: game.nome ?? "",
			descricao: game.descricao ?? "",
			ano: game.ano ? String(game.ano) : "",
			preco: game.preco ? String(game.preco) : "",
			desconto: game.desconto ? String(game.desconto) : "",
			fkEmpresa: game.fkEmpresa ? String(game.fkEmpresa) : "",
			fkCategoria: game.fkCategoria ? String(game.fkCategoria) : "",
		});
		setIsModalOpen(true);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setIsSubmitting(true);

		const payload = {
			nome: form.nome.trim(),
			descricao: form.descricao.trim(),
			ano: form.ano ? Number(form.ano) : null,
			preco: Number(form.preco),
			desconto: form.desconto ? Number(form.desconto) : 0,
			fkEmpresa: Number(form.fkEmpresa),
			fkCategoria: Number(form.fkCategoria),
		};

		try {
			const wasEditing = Boolean(editingId);

			if (wasEditing) {
				await updateGame(editingId, payload);
			} else {
				await createGame(payload);
			}

			await getPublicGames({ forceRefresh: true }).catch(() => []);
			await loadData();
			closeModal();
			setPopupState({
				open: true,
				title: wasEditing ? "Jogo atualizado" : "Jogo cadastrado",
				message: wasEditing
					? "As informações do jogo foram atualizadas com sucesso."
					: "O novo jogo foi cadastrado com sucesso no catálogo.",
			});
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível salvar o jogo",
				message:
					error?.message ||
					"Revise os dados informados e tente novamente.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDelete(game) {
		if (!window.confirm(`Deseja remover o jogo "${game.nome}"?`)) {
			return;
		}

		setRemovingId(game.id);

		try {
			await deleteGame(game.id);
			await getPublicGames({ forceRefresh: true }).catch(() => []);
			await loadData();

			if (editingId === game.id) {
				closeModal();
			}
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível remover o jogo",
				message:
					error?.message ||
					"Tente novamente em instantes para excluir este item.",
			});
		} finally {
			setRemovingId(null);
		}
	}

	return (
		<>
			<section className="grid content-start gap-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-xl font-black">Jogos cadastrados</h2>
						<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
							Total atual no painel: {games.length} jogo(s).
						</p>
					</div>

					<PrimaryButton
						icon={Plus}
						className="!min-w-0 !w-fit"
						onClick={openCreateModal}
					>
						Cadastrar jogo
					</PrimaryButton>
				</div>

				{isLoading ? (
					<div className="h-[360px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				) : (
					<div className="overflow-x-auto rounded-[var(--radius-large)] border border-[color:var(--border-color)]">
						<table className="min-w-full border-collapse text-left text-sm">
							<thead className="bg-[color:var(--surface-soft-color)] text-[color:var(--text-muted-color)]">
								<tr>
									<th className="px-4 py-3 font-semibold">Jogo</th>
									<th className="px-4 py-3 font-semibold">Ano</th>
									<th className="px-4 py-3 font-semibold">Preço</th>
									<th className="px-4 py-3 font-semibold">Desconto</th>
									<th className="px-4 py-3 font-semibold">Ações</th>
								</tr>
							</thead>
							<tbody>
								{games.map((game) => (
									<tr
										key={game.id}
										className="border-t border-[color:var(--border-color)] bg-[color:var(--surface-color)]"
									>
										<td className="px-4 py-4">
											<div>
												<strong className="block text-[color:var(--text-primary-color)]">
													{game.nome}
												</strong>
												<span className="block text-xs text-[color:var(--text-muted-color)]">
													ID #{game.id}
												</span>
											</div>
										</td>
										<td className="px-4 py-4">{game.ano || "--"}</td>
										<td className="px-4 py-4">{formatCurrency(game.preco)}</td>
										<td className="px-4 py-4">
											{game.desconto ? `${game.desconto}%` : "--"}
										</td>
										<td className="px-4 py-4">
											<div className="flex flex-wrap gap-2">
												<button
													type="button"
													onClick={() => openEditModal(game)}
													className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-soft-color)] px-3 py-2 text-xs font-semibold text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-soft-color)]"
												>
													<PencilLine size={14} />
													Editar
												</button>
												<button
													type="button"
													onClick={() => handleDelete(game)}
													disabled={removingId === game.id}
													className="inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in srgb,var(--danger-color) 12%,var(--surface-color))] px-3 py-2 text-xs font-semibold text-[color:var(--danger-color)] transition hover:bg-[color:color-mix(in srgb,var(--danger-color) 18%,var(--surface-color))]"
												>
													<Trash2 size={14} />
													{removingId === game.id ? "Removendo..." : "Excluir"}
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>

			{isModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
					<div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 shadow-[var(--shadow-large)]">
						<div className="mb-5 flex items-start justify-between gap-4 border-b border-[color:var(--border-color)] pb-4">
							<div>
								<h3 className="text-2xl font-black text-[color:var(--text-primary-color)]">
									{editingId ? "Editar jogo" : "Cadastrar jogo"}
								</h3>
								<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
									{editingId
										? "Atualize os dados do jogo selecionado."
										: "Preencha os campos para publicar um novo jogo na NexGames."}
								</p>
							</div>

							<button
								type="button"
								onClick={closeModal}
								aria-label="Fechar modal"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-soft-color)] text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-soft-color)]"
							>
								<X size={18} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="grid gap-4">
							<label className="grid gap-2 text-sm font-semibold">
								<span>Nome</span>
								<input
									type="text"
									value={form.nome}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											nome: event.target.value,
										}))
									}
									className={inputClassName}
									required
								/>
							</label>

							<label className="grid gap-2 text-sm font-semibold">
								<span>Descrição</span>
								<textarea
									value={form.descricao}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											descricao: event.target.value,
										}))
									}
									className="min-h-[120px] rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 py-3 text-sm outline-none transition focus:border-[color:var(--primary-color)]"
									required
								/>
							</label>

							<div className="grid gap-4 md:grid-cols-2">
								<label className="grid gap-2 text-sm font-semibold">
									<span>Ano</span>
									<input
										type="number"
										value={form.ano}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												ano: event.target.value,
											}))
										}
										className={inputClassName}
										required
									/>
								</label>

								<label className="grid gap-2 text-sm font-semibold">
									<span>Preço</span>
									<input
										type="number"
										step="0.01"
										min="0"
										value={form.preco}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												preco: event.target.value,
											}))
										}
										className={inputClassName}
										required
									/>
								</label>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<label className="grid gap-2 text-sm font-semibold">
									<span>Desconto (%)</span>
									<input
										type="number"
										min="0"
										max="100"
										value={form.desconto}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												desconto: event.target.value,
											}))
										}
										className={inputClassName}
									/>
								</label>

								<label className="grid gap-2 text-sm font-semibold">
									<span>Empresa</span>
									<select
										value={form.fkEmpresa}
										onChange={(event) =>
											setForm((current) => ({
												...current,
												fkEmpresa: event.target.value,
											}))
										}
										className={inputClassName}
										required
									>
										<option value="">Selecione</option>
										{companies.map((company) => (
											<option key={company.id} value={company.id}>
												{company.nome}
											</option>
										))}
									</select>
								</label>
							</div>

							<label className="grid gap-2 text-sm font-semibold">
								<span>Categoria</span>
								<select
									value={form.fkCategoria}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											fkCategoria: event.target.value,
										}))
									}
									className={inputClassName}
									required
								>
									<option value="">Selecione</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.nome}
										</option>
									))}
								</select>
							</label>

							<div className="mt-2 grid gap-3 sm:grid-cols-2">
								<PrimaryButton
									type="submit"
									icon={Plus}
									className="!min-w-0"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Salvando..."
										: editingId
											? "Salvar edição"
											: "Cadastrar jogo"}
								</PrimaryButton>

								<SecondaryButton
									className="!min-w-0"
									onClick={closeModal}
								>
									Cancelar
								</SecondaryButton>
							</div>
						</form>
					</div>
				</div>
			) : null}

			<FeedbackPopup
				open={popupState.open}
				title={popupState.title}
				message={popupState.message}
				onClose={closePopup}
			/>
		</>
	);
}
