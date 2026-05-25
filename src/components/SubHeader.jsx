import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPublicGameCategories } from "../../services/gameService";

function buildSubHeaderItems(games) {
	const categories = getPublicGameCategories(games).slice(0, 6);

	if (categories.length === 0) {
		return [];
	}

	return [
		{
			id: "home",
			label: "Home",
			action: {},
		},
		...categories.map((category) => ({
			id: category,
			label: category,
			action: { category },
		})),
	];
}

function buildSearchParams({ search, category } = {}) {
	const params = new URLSearchParams();

	if (search) {
		params.set("search", search);
	}

	if (category) {
		params.set("categoria", category);
	}

	return params.toString();
}

export default function SubHeader({ games = [] }) {
	const navigate = useNavigate();
	const location = useLocation();

	const items = useMemo(() => buildSubHeaderItems(games), [games]);
	const activeCategory = new URLSearchParams(location.search).get("categoria") || "";

	function handleNavigation(action = {}) {
		const search = buildSearchParams(action);

		navigate({
			pathname: "/",
			search: search ? `?${search}` : "",
		});
	}

	if (items.length === 0) {
		return null;
	}

	return (
		<nav
			aria-label="Navegação principal da loja"
			className="hidden bg-[color:var(--primary-color)] text-[color:var(--primary-ui-text-color)] lg:block"
		>
			<div className="app-container flex items-center justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-lg:justify-start">
				{items.map((item) => {
					const isActive =
						item.id === "home"
							? !activeCategory
							: activeCategory === item.action.category;

					return (
						<button
							key={item.id}
							type="button"
							onClick={() => handleNavigation(item.action)}
							className={`inline-flex min-h-12 shrink-0 items-center gap-1.5 px-4 text-sm font-bold transition ${
								isActive
									? "bg-[color:var(--subnav-hover-background)] !text-[color:var(--primary-ui-text-color)]"
									: "bg-transparent !text-[color:var(--primary-ui-text-color)] hover:bg-[color:var(--subnav-hover-background)]"
							}`}
						>
							<span>{item.label}</span>
							<ChevronDown size={16} />
						</button>
					);
				})}
			</div>
		</nav>
	);
}
