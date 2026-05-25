import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ExclusiveProducts from "../components/ExclusiveProducts";
import FeedbackPopup from "../components/FeedbackPopup";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Products from "../components/Products";
import SubHeader from "../components/SubHeader";
import TopHeader from "../components/TopHeader";
import TrendingProducts from "../components/TrendingProducts";
import {
	getPublicGameCategories,
	getPublicGames,
} from "../../services/gameService";

export default function Home() {
	const location = useLocation();
	const [games, setGames] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const availableCategories = useMemo(() => {
		return getPublicGameCategories(games);
	}, [games]);

	const activeCategory = useMemo(() => {
		const categoryFromQuery =
			new URLSearchParams(location.search).get("categoria") || "";

		return availableCategories.includes(categoryFromQuery)
			? categoryFromQuery
			: "";
	}, [availableCategories, location.search]);

	const visibleGames = useMemo(() => {
		if (!activeCategory) {
			return games;
		}

		return games.filter((game) => game.categoria === activeCategory);
	}, [activeCategory, games]);

	useEffect(() => {
		let isMounted = true;

		async function loadGames() {
			setIsLoading(true);
			setHasError(false);

			try {
				const data = await getPublicGames({ forceRefresh: true });

				if (!isMounted) return;

				setGames(Array.isArray(data) ? data : []);
				setIsPopupOpen(false);
			} catch {
				if (!isMounted) return;

				setGames([]);
				setHasError(true);
				setIsPopupOpen(true);
			} finally {
				if (!isMounted) return;
				setIsLoading(false);
			}
		}

		loadGames();

		return () => {
			isMounted = false;
		};
	}, []);

	const hasCatalog = games.length > 0;

	if (isLoading) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-primary-color)]">
			{hasCatalog ? (
				<>
					<TopHeader />
					<Header games={games} />
					<SubHeader games={games} />

					<main>
						<Hero games={visibleGames} catalogGames={games} />
						<TrendingProducts games={games} />
						<ExclusiveProducts games={games} />
						<Products games={games} />
					</main>
				</>
			) : null}

			<FeedbackPopup
				open={isPopupOpen && hasError}
				title="Não foi possível carregar o catálogo"
				message="A API pública de jogos não respondeu e não havia cache salvo no navegador."
				onClose={() => setIsPopupOpen(false)}
			/>
		</div>
	);
}
