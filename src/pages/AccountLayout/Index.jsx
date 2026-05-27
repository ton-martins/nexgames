import { useEffect, useMemo, useState } from "react";
import {
	BarChart3,
	Building2,
	Gamepad2,
	Heart,
	LayoutDashboard,
	LogOut,
	Package,
	ShoppingCart,
	Tag,
	UserCircle2,
} from "lucide-react";
import {
	Link,
	NavLink,
	Outlet,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { getSessionUser, isAdmin, logout } from "../../../services/authService";
import {
	getPublicGames,
	getStoredPublicGames,
} from "../../../services/gameService";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TopHeader from "../../components/TopHeader";
import SecondaryButton from "../../components/shared/SecondaryButton";

const accountLinks = [
	{
		to: "/account/profile",
		label: "Dados da conta",
		icon: UserCircle2,
	},
	{
		to: "/account/wishlist",
		label: "Favoritos",
		icon: Heart,
	},
	{
		to: "/account/cart",
		label: "Carrinho",
		icon: ShoppingCart,
	},
	{
		to: "/account/orders",
		label: "Pedidos",
		icon: Package,
	},
];

const adminLinks = [
	{
		to: "/account/admin/games",
		label: "Jogos",
		icon: Gamepad2,
	},
	{
		to: "/account/admin/categories",
		label: "Categorias",
		icon: Tag,
	},
	{
		to: "/account/admin/companies",
		label: "Empresas",
		icon: Building2,
	},
	{
		to: "/account/admin/reports",
		label: "Relatórios",
		icon: BarChart3,
	},
];

function joinClasses(...classNames) {
	return classNames.filter(Boolean).join(" ");
}

function getSectionMeta(pathname) {
	if (pathname.includes("/account/wishlist")) {
		return {
			title: "Lista de favoritos",
			description: "Gerencie os jogos que você salvou para acompanhar e comprar depois.",
		};
	}

	if (pathname.includes("/account/cart")) {
		return {
			title: "Carrinho",
			description: "Revise os itens do seu carrinho ativo e siga para o checkout quando quiser.",
		};
	}

	if (pathname.includes("/account/orders")) {
		return {
			title: "Pedidos",
			description: "Consulte seu histórico de compras e acompanhe suas aquisições digitais.",
		};
	}

	if (pathname.includes("/account/admin/games")) {
		return {
			title: "Administrativo · Jogos",
			description: "Cadastre, edite e organize o catálogo principal da NexGames.",
		};
	}

	if (pathname.includes("/account/admin/categories")) {
		return {
			title: "Administrativo · Categorias",
			description: "Consulte as categorias disponíveis hoje no backend da NexGames.",
		};
	}

	if (pathname.includes("/account/admin/companies")) {
		return {
			title: "Administrativo · Empresas",
			description: "Gerencie os publishers e estúdios associados aos jogos da loja.",
		};
	}

	if (pathname.includes("/account/admin/reports")) {
		return {
			title: "Administrativo · Relatórios",
			description: "Acompanhe o desempenho comercial dos jogos mais vendidos.",
		};
	}

	return {
		title: "Minha conta",
		description: "Atualize seus dados, acompanhe sua biblioteca e gerencie sua área pessoal.",
	};
}

function getProfileLabel(sessionUser) {
	if (sessionUser?.perfil === "Administrador") {
		return "Administrador";
	}

	return "Cliente";
}

export default function AccountLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [sessionUser, setSessionUser] = useState(() => getSessionUser());
	const [catalogGames, setCatalogGames] = useState(() => getStoredPublicGames());

	const sectionMeta = useMemo(
		() => getSectionMeta(location.pathname),
		[location.pathname]
	);

	useEffect(() => {
		setSessionUser(getSessionUser());
	}, [location.pathname]);

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
				// Mantém os jogos do storage quando a API falhar.
			}
		}

		loadCatalogGames();

		return () => {
			isMounted = false;
		};
	}, []);

	function handleLogout() {
		logout();
		window.dispatchEvent(new Event("nexgames:cart-updated"));
		window.dispatchEvent(new Event("nexgames:wishlist-updated"));
		navigate("/", { replace: true });
	}

	return (
		<div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
			<TopHeader />
			<Header games={catalogGames} />

			<main className="pb-16 pt-8">
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
						<span>/</span>
						<span className="text-[color:var(--text-primary-color)]">
							Minha área
						</span>
					</nav>

					<div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
						<aside className="grid content-start gap-5 lg:sticky lg:top-6">
							<section
								className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-5"
								style={{ boxShadow: "var(--shadow-soft)" }}
							>
								<div className="flex items-start gap-4">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary-soft-color)] text-[color:var(--primary-color)]">
										<UserCircle2 size={28} />
									</div>

									<div className="min-w-0">
										<span className="block text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
											Área do usuário
										</span>
										<strong className="mt-1 block truncate text-lg font-black text-[color:var(--text-primary-color)]">
											{sessionUser?.nome || "Minha conta"}
										</strong>
										<span className="mt-2 inline-flex rounded-full bg-[color:var(--surface-soft-color)] px-3 py-1 text-xs font-semibold text-[color:var(--text-muted-color)]">
											{getProfileLabel(sessionUser)}
										</span>
									</div>
								</div>
							</section>

							<section
								className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-4"
								style={{ boxShadow: "var(--shadow-soft)" }}
							>
								<div className="grid gap-2">
									<span className="px-2 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
										Conta
									</span>

									{accountLinks.map((link) => {
										const Icon = link.icon;

										return (
											<NavLink
												key={link.to}
												to={link.to}
												className={({ isActive }) =>
													joinClasses(
														"flex items-center gap-3 rounded-[var(--radius-medium)] border px-4 py-3 text-sm font-semibold transition",
														isActive
															? "border-[color:var(--primary-color)] bg-[color:var(--primary-soft-color)] text-[color:var(--text-primary-color)]"
															: "border-transparent text-[color:var(--text-muted-color)] hover:border-[color:var(--border-color)] hover:bg-[color:var(--surface-soft-color)] hover:text-[color:var(--text-primary-color)]"
													)
												}
											>
												<Icon size={18} />
												<span>{link.label}</span>
											</NavLink>
										);
									})}
								</div>

								{isAdmin() ? (
									<div className="mt-5 grid gap-2 border-t border-[color:var(--border-color)] pt-5">
										<span className="px-2 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--text-soft-color)]">
											Administrativo
										</span>

										{adminLinks.map((link) => {
											const Icon = link.icon;

											return (
												<NavLink
													key={link.to}
													to={link.to}
													className={({ isActive }) =>
														joinClasses(
															"flex items-center gap-3 rounded-[var(--radius-medium)] border px-4 py-3 text-sm font-semibold transition",
															isActive
																? "border-[color:var(--primary-color)] bg-[color:var(--primary-soft-color)] text-[color:var(--text-primary-color)]"
																: "border-transparent text-[color:var(--text-muted-color)] hover:border-[color:var(--border-color)] hover:bg-[color:var(--surface-soft-color)] hover:text-[color:var(--text-primary-color)]"
														)
													}
												>
													<Icon size={18} />
													<span>{link.label}</span>
												</NavLink>
											);
										})}
									</div>
								) : null}

								<div className="mt-5 border-t border-[color:var(--border-color)] pt-5">
									<SecondaryButton
										icon={LogOut}
										className="!min-w-0 !justify-start"
										onClick={handleLogout}
									>
										Sair da conta
									</SecondaryButton>
								</div>
							</section>
						</aside>

						<section
							className="rounded-[var(--radius-large)] border border-[color:var(--border-color)] bg-[color:var(--surface-color)] p-5 md:p-6 xl:p-7"
							style={{ boxShadow: "var(--shadow-soft)" }}
						>
							<header className="mb-6 border-b border-[color:var(--border-color)] pb-5">
								<div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-soft-color)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--secondary-color)]">
									<LayoutDashboard size={14} />
									Painel NexGames
								</div>

								<h1 className="mt-3 text-[28px] font-black text-[color:var(--text-primary-color)]">
									{sectionMeta.title}
								</h1>

								<p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--text-muted-color)]">
									{sectionMeta.description}
								</p>
							</header>

							<Outlet />
						</section>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
