import { useEffect, useState } from "react";
import Container from "./Container";
import logo from "../assets/Kataleya_titre.png";
import { AkarIconsInstagramFill } from "./icons";

export default function Navbar() {
    const [path, setPath] = useState("");
    useEffect(() => {
        setPath(window.location.pathname);
    }, []);

    const links = [
        { href: "/travaux", label: "Nos Travaux" },
        { href: "/catalogue", label: "Catalogue" },
        { href: "/qui-sommes-nous", label: "Qui Sommes-nous" },
    ];

    const linkClass = (href: string) =>
        `hover:text-blue-500 ${path === href || path.startsWith(href + "/") ? "text-blue-500" : "text-gray-700"}`;

    return (
        <nav className="bg-white sticky top-0 z-50">
            <Container>
                <div className="flex justify-between h-18">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-gray-700 hover:text-blue-500">
                            <img src={logo.src} alt="La Kataleya" className="h-10.25 w-auto" />
                        </a>
                        <div className="hidden md:flex flex-col gap-1">
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>ÉLÉGANCE &</span>
                            <span className="font-extrabold inter text-[15px]" style={{ lineHeight: 1 }}>FONCTIONNALITÉ RÉUNIES</span>
                        </div>
                    </div>
                    <div className="flex items-center font-bold gap-4.75 text-base inter">
                        {links.map((l) => (
                            <a key={l.href} href={l.href} className={linkClass(l.href)}>{l.label}</a>
                        ))}
                        <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                        </a>
                        <a href="/travaux" className="text-gray-700 hover:text-blue-500">
                            <AkarIconsInstagramFill className="h-8 w-8" />
                        </a>
                    </div>
                </div>
            </Container>
        </nav>
    );
}