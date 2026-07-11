import { useEffect, useState } from "react";
import TravailForm from "./TravailForm";

export default function TravailFormShell() {
    const [id, setId] = useState<number | null>(null);

    useEffect(() => {
        const match = window.location.pathname.match(/\/admin\/travaux\/(\d+)/);
        if (match) setId(Number(match[1]));
    }, []);

    if (id === null) return <p className="text-neutral-500">Chargement…</p>;
    return <TravailForm mode="edit" id={id} />;
}
