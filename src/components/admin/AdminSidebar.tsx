import logo from "../../assets/Kataleya_titre.PNG";

type Link = { href: string; label: string; key: string };

const links: Link[] = [
    { href: "/admin", label: "Tableau de bord", key: "dashboard" },
    { href: "/admin/travaux", label: "Travaux", key: "travaux" },
    { href: "/admin/produits", label: "Produits", key: "produits" },
    { href: "/admin/catalogue", label: "Catalogue", key: "catalogue" },
    { href: "/admin/messages", label: "Messages", key: "messages" },
    { href: "/admin/parametres", label: "Paramètres", key: "parametres" },
];

type Props = { active?: string };

export default function AdminSidebar({ active = "" }: Props) {
    return (
        <aside
            className="hidden lg:flex flex-col justify-between shrink-0 bg-white px-6 pb-6 h-dvh"
            style={{ width: 375 }}
        >
            <div>
                <div className="flex items-center pt-10 pb-8 h-18 gap-3">
                    <a href="/admin" className="flex items-center gap-3 no-underline">
                        <img src={logo.src} alt="La Kataleya" className="h-10.25 w-auto" />
                    </a>
                    <div className="flex flex-col gap-1">
                        <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>
                            ESPACE
                        </span>
                        <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>
                            ADMINISTRATEUR
                        </span>
                    </div>
                </div>
                <nav className="flex-1 mt-10">
                    <ul className="flex flex-col gap-1 list-none p-0 m-0 inter">
                        {links.map((l) => {
                            const isActive = active === l.key;
                            return (
                                <li key={l.key}>
                                    <a
                                        href={l.href}
                                        className={
                                            "block px-4 py-3 no-underline font-semibold transition-colors " +
                                            (isActive
                                                ? "bg-neutral-900 text-white"
                                                : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100")
                                        }
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <div className="px-6">
                <a
                    href="/admin/logout"
                    className="inter text-sm font-bold uppercase tracking-wide text-neutral-500 hover:text-neutral-900 no-underline"
                >
                    Déconnexion
                </a>
            </div>
        </aside>
    );
}
