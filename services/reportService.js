import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeBestSellingGameReport(item) {
  if (!item) return null;

  return {
    nome: item.nome ?? "",
    empresa: item.empresa ?? "",
    totalVendas: Number(item.total ?? 0),
  };
}

export async function getBestSellingGames({ top = 10, empresa } = {}) {
  const token = getToken();

  const data = await apiRequest("/relatorios/jogos-mais-vendidos", {
    token,
    query: { top, empresa },
  });

  if (! data || data.length === 0) {
    return [];
  }

  return data.map(normalizeBestSellingGameReport);
}

export async function getBestSellingGamesByCompany(empresa, { top = 10 } = {}) {
  return getBestSellingGames({ top, empresa });
}
