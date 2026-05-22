import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeRating(rating) {
    if (! rating) return null;

    return {
        id: rating.id ?? null,
        fkUsuario: rating.fkUsuario ?? null,
        fkJogo: rating.fkJogo ?? null,
        nota: Number(rating.nota ?? 0),
        comentario: rating.comentario ?? "",
        data: rating.data ?? null
    };
}

export async function getRatings({ jogoId } = {}) {
    const token = getToken();

    const data = await apiRequest("/avaliacoes", {
        token,
        query: { jogoId }
    });

    if (! data) {
        return [];
    }

    if (! Array.isArray(data)) {
        return [normalizeRating(data)];
    }

    return data.map(normalizeRating);
}

export async function getGameRatingSummary(jogoId) {
    const token = getToken();

    const data = await apiRequest(`/avaliacoes/media/${jogoId}`, {
        token
    });

    if (! data) {
        return {
            media: 0,
            totalAvaliacoes: 0,
            avaliacoes: []
        };
    }

    return {
        media: Number(data.media ?? 0),
        totalAvaliacoes: data.totalAvaliacoes ?? 0,
        avaliacoes: Array.isArray(data.avaliacoes) 
            ? data.avaliacoes.map(normalizeRating)
            : []
    };
}

export async function createRating({ jogoId, nota, comentario }) {
    const token = getToken();

    const data = await apiRequest("/avaliacoes", {
        method: "POST",
        token,
        body: { jogoId, nota, comentario }
    });

    return {
        message: data?.message ?? "",
        avaliacao: data?.avaliacao ? normalizeRating(data.avaliacao) : null
    };
}

export async function updateRating({ jogoId, nota, comentario }) {
    const token = getToken();

    const data = await apiRequest("/avaliacoes", {
        method: "PUT",
        token,
        body: { jogoId, nota, comentario }
    });

    return {
        message: data?.message ?? "",
    };
}