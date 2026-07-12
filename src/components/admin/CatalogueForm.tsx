import { useEffect, useState } from "react";
import CatalogueImportKataleya from "./CatalogueImportKataleya";

type Catalogue = {
    id: number;
    title: string;
    description: string | null;
    cover_image: string;
};

type Props = { mode: "create" } | { mode: "edit"; id: number };

export default function CatalogueForm(props: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(props.mode === "edit");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (props.mode !== "edit") return;
        (async () => {
            try {
                const res = await fetch(`/api/catalogues/${props.id}`);
                if (!res.ok) throw new Error("not found");
                const data = await res.json<{ catalogue: Catalogue }>();
                setTitle(data.catalogue.title);
                setDescription(data.catalogue.description ?? "");
                setCoverImage(data.catalogue.cover_image);
            } catch {
                setError("Catalogue introuvable.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        setUploading(false);
        if (res.ok) {
            const data = await res.json<{ url: string }>();
            setCoverImage(data.url);
        }
        e.target.value = "";
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!coverImage) {
            setError("L'image principale est requise.");
            return;
        }
        setSaving(true);
        const payload = {
            title,
            description: description || null,
            cover_image: coverImage,
        };
        const url = props.mode === "create" ? "/api/admin/catalogues" : `/api/admin/catalogues/${props.id}`;
        const method = props.mode === "create" ? "POST" : "PUT";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        setSaving(false);
        if (!res.ok) {
            const data = await res.json<{ error?: string }>().catch(() => ({}));
            setError(data?.error || "Erreur lors de l'enregistrement.");
            return;
        }
        window.location.href = "/admin/catalogue";
    }

    if (loading) return <p className="text-neutral-500">Chargement…</p>;
    if (error && props.mode === "edit" && !title) return <p className="text-red-600">{error}</p>;

    return (
        <>
        <form onSubmit={onSubmit} className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold inter" style={{ lineHeight: 1 }}>
                    {props.mode === "create" ? "Nouveau catalogue" : "Modifier le catalogue"}
                </h1>
                <a href="/admin/catalogue" className="inter text-sm text-neutral-500 hover:text-neutral-900 no-underline">
                    Annuler
                </a>
            </div>

            <div className="flex flex-col gap-5">
                <Field label="Titre" required>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                    />
                </Field>

                <Field label="Description">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                    />
                </Field>

                <Field label="Image principale" required>
                    <div className="flex items-center gap-4">
                        <div className="w-40 aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
                            {coverImage && (
                                <img src={coverImage} alt="couverture" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <input type="file" accept="image/*" onChange={onCoverChange} />
                            {coverImage && (
                                <button
                                    type="button"
                                    onClick={() => setCoverImage(null)}
                                    className="inter text-xs text-red-600 bg-transparent border-0 cursor-pointer self-start p-0"
                                >
                                    Retirer
                                </button>
                            )}
                        </div>
                    </div>
                </Field>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="inter font-semibold bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 disabled:opacity-50"
                    >
                        {saving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </div>
        </form>
        {props.mode === "edit" && <CatalogueImportKataleya catalogueId={props.id} />}
        </>
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
