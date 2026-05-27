import { useEffect, useState } from "react";
import { BookOpen, KeyRound, Save, ShieldCheck } from "lucide-react";
import { changePassword, getSessionUser } from "../../../../services/authService";
import { getMyGames, getUserById, updateUser } from "../../../../services/userService";
import FeedbackPopup from "../../../components/FeedbackPopup";
import PrimaryButton from "../../../components/shared/PrimaryButton";

const INITIAL_PROFILE_FORM = {
	nome: "",
	email: "",
	dataNascimento: "",
	fkPerfil: null,
};

const INITIAL_PASSWORD_FORM = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

function formatDateToInput(dateValue) {
	if (!dateValue) {
		return "";
	}

	const [day, month, year] = dateValue.split("/");

	if (!day || !month || !year) {
		return "";
	}

	return `${year}-${month}-${day}`;
}

function formatDateToApi(dateValue) {
	if (!dateValue) {
		return undefined;
	}

	const [year, month, day] = dateValue.split("-");

	if (!day || !month || !year) {
		return undefined;
	}

	return `${day}/${month}/${year}`;
}

export default function MyAccount() {
	const sessionUser = getSessionUser();
	const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM);
	const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
	const [libraryCount, setLibraryCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [isSavingPassword, setIsSavingPassword] = useState(false);
	const [popupState, setPopupState] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		let isMounted = true;

		async function loadAccountData() {
			if (!sessionUser?.id) {
				return;
			}

			setIsLoading(true);

			try {
				const [user, myGames] = await Promise.all([
					getUserById(sessionUser.id),
					getMyGames().catch(() => []),
				]);

				if (!isMounted) {
					return;
				}

				setProfileForm({
					nome: user?.nome ?? "",
					email: user?.email ?? "",
					dataNascimento: formatDateToInput(user?.dataNascimento),
					fkPerfil: user?.fkPerfil ?? null,
				});
				setLibraryCount(Array.isArray(myGames) ? myGames.length : 0);
			} catch (error) {
				if (!isMounted) {
					return;
				}

				setPopupState({
					open: true,
					title: "Não foi possível carregar sua conta",
					message:
						error?.message ||
						"Tente atualizar a página para buscar seus dados novamente.",
				});
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		loadAccountData();

		return () => {
			isMounted = false;
		};
	}, [sessionUser?.id]);

	function closePopup() {
		setPopupState({
			open: false,
			title: "",
			message: "",
		});
	}

	async function handleProfileSubmit(event) {
		event.preventDefault();

		if (!sessionUser?.id) {
			return;
		}

		setIsSavingProfile(true);

		try {
			const response = await updateUser(sessionUser.id, {
				nome: profileForm.nome.trim(),
				dataNascimento: formatDateToApi(profileForm.dataNascimento),
				fkPerfil: profileForm.fkPerfil,
			});

			setPopupState({
				open: true,
				title: "Dados atualizados",
				message:
					response?.message ||
					"Seus dados da conta foram atualizados com sucesso.",
			});
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível atualizar sua conta",
				message:
					error?.message ||
					"Tente novamente em instantes para salvar seus dados.",
			});
		} finally {
			setIsSavingProfile(false);
		}
	}

	async function handlePasswordSubmit(event) {
		event.preventDefault();

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPopupState({
				open: true,
				title: "Senhas não conferem",
				message: "Confirme a nova senha com o mesmo valor informado acima.",
			});
			return;
		}

		setIsSavingPassword(true);

		try {
			const response = await changePassword({
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			});

			setPasswordForm(INITIAL_PASSWORD_FORM);
			setPopupState({
				open: true,
				title: "Senha atualizada",
				message:
					response?.message ||
					"Sua senha foi alterada com sucesso.",
			});
		} catch (error) {
			setPopupState({
				open: true,
				title: "Não foi possível atualizar a senha",
				message:
					error?.message ||
					"Verifique sua senha atual e tente novamente.",
			});
		} finally {
			setIsSavingPassword(false);
		}
	}

	if (isLoading) {
		return (
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
				<div className="h-[420px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
				<div className="h-[420px] animate-pulse rounded-[var(--radius-large)] bg-[color:var(--surface-soft-color)]" />
			</div>
		);
	}

	return (
		<>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
				<form
					onSubmit={handleProfileSubmit}
					className="grid gap-5 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5"
				>
					<div>
						<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
							Dados da conta
						</h2>
						<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
							Mantenha seu nome e data de nascimento atualizados para uma experiência mais consistente dentro da sua conta.
						</p>
					</div>

					<label className="grid gap-2 text-sm font-semibold">
						<span>Nome completo</span>
						<input
							type="text"
							value={profileForm.nome}
							onChange={(event) =>
								setProfileForm((current) => ({
									...current,
									nome: event.target.value,
								}))
							}
							className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
							required
						/>
					</label>

					<label className="grid gap-2 text-sm font-semibold">
						<span>E-mail</span>
						<input
							type="email"
							value={profileForm.email}
							readOnly
							className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 text-[color:var(--text-muted-color)] outline-none"
						/>
					</label>

					<label className="grid gap-2 text-sm font-semibold">
						<span>Data de nascimento</span>
						<input
							type="date"
							value={profileForm.dataNascimento}
							onChange={(event) =>
								setProfileForm((current) => ({
									...current,
									dataNascimento: event.target.value,
								}))
							}
							className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
						/>
					</label>

					<PrimaryButton
						type="submit"
						icon={Save}
						className="!min-w-0 !w-fit"
						disabled={isSavingProfile}
					>
						{isSavingProfile ? "Salvando..." : "Salvar alterações"}
					</PrimaryButton>
				</form>

				<div className="grid gap-6">
					<section className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5">
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
							<BookOpen size={20} />
						</div>

						<div>
							<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
								Resumo da conta
							</h2>
							<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
								Veja rapidamente seu perfil atual e o tamanho da sua biblioteca digital.
							</p>
						</div>

						<div className="grid gap-3 text-sm">
							<div className="flex items-center justify-between rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-4 py-3">
								<span className="text-[color:var(--text-muted-color)]">Perfil</span>
								<strong>{sessionUser?.perfil || "Cliente"}</strong>
							</div>

							<div className="flex items-center justify-between rounded-[var(--radius-medium)] bg-[color:var(--surface-color)] px-4 py-3">
								<span className="text-[color:var(--text-muted-color)]">Jogos na biblioteca</span>
								<strong>{libraryCount}</strong>
							</div>
						</div>
					</section>

					<form
						onSubmit={handlePasswordSubmit}
						className="grid gap-4 rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-soft-color)] p-5"
					>
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
							<KeyRound size={20} />
						</div>

						<div>
							<h2 className="text-xl font-black text-[color:var(--text-primary-color)]">
								Segurança
							</h2>
							<p className="mt-2 text-sm leading-7 text-[color:var(--text-muted-color)]">
								Altere sua senha para manter sua conta protegida.
							</p>
						</div>

						<label className="grid gap-2 text-sm font-semibold">
							<span>Senha atual</span>
							<input
								type="password"
								value={passwordForm.currentPassword}
								onChange={(event) =>
									setPasswordForm((current) => ({
										...current,
										currentPassword: event.target.value,
									}))
								}
								className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
								required
							/>
						</label>

						<label className="grid gap-2 text-sm font-semibold">
							<span>Nova senha</span>
							<input
								type="password"
								value={passwordForm.newPassword}
								onChange={(event) =>
									setPasswordForm((current) => ({
										...current,
										newPassword: event.target.value,
									}))
								}
								className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
								required
							/>
						</label>

						<label className="grid gap-2 text-sm font-semibold">
							<span>Confirmar nova senha</span>
							<input
								type="password"
								value={passwordForm.confirmPassword}
								onChange={(event) =>
									setPasswordForm((current) => ({
										...current,
										confirmPassword: event.target.value,
									}))
								}
								className="h-12 rounded-[var(--radius-medium)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-4 outline-none transition focus:border-[color:var(--primary-color)]"
								required
							/>
						</label>

						<PrimaryButton
							type="submit"
							icon={ShieldCheck}
							className="!min-w-0 !w-fit"
							disabled={isSavingPassword}
						>
							{isSavingPassword ? "Atualizando..." : "Atualizar senha"}
						</PrimaryButton>
					</form>
				</div>
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
