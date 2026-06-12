import Container from "./Container";
import logo from "../assets/Kataleya_titre.png";
import { AkarIconsInstagramFill, RiArrowRightUpLine } from "./icons";

export default function Footer() {
    const navigation = [
        { label: "Nos Travaux", href: "/travaux" },
        { label: "Catalogue", href: "/catalogue" },
        { label: "Qui Sommes-nous", href: "/qui-sommes-nous" },
        { label: "Contact", href: "/contact" },
    ];

    const services = [
        "Salle de bain",
        "Cuisine",
        "Carrelage",
        "Aménagement",
    ];

    return (
        <footer className="bg-neutral-950 text-white mt-30">
            <Container>
                <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <a href="/" className="flex items-center gap-4">
                            <img src={logo.src} alt="La Kataleya" className="h-12 w-auto" />
                        </a>
                        <div className="flex flex-col gap-1 inter">
                            <span className="font-extrabold text-[15px] leading-none">ÉLÉGANCE &</span>
                            <span className="font-extrabold text-[15px] leading-none">FONCTIONNALITÉ RÉUNIES</span>
                        </div>
                        <p className="inter text-neutral-400 text-base leading-relaxed max-w-sm">
                            Nous accompagnons chaque chantier avec rigueur et proximité pour un résultat à la hauteur de vos ambitions.
                        </p>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="libre italic text-xl">Navigation</h3>
                        <ul className="flex flex-col gap-3 inter">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className="text-neutral-300 hover:text-white inline-flex items-center gap-2 group">
                                        {item.label}
                                        <RiArrowRightUpLine className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="libre italic text-xl">Services</h3>
                        <ul className="flex flex-col gap-3 inter">
                            {services.map((item) => (
                                <li key={item} className="text-neutral-300">{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <h3 className="libre italic text-xl">Contact</h3>
                        <ul className="flex flex-col gap-3 inter text-neutral-300">
                            <li>
                                <a href="mailto:contact@lakataleya.com" className="hover:text-white">contact@lakataleya.com</a>
                            </li>
                            <li>
                                <a href="tel:+237000000000" className="hover:text-white">+237 00 000 00 00</a>
                            </li>
                            <li>Yaounde, Cameroun</li>
                        </ul>
                        <div className="flex items-center gap-3 mt-2">
                            <a href="#" aria-label="Facebook" className="h-10 w-10 flex items-center justify-center border border-neutral-700 hover:border-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="h-10 w-10 flex items-center justify-center border border-neutral-700 hover:border-white transition-colors">
                                <AkarIconsInstagramFill className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 inter text-sm text-neutral-500">
                    <p>
                        © {new Date().getFullYear()} La Kataleya — Plus qu'un <span className="libre italic text-neutral-300">style</span>, des solutions <span className="libre italic text-neutral-300">élégantes</span>.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="/mentions-legales" className="hover:text-white">Mentions légales</a>
                        <a href="/confidentialite" className="hover:text-white">Confidentialité</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
