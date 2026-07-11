import { useState } from "react";
import Container from "../Container";
import Navbar from "../Navbar";
import { AkarIconsInstagramFill } from "../icons";
import Footer from "../Footer";

export default function ContactPage() {
    const [form, setForm] = useState({ nom: "", prenom: "", email: "", message: "" });
    const [sent, setSent] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.nom || !form.prenom || !form.email || !form.message) return;
        console.log("contact form", form);
        setSent(true);
        setForm({ nom: "", prenom: "", email: "", message: "" });
    };

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-11">
                    <div className="w-full lg:w-112.5">
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter mb-6 lg:mb-10" style={{ lineHeight: 1 }}>Contact</h1>
                        <p className="text-base md:text-lg text-neutral-700 mb-10">
                            Nous accompagnons chaque chantier avec rigueur et proximité pour un résultat à la hauteur de vos ambitions.
                        </p>
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="libre italic text-xl mb-2">E-mail</h3>
                                <a href="mailto:contact@lakataleya.com" className="inter text-neutral-700 hover:text-neutral-900">contact@lakataleya.com</a>
                            </div>
                            <div>
                                <h3 className="libre italic text-xl mb-2">Téléphone</h3>
                                <a href="tel:+237000000000" className="inter text-neutral-700 hover:text-neutral-900">+237 00 000 00 00</a>
                            </div>
                            <div>
                                <h3 className="libre italic text-xl mb-2">Adresse</h3>
                                <p className="inter text-neutral-700">Yaounde, Cameroun</p>
                            </div>
                            <div>
                                <h3 className="libre italic text-xl mb-3">Suivez-nous</h3>
                                <div className="flex items-center gap-3">
                                    <a href="#" aria-label="Facebook" className="h-10 w-10 flex items-center justify-center border border-neutral-300 hover:border-neutral-900 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" /></svg>
                                    </a>
                                    <a href="#" aria-label="Instagram" className="h-10 w-10 flex items-center justify-center border border-neutral-300 hover:border-neutral-900 transition-colors">
                                        <AkarIconsInstagramFill className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="lg:h-26"></div>
                        <div className="w-full">
                            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-5 mb-4">
                                    <Field label="Nom" name="nom" value={form.nom} onChange={onChange} />
                                    <Field label="Prénom" name="prenom" value={form.prenom} onChange={onChange} />
                                </div>
                                <Field label="E-mail" name="email" type="email" value={form.email} onChange={onChange} />
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="inter text-sm font-bold uppercase tracking-wide">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={onChange}
                                        rows={6}
                                        required
                                        className="w-full px-4 py-3 bg-slate-100 outline-none inter resize-none"
                                    />
                                </div>
                                <button type="submit" className="self-start px-8 py-3 bg-neutral-900 text-white inter font-bold uppercase tracking-wide hover:bg-neutral-700 transition-colors">
                                    Envoyer
                                </button>
                                {sent && <p className="inter text-sm text-green-700">Merci, votre message a bien été envoyé.</p>}
                            </form>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div className="mt-16 lg:mt-20">
                    <h2 className="libre italic text-2xl md:text-3xl mb-4 md:mb-6">Nous trouver</h2>
                    <div className="w-full h-75 md:h-112.5 overflow-hidden">
                        <iframe
                            title="Localisation La Kataleya"
                            src="https://www.google.com/maps?q=Yaound%C3%A9%2C%20Cameroun&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    )
}

function Field({
    label,
    name,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="inter text-sm font-bold uppercase tracking-wide">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                className="w-full px-4 py-3 bg-slate-100 outline-none inter"
            />
        </div>
    );
}