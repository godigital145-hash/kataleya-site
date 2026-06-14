import { useEffect, useState, type SubmitEventHandler } from "react";
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
                            aria-label="Menu"
                            onClick={() => setOpen((v) => !v)}
                            className="p-2 text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {open ? (
                                    <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                ) : (
                                    <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="lg:hidden border-t border-slate-100 pb-4">
                        <div className="flex flex-col font-bold text-base inter py-4 gap-3">
                            {links.map((l) => (
                                <a key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</a>
                            ))}
                            <div className="flex items-center gap-4 pt-2">
                                <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                                </a>
                                <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                                    <AkarIconsInstagramFill className="h-7 w-7" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </nav>
    );
}


export function NavbarSearch({ onSubmit }: { onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void }) {


    return (
        <nav className="bg-white sticky top-0 z-50">
            <Container>
                <div className="grid grid-cols-3 justify-between h-18 ">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-gray-700 hover:text-blue-500">
                            <img src={logo.src} alt="La Kataleya" className="h-10.25 w-auto" />
                        </a>
                        <div className="hidden md:flex flex-col gap-1">
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ÉLÉGANCE &</span>
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>FONCTIONNALITÉ RÉUNIES</span>
                        </div>
                    </div>
                    <div />
                    <div className="flex flex-1 items-center font-bold gap-4.75 text-base inter">
                        <form onSubmit={onSubmit} className="w-full">
                            <div className="w-full flex items-center px-4 py-2 bg-slate-100 gap-4">
                                <input type="search" placeholder="Type your research" className="flex-1 outline-0 outline-none" autoFocus name="search" />

                                <button className="text-gray-700 hover:text-blue-500">
                                    <RiSearchLine className="h-8 w-8" />
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </Container>
        </nav>
    );
}