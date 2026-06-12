import { apiRequest } from "./api";
import { getToken } from "./authService";
import { attachGameImage } from "../src/data/gameImages";

const PUBLIC_GAMES_STORAGE_KEY = "nexgames_public_games";

function normalizeGame(game) {
	if (!game) return null;

	return {
		id: game.id ?? null,
		nome: game.nome ?? "",
		descricao: game.descricao ?? "",
		ano: game.ano ?? null,
		preco: Number(game.preco ?? 0),
		desconto: Number(game.desconto ?? 0),
		fkEmpresa: game.fkEmpresa ?? null,
		fkCategoria: game.fkCategoria ?? null,
	};
}

function normalizePublicGame(game) {
	if (!game) return null;

	return {
		id: game.id ?? null,
		nome: game.nome ?? "",
		descricao: game.descricao ?? "",
		ano: game.ano ?? null,
		preco: Number(game.preco ?? 0),
		desconto: Number(game.desconto ?? 0),
		categoria: game.categoria ?? "",
		empresaNome: game.empresa_nome ?? game.empresaNome ?? "",
	};
}

function findAuthenticatedGameMatch(publicGame, authenticatedGames) {
	if (!publicGame || !authenticatedGames.length) {
		return null;
	}

	return (
		authenticatedGames.find(
			(game) =>
				game.nome === publicGame.nome &&
				(game.ano === publicGame.ano || !game.ano || !publicGame.ano)
		) ||
		authenticatedGames.find((game) => game.nome === publicGame.nome) ||
		null
	);
}

function mergeCatalogGames(publicGames, authenticatedGames) {
	if (!authenticatedGames.length) {
		return publicGames;
	}

	return publicGames.map((publicGame) => {
		const authenticatedGame = findAuthenticatedGameMatch(
			publicGame,
			authenticatedGames
		);

		if (!authenticatedGame) {
			return publicGame;
		}

		return {
			...publicGame,
			id: authenticatedGame.id,
			fkEmpresa: authenticatedGame.fkEmpresa ?? null,
			fkCategoria: authenticatedGame.fkCategoria ?? null,
		};
	});
}

function savePublicGamesToStorage(games) {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(PUBLIC_GAMES_STORAGE_KEY, JSON.stringify(games));
	} catch {
		// Ignora falhas de persistencia no navegador.
	}
}

export function getStoredPublicGames() {
	if (typeof window === "undefined") {
		return [];
	}

	try {
		const storedGames = localStorage.getItem(PUBLIC_GAMES_STORAGE_KEY);

		if (!storedGames) {
			return [];
		}

		const parsedGames = JSON.parse(storedGames);

		if (!Array.isArray(parsedGames)) {
			return [];
		}

		return parsedGames.map(normalizePublicGame).filter(Boolean).map(attachGameImage);
	} catch {
		return [];
	}
}

export function getPublicGameCategories(games = getStoredPublicGames()) {
	return [...new Set(games.map((game) => game.categoria).filter(Boolean))].sort(
		(a, b) => a.localeCompare(b, "pt-BR")
	);
}

export async function getGames({ categoria } = {}) {
	const token = getToken();
	const data = await apiRequest("/jogos", {
		token,
		query: { categoria },
	});

	if (!data || data.length === 0) {
		return [];
	}

	return data.map(normalizeGame).filter(Boolean).map(attachGameImage);
}

export async function getPublicGames({ forceRefresh = false } = {}) {
	if (!forceRefresh) {
		const storedGames = getStoredPublicGames();

		if (storedGames.length > 0) {
			return storedGames;
		}
	}

	try {
		const data = await apiRequest("/public/jogos");
		const publicGames = Array.isArray(data)
			? data.map(normalizePublicGame).filter(Boolean)
			: [];

		let games = publicGames;

		if (getToken()) {
			try {
				const authenticatedGames = await getGames();
				games = mergeCatalogGames(publicGames, authenticatedGames);
			} catch {
				games = publicGames;
			}
		}

		savePublicGamesToStorage(games);

		return games.map(attachGameImage);
	} catch (error) {
		const storedGames = getStoredPublicGames();

		if (storedGames.length > 0) {
			return storedGames;
		}

		throw error;
	}
}

export async function getGameById(id) {
	const token = getToken();

	const data = await apiRequest(`/jogos/${id}`, {
		token,
	});

	return attachGameImage(normalizeGame(data));
}

export async function createGame({
	nome,
	descricao,
	ano,
	preco,
	desconto,
	fkEmpresa,
	fkCategoria,
}) {
	const token = getToken();

	const data = await apiRequest("/jogos", {
		method: "POST",
		token,
		body: {
			nome,
			descricao,
			ano,
			preco,
			desconto,
			fkEmpresa,
			fkCategoria,
		},
	});

	return attachGameImage(normalizeGame(data));
}

export async function updateGame(
	id,
	{
		nome,
		descricao,
		ano,
		preco,
		desconto,
		fkEmpresa,
		fkCategoria,
	}
) {
	const token = getToken();

	const data = await apiRequest(`/jogos/${id}`, {
		method: "PUT",
		token,
		body: {
			nome,
			descricao,
			ano,
			preco,
			desconto,
			fkEmpresa,
			fkCategoria,
		},
	});

	return attachGameImage(normalizeGame(data));
}

export async function deleteGame(id) {
	const token = getToken();

	return apiRequest(`/jogos/${id}`, {
		method: "DELETE",
		token,
	});
}
