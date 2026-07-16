import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { Temoignage } from "./home";
import { RiArrowRightUpLine } from "../icons";
import { listTravaux, imgUrl } from "../../lib/api";

type Travail = {
    id: number;
    title: string;
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
            style={{ aspectRatio: ratio ?? "9 / 16" }}
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

export default function Travaux() {
    const [travaux, setTravaux] = useState<Travail[] | null>(null);

    useEffect(() => {
        listTravaux()
            .then((r) => r.json() as Promise<{ travaux: Travail[] }>)
            .then((d) => setTravaux(d.travaux))
            .catch(() => setTravaux([]));
    }, []);

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-11">
                    <div className="w-full lg:w-112.5">
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter">Nos Travaux</h1>
                        <div>
                            <p className="text-base md:text-lg mt-4 text-neutral-700">
                                Nos réalisations sont le reflet de notre passion pour l'excellence. Chaque chantier est mené avec rigueur afin d'offrir des espaces harmonieux, durables et élégants, conçus pour répondre aux attentes les plus exigeantes.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        {!travaux && <p className="text-neutral-500">Chargement…</p>}
                        {travaux && travaux.length === 0 && (
                            <p className="text-neutral-500">Aucune réalisation pour l'instant.</p>
                        )}
                        {travaux && travaux.length > 0 && (
                            <div className="columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:balance]">
                                {travaux.map((t) => (
                                    <a
                                        href={`/travaux/${t.id}`}
                                        key={t.id}
                                        className="group block mb-4 md:mb-6 break-inside-avoid relative overflow-hidden"
                                    >
                                        <div className="relative overflow-hidden">
                                            <ParallaxImage src={t.cover_image ? imgUrl(t.cover_image) : "/aff_1.jpg"} alt={t.title} />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                                            <div className="absolute bottom-0 left-0 p-4 md:p-8 flex items-center gap-2 text-white font-semibold text-base md:text-xl inter">
                                                <span>{t.category || t.title}</span>
                                                <RiArrowRightUpLine className="h-6 w-6 md:h-8 md:w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
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
