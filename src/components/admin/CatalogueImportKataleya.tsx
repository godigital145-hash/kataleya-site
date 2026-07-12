import { useEffect, useState } from "react";

type Status = { connected: boolean; baseUrl?: string; email?: string };

type Collection = { id: string; nom: string; quantite: number };
type SousCollection = { id: string; collectionId: string; nom: string };
type Article = { id: string; nom: string; reference: string; prixTTC: number; stockTotal: number };

type Produit = {
    id: number;
    title: string;
    price: string | null;
    cover_image: string | null;
    remote_article_id: string | null;
};

type Tab = "collection" | "sous-collection" | "articles";

export default function CatalogueImportKataleya({ catalogueId }: { catalogueId: number }) {
    const [status, setStatus] = useState<Status | null>(null);
    const [produits, setProduits] = useState<Produit[] | null>(null);

    const [tab, setTab] = useState<Tab>("collection");
    const [collections, setCollections] = useState<Collection[] | null>(null);
    const [sousCollections, setSousCollections] = useState<SousCollection[] | null>(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState("");
    const [selectedSousCollectionId, setSelectedSousCollectionId] = useState("");

    const [q, setQ] = useState("");
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [selectedArticleIds, setSelectedArticleIds] = useState<Set<string>>(new Set());

    const [loadingData, setLoadingData] = useState(false);
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function loadStatus() {
        fetch("/api/admin/kataleya/status")
            .then((r) => r.json<Status>())
            .then(setStatus)
            .catch(() => setStatus({ connected: false }));
    }

    function loadProduits() {
        fetch(`/api/catalogues/${catalogueId}`)
            .then((r) => r.json<{ produits?: Produit[] }>())
            .then((data) => setProduits(data.produits ?? []))
            .catch(() => setProduits([]));
    }

    useEffect(() => {
        loadStatus();
        loadProduits();
    }, [catalogueId]);

    useEffect(() => {
        if (!status?.connected) return;
        if (tab === "collection" && collections === null) {
            setLoadingData(true);
            fetch("/api/admin/kataleya/collections")
                .then((r) => r.json<{ items?: Collection[] }>())
                .then((data) => setCollections(data.items ?? []))
                .finally(() => setLoadingData(false));
        }
        if (tab === "sous-collection" && collections === null) {
            setLoadingData(true);
            fetch("/api/admin/kataleya/collections")
                .then((r) => r.json<{ items?: Collection[] }>())
                .then((data) => setCollections(data.items ?? []))
                .finally(() => setLoadingData(false));
        }
    }, [tab, status?.connected]);

    function loadSousCollections(collectionId: string) {
        setSelectedCollectionId(collectionId);
        setSousCollections(null);
        if (!collectionId) return;
        setLoadingData(true);
        fetch(`/api/admin/kataleya/sous-collections?collectionId=${encodeURIComponent(collectionId)}`)
            .then((r) => r.json<{ items?: SousCollection[] }>())
            .then((data) => setSousCollections(data.items ?? []))
            .finally(() => setLoadingData(false));
    }

    function loadArticles(collectionId?: string) {
        setLoadingData(true);
        const qs = new URLSearchParams();
        if (q) qs.set("q", q);
        if (collectionId) qs.set("collectionId", collectionId);
        fetch(`/api/admin/kataleya/articles?${qs}`)
            .then((r) => r.json<{ items?: Article[] }>())
            .then((data) => setArticles(data.items ?? []))
            .finally(() => setLoadingData(false));
    }

    useEffect(() => {
        if (!status?.connected) return;
        if (tab === "articles" && articles === null) loadArticles(selectedCollectionId || undefined);
    }, [tab, status?.connected]);

    function toggleArticle(id: string) {
        setSelectedArticleIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    async function runImport(body: { collectionId?: string; sousCollectionId?: string; articleIds?: string[] }) {
        setImporting(true);
        setError(null);
        setMessage(null);
        const res = await fetch(`/api/admin/catalogues/${catalogueId}/kataleya-import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setImporting(false);
        const data = await res.json<{ imported?: number; error?: string }>().catch(() => ({}));
        if (!res.ok) {
            setError(data?.error || "Erreur lors de l'importation.");
            return;
        }
        setMessage(`${data.imported ?? 0} article(s) importé(s).`);
        setSelectedArticleIds(new Set());
        loadProduits();
    }

    async function onDeleteProduit(id: number) {
        if (!confirm("Supprimer ce produit du catalogue ?")) return;
        await fetch(`/api/admin/produits/${id}`, { method: "DELETE" });
        loadProduits();
    }

    if (!status) return null;

    return (
        <section className="max-w-3xl mt-12 border-t border-neutral-200 pt-10">
            <h2 className="inter font-semibold text-xl mb-4">Produits du catalogue</h2>

            {produits && produits.length > 0 && (
                <ul className="flex flex-col gap-2 mb-8">
                    {produits.map((p) => (
                        <li
                            key={p.id}
                            className="border border-neutral-200 p-3 inter text-sm flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                                    {p.cover_image && (
                                        <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <a href={`/admin/produits/${p.id}`} className="font-semibold no-underline text-neutral-900">
                                        {p.title}
                                    </a>
                                    {p.remote_article_id && (
                                        <span className="ml-2 text-xs text-neutral-400">(Kataleya)</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {p.price && <span>{p.price} €</span>}
                                <button
                                    onClick={() => onDeleteProduit(p.id)}
                                    className="text-red-600 bg-transparent border-0 cursor-pointer p-0 text-xs"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {produits && produits.length === 0 && (
                <p className="text-neutral-500 text-sm mb-8">Aucun produit lié pour l'instant.</p>
            )}

            <h3 className="inter font-semibold text-lg mb-4">Ajouter depuis le serveur Kataleya</h3>

            {!status.connected && (
                <p className="text-neutral-500 text-sm">
                    Non connecté au serveur Kataleya.{" "}
                    <a href="/admin/parametres" className="underline">
                        Configurer la connexion
                    </a>
                    .
                </p>
            )}

            {status.connected && (
                <div>
                    <div className="flex items-center gap-2 mb-6 border-b border-neutral-200">
                        {(["collection", "sous-collection", "articles"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`inter text-sm px-4 py-2 border-b-2 -mb-px bg-transparent ${
                                    tab === t ? "border-neutral-900 font-semibold" : "border-transparent text-neutral-500"
                                }`}
                            >
                                {t === "collection" ? "Collection" : t === "sous-collection" ? "Sous-collection" : "Articles"}
                            </button>
                        ))}
                    </div>

                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    {message && <p className="text-green-700 text-sm mb-4">{message}</p>}
                    {loadingData && <p className="text-neutral-500 text-sm mb-4">Chargement…</p>}

                    {tab === "collection" && collections && (
                        <div className="flex flex-col gap-3">
                            {collections.length === 0 ? (
                                <p className="text-neutral-500">Aucune collection.</p>
                            ) : (
                                collections.map((col) => (
                                    <div
                                        key={col.id}
                                        className="border border-neutral-200 p-4 inter text-sm flex items-center justify-between gap-4"
                                    >
                                        <div>
                                            <p className="font-semibold">{col.nom}</p>
                                            <p className="text-neutral-400 mt-1">{col.quantite} article(s)</p>
                                        </div>
                                        <button
                                            disabled={importing}
                                            onClick={() => runImport({ collectionId: col.id })}
                                            className="inter text-sm border border-neutral-300 px-4 py-2 hover:bg-neutral-100 disabled:opacity-50"
                                        >
                                            Importer tout
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {tab === "sous-collection" && collections && (
                        <div className="flex flex-col gap-4">
                            <select
                                value={selectedCollectionId}
                                onChange={(e) => loadSousCollections(e.target.value)}
                                className="border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                            >
                                <option value="">— Choisir une collection —</option>
                                {collections.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.nom}
                                    </option>
                                ))}
                            </select>

                            {sousCollections && (
                                <div className="flex flex-col gap-3">
                                    {sousCollections.length === 0 ? (
                                        <p className="text-neutral-500">Aucune sous-collection.</p>
                                    ) : (
                                        sousCollections.map((sc) => (
                                            <div
                                                key={sc.id}
                                                className="border border-neutral-200 p-4 inter text-sm flex items-center justify-between gap-4"
                                            >
                                                <p className="font-semibold">{sc.nom}</p>
                                                <button
                                                    disabled={importing}
                                                    onClick={() => runImport({ sousCollectionId: sc.id })}
                                                    className="inter text-sm border border-neutral-300 px-4 py-2 hover:bg-neutral-100 disabled:opacity-50"
                                                >
                                                    Importer tout
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "articles" && (
                        <div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    loadArticles(selectedCollectionId || undefined);
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

                            {articles && (
                                articles.length === 0 ? (
                                    <p className="text-neutral-500">Aucun article.</p>
                                ) : (
                                    <>
                                        <ul className="flex flex-col gap-2 mb-4">
                                            {articles.map((a) => (
                                                <li
                                                    key={a.id}
                                                    className="border border-neutral-200 p-3 inter text-sm flex items-center gap-3"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedArticleIds.has(a.id)}
                                                        onChange={() => toggleArticle(a.id)}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{a.nom}</p>
                                                        <p className="text-neutral-500">{a.reference} · stock {a.stockTotal}</p>
                                                    </div>
                                                    <p className="font-semibold">{a.prixTTC} €</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            disabled={importing || selectedArticleIds.size === 0}
                                            onClick={() => runImport({ articleIds: Array.from(selectedArticleIds) })}
                                            className="inter font-semibold bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 disabled:opacity-50"
                                        >
                                            Importer la sélection ({selectedArticleIds.size})
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
