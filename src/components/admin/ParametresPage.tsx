import { useEffect, useState } from "react";
import { kataleyaStatus, kataleyaConnect, kataleyaDisconnect, kataleyaCollections, kataleyaSousCollections, kataleyaArticles } from "../../lib/api";

type Status = { connected: boolean; baseUrl?: string; email?: string };

type Collection = {
    id: string;
    nom: string;
    description?: string;
    ordre?: number;
    quantite: number;
};

type SousCollection = {
    id: string;
    collectionId: string;
    nom: string;
    description?: string;
};

type Article = {
    id: string;
    collectionId: string;
    sousCollectionId?: string;
    nom: string;
    reference: string;
    prixTTC: number;
    stockTotal: number;
};

type Tab = "collections" | "sous-collections" | "articles";

export default function ParametresPage() {
    const [status, setStatus] = useState<Status | null>(null);
    const [baseUrl, setBaseUrl] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [tab, setTab] = useState<Tab>("collections");
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [sousCollections, setSousCollections] = useState<SousCollection[] | null>(null);
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [articlesTotal, setArticlesTotal] = useState(0);
    const [q, setQ] = useState("");
    const [loadingData, setLoadingData] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);

    function loadStatus() {
        kataleyaStatus()
            .then((r) => r.json<Status>())
            .then(setStatus)
            .catch(() => setStatus({ connected: false }));
    }

    useEffect(() => {
        loadStatus();
    }, []);

    async function onConnect(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setConnecting(true);
        const res = await kataleyaConnect(baseUrl, email, password);
        setConnecting(false);
        const data = await res.json<{ error?: string }>().catch(() => ({}));
        if (!res.ok) {
            setError(data?.error || "Connexion refusée.");
            return;
        }
        setPassword("");
        setCollections(null);
        setSousCollections(null);
        setArticles(null);
        loadStatus();
    }

    async function onDisconnect() {
        if (!confirm("Se déconnecter du serveur Kataleya ?")) return;
        await kataleyaDisconnect();
        setCollections(null);
        setSousCollections(null);
        setArticles(null);
        loadStatus();
    }

    async function loadCollections() {
        setLoadingData(true);
        setDataError(null);
        const res = await kataleyaCollections();
        const data = await res.json<{ items?: Collection[]; error?: string }>().catch(() => ({}));
        setLoadingData(false);
        if (res.ok) setCollections(data?.items ?? []);
        else setDataError(data?.error || "Erreur de récupération.");
    }

    async function loadSousCollections() {
        setLoadingData(true);
        setDataError(null);
        const res = await kataleyaSousCollections();
        const data = await res.json<{ items?: SousCollection[]; error?: string }>().catch(() => ({}));
        setLoadingData(false);
        if (res.ok) setSousCollections(data?.items ?? []);
        else setDataError(data?.error || "Erreur de récupération.");
    }

    async function loadArticles() {
        setLoadingData(true);
        setDataError(null);
        const res = await kataleyaArticles({ q });
        const data = await res.json<{ items?: Article[]; total?: number; error?: string }>().catch(() => ({}));
        setLoadingData(false);
        if (res.ok) {
            setArticles(data?.items ?? []);
            setArticlesTotal(data?.total ?? 0);
        } else setDataError(data?.error || "Erreur de récupération.");
    }

    useEffect(() => {
        if (!status?.connected) return;
        if (tab === "collections" && collections === null) loadCollections();
        if (tab === "sous-collections" && sousCollections === null) loadSousCollections();
        if (tab === "articles" && articles === null) loadArticles();
    }, [tab, status?.connected]);

    if (!status) return <p className="text-neutral-500">Chargement…</p>;

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold inter mb-8" style={{ lineHeight: 1 }}>
                Paramètres
            </h1>

            <section className="mb-10 border border-neutral-200 p-6">
                <h2 className="inter font-semibold text-lg mb-4">Connexion au serveur Kataleya</h2>

                {status.connected ? (
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <p className="inter text-sm text-neutral-700 flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
                            Connecté à <strong>{status.baseUrl}</strong> ({status.email})
                        </p>
                        <button
                            onClick={onDisconnect}
                            className="inter text-sm border border-neutral-300 px-4 py-2 hover:bg-neutral-100"
                        >
                            Se déconnecter
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onConnect} className="flex flex-col gap-4 max-w-md">
                        <Field label="URL du serveur" required>
                            <input
                                type="url"
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                placeholder="https://exemple.workers.dev"
                                required
                                className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                            />
                        </Field>
                        <Field label="Email" required>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                            />
                        </Field>
                        <Field label="Mot de passe" required>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                            />
                        </Field>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={connecting}
                            className="inter font-semibold bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 disabled:opacity-50 self-start"
                        >
                            {connecting ? "Connexion…" : "Se connecter"}
                        </button>
                    </form>
                )}
            </section>

            {status.connected && (
                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-neutral-200">
                        {(["collections", "sous-collections", "articles"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`inter text-sm px-4 py-2 border-b-2 -mb-px bg-transparent ${
                                    tab === t ? "border-neutral-900 font-semibold" : "border-transparent text-neutral-500"
                                }`}
                            >
                                {t === "collections" ? "Collections" : t === "sous-collections" ? "Sous-collections" : "Articles"}
                            </button>
                        ))}
                    </div>

                    {dataError && <p className="text-red-600 text-sm mb-4">{dataError}</p>}
                    {loadingData && <p className="text-neutral-500">Chargement…</p>}

                    {tab === "collections" && !loadingData && collections && (
                        collections.length === 0 ? (
                            <p className="text-neutral-500">Aucune collection.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {collections.map((col) => (
                                    <li key={col.id} className="border border-neutral-200 p-4 inter text-sm">
                                        <p className="font-semibold">{col.nom}</p>
                                        {col.description && <p className="text-neutral-500 mt-1">{col.description}</p>}
                                        <p className="text-neutral-400 mt-1">{col.quantite} article(s)</p>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                    {tab === "sous-collections" && !loadingData && sousCollections && (
                        sousCollections.length === 0 ? (
                            <p className="text-neutral-500">Aucune sous-collection.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {sousCollections.map((sc) => (
                                    <li key={sc.id} className="border border-neutral-200 p-4 inter text-sm">
                                        <p className="font-semibold">{sc.nom}</p>
                                        {sc.description && <p className="text-neutral-500 mt-1">{sc.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                    {tab === "articles" && (
                        <div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    loadArticles();
                                }}
                                className="flex gap-2 mb-4"
                            >
                                <input
                                    type="text"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Rechercher…"
                                    className="flex-1 border border-neutral-300 px-4 py-2 inter outline-none focus:border-neutral-900"
                                />
                                <button type="submit" className="inter text-sm border border-neutral-300 px-4 py-2 hover:bg-neutral-100">
                                    Rechercher
                                </button>
                            </form>
                            {!loadingData && articles && (
                                articles.length === 0 ? (
                                    <p className="text-neutral-500">Aucun article.</p>
                                ) : (
                                    <>
                                        <p className="text-neutral-400 text-xs mb-2">{articlesTotal} résultat(s)</p>
                                        <ul className="flex flex-col gap-2">
                                            {articles.map((a) => (
                                                <li
                                                    key={a.id}
                                                    className="border border-neutral-200 p-4 inter text-sm flex items-center justify-between gap-4"
                                                >
                                                    <div>
                                                        <p className="font-semibold">{a.nom}</p>
                                                        <p className="text-neutral-500 mt-1">{a.reference} · stock {a.stockTotal}</p>
                                                    </div>
                                                    <p className="font-semibold">{a.prixTTC} €</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="inter text-sm font-semibold text-neutral-700">
                {label}
                {required && <span className="text-red-600"> *</span>}
            </span>
            {children}
        </label>
    );
}
