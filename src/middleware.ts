import { defineMiddleware } from "astro:middleware";

const SESSION_COOKIE = "lk_admin";

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname } = context.url;

    if (!pathname.startsWith("/admin")) return next();
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
        return next();
    }

    const token = context.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
        return context.redirect("/admin/login");
    }

    const apiBase = import.meta.env.DEV ? "http://localhost:8788" : context.url.origin;
    try {
        const res = await fetch(`${apiBase}/api/admin/me`, {
            headers: { cookie: `${SESSION_COOKIE}=${token}` },
        });
        const data = (await res.json()) as { authed?: boolean };
        if (!data.authed) return context.redirect("/admin/login");
    } catch {
        return context.redirect("/admin/login");
    }

    return next();
});
