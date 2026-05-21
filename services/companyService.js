import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeCompany(company) {
    if (! company) return null;

    return {
    id: company.id ?? null,
    nome: company.nome ?? "",
    };
}

export async function getCompanies() {
    const token = getToken();

    const data = await apiRequest("/empresas", {
        token,
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data.map(normalizeCompany);
}

export async function getCompanyById(id) {
    const token = getToken();

    const data = await apiRequest(`/empresas/${id}`, {
        token
    });

    return normalizeCompany(data);
}

export async function createCompany({ nome }) {
    const token = getToken();
    
    const data = await apiRequest("/empresas", {
        method: "POST",
        token,
        body: { nome },
    });

    return normalizeCompany(data);
}

export async function updateCompany(id, { nome }) {
    const token = getToken();
    
    const data = await apiRequest(`/empresas/${id}`, {
        method: "PUT",
        token,
        body: { nome },
    });

    return normalizeCompany(data);
}

export async function deleteCompany(id) {
    const token = getToken();

    return apiRequest(`/empresas/${id}`, {
        method: "DELETE",
        token,
    });
}