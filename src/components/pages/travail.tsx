import { useEffect, useState } from "react";
import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { RiArrowLeftLongLine } from "../icons";
import { Temoignage } from "./home";

type Travail = {
    id: number;
    title: string;
    description: string;
    location: string | null;
    year: string | null;
    category: string | null;
    cover_image: string | null;
};

type Image = { id: number; url: string; position: number };

export default function TravailPage({ id: propsId }: { id?: string }) {
    const [travail, setTravail] = useState<Travail | null>(null);
    const [images, setImages] = useState<Image[]>([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let realId = propsId && propsId !== "_" ? propsId : "";
        if (!realId) {
            const match = window.location.pathname.match(/\/travaux\/([^/]+)/);
            if (match) realId = match[1];
        }
        if (!realId) {
            setNotFound(true);
            return;
        }
        fetch(`/api/travaux/${realId}`)
            .then(async (r) => {
                if (!r.ok) throw new Error("not found");
                return r.json() as Promise<{ travail: Travail; images: Image[] }>;
            })
            .then((d) => {
                setTravail(d.travail);
                setImages(d.images);
            })
            .catch(() => setNotFound(true));
    }, [propsId]);

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="max-w-4xl mx-auto">
                    <a
                        href="/travaux"
                        className="inter text-sm text-neutral-500 hover:text-neutral-900 mb-6 flex items-center gap-4"
                    >
                        <RiArrowLeftLongLine className="h-6 w-6" />
                        Retour aux travaux
                    </a>

                    {notFound && <p className="text-neutral-500">Travail introuvable.</p>}
                    {!travail && !notFound && <p className="text-neutral-500">Chargement…</p>}

                    {travail && (
                        <>
                            <div className="flex flex-wrap items-center gap-3 mb-4 inter text-sm text-neutral-500">
                                {travail.category && <span>{travail.category}</span>}
                                {travail.category && travail.year && <span className="h-1 w-1 rounded-full bg-neutral-400" />}
                                {travail.year && <span>{travail.year}</span>}
                                {travail.year && travail.location && <span className="h-1 w-1 rounded-full bg-neutral-400" />}
                                {travail.location && <span>{travail.location}</span>}
                            </div>

                            <h1
                                className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter mb-6 lg:mb-8"
                                style={{ lineHeight: 1.05 }}
                            >
                                {travail.title}
                            </h1>

                            <p className="text-base md:text-lg text-neutral-700 mb-10 lg:mb-14">
                                {travail.description}
                            </p>

                            {travail.cover_image && (
                                <div className="w-full aspect-video overflow-hidden mb-8 lg:mb-12">
                                    <img
                                        src={travail.cover_image}
                                        alt={travail.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-6 lg:gap-10">
                                {images.map((img) => (
                                    <div key={img.id} className="w-full overflow-hidden">
                                        <img
                                            src={img.url}
                                            alt={`${travail.title}`}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </Container>
            <div className="h-20 w-full" />
            <Temoignage />
            <Footer />
        </div>
    );
}
