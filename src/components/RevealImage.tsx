import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
    src: string;
    alt?: string;
    className?: string;
    imgClassName?: string;
    overlayClassName?: string;
    style?: CSSProperties;
    imgStyle?: CSSProperties;
    overlayStyle?: CSSProperties;
    initialScale?: number;
    finalScale?: number;
    duration?: number;
    delay?: number;
    parallax?: boolean;
    parallaxAmount?: number;
};

export default function RevealImage({
    src,
    alt = "",
    className = "",
    imgClassName = "",
    overlayClassName = "",
    style,
    imgStyle,
    overlayStyle,
    initialScale = 1.5,
    finalScale = 1,
    duration = 1000,
    delay = 0,
    parallax = false,
    parallaxAmount = 80,
}: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const playedRef = useRef(false);
    const scaleRef = useRef(initialScale);

    useEffect(() => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        const overlay = overlayRef.current;
        if (!wrap || !img || !overlay) return;

        scaleRef.current = initialScale;
        img.style.opacity = "0";
        img.style.transform = `scale(${initialScale})`;
        overlay.style.transform = "translateY(0%)";

        let observer: IntersectionObserver | null = null;
        let cancelled = false;
        let raf = 0;
        let parallaxY = 0;

        const applyTransform = () => {
            img.style.transform = `scale(${scaleRef.current}) translate3d(0, ${parallaxY}px, 0)`;
        };

        const updateParallax = () => {
            raf = 0;
            const rect = wrap.getBoundingClientRect();
            const vh = window.innerHeight;
            if (rect.bottom < 0 || rect.top > vh) return;
            const progress = (vh - rect.top) / (vh + rect.height);
            const clamped = Math.max(0, Math.min(1, progress));
            parallaxY = (clamped - 0.5) * parallaxAmount;
            applyTransform();
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(updateParallax);
        };

        (async () => {
            const { animate } = await import("animejs");
            if (cancelled) return;

            const play = () => {
                if (playedRef.current) return;
                playedRef.current = true;
                animate(overlay, {
                    translateY: ["0%", "100%"],
                    duration,
                    delay,
                    ease: "inOutCubic",
                });
                animate(img, {
                    opacity: [0, 1],
                    duration,
                    delay,
                    ease: "outQuad",
                });
                animate(scaleRef, {
                    current: [initialScale, finalScale],
                    duration,
                    delay,
                    ease: "outQuad",
                    onUpdate: () => applyTransform(),
                    onComplete: () => {
                        if (parallax) {
                            window.addEventListener("scroll", onScroll, { passive: true });
                            window.addEventListener("resize", onScroll);
                            updateParallax();
                        }
                    },
                });
            };

            observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            play();
                            observer?.disconnect();
                        }
                    }
                },
                { threshold: 0.3 }
            );
            observer.observe(wrap);
        })();

        return () => {
            cancelled = true;
            observer?.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [initialScale, finalScale, duration, delay, parallax, parallaxAmount]);

    return (
        <div ref={wrapRef} className={`relative overflow-hidden ${className}`} style={style}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
                style={{ willChange: "opacity, transform", ...imgStyle }}
            />
            <div
                ref={overlayRef}
                className={`absolute inset-0 bg-white pointer-events-none ${overlayClassName}`}
                style={{ zIndex: 5, willChange: "transform", ...overlayStyle }}
            />
        </div>
    );
}
