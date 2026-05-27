import { useEffect, useState } from "react";
import { Info, Tag } from "lucide-react";
import { getCategories } from "../../../../services/categoryService";
import FeedbackPopup from "../../../components/FeedbackPopup";

export default function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		let isMounted = true;

		async function loadCategories() {
			setIsLoading(true);

			try {
				const data = await getCategories();

				if (!isMounted) {
					return;
				}

				setCategories(Array.isArray(data) ? data : []);
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setPopupState({
					open: true,
					title: "Não foi possível carregar as categorias",
					message:
						error?.message ||
						"Tente novamente em instantes para consultar a estrutura do catálogo.",
				});
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadCategories();

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

	return (
		<>
			<div className="grid gap-6">
				<section className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5">
					<div className="flex items-start gap-4">
						<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
							<Info size={20} />
						</div>

						<div>
							<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
								Estado atual da API
							</h2>
							<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
								A API atual da NexGames expõe categorias apenas para leitura. Assim que o backend publicar rotas de criação, edição e remoção, esta seção pode receber o CRUD completo.
							</p>
						</div>
					</div>
				</section>

				{isLoading ? (
					<div className="h-[260px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				) : (
					<section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
						{categories.map((category) => (
							<article
								key={category.id}
								className="flex items-center gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-4"
							>
								<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--surface-color)] text-[color:var(--primary-color)]">
									<Tag size={18} />
								</div>

								<div>
									<strong className="block text-[color:var(--text-primary-color)]">
										{category.nome}
									</strong>
									<span className="text-sm text-[color:var(--text-muted-color)]">
										ID #{category.id}
									</span>
								</div>
							</article>
						))}
					</section>
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
