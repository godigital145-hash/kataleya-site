import { defineMiddleware } from "astro:middleware";

// Le cookie de session appartient au domaine du serveur (worker distinct),
// donc il n'est jamais visible ici côté SSR front. La vérification réelle
// se fait côté client dans AdminGuard.tsx via un appel credentials "include".
export const onRequest = defineMiddleware(async (_context, next) => next());
