// Centralise tous les appels vers les routes /api (publiques, admin, kataleya).
// Le front et le serveur (Hono/Cloudflare Worker) sont deux domaines distincts,
// donc chaque appel part en absolu vers Public_API avec les credentials inclus
// (nécessaire pour que le cookie de session admin soit envoyé cross-origin).
export const Public_API = "https://kataleya-serveur-site.godigital145.workers.dev/";

function apiUrl(path: string): string {
    return `${Public_API}${path.replace(/^\//, "")}`;
}

// Construit l'URL absolue d'une image dont le chemin (ex: "/img/xxx.jpg") est
// renvoyé par le serveur en relatif.
export function imgUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (/^https?:\/\//.test(path)) return path;
    return apiUrl(path);
}

export type TravailInput = {
    title: string;
    description: string;
    location: string | null;
    year: string | null;
    category: string | null;
    cover_image: string | null;
    images: string[];
};

export type CatalogueInput = {
    title: string;
    description: string | null;
    cover_image: string;
};

export type ProduitInput = {
    title: string;
    description: string;
    price: string | null;
    category: string | null;
    cover_image: string | null;
    catalogue_id: number;
    images: string[];
};

// ---------- Public: Travaux ----------

export const listTravaux = () => fetch(apiUrl("api/travaux"), { credentials: "include" });
export const getTravail = (id: number | string) => fetch(apiUrl(`api/travaux/${id}`), { credentials: "include" });

// ---------- Public: Catalogues ----------

export const listCatalogues = () => fetch(apiUrl("api/catalogues"), { credentials: "include" });
export const getCatalogue = (id: number | string) => fetch(apiUrl(`api/catalogues/${id}`), { credentials: "include" });

// ---------- Public: Produits ----------

export const listProduits = () => fetch(apiUrl("api/produits"), { credentials: "include" });
export const getProduit = (id: number | string) => fetch(apiUrl(`api/produits/${id}`), { credentials: "include" });

// ---------- Admin: Auth ----------

export const adminLogin = (password: string) =>
    fetch(apiUrl("api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
    });

export const adminLogout = () => fetch(apiUrl("api/admin/logout"), { method: "POST", credentials: "include" });

export const adminMe = (cookieHeader?: string) =>
    fetch(apiUrl("api/admin/me"), {
        credentials: "include",
        ...(cookieHeader ? { headers: { cookie: cookieHeader } } : {}),
    });

// ---------- Admin: Upload ----------

export const adminUpload = (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return fetch(apiUrl("api/admin/upload"), { method: "POST", body: form, credentials: "include" });
};

// ---------- Admin: Travaux ----------

export const createTravail = (input: TravailInput) =>
    fetch(apiUrl("api/admin/travaux"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const updateTravail = (id: number, input: TravailInput) =>
    fetch(apiUrl(`api/admin/travaux/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const deleteTravail = (id: number) =>
    fetch(apiUrl(`api/admin/travaux/${id}`), { method: "DELETE", credentials: "include" });

// ---------- Admin: Catalogues ----------

export const createCatalogue = (input: CatalogueInput) =>
    fetch(apiUrl("api/admin/catalogues"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const updateCatalogue = (id: number, input: CatalogueInput) =>
    fetch(apiUrl(`api/admin/catalogues/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const deleteCatalogue = (id: number) =>
    fetch(apiUrl(`api/admin/catalogues/${id}`), { method: "DELETE", credentials: "include" });

// ---------- Admin: Produits ----------

export const createProduit = (input: ProduitInput) =>
    fetch(apiUrl("api/admin/produits"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const updateProduit = (id: number, input: ProduitInput) =>
    fetch(apiUrl(`api/admin/produits/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
    });

export const deleteProduit = (id: number) =>
    fetch(apiUrl(`api/admin/produits/${id}`), { method: "DELETE", credentials: "include" });

// ---------- Admin: Kataleya (connexion au serveur distant) ----------

export const kataleyaStatus = () => fetch(apiUrl("api/admin/kataleya/status"), { credentials: "include" });

export const kataleyaConnect = (baseUrl: string, email: string, password: string) =>
    fetch(apiUrl("api/admin/kataleya/connect"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, email, password }),
        credentials: "include",
    });

export const kataleyaDisconnect = () =>
    fetch(apiUrl("api/admin/kataleya/disconnect"), { method: "POST", credentials: "include" });

export const kataleyaCollections = () => fetch(apiUrl("api/admin/kataleya/collections"), { credentials: "include" });

export const kataleyaSousCollections = (collectionId?: string) => {
    const qs = collectionId ? `?collectionId=${encodeURIComponent(collectionId)}` : "";
    return fetch(apiUrl(`api/admin/kataleya/sous-collections${qs}`), { credentials: "include" });
};

export const kataleyaArticles = (params: { q?: string; collectionId?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.collectionId) qs.set("collectionId", params.collectionId);
    return fetch(apiUrl(`api/admin/kataleya/articles?${qs}`), { credentials: "include" });
};

export const kataleyaImport = (
    catalogueId: number,
    body: { collectionId?: string; sousCollectionId?: string; articleIds?: string[] }
) =>
    fetch(apiUrl(`api/admin/catalogues/${catalogueId}/kataleya-import`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
    });
