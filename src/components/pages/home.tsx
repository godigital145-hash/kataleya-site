import { useEffect, useRef, useState } from "react";
import Container from "../Container";
import { RiArrowLeftLine, RiArrowRightLine, RiArrowRightLongLine, RiArrowRightUpLine } from "../icons";
import Navbar from "../Navbar";
import Footer from "../Footer";
import image_1 from "../../assets/images_1.jpg";
import quote from "../../assets/quote.png"
import Titre from "../Titre";
import RevealImage from "../RevealImage";
import diaporama from "../../assets/diaporama.jpg"

import CEO from "../../assets/CEO_2.jpg";

export default function Home() {
    const suite_Image = ["/aff_1.jpg", "/aff_2.jpg", "/aff_3.jpg"]
    return (
        <div className="relative">
            <Navbar />
            <Header />
            <HeaderImage />
            <SectionOfTree image={suite_Image} title="Nos travaux" />
            <CeoQuote texte="Chez La Kataleya, nous accompagnons chaque chantier avec rigueur et proximité, en sélectionnant des produits de qualité qui allient performance, durabilité et élégance pour un résultat à la hauteur de vos ambitions." />
            <Partenaire />
            <Diaporama />
            <Panorama />
            <Temoignage />
            <Footer />
        </div>
    )
}

function Header() {
    return (
        <section>
            <Container>
                <div className="min-h-[60vh] md:h-150 flex flex-col items-start justify-center gap-4 inter py-10 md:py-0">
                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold">
                        Plus qu'un <span className="relative libre italic font-bold deco z-3 before:bg-amber-400">style</span>, <br />
                        Des solutions <span className="relative libre italic font-bold deco z-3 before:bg-blue-400">Élégantes</span>
                    </h1>
                    <a href="/travaux" className="px-4 py-3 bg-slate-200 inter text-sm md:text-lg uppercase flex items-center gap-4 font-bold">
                        Découvrez nos travaux
                        <RiArrowRightLongLine className="h-6 w-6 md:h-8 md:w-8" />
                    </a>
                </div>
            </Container>
        </section>
    )
}

