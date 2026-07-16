import { useEffect, useState } from "react";
import { listCatalogues, deleteCatalogue, imgUrl } from "../../lib/api";

type Catalogue = {
    id: number;
    title: string;
    description: string | null;
    cover_image: string;
    created_at: number;
};

export default function CataloguesList() {
    const [catalogues, setCatalogues] = useState<Catalogue[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            const res = await listCatalogues();
            const data = await res.json<{ catalogues: Catalogue[] }>();
            setCatalogues(data.catalogues);
        } catch (e) {
            setError("Impossible de charger les catalogues.");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id: number) {
        if (!confirm("Supprimer ce catalogue ?")) return;
        const res = await deleteCatalogue(id);
        if (res.ok) load();
        else alert("Erreur lors de la suppression.");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter" style={{ lineHeight: 1 }}>
                    Catalogue
                </h1>
                <a
                    href="/admin/catalogue/nouveau"
                    className="inter font-semibold bg-neutral-900 text-white px-5 py-3 no-underline hover:bg-neutral-700"
                >
                    + Nouveau catalogue
                </a>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {!catalogues && !error && <p className="text-neutral-500">Chargement…</p>}
            {catalogues && catalogues.length === 0 && (
                <p className="text-neutral-500">Aucun catalogue pour l'instant.</p>
            )}

            {catalogues && catalogues.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalogues.map((cat) => (
                        <div key={cat.id} className="border border-neutral-200">
                            <div className="aspect-video bg-neutral-100 overflow-hidden">
                                <img
                                    src={imgUrl(cat.cover_image)}
                                    alt={cat.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="inter font-bold text-lg mb-3">{cat.title}</h2>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`/admin/catalogue/${cat.id}`}
                                        className="inter text-sm font-semibold no-underline text-neutral-900 hover:underline"
                                    >
                                        Modifier
                                    </a>
                                    <button
                                        onClick={() => onDelete(cat.id)}
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
