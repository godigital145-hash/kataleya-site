import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";

import { RiArrowRightUpLine } from "../icons";
import { Partenaire } from "./home";

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
            const y = (clamped - 0.5) * 120;
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
            style={{ aspectRatio: ratio ?? "1/1" }}
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
                style={{ transform: "scale(1.1)", willChange: "transform" }}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </div>
    );
}

export default function Catalogue() {
    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex items-start gap-11">
                    <div className="w-112.5">
                        <h1 className="text-[64px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Notre Catalogue</h1>
                        <div>
                            <p className="text-lg mt-4 text-neutral-700">
                                Nos réalisations sont le reflet de notre passion pour l'excellence. Chaque chantier est mené avec rigueur afin d'offrir des espaces harmonieux, durables et élégants, conçus pour répondre aux attentes les plus exigeantes.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="columns-3 gap-6 [column-fill:balance]">
                            {[
                                { src: "/aff_1.jpg", label: "Cuisine", slug: "cuisine" },
                                { src: "/aff_2.jpg", label: "Carrelage", slug: "carrelage" },
                                { src: "/aff_3.jpg", label: "Salle de Bains", slug: "salle-de-bain" },
                                { src: "/aff_1.jpg", label: "Aménagement", slug: "amenagement" },
                                { src: "/aff_2.jpg", label: "Cuisine sur mesure", slug: "cuisine" },
                                { src: "/aff_3.jpg", label: "Carrelage d'exception", slug: "carrelage" },
                            ].map((item, i) => (
                                <a
                                    href={`/catalogue/${item.slug}`}
                                    key={i}
                                    className="group block mb-6 break-inside-avoid relative overflow-hidden"
                                >
                                    <div className="relative overflow-hidden">
                                        <ParallaxImage src={item.src} alt={item.label} />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 p-8 flex items-center gap-2 text-white font-semibold text-3xl inter">
                                            <span>{item.label}</span>
                                            <RiArrowRightUpLine className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
            <div className="h-20 w-full" />
            <Partenaire />
            <Footer />
        </div>
    )
}