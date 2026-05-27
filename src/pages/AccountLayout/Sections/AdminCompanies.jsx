import { useEffect, useState } from "react";
import { PencilLine, Plus, Trash2, X } from "lucide-react";
import {
	createCompany,
	deleteCompany,
	getCompanies,
	updateCompany,
} from "../../../../services/companyService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";
import SecondaryButton from "../../../components/shared/SecondaryButton";

const inputClassName =
	"h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 text-sm outline-none transition focus:border-[color:var(--primary-color)]";

export default function AdminCompanies() {
	const [companies, setCompanies] = useState([]);
	const [name, setName] = useState("");
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
		loadCompanies();
	}, []);

	async function loadCompanies() {
		setIsLoading(true);

		try {
			const data = await getCompanies();
			setCompanies(Array.isArray(data) ? data : []);
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível carregar as empresas",
				message:
					error?.message ||
					"Tente novamente em instantes para consultar a lista.",
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
		setName("");
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

	function openEditModal(company) {
		setEditingId(company.id);
		setName(company.nome);
		setIsModalOpen(true);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const wasEditing = Boolean(editingId);

			if (wasEditing) {
				await updateCompany(editingId, { nome: name.trim() });
			} else {
				await createCompany({ nome: name.trim() });
			}

			await loadCompanies();
			closeModal();
			setPopupState({
				open: true,
				title: wasEditing ? "Empresa atualizada" : "Empresa cadastrada",
				message: wasEditing
					? "Os dados da empresa foram atualizados com sucesso."
					: "A nova empresa foi cadastrada com sucesso.",
			});
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível salvar a empresa",
				message:
					error?.message ||
					"Tente novamente em instantes para salvar este cadastro.",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDelete(company) {
		if (!window.confirm(`Deseja remover a empresa "${company.nome}"?`)) {
			return;
		}

		setRemovingId(company.id);

		try {
			await deleteCompany(company.id);
			await loadCompanies();

			if (editingId === company.id) {
				closeModal();
			}
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível remover a empresa",
				message:
					error?.message ||
					"Tente novamente em instantes para concluir a exclusão.",
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
						<h2 className="text-xl font-black">Empresas cadastradas</h2>
						<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
							Total atual no painel: {companies.length} empresa(s).
						</p>
					</div>

					<PrimaryButton
						icon={Plus}
						className="!min-w-0 !w-fit"
						onClick={openCreateModal}
					>
						Cadastrar empresa
					</PrimaryButton>
				</div>

				{isLoading ? (
					<div className="h-[260px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				) : (
					<div className="grid gap-3">
						{companies.map((company) => (
							<article
								key={company.id}
								className="flex flex-col gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div>
									<strong className="block text-[color:var(--text-primary-color)]">
										{company.nome}
									</strong>
									<span className="text-sm text-[color:var(--text-muted-color)]">
										ID #{company.id}
									</span>
								</div>

								<div className="flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => openEditModal(company)}
										className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-color)] px-3 py-2 text-xs font-semibold text-[color:var(--text-primary-color)] transition hover:bg-[color:var(--primary-soft-color)]"
									>
										<PencilLine size={14} />
										Editar
									</button>

									<button
										type="button"
										onClick={() => handleDelete(company)}
										disabled={removingId === company.id}
										className="inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in srgb,var(--danger-color) 12%,var(--surface-color))] px-3 py-2 text-xs font-semibold text-[color:var(--danger-color)] transition hover:bg-[color:color-mix(in srgb,var(--danger-color) 18%,var(--surface-color))]"
									>
										<Trash2 size={14} />
										{removingId === company.id ? "Removendo..." : "Excluir"}
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</section>

			{isModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
					<div className="w-full max-w-xl rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-6 shadow-[var(--shadow-large)]">
						<div className="mb-5 flex items-start justify-between gap-4 border-b border-[color:var(--border-color)] pb-4">
							<div>
								<h3 className="text-2xl font-black text-[color:var(--text-primary-color)]">
									{editingId ? "Editar empresa" : "Cadastrar empresa"}
								</h3>
								<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
									{editingId
										? "Atualize o nome da empresa selecionada."
										: "Cadastre um novo estúdio ou publisher para vincular aos jogos."}
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
								<span>Nome da empresa</span>
								<input
									type="text"
									value={name}
									onChange={(event) => setName(event.target.value)}
									className={inputClassName}
									required
								/>
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
											: "Cadastrar empresa"}
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
