import { useEffect, useState } from "react";
import ProduitForm from "./ProduitForm";

export default function ProduitFormShell() {
    const [id, setId] = useState<number | null>(null);

    useEffect(() => {
        const match = window.location.pathname.match(/\/admin\/produits\/(\d+)/);
        if (match) setId(Number(match[1]));
    }, []);

    if (id === null) return <p className="text-neutral-500">Chargement…</p>;
    return <ProduitForm mode="edit" id={id} />;
}
