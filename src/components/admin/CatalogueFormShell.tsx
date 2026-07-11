import { useEffect, useState } from "react";
import CatalogueForm from "./CatalogueForm";

export default function CatalogueFormShell() {
    const [id, setId] = useState<number | null>(null);

    useEffect(() => {
        const match = window.location.pathname.match(/\/admin\/catalogue\/(\d+)/);
        if (match) setId(Number(match[1]));
    }, []);

    if (id === null) return <p className="text-neutral-500">Chargement…</p>;
    return <CatalogueForm mode="edit" id={id} />;
}
