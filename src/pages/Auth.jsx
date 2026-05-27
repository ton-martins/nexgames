import { useEffect, useState } from "react";
import {
	ChevronRight,
	Eye,
	EyeOff,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSessionUser, login, register } from "../../services/authService";
import {
	getPublicGames,
	getStoredPublicGames,
} from "../../services/gameService";
import Footer from "../components/Footer";
import Header from "../components/Header";
import RecommendedProducts from "../components/RecommendedProducts";
import TopHeader from "../components/TopHeader";
import PrimaryButton from "../components/shared/PrimaryButton";

const INITIAL_LOGIN_FORM = {
	email: "",
	senha: "",
};

const INITIAL_REGISTER_FORM = {
	nome: "",
	email: "",
	senha: "",
	confirmarSenha: "",
	dataNascimento: "",
};

function buildRedirectFromLocationState(state) {
	if (typeof state?.redirectTo === "string" && state.redirectTo.startsWith("/")) {
		return state.redirectTo;
	}

	if (state?.from?.pathname) {
		const search = state.from.search || "";
		const hash = state.from.hash || "";
		return `${state.from.pathname}${search}${hash}`;
	}

	return "";
}

function findCatalogGameMatch(games, pendingProduct) {
	if (!pendingProduct?.nome || !Array.isArray(games)) {
		return null;
	}

	return (
		games.find(
			(game) =>
				game.nome === pendingProduct.nome &&
				(game.ano === pendingProduct.ano || !game.ano || !pendingProduct.ano)
		) ||
		games.find((game) => game.nome === pendingProduct.nome) ||
		null
	);
}

function formatDateToApi(dateValue) {
	if (!dateValue) {
		return undefined;
	}

	const [year, month, day] = dateValue.split("-");

	if (!year || !month || !day) {
		return undefined;
	}

	return `${day}/${month}/${year}`;
}

