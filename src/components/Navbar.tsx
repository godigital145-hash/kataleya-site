import { Fragment, useEffect, useState, type SubmitEventHandler } from "react";
import Container from "./Container";
import logo from "../assets/Kataleya_titre.PNG";
import { AkarIconsInstagramFill, RiSearchLine } from "./icons";

export default function Navbar() {
    const [path, setPath] = useState("");
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setPath(window.location.pathname);
    }, []);

    const links = [
        { href: "/travaux", label: "Nos Travaux" },
        { href: "/catalogue", label: "Catalogue" },
        { href: "/qui-sommes-nous", label: "Qui Sommes-nous" },
        { href: "/contact", label: "Contact" },
    ];

    const linkClass = (href: string) =>
        `hover:text-blue-500 ${path === href || path.startsWith(href + "/") ? "text-blue-500" : "text-gray-700"}`;

    return (
        <nav className="bg-white sticky top-0 z-50">
            <Container>
                <div className="flex justify-between items-center h-18">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-gray-700 hover:text-blue-500">
                            <img src={logo.src} alt="La Kataleya" className="h-10.25 w-auto" />
                        </a>
                        <div className="hidden md:flex flex-col gap-1">
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ÉLÉGANCE &</span>
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>FONCTIONNALITÉ RÉUNIES</span>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center font-bold gap-4.75 text-base inter">
                        {links.map((l) => (
                            <a key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</a>
                        ))}
                        <a href="/search" className="text-gray-700 hover:text-blue-500">
                            <RiSearchLine className="h-8 w-8" />
                        </a>
                        <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                        </a>
                        <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                            <AkarIconsInstagramFill className="h-8 w-8" />
                        </a>
                    </div>
                    <div className="flex lg:hidden items-center gap-3">
                        <a href="/search" className="text-gray-700 hover:text-blue-500">
                            <RiSearchLine className="h-7 w-7" />
                        </a>
                        <button
                            aria-label="Ouvrir le menu"
                            onClick={() => setOpen(true)}
                            className="flex items-center justify-center h-13 aspect-square rounded-xl text-black active:bg-slate-100 active:text-black duration-300 ease-in-out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Container>
            <div
                className={`lg:hidden fixed top-0 w-dvw h-dvh bg-black z-50 flex flex-col justify-between transition-[right] duration-300 ease-in-out ${open ? "right-0" : "right-[-100%]"}`}
            >
                <div>
                    <div className="px-6 pt-6 pb-3 flex justify-end">
                        <button
                            aria-label="Fermer le menu"
                            onClick={() => setOpen(false)}
                            className="text-white text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                    <nav>
                        <ul className="flex flex-col list-none gap-4 flex-1 justify-center px-6 inter">
                            <span className="w-full" />
                            <li>
                                <a href="/" className="text-white mx-2 no-underline font-semibold hover:text-blue-400 transition-colors">
                                    Accueil
                                </a>
                            </li>
                            {links.map((l) => (
                                <Fragment key={l.href}>
                                    <span className="w-full border-t border-white/30" />
                                    <li>
                                        <a href={l.href} className="text-white mx-2 no-underline font-semibold hover:text-blue-400 transition-colors">
                                            {l.label}
                                        </a>
                                    </li>
                                </Fragment>
                            ))}

                        </ul>
                    </nav>
                </div>
                <div className="px-6 pb-6 flex items-end justify-between">
                    <a href="/" className="flex flex-col items-start gap-2 no-underline">
                        <img src={logo.src} alt="La Kataleya" className="w-auto h-13 object-contain" />
                        <span className="text-white text-base font-extrabold leading-tight tracking-wide inter">
                            ÉLÉGANCE &<br />FONCTIONNALITÉ RÉUNIES
                        </span>
                    </a>
                    <div className="flex gap-3 items-center">
                        <a href="#" aria-label="Facebook" className="text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="text-blue-400">
                            <AkarIconsInstagramFill className="h-7 w-7" />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}


export function NavbarSearch({ onSubmit }: { onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void }) {
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/travaux", label: "Nos Travaux" },
        { href: "/catalogue", label: "Catalogue" },
        { href: "/qui-sommes-nous", label: "Qui Sommes-nous" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50">
            <Container>
                <div className="flex flex-col lg:grid lg:grid-cols-3 lg:items-center lg:justify-between gap-4 py-4 lg:py-0 lg:h-18">
                    <div className="flex items-center justify-between gap-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <a href="/" className="text-gray-700 hover:text-blue-500">
                                <img src={logo.src} alt="La Kataleya" className="h-10.25 w-auto" />
                            </a>
                            <div className="hidden md:flex flex-col gap-1">
                                <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ÉLÉGANCE &</span>
                                <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>FONCTIONNALITÉ RÉUNIES</span>
                            </div>
                        </div>
                        <button
                            aria-label="Ouvrir le menu"
                            onClick={() => setOpen(true)}
                            className="lg:hidden flex items-center justify-center h-13 aspect-square rounded-xl text-black active:bg-slate-100 active:text-black duration-300 ease-in-out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div className="hidden lg:block" />
                    <div className="flex w-full items-center font-bold gap-4.75 text-base inter">
                        <form onSubmit={onSubmit} className="w-full">
                            <div className="w-full flex items-center px-3 md:px-4 py-2 bg-slate-100 gap-2 md:gap-4">
                                <input type="search" placeholder="Type your research" className="flex-1 outline-0 outline-none min-w-0" autoFocus name="search" />

                                <button className="text-gray-700 hover:text-blue-500 shrink-0">
                                    <RiSearchLine className="h-6 w-6 md:h-8 md:w-8" />
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Container>
            <div
                className={`lg:hidden fixed top-0 w-dvw h-dvh bg-black z-50 flex flex-col justify-between transition-[right] duration-300 ease-in-out ${open ? "right-0" : "right-[-100%]"}`}
            >
                <div>
                    <div className="px-6 pt-6 pb-3 flex justify-end">
                        <button
                            aria-label="Fermer le menu"
                            onClick={() => setOpen(false)}
                            className="text-white text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                    <nav>
                        <ul className="flex flex-col list-none gap-4 flex-1 justify-center px-6 inter">
                            <span className="w-full" />
                            <li>
                                <a href="/" className="text-white mx-2 no-underline font-semibold hover:text-blue-400 transition-colors">
                                    Accueil
                                </a>
                            </li>
                            {links.map((l) => (
                                <Fragment key={l.href}>
                                    <span className="w-full border-t border-white/30" />
                                    <li>
                                        <a href={l.href} className="text-white mx-2 no-underline font-semibold hover:text-blue-400 transition-colors">
                                            {l.label}
                                        </a>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="px-6 pb-6 flex items-end justify-between">
                    <a href="/" className="flex flex-col items-start gap-2 no-underline">
                        <img src={logo.src} alt="La Kataleya" className="w-auto h-13 object-contain" />
                        <span className="text-white text-base font-extrabold leading-tight tracking-wide inter">
                            ÉLÉGANCE &<br />FONCTIONNALITÉ RÉUNIES
                        </span>
                    </a>
                    <div className="flex gap-3 items-center">
                        <a href="#" aria-label="Facebook" className="text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="text-blue-400">
                            <AkarIconsInstagramFill className="h-7 w-7" />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}