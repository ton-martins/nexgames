import { apiRequest } from "./api";
import { getToken } from "./authService";

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
    if (! game) return null;

    return {
        nome: game.nome ?? "",
        descricao: game.descricao ?? "",
        ano: game.ano ?? null,
        preco: Number(game.preco ?? 0),
        desconto: Number(game.desconto ?? 0),
        categoria: game.categoria ?? "",
        empresaNome: game.empresa_nome ?? "",
    };
}

export async function getGames({ categoria } = {}) {
    const token = getToken();
    const data = await apiRequest("/jogos", {
        token,
        query: { categoria }
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizeGame);
}

export async function getPublicGames() {
    const data = await apiRequest("/public/jogos");

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizePublicGame);
}

export async function getGameById(id) {
    const token = getToken();

    const data = await apiRequest(`/jogos/${id}`, {
        token,
    });

    return normalizeGame(data);
}

export async function createGame({
    nome,
    descricao,
    ano,
    preco,
    desconto,
    fkEmpresa,
    fkCategoria
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
            fkCategoria
        }
    });

    return normalizeGame(data);
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
        fkCategoria
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
            fkCategoria
        }
    });

    return normalizeGame(data);
}

export async function deleteGame(id) {
    const token = getToken();

    return apiRequest(`/jogos//${id}`, {
        method: "DELETE",
        token
    });
}