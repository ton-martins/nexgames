import { getToken } from "./authService";
import { apiRequest } from "./api";
import { getPublicGames, getStoredPublicGames } from "./gameService";

function normalizeCartGame(game) {
	if (!game) return null;

	return {
		id: game.id ?? null,
		nome: game.nome ?? "",
		descricao: game.descricao ?? "",
		ano: game.ano ?? null,
		preco: Number(game.preco ?? 0),
		desconto: Number(game.desconto ?? 0),
		categoria: game.categoria ?? "",
		empresaNome: game.empresaNome ?? game.empresa_nome ?? "",
	};
}

function normalizeCartItem(item) {
	if (!item) return null;

	return {
		id: item.id ?? null,
		fkJogo: item.fkJogo ?? item.fk_jogo ?? null,
		fkCarrinho: item.fkCarrinho ?? item.fk_carrinho ?? null,
		chaveAtivacao: item.chaveAtivacao ?? item.chave_ativacao ?? null,
		jogo: normalizeCartGame(item.jogo),
	};
}

function normalizeCart(cart) {
	if (!cart) return null;

	return {
		id: cart.id ?? null,
		fkUsuario: cart.fkUsuario ?? cart.fk_usuario ?? null,
		fkVenda: cart.fkVenda ?? cart.fk_venda ?? null,
		status: cart.status ?? "",
		itens: Array.isArray(cart.itens)
			? cart.itens.map(normalizeCartItem).filter(Boolean)
			: [],
	};
}

async function getCatalogGamesForCart() {
	const storedGames = getStoredPublicGames();

	if (storedGames.length > 0) {
		return storedGames;
	}

	try {
		return await getPublicGames();
	} catch {
		return [];
	}
}

function buildCatalogIndex(games) {
	return new Map(
		games
			.filter((game) => game?.id !== null && game?.id !== undefined)
			.map((game) => [Number(game.id), game])
	);
}

async function hydrateCart(cart) {
	const normalizedCart = normalizeCart(cart);

	if (!normalizedCart || normalizedCart.itens.length === 0) {
		return normalizedCart;
	}

	const catalogGames = await getCatalogGamesForCart();
	const catalogIndex = buildCatalogIndex(catalogGames);

	return {
		...normalizedCart,
		itens: normalizedCart.itens.map((item) => ({
			...item,
			jogo:
				item.jogo ??
				catalogIndex.get(Number(item.fkJogo)) ??
				null,
		})),
	};
}

export async function getCart() {
	const token = getToken();

	const data = await apiRequest("/carrinho/ativo", {
		token,
	});

	if (!data?.carrinho) {
		return null;
	}

	return hydrateCart(data.carrinho);
}

export async function getCarts() {
	const token = getToken();

	const data = await apiRequest("/carrinho", {
		token,
	});

	if (!data?.carrinhosComItens || data.carrinhosComItens.length === 0) {
		return [];
	}

	return Promise.all(data.carrinhosComItens.map(hydrateCart));
}

export async function addToCart(jogoId) {
	const token = getToken();

	const data = await apiRequest("/carrinho/add", {
		method: "POST",
		token,
		body: { jogoId },
	});

	return {
		message: data?.message ?? "",
		carrinho: data?.carrinho ? await hydrateCart(data.carrinho) : null,
	};
}

export async function removeFromCart(jogoId) {
	const token = getToken();

	return apiRequest(`/carrinho/${jogoId}`, {
		method: "DELETE",
		token,
	});
}
