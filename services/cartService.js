import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeCartItem(item) {
    if (! item) return null;

    return {
        id: item.id ?? null,
        fkJogo: item.fkJogo ?? null,
        fkCarrinho: item.fkCarrinho ?? null,
        chaveAtivacao: item.chaveAtivacao ?? null,
        jogo: item.jogo ?? null,
    };
}

function normalizeCart(cart) {
    if (! cart) return null;

    return {
        id: cart.id ?? null,
        fkUsuario: cart.fkUsuario ?? null,
        fkVenda: cart.fkVenda ?? null,
        status: cart.status ?? "",
        itens: Array.isArray(cart.itens)
        ? cart.itens.map(normalizeCartItem)
        : [],
    };
}

export async function getCart() {
    const token = getToken();

    const data = await apiRequest("/carrinho/ativo", {
        token,
    });

    if (! data?.carrinho) {
        return null;
    }

    return normalizeCart(data.carrinho);
}

export async function getCarts() {
    const token = getToken();

    const data = await apiRequest("/carrinho", {
        token,
    });

    if (! data?.carrinhosComItens || data.carrinhosComItens.length === 0) {
        return [];
    }

    return data.carrinhosComItens.map(normalizeCart);
}

export async function addToCart(jogoId) {
    const token = getToken();

    const data = await apiRequest("/carrinho/add", {
        method: "POST",
        token,
        body: { jogoId }
    });

    return {
        message: data?.message ?? "",
        carrinho: data?.carrinho ? normalizeCart(data.carrinho) : null
    };
}

export async function removeFromCart(jogoId) {
    const token = getToken();

    return apiRequest(`/carrinho/${jogoId}`, {
        method: "DELETE",
        token
    });
}