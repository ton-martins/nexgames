import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeCategory(category) {
    if (! category) return null;

    return {
        id: category.id ?? null,
        nome: category.nome ?? "",
    };
}

export async function getCategories() {
    const token = getToken();

    const data = await apiRequest("/categorias", {
        token,
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizeCategory);
}

export async function getCategoryById(id) {
    const token = getToken();

    const data = await apiRequest(`/categorias/${id}`, {
        token,
    });

    return normalizeCategory(data);
}