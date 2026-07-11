import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { RiArrowLeftLongLine, RiArrowRightUpLine } from "../icons";
import { Partenaire } from "./home";

type Catalogue = {
    id: number;
    title: string;
    description: string | null;
    cover_image: string;
};

type Produit = {
    id: number;
    title: string;
    price: string | null;
    category: string | null;
    cover_image: string | null;
};

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [ratio, setRatio] = useState<string | null>(null);
    useEffect(() => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        if (!wrap || !img) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const rect = wrap.getBoundingClientRect();
            const vh = window.innerHeight;
            if (rect.bottom < 0 || rect.top > vh) return;
            const progress = (vh - rect.top) / (vh + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            const y = (clamped - 0.5) * 80;
            img.style.transform = `scale(1.2) translate3d(0, ${y}px, 0)`;
        };
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [ratio]);
    return (
        <div
            ref={wrapRef}
            className="relative w-full overflow-hidden bg-neutral-100"
            style={{ aspectRatio: ratio ?? "1 / 1" }}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth && img.naturalHeight) {
                        setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
                    }
                }}
                style={{ transform: "scale(1.2)", willChange: "transform" }}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </div>
    );
}

export default function CatalogueDetail({ id: propsId }: { id?: string }) {
    const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let realId = propsId && propsId !== "_" ? propsId : "";
        if (!realId) {
            const match = window.location.pathname.match(/\/catalogue\/([^/]+)/);
            if (match) realId = match[1];
        }
        if (!realId) {
            setNotFound(true);
            return;
        }
        fetch(`/api/catalogues/${realId}`)
            .then(async (r) => {
                if (!r.ok) throw new Error("not found");
                return r.json() as Promise<{ catalogue: Catalogue; produits: Produit[] }>;
            })
            .then((d) => {
                setCatalogue(d.catalogue);
                setProduits(d.produits);
            })
            .catch(() => setNotFound(true));
    }, [propsId]);

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <a
                    href="/catalogue"
                    className="inter text-sm text-neutral-500 hover:text-neutral-900 mb-6 flex items-center gap-4"
                >
                    <RiArrowLeftLongLine className="h-6 w-6" />
                    Retour au catalogue
                </a>

                {notFound && <p className="text-neutral-500">Catalogue introuvable.</p>}
                {!catalogue && !notFound && <p className="text-neutral-500">Chargement…</p>}

                {catalogue && (
                    <>
                        <h1
                            className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter mb-6 lg:mb-8"
                            style={{ lineHeight: 1.05 }}
                        >
                            {catalogue.title}
                        </h1>

                        {catalogue.description && (
                            <p className="text-base md:text-lg text-neutral-700 mb-10 lg:mb-14 max-w-3xl">
                                {catalogue.description}
                            </p>
                        )}

                        <div className="w-full aspect-video overflow-hidden mb-10 lg:mb-14">
                            <img
                                src={catalogue.cover_image}
                                alt={catalogue.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {produits.length === 0 && (
                            <p className="text-neutral-500">Aucun produit dans ce catalogue pour l'instant.</p>
                        )}

                        {produits.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {produits.map((p) => (
                                    <a key={p.id} href={`/produits/${p.id}`} className="group block">
                                        <div className="relative overflow-hidden mb-4">
                                            <ParallaxImage src={p.cover_image || "/aff_1.jpg"} alt={p.title} />
                                        </div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="inter font-bold text-base md:text-lg">{p.title}</h3>
                                                {p.price && (
                                                    <p className="inter text-neutral-500 text-sm mt-1">{p.price}</p>
                                                )}
                                            </div>
                                            <RiArrowRightUpLine className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </Container>
            <div className="h-20 w-full" />
            <Partenaire />
            <Footer />
        </div>
    );
}