function HeaderImage() {
    const slides = [
        { src: image_1.src, label: "Un intérieur qui inspire" },
        { src: "/aff_1.jpg", label: "Des cuisines sur mesure" },
        { src: "/aff_2.jpg", label: "Salles de bain raffinées" },
        { src: "/aff_3.jpg", label: "Carrelage d'exception" },
    ];
    const STRIPS = 8;
    const STAGGER = 100;
    const STRIP_DURATION = 1000;
    const TOTAL = STRIP_DURATION + STAGGER * (STRIPS - 1) + 50;

    const [current, setCurrent] = useState(0);
    const [incoming, setIncoming] = useState<number | null>(null);
    const lockRef = useRef(false);
    const stripsContainerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLSpanElement | null>(null);

    const go = (target: number) => {
        if (lockRef.current) return;
        lockRef.current = true;
        const idx = (target + slides.length) % slides.length;
        setIncoming(idx);
        window.setTimeout(() => {
            setCurrent(idx);
            setIncoming(null);
            lockRef.current = false;
        }, TOTAL);
    };

    useEffect(() => {
        const id = window.setInterval(() => {
            if (!lockRef.current) go(current + 1);
        }, 6000);
        return () => window.clearInterval(id);
    }, [current]);

    useEffect(() => {
        if (incoming === null) return;
        const container = stripsContainerRef.current;
        if (!container) return;
        let cancelled = false;
        (async () => {
            const { animate, stagger } = await import("animejs");
            if (cancelled) return;
            const strips = container.querySelectorAll<HTMLElement>("[data-strip]");
            const flashes = container.querySelectorAll<HTMLElement>("[data-strip-flash]");
            animate(strips, {
                opacity: [
                    { to: 1, duration: STRIP_DURATION / 2 },
                    { to: 0, duration: STRIP_DURATION / 2 },
                ],
                delay: stagger(STAGGER),
                ease: "inOutSine",
            });
            animate(flashes, {
                opacity: [
                    { to: 1, duration: STRIP_DURATION / 2, ease: "inSine" },
                    { to: 0, duration: STRIP_DURATION / 2, ease: "outSine" },
                ],
                delay: stagger(STAGGER),
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [incoming]);

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;
        let cancelled = false;
        (async () => {
            const { animate } = await import("animejs");
            if (cancelled) return;
            animate(el, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 300,
                ease: "outQuad",
            });
        })();
        return () => {
            cancelled = true;
        };
    }, [current]);

    const active = slides[current];
    const next = incoming !== null ? slides[incoming] : null;

    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = (vh - rect.top) / (vh + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            const y = (clamped - 0.5) * 120;
            el.style.setProperty("--parallax-y", `${y}px`);
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
    }, []);

    return (
        <Container>
            <div ref={wrapRef} className="h-[60vh] md:h-200 relative overflow-hidden">
                {next && (
                    <img
                        src={next.src}
                        alt=""
                        className="absolute inset-0 object-cover object-[50%_30%] h-full w-full parallax-img"
                    />
                )}
                <div ref={stripsContainerRef} className="absolute inset-0 flex">
                    {Array.from({ length: STRIPS }).map((_, i) => (
                        <div
                            key={`${current}-${incoming ?? "x"}-${i}`}
                            data-strip
                            className="relative h-full overflow-hidden"
                            style={{ width: `${100 / STRIPS}%` }}
                        >
                            <img
                                src={active.src}
                                alt={active.label}
                                className="absolute top-0 h-full max-w-none object-cover object-[50%_30%] parallax-img"
                                style={{
                                    width: `${STRIPS * 100}%`,
                                    left: `-${i * 100}%`,
                                }}
                            />
                            {next && (
                                <div
                                    data-strip-flash
                                    className="absolute inset-0 bg-white pointer-events-none"
                                    style={{ opacity: 0 }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute flex w-full h-full p-4 md:p-7 top-0 left-0 items-end text-white z-10">
                    <div className="flex items-center text-lg md:text-3xl pb-2 w-1/2 md:w-[30%]">
                        <span key={current} className="font-bold uppercase title-up">{active.label}</span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 ml-auto">
                        <button onClick={() => go(current - 1)} className="p-2 flex w-10 md:w-12 aspect-square hover:bg-slate-200/40">
                            <RiArrowLeftLine className="h-6 w-6 md:h-8 md:w-8" />
                        </button>
                        <button onClick={() => go(current + 1)} className="p-2 flex w-10 md:w-12 aspect-square hover:bg-slate-200/40">
                            <RiArrowRightLine className="h-6 w-6 md:h-8 md:w-8" />
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export function Diaporama() {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
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
            const y = (clamped - 0.9) * 200;
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
    }, []);
    return (
        <section className="mt-30">
            <div className="relative w-full h-[80vh] md:h-[110vh]">
                <div ref={wrapRef} className="h-full w-full overflow-hidden relative">
                    <img
                        ref={imgRef}
                        src={diaporama.src}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ transform: "scale(1.2)", willChange: "transform" }}
                    />
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex items-end py-20">
                    <div className="w-full">
                        <Container>
                            <div className="flex justify-center md:justify-end items-end">
                                <div className="p-6 md:p-8 bg-white w-full md:w-137.5 space-y-5">
                                    <h1 className="text-3xl md:text-5xl font-bold inter mb-4">Des cuisines pensées pour inspirer</h1>
                                    <p className="text-base md:text-lg">
                                        Bien plus qu'un simple espace de préparation, la cuisine est le cœur de la maison. Chez La Kataleya, nous créons des cuisines élégantes et fonctionnelles, conçues avec des matériaux de qualité et des finitions soignées pour offrir un cadre de vie à la fois chaleureux et raffiné.
                                    </p>
                                    <a href="" className="flex items-center justify-between p-4 border-2 border-slate-100 bg-slate-100 mt-6 font-bold uppercase">
                                        Voir notre catalogue de cuisine
                                        <RiArrowRightLongLine className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function CeoQuote({ texte }: { texte: string }) {
    return (
        <section className="mt-24 mb-24 flex items-center">
            <Container>
                <div className="flex flex-col lg:flex-row gap-12 lg:items-center lg:h-250 py-10">
                    <div className="inter w-full lg:w-150 relative">
                        <img src={quote.src} alt="Quote" className="absolute -top-8 -left-4 md:-top-15 md:-left-15 w-16 md:w-auto" />
                        <p className="text-xl md:text-3xl lg:text-[40px] leading-snug text-neutral-900 -mt-4 relative">
                            {texte}
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-4 w-full lg:w-auto">
                        <RevealImage
                            src={CEO.src}
                            alt="CEO"
                            parallax
                            parallaxAmount={120}
                            className="aspect-9/16 w-full lg:w-100 max-w-100 bg-neutral-200"
                        />
                        <div>
                            <p className="libre font-bold text-lg md:text-xl lg:text-2xl">Bernard NGOM</p>
                            <p className="libre italic text-neutral-700 text-lg md:text-xl lg:text-2xl">CEO de la Kataleya</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

function SectionOfTree({ image }: { image: string[], title: string }) {
    const liste_Image = [
        { titre: "Salle de bain", image: image[0] },
        { titre: "Cuisine", image: image[1] },
        { titre: "Carrelage", image: image[2] },
    ]
    const Image = ({ image, title }: { image: string, title: string }) => {
        return (
            <a href="#" className="group">
                <div className="relative aspect-square overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                    </div>
                    <div className="absolute z-10 h-full w-full flex items-end justify-start bg-black/40 text-white text-2xl md:text-4xl font-semibold p-4 md:p-8 gap-3">
                        <span>{title}</span>
                        <RiArrowRightUpLine className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>
            </a>
        )
    }
    return (
        <section className="mt-6">
            <div className="md:hidden overflow-x-auto scrollbar-none snap-x snap-mandatory">
                <div className="flex w-fit gap-4 px-4">
                    {liste_Image.map((item, index) => (
                        <div key={index} className="shrink-0 w-75 snap-center">
                            <Image image={item.image} title={item.titre} />
                        </div>
                    ))}
                </div>
            </div>
            <Container>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liste_Image.map((item, index) => (
                        <Image key={index} image={item.image} title={item.titre} />
                    ))}
                </div>
            </Container>
        </section>
    )
}

export function Partenaire() {
    const liste_Marque = [
        '/logo_1.webp',
        '/logo_2.webp',
        '/logo_3.webp',
        '/logo_4.webp',
        '/logo_5.webp',
        '/logo_6.webp',
        '/logo_7.webp',
        '/logo_8.webp',
        '/logo_9.webp',
        '/logo_10.webp',
        '/logo_11.webp',
        '/logo_12.webp',
        '/logo_13.webp',
        '/logo_14.webp',
        '/logo_15.webp',
        '/logo_16.webp',
    ]
    return (
        <section>
            <Container>
                <Titre title="Les Marques Que Nous Aimons" />
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
                    {liste_Marque.map((marque, index) => (
                        <div key={index} className="aspect-square w-full border border-slate-300">
                            <img src={marque} alt={`Marque ${index + 1}`} className="object-contain h-full w-full p-4" />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}

function Panorama() {
    return (
        <section className="relative py-5 mt-10">
            <div className="w-full h-full md:h-150 absolute top-0 left-0 z-0" />
            <div className="relative z-10 md:h-187.5">
                <Container>
                    <Titre title="Nos travaux en images" url="/travaux" />
                    {/* <div className="text-white">
                    </div> */}
                </Container>
                <div className="mx-auto px-4 md:px-8 lg:px-19 overflow-x-auto scrollbar-none">
                    <div className="w-fit flex items-center gap-6 ">
                        <div className="w-72 md:w-md h-80 md:h-134 bg-amber-50" />
                        <div className="w-72 md:w-md h-80 md:h-134 bg-amber-50" />
                        <div className="w-72 md:w-md h-80 md:h-134 bg-amber-50" />
                        <div className="w-72 md:w-md h-80 md:h-134 bg-amber-50" />
                        <div className="w-72 md:w-md h-80 md:h-134 bg-amber-50" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export function Temoignage() {
    return (
        <section>
            <Container>
                <Titre title="Ce que nos clients disent..." />
            </Container>
            <div className="w-full overflow-hidden">
                <div className="marquee items-center py-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`a-${i}`} className="w-72 md:w-md h-56 md:h-70 bg-slate-100 shrink-0 mr-6" />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`b-${i}`} className="w-72 md:w-md h-56 md:h-70 bg-slate-100 shrink-0 mr-6" aria-hidden="true" />
                    ))}
                </div>
            </div>
        </section>
    )
}