import { jwtDecode } from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "nexgames_token";

function buildUrl(path, query = {}) {
    const normalizePath = path.startsWith("/") ? path : `${path}`;
    const url = new URL(`${API_BASE_URL}${normalizePath}`);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

async function parseResponse(response) {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

export async function apiRequest(
    path,
    {
        method = "GET",
        token,
        body,
        query,
        headers = {},
    } = {}
) {
    const requestHeaders = {
        Accept: "application/json",
        ...headers,
    };

    if (body !== undefined) {
        requestHeaders["Content-Type"] = "application/json";
    }

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(buildUrl(path, query), {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        const message = data?.message || data?.error || "Não foi possível concluir a requisição.";

        const error = new Error(message);
        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}

export function getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveToken(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function decodeToken(token = getToken()) {
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

export function isTokenExpired(token = getToken()) {
    const decoded = decodeToken(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (! decoded?.exp) return true;
    
    return decoded.exp <= nowInSeconds;
}

export function getSessionUser() {
    const token = getToken();

    if (! token) return null;

    if (isTokenExpired(token)) {
        removeToken();
        return null;
    }

    const decoded = decodeToken(token);
    
    if (! decoded) return null;

    return {
        id: decoded.id,
        nome: decoded.nome,
        perfil: decoded.perfil,
        exp: decoded.exp,
    };
}

export function isAuthenticated() {
    return Boolean(getSessionUser());
}

export function isAdmin() {
    const user = getSessionUser();
    if (! user) return false;

    return user.perfil === "Administrador";
}