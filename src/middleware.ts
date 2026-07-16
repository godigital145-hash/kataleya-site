import { defineMiddleware } from "astro:middleware";
import { adminMe } from "./lib/api";

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

    try {
        const res = await adminMe(`${SESSION_COOKIE}=${token}`);
        const data = (await res.json()) as { authed?: boolean };
        if (!data.authed) return context.redirect("/admin/login");
    } catch {
        return context.redirect("/admin/login");
    }

    return next();
});
