import { useEffect, useState } from "react";

type Travail = {
    id: number;
    title: string;
    category: string | null;
    year: string | null;
    location: string | null;
    cover_image: string | null;
    created_at: number;
};

export default function TravauxList() {
    const [travaux, setTravaux] = useState<Travail[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        try {
            const res = await fetch("/api/travaux");
            const data = await res.json<{ travaux: Travail[] }>();
            setTravaux(data.travaux);
        } catch (e) {
            setError("Impossible de charger les travaux.");
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onDelete(id: number) {
        if (!confirm("Supprimer ce travail ?")) return;
        const res = await fetch(`/api/admin/travaux/${id}`, { method: "DELETE" });
        if (res.ok) load();
        else alert("Erreur lors de la suppression.");
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter" style={{ lineHeight: 1 }}>
                    Travaux
                </h1>
                <a
                    href="/admin/travaux/nouveau"
                    className="inter font-semibold bg-neutral-900 text-white px-5 py-3 no-underline hover:bg-neutral-700"
                >
                    + Nouveau travail
                </a>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {!travaux && !error && <p className="text-neutral-500">Chargement…</p>}
            {travaux && travaux.length === 0 && (
                <p className="text-neutral-500">Aucun travail pour l'instant.</p>
            )}

            {travaux && travaux.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {travaux.map((t) => (
                        <div key={t.id} className="border border-neutral-200">
                            <div className="aspect-video bg-neutral-100 overflow-hidden">
                                {t.cover_image && (
                                    <img
                                        src={t.cover_image}
                                        alt={t.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-neutral-500 inter mb-1">
                                    {[t.category, t.year, t.location].filter(Boolean).join(" · ") || "—"}
                                </div>
                                <h2 className="inter font-bold text-lg mb-3">{t.title}</h2>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`/admin/travaux/${t.id}`}
                                        className="inter text-sm font-semibold no-underline text-neutral-900 hover:underline"
                                    >
                                        Modifier
                                    </a>
                                    <button
                                        onClick={() => onDelete(t.id)}
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
