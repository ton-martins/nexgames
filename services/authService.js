import { jwtDecode } from "jwt-decode";
import { apiRequest } from "./api";

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || "nexgames_token";

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

export async function login({ email, senha }) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, senha },
    });

    saveToken(data.token);

    return {
        token: data.token,
        user: getSessionUser(),
        message: data.message,
    };
}

export async function register({ nome, email, senha, dataNascimento }) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: { nome, email, senha, dataNascimento },
    });
}

export async function changePassword({ currentPassword, newPassword}) {
    const token = getToken();

    return apiRequest("/auth/change-password", {
        method: "PUT",
        token,
        body: { currentPassword, newPassword },
    });
}

export function logout() {
    removeToken();
}