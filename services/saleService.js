import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeSale(sale) {
    if (! sale) return null;

    return {
        id: sale.id ?? null,
        fkUsuario: sale.fkUsuario ?? null,
        valorTotal: Number(sale.valorTotal ?? 0),
        quantidade: sale.quantidade ?? 0,
        data: sale.data ?? null
    };
}

export async function getSales() {
    const token = getToken();

    const data = await apiRequest("/vendas", {
        token,
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizeSale);
}

export async function pay({ metodo, dados }) {
    const token = getToken();

    return apiRequest("/vendas/pay", {
        method: "POST",
        token,
        body: { metodo, dados }
    });
}

export async function checkout() {
    const token = getToken();

    const data = await apiRequest("/vendas/checkout", {
        method: "POST",
        token
    });

    return {
        message: data?.message ?? "",
        venda: data?.venda ? normalizeSale(data.venda) : null
    };
}