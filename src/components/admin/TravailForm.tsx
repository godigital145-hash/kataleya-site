import { useEffect, useState } from "react";
import { getTravail, adminUpload, createTravail, updateTravail, imgUrl } from "../../lib/api";

type Travail = {
    id: number;
    title: string;
    description: string;
    location: string | null;
    year: string | null;
    category: string | null;
    cover_image: string | null;
};

type Image = { id?: number; url: string; position: number };

type Props = { mode: "create" } | { mode: "edit"; id: number };

export default function TravailForm(props: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [year, setYear] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(props.mode === "edit");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (props.mode !== "edit") return;
        (async () => {
            try {
                const res = await getTravail(props.id);
                if (!res.ok) throw new Error("not found");
                const data = await res.json<{ travail: Travail; images: Image[] }>();
                setTitle(data.travail.title);
                setDescription(data.travail.description);
                setLocation(data.travail.location ?? "");
                setYear(data.travail.year ?? "");
                setCategory(data.travail.category ?? "");
                setCoverImage(data.travail.cover_image);
                setImages(data.images);
            } catch {
                setError("Travail introuvable.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function uploadFile(file: File): Promise<string | null> {
        const res = await adminUpload(file);
        if (!res.ok) return null;
        const data = await res.json<{ url: string }>();
        return data.url;
    }

    async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const url = await uploadFile(file);
        setUploading(false);
        if (url) setCoverImage(url);
        e.target.value = "";
    }

    async function onImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;
        setUploading(true);
        const uploaded: Image[] = [];
        for (const file of files) {
            const url = await uploadFile(file);
            if (url) uploaded.push({ url, position: images.length + uploaded.length });
        }
        setUploading(false);
        setImages([...images, ...uploaded]);
        e.target.value = "";
    }

    function removeImage(index: number) {
        const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, position: i }));
        setImages(next);
    }

    function moveImage(index: number, dir: -1 | 1) {
        const next = [...images];
        const swap = index + dir;
        if (swap < 0 || swap >= next.length) return;
        [next[index], next[swap]] = [next[swap], next[index]];
        setImages(next.map((img, i) => ({ ...img, position: i })));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        const payload = {
            title,
            description,
            location: location || null,
            year: year || null,
            category: category || null,
            cover_image: coverImage,
            images: images.map((i) => i.url),
        };
        const res = props.mode === "create" ? await createTravail(payload) : await updateTravail(props.id, payload);
        setSaving(false);
        if (!res.ok) {
            const data = await res.json<{ error?: string }>().catch(() => ({}));
            setError(data?.error || "Erreur lors de l'enregistrement.");
            return;
        }
        window.location.href = "/admin/travaux";
    }

    if (loading) return <p className="text-neutral-500">Chargement…</p>;
    if (error && props.mode === "edit" && !title) return <p className="text-red-600">{error}</p>;

    return (
        <form onSubmit={onSubmit} className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold inter" style={{ lineHeight: 1 }}>
                    {props.mode === "create" ? "Nouveau travail" : "Modifier le travail"}
                </h1>
                <a href="/admin/travaux" className="inter text-sm text-neutral-500 hover:text-neutral-900 no-underline">
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
                        rows={5}
                        className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                    />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Catégorie">
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                        />
                    </Field>
                    <Field label="Année">
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                        />
                    </Field>
                    <Field label="Lieu">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-neutral-300 px-4 py-3 inter outline-none focus:border-neutral-900"
                        />
                    </Field>
                </div>

                <Field label="Image de couverture">
                    <div className="flex items-center gap-4">
                        <div className="w-40 aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
                            {coverImage && (
                                <img src={imgUrl(coverImage)} alt="couverture" className="w-full h-full object-cover" />
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

                <Field label="Galerie">
                    <div className="flex flex-col gap-3">
                        <input type="file" accept="image/*" multiple onChange={onImagesChange} />
                        {uploading && <p className="text-xs text-neutral-500">Téléversement…</p>}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {images.map((img, i) => (
                                    <div key={i} className="border border-neutral-200">
                                        <div className="aspect-square bg-neutral-100 overflow-hidden">
                                            <img src={imgUrl(img.url)} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex justify-between items-center px-2 py-1 text-xs">
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(i, -1)}
                                                    className="bg-transparent border-0 cursor-pointer p-0"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(i, 1)}
                                                    className="bg-transparent border-0 cursor-pointer p-0"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="text-red-600 bg-transparent border-0 cursor-pointer p-0"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
