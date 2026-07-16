import { useEffect, useState } from "react";
import { listProduits, deleteProduit, imgUrl } from "../../lib/api";

type Produit = {
    id: number;
    title: string;
    category: string | null;
    price: string | null;
    cover_image: string | null;
    catalogue_title: string | null;
    created_at: number;
};

export default function ProduitsList() {
    const [produits, setProduits] = useState<Produit[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            const res = await listProduits();
            const data = await res.json<{ produits: Produit[] }>();
            setProduits(data.produits);
        } catch (e) {
            setError("Impossible de charger les produits.");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id: number) {
        if (!confirm("Supprimer ce produit ?")) return;
        const res = await deleteProduit(id);
        if (res.ok) load();
        else alert("Erreur lors de la suppression.");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter" style={{ lineHeight: 1 }}>
                    Produits
                </h1>
                <a
                    href="/admin/produits/nouveau"
                    className="inter font-semibold bg-neutral-900 text-white px-5 py-3 no-underline hover:bg-neutral-700"
                >
                    + Nouveau produit
                </a>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {!produits && !error && <p className="text-neutral-500">Chargement…</p>}
            {produits && produits.length === 0 && (
                <p className="text-neutral-500">Aucun produit pour l'instant.</p>
            )}

            {produits && produits.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produits.map((p) => (
                        <div key={p.id} className="border border-neutral-200">
                            <div className="aspect-video bg-neutral-100 overflow-hidden">
                                {p.cover_image && (
                                    <img
                                        src={imgUrl(p.cover_image)}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-neutral-500 inter mb-1">
                                    {[p.catalogue_title, p.category, p.price].filter(Boolean).join(" · ") || "—"}
                                </div>
                                <h2 className="inter font-bold text-lg mb-3">{p.title}</h2>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`/admin/produits/${p.id}`}
                                        className="inter text-sm font-semibold no-underline text-neutral-900 hover:underline"
                                    >
                                        Modifier
                                    </a>
                                    <button
                                        onClick={() => onDelete(p.id)}
                                        className="inter text-sm font-semibold text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-0"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
