import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSessionUser } from "../../services/authService";

function getFirstName(fullName) {
	if (!fullName) return "";
	return fullName.trim().split(" ")[0];
}

export default function TopHeader() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [sessionUser, setSessionUser] = useState(() => getSessionUser());

	useEffect(() => {
		setSessionUser(getSessionUser());
	}, [pathname]);

	const welcomeMessage = sessionUser
		? `Olá, ${getFirstName(sessionUser.nome)}. Bem-vindo(a) de volta à NexGames.`
		: "Bem-vindo(a) à loja virtual da NexGames.";

	return (
		<div className="hidden border-b border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] md:block">
			<div className="app-container flex min-h-[34px] items-center justify-between gap-4 text-xs">
				<span className="truncate">{welcomeMessage}</span>

				<nav
					aria-label="Navegação utilitária da loja"
					className="flex items-center gap-4 lg:gap-[18px]"
				>
					<Link
						to="/"
						className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
					>
						<MapPin size={14} strokeWidth={2} />
						<span>Localizar loja</span>
					</Link>

					<Link
						to="/orders"
						className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
					>
						<span>Rastrear pedido</span>
					</Link>

					<Link
						to="/"
						className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
					>
						<span>Loja</span>
					</Link>

					{sessionUser ? (
						<Link
							to="/my-account"
							className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
						>
							<span>Minha conta</span>
						</Link>
					) : (
						<button
							type="button"
							onClick={() =>
								navigate("/login", {
									state: { redirectTo: "/my-account" },
								})
							}
							className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
						>
							<span>Minha conta</span>
						</button>
					)}
				</nav>
			</div>
		</div>
	);
}
