const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildUrl(path, query = {}) {
    const normalizePath = path.startsWith("/") ? path : `/${path}`;
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