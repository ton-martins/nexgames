import { apiRequest } from "./api";
import { getToken } from "./authService";

function normalizeUser(user) {
    if (! user) return null;

    return {
        id: user.id ?? null,
        nome: user.nome ?? "",
        email: user.email ?? "",
        dataNascimento: user.dataNascimento ?? null,
        fkPerfil: user.fkPerfil ?? null,
    };
}

export async function getUserById(id) {
    const token = getToken();

    const data = await apiRequest(`/usuarios/${id}`, {
        token
    });

    return normalizeUser(data);
}

export async function getMyGames() {
    const token = getToken();

    const data = await apiRequest("/usuarios/my/games", {
        token
    });

    if (! data || data.length === 0) {
        return [];
    }

    return data;
}

export async function updateUser(id, { nome, dataNascimento, fkPerfil }) {
    const token = getToken();

    const data = await apiRequest(`/usuarios/${id}`, {
        method: "PUT",
        token,
        body: { nome, dataNascimento, fkPerfil },
    });

    return {
        message: data?.message ?? "",
    };
}

export async function getUsers() {
    const token = getToken();

    const data = await apiRequest("/usuarios", {
        token,
    });

    if (! data || data.length === 0) {
    return [];
    }

    return data.map(normalizeUser);
}

export async function getProfiles() {
    const token = getToken();

    const data = await apiRequest("/profiles", {
        token,
    });

    if (! data || data.length === 0) {
    return [];
    }

    return data.map((profile) => ({
        id: profile.id ?? null,
        nome: profile.nome ?? "",
    }));
}

export async function createProfile({ nome }) {
    const token = getToken();

    const data = await apiRequest("/profiles", {
        method: "POST",
        token,
        body: { nome },
    });

    return {
        message: data?.message ?? "",
        profileId: data?.profileId ?? null,
    };
}