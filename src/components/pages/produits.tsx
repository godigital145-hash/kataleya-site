import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { Temoignage } from "./home";
import { RiArrowRightUpLine } from "../icons";

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

export default function Produits() {
    const [produits, setProduits] = useState<Produit[] | null>(null);

    useEffect(() => {
        fetch("/api/produits")
            .then((r) => r.json() as Promise<{ produits: Produit[] }>)
            .then((d) => setProduits(d.produits))
            .catch(() => setProduits([]));
    }, []);

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-11">
                    <div className="w-full lg:w-112.5">
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter" style={{ lineHeight: 1 }}>Nos Produits</h1>
                        <div>
                            <p className="text-base md:text-lg mt-4 text-neutral-700">
                                Découvrez notre sélection de produits, pensés pour allier qualité, élégance et durabilité.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        {!produits && <p className="text-neutral-500">Chargement…</p>}
                        {produits && produits.length === 0 && (
                            <p className="text-neutral-500">Aucun produit pour l'instant.</p>
                        )}
                        {produits && produits.length > 0 && (
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
                    </div>
                </div>
            </Container>
            <div className="h-20 w-full" />
            <Temoignage />
            <Footer />
        </div>
    );
}
