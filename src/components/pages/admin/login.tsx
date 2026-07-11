import { useState } from "react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!password) return;
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
                credentials: "same-origin",
            });
            if (res.ok) {
                window.location.href = "/admin";
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data?.error || "Mot de passe incorrect.");
            }
        } catch {
            setError("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-white px-6 py-16">
            <div className="w-full max-w-md">
                <div className="mb-10">
                    <span className="block font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ESPACE</span>
                    <span className="block font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ADMINISTRATEUR</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold inter mb-4" style={{ lineHeight: 1 }}>Connexion</h1>
                <p className="text-base md:text-lg text-neutral-700 mb-10">
                    Entrez votre mot de passe pour accéder à l'espace administrateur de La Kataleya.
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="inter text-sm font-bold uppercase tracking-wide">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            className="w-full px-4 py-3 bg-slate-100 outline-none inter"
                        />
                    </div>

                    {error && <p className="inter text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="self-start px-8 py-3 bg-neutral-900 text-white inter font-bold uppercase tracking-wide hover:bg-neutral-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <div className="mt-10 inter text-sm text-neutral-500">
                    <a href="/" className="hover:text-neutral-900">← Retour au site</a>
                </div>
            </div>
        </div>
    );
}
