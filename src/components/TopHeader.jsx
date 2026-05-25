import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getSessionUser } from "../../services/authService";

function getFirstName(fullName) {
	if (!fullName) return "";
	return fullName.trim().split(" ")[0];
}

export default function TopHeader() {
	const { pathname } = useLocation();
	const sessionUser = useMemo(() => getSessionUser(), [pathname]);

	const welcomeMessage = sessionUser
		? `Olá, ${getFirstName(sessionUser.nome)}. Bem-vindo(a) de volta à NexGames.`
		: "Bem-vindo(a) à loja virtual da NexGames.";

	const utilityLinks = [
		{
			id: "store-locator",
			label: "Localizar loja",
			to: "/",
			icon: true,
		},
		{
			id: "track-order",
			label: "Rastrear pedido",
			to: "/orders",
			icon: false,
		},
		{
			id: "store",
			label: "Loja",
			to: "/",
			icon: false,
		},
		{
			id: "account",
			label: "Minha conta",
			to: sessionUser ? "/my-account" : "/login",
			icon: false,
		},
	];

	return (
		<div className="hidden border-b border-[color:var(--border-color)] bg-[color:var(--surface-color)] text-[color:var(--text-muted-color)] md:block">
			<div className="app-container flex min-h-[34px] items-center justify-between gap-4 text-xs">
				<span className="truncate">{welcomeMessage}</span>

				<nav
					aria-label="Navegação utilitária da loja"
					className="flex items-center gap-4 lg:gap-[18px]"
				>
					{utilityLinks.map((link) => (
						<Link
							key={link.id}
							to={link.to}
							className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--text-primary-color)]"
						>
							{link.icon ? <MapPin size={14} strokeWidth={2} /> : null}
							<span>{link.label}</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