export default function Auth() {
	const navigate = useNavigate();
	const location = useLocation();

	const [catalogGames, setCatalogGames] = useState(() => getStoredPublicGames());
	const [loginForm, setLoginForm] = useState(() => ({
		...INITIAL_LOGIN_FORM,
		email: location.state?.registeredEmail || "",
	}));
	const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM);
	const [rememberMe, setRememberMe] = useState(false);
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [showRegisterPassword, setShowRegisterPassword] = useState(false);
	const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
		useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [loginErrorMessage, setLoginErrorMessage] = useState("");
	const [registerErrorMessage, setRegisterErrorMessage] = useState("");
	const [loginSuccessMessage, setLoginSuccessMessage] = useState(
		location.state?.successMessage || ""
	);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "auto",
		});
	}, [location.pathname, location.search]);

	useEffect(() => {
		if (getSessionUser()) {
			navigate("/", { replace: true });
		}
	}, [navigate]);

	useEffect(() => {
		let isMounted = true;

		async function loadCatalogGames() {
			try {
				const games = await getPublicGames();

				if (!isMounted || !Array.isArray(games)) {
					return;
				}

				setCatalogGames(games);
			} catch {
				// Mantém o catálogo disponível no storage quando existir.
			}
		}

		loadCatalogGames();

		return () => {
			isMounted = false;
		};
	}, []);

	async function resolvePostLoginRedirect() {
		const directRedirect = buildRedirectFromLocationState(location.state);

		if (directRedirect) {
			return directRedirect;
		}

		if (!location.state?.pendingProduct) {
			return "/";
		}

		try {
			const games = await getPublicGames({ forceRefresh: true });
			const matchedGame = findCatalogGameMatch(
				games,
				location.state.pendingProduct
			);

			if (matchedGame?.id) {
				return `/product/${matchedGame.id}`;
			}
		} catch {
			return "/";
		}

		return "/";
	}

	async function handleLoginSubmit(event) {
		event.preventDefault();
		setIsLoggingIn(true);
		setLoginErrorMessage("");
		setLoginSuccessMessage("");

		try {
			await login(loginForm);
			const redirectPath = await resolvePostLoginRedirect();
			navigate(redirectPath, { replace: true });
		} catch (error) {
			setLoginErrorMessage(
				error?.message || "Não foi possível entrar. Tente novamente."
			);
		} finally {
			setIsLoggingIn(false);
		}
	}

	async function handleRegisterSubmit(event) {
		event.preventDefault();
		setIsRegistering(true);
		setRegisterErrorMessage("");

		if (registerForm.senha !== registerForm.confirmarSenha) {
			setIsRegistering(false);
			setRegisterErrorMessage("As senhas não conferem.");
			return;
		}

		try {
			await register({
				nome: registerForm.nome.trim(),
				email: registerForm.email.trim(),
				senha: registerForm.senha,
				dataNascimento: formatDateToApi(registerForm.dataNascimento),
			});

			setLoginForm((current) => ({
				...current,
				email: registerForm.email.trim(),
				senha: "",
			}));
			setRegisterForm(INITIAL_REGISTER_FORM);
			setLoginSuccessMessage(
				"Cadastro realizado com sucesso. Agora você já pode entrar."
			);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			setRegisterErrorMessage(
				error?.message || "Não foi possível concluir o cadastro."
			);
		} finally {
			setIsRegistering(false);
		}
	}

	return (
		<div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
			<TopHeader />
			<Header games={catalogGames} />

			<main className="pb-14 pt-8">
				<div className="app-container">
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
						<span className="text-[color:var(--text-primary-color)]">
							Minha conta
						</span>
					</nav>

					<section className="relative pb-4">
						<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
							<section className="grid max-w-[560px] content-start gap-5">
								<div className="border-b border-[color:var(--border-color)] pb-4">
									<h1 className="m-0 text-[28px] font-medium leading-none lg:text-[30px]">
										Login
									</h1>
									<div className="mt-4 h-[2px] w-[120px] bg-[color:var(--primary-color)]" />
								</div>

								<p className="m-0 text-base leading-7 text-[color:var(--text-muted-color)]">
									Bom te ver de volta. Entre na sua conta para continuar comprando.
								</p>

								{loginErrorMessage ? (
									<div className="rounded-[var(--radius-medium)] border border-[color:var(--danger-color)] bg-[color:color-mix(in srgb,var(--danger-color) 10%,var(--surface-color))] px-4 py-3 text-sm">
										{loginErrorMessage}
									</div>
								) : null}

								{loginSuccessMessage ? (
									<div className="rounded-[var(--radius-medium)] border border-[color:var(--secondary-color)] bg-[color:color-mix(in srgb,var(--secondary-color) 10%,var(--surface-color))] px-4 py-3 text-sm">
										{loginSuccessMessage}
									</div>
								) : null}

								<form className="grid gap-5" onSubmit={handleLoginSubmit}>
									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											E-mail <span aria-hidden="true">*</span>
										</span>
										<input
											type="email"
											value={loginForm.email}
											onChange={(event) =>
												setLoginForm((current) => ({
													...current,
													email: event.target.value,
												}))
											}
											required
											className="h-[48px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
										/>
									</label>

									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											Senha <span aria-hidden="true">*</span>
										</span>
										<div className="relative">
											<input
												type={showLoginPassword ? "text" : "password"}
												value={loginForm.senha}
												onChange={(event) =>
													setLoginForm((current) => ({
														...current,
														senha: event.target.value,
													}))
												}
												required
												className="h-[48px] w-full rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 pr-12 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
											/>

											<button
												type="button"
												onClick={() =>
													setShowLoginPassword((current) => !current)
												}
												aria-label={
													showLoginPassword ? "Ocultar senha" : "Mostrar senha"
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted-color)] transition hover:text-[color:var(--text-primary-color)]"
											>
												{showLoginPassword ? (
													<EyeOff size={18} />
												) : (
													<Eye size={18} />
												)}
											</button>
										</div>
									</label>

									<label className="inline-flex items-center gap-3 text-[15px] font-semibold">
										<input
											type="checkbox"
											checked={rememberMe}
											onChange={(event) => setRememberMe(event.target.checked)}
											className="h-4 w-4 rounded border-[color:var(--border-color)]"
										/>
										<span>Lembrar de mim</span>
									</label>

									<div className="grid gap-4">
										<PrimaryButton
											type="submit"
											disabled={isLoggingIn}
											className="!h-[50px] !min-w-[124px] !w-fit !rounded-full !px-8"
										>
											{isLoggingIn ? "Entrando..." : "Entrar"}
										</PrimaryButton>

										<button
											type="button"
											className="w-fit bg-transparent p-0 text-left text-sm text-[color:var(--text-muted-color)] transition hover:text-[color:var(--text-primary-color)]"
										>
											Esqueceu sua senha?
										</button>
									</div>
								</form>
							</section>

							<section className="grid max-w-[560px] content-start gap-5">
								<div className="border-b border-[color:var(--border-color)] pb-4">
									<h2 className="m-0 text-[28px] font-medium leading-none lg:text-[30px]">
										Cadastro
									</h2>
									<div className="mt-4 h-[2px] w-[120px] bg-[color:var(--primary-color)]" />
								</div>

								<p className="m-0 text-base leading-7 text-[color:var(--text-muted-color)]">
									Crie sua conta agora para aproveitar uma experiência de compra
									personalizada.
								</p>

								{registerErrorMessage ? (
									<div className="rounded-[var(--radius-medium)] border border-[color:var(--danger-color)] bg-[color:color-mix(in srgb,var(--danger-color) 10%,var(--surface-color))] px-4 py-3 text-sm">
										{registerErrorMessage}
									</div>
								) : null}

								<form className="grid gap-5" onSubmit={handleRegisterSubmit}>
									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											Nome completo <span aria-hidden="true">*</span>
										</span>
										<input
											type="text"
											value={registerForm.nome}
											onChange={(event) =>
												setRegisterForm((current) => ({
													...current,
													nome: event.target.value,
												}))
											}
											required
											className="h-[48px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
										/>
									</label>

									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											E-mail <span aria-hidden="true">*</span>
										</span>
										<input
											type="email"
											value={registerForm.email}
											onChange={(event) =>
												setRegisterForm((current) => ({
													...current,
													email: event.target.value,
												}))
											}
											required
											className="h-[48px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
										/>
									</label>

									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											Senha <span aria-hidden="true">*</span>
										</span>
										<div className="relative">
											<input
												type={showRegisterPassword ? "text" : "password"}
												value={registerForm.senha}
												onChange={(event) =>
													setRegisterForm((current) => ({
														...current,
														senha: event.target.value,
													}))
												}
												required
												className="h-[48px] w-full rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 pr-12 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
											/>

											<button
												type="button"
												onClick={() =>
													setShowRegisterPassword((current) => !current)
												}
												aria-label={
													showRegisterPassword
														? "Ocultar senha"
														: "Mostrar senha"
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted-color)] transition hover:text-[color:var(--text-primary-color)]"
											>
												{showRegisterPassword ? (
													<EyeOff size={18} />
												) : (
													<Eye size={18} />
												)}
											</button>
										</div>
									</label>

									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											Confirmar senha <span aria-hidden="true">*</span>
										</span>
										<div className="relative">
											<input
												type={
													showRegisterConfirmPassword
														? "text"
														: "password"
												}
												value={registerForm.confirmarSenha}
												onChange={(event) =>
													setRegisterForm((current) => ({
														...current,
														confirmarSenha: event.target.value,
													}))
												}
												required
												className="h-[48px] w-full rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 pr-12 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
											/>

											<button
												type="button"
												onClick={() =>
													setShowRegisterConfirmPassword(
														(current) => !current
													)
												}
												aria-label={
													showRegisterConfirmPassword
														? "Ocultar confirmação de senha"
														: "Mostrar confirmação de senha"
												}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted-color)] transition hover:text-[color:var(--text-primary-color)]"
											>
												{showRegisterConfirmPassword ? (
													<EyeOff size={18} />
												) : (
													<Eye size={18} />
												)}
											</button>
										</div>
									</label>

									<label className="grid gap-2">
										<span className="text-[15px] font-semibold">
											Data de nascimento
										</span>
										<input
											type="date"
											value={registerForm.dataNascimento}
											onChange={(event) =>
												setRegisterForm((current) => ({
													...current,
													dataNascimento: event.target.value,
												}))
											}
											className="h-[48px] rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] px-5 text-[15px] outline-none transition focus:border-[color:var(--primary-color)]"
										/>
									</label>

									<p className="m-0 text-sm leading-7 text-[color:var(--text-muted-color)]">
										Seus dados pessoais serão usados para melhorar sua experiência
										na loja, gerenciar o acesso à sua conta e apoiar seus pedidos
										na NexGames.
									</p>

									<PrimaryButton
										type="submit"
										disabled={isRegistering}
										className="!h-[50px] !min-w-[148px] !w-fit !rounded-full !px-8"
									>
										{isRegistering ? "Cadastrando..." : "Cadastrar"}
									</PrimaryButton>
								</form>
							</section>
						</div>

						<div className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 lg:block">
							<div className="relative h-full">
								<div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[color:var(--border-color)]" />
								<div className="absolute left-1/2 top-1/2 flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-lg italic text-[color:var(--text-primary-color)]">
									ou
								</div>
							</div>
						</div>
					</section>
				</div>

				<RecommendedProducts games={catalogGames} />
			</main>

			<Footer />
		</div>
	);
}
