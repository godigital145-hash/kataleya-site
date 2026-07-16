import { useEffect, useState } from "react";
import { adminMe } from "../../lib/api";

// Le cookie de session appartient au domaine du serveur (cross-origin), donc
// le middleware Astro (SSR côté front) ne peut jamais le lire. La seule
// vérification fiable se fait ici, côté navigateur, via un appel credentials
// "include" vers le serveur qui, lui, reçoit bien le cookie.
export default function AdminGuard() {
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        adminMe()
            .then((res) => res.json<{ authed?: boolean }>())
            .then((data) => {
                if (!data?.authed) {
                    window.location.href = "/admin/login";
                } else {
                    setChecking(false);
                }
            })
            .catch(() => {
                window.location.href = "/admin/login";
            });
    }, []);

    if (!checking) return null;

    return <div className="fixed inset-0 bg-white z-50" />;
}
