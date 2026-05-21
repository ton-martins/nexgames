import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeWishlistItem(item) {
    if (! item) return null;

    return {
        id: item.id ?? null,
        fkUsuario: item.fkUsuario ?? null,
        fkJogo: item.fkJogo ?? null,
        jogo: item.jogo ?? null
    };
}

export async function getWishlist() {
    const token = getToken();

    const data = await apiRequest("/lista-desejo", {
        token
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizeWishlistItem);
}

export async function addToWishlist(jogoId) {
    const token = getToken();

    const data = apiRequest("/lista-desejo", {
        method: "POST",
        token,
        body: { jogoId },
    });

    return data;
}

export async function removeFromWishlist(jogoId) {
    const token = getToken();

    return apiRequest("/lista-desejo", {
        method: "DELETE",
        token,
        body: { jogoId }
    });
}