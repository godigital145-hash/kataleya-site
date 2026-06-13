import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { CeoQuote, Partenaire } from "./home";
import image_1 from "../../assets/images_1.jpg";
import RevealImage from "../RevealImage";

export default function QuiSommes() {
    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex items-start gap-11">
                    <div className="w-112.5">
                        <h1 className="text-[64px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Qui sommes-nous ?</h1>
                        <div>
                            <p className="text-lg mt-4 text-neutral-700">
                                Nos réalisations sont le reflet de notre passion pour l'excellence. Chaque chantier est mené avec rigueur afin d'offrir des espaces harmonieux, durables et élégants, conçus pour répondre aux attentes les plus exigeantes.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="w-full aspect-video overflow-hidden flex items-center">
                            <RevealImage src={image_1.src} alt="..." className="w-full aspect-video object-cover" parallax parallaxAmount={80} />
                            {/* <img src={image_1.src} alt="Qui sommes-nous ?" className="w-full aspect-video object-cover rounded-2xl" /> */}
                        </div>

                    </div>
                </div>
            </Container>
            <div className="mt-40" />
            <Container>
                <div className="flex items-start gap-11">
                    <div className="w-112.5">
                        <h1 className="text-[38px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Une vision fondée sur l'excellence</h1>
                        <div className="mb-8">
                            <p className="text-lg mt-4 text-neutral-700">
                                La Kataleya est une entreprise spécialisée dans la fourniture de solutions et de produits de qualité pour vos projets d'aménagement et de construction. Notre mission est d'accompagner nos clients avec professionnalisme afin de transformer leurs idées en réalisations durables et élégantes.
                            </p>
                        </div>
                        <h1 className="text-[38px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Un accompagnement de proximité</h1>
                        <div className="mb-8">
                            <p className="text-lg mt-4 text-neutral-700">
                                Nous croyons que chaque projet mérite une attention particulière. C'est pourquoi nous assurons un suivi personnalisé à chaque étape, en apportant conseils, expertise et solutions adaptées aux besoins de nos clients.
                            </p>
                        </div>

                    </div>
                    <div className="flex-1">
                        <div className="w-full aspect-video overflow-hidden flex items-center">
                            <RevealImage src={image_1.src} alt="..." className="w-full aspect-video object-cover" parallax parallaxAmount={80} />
                        </div>

                    </div>
                </div>
            </Container>
            <CeoQuote texte="Chez La Kataleya, nous accompagnons chaque chantier avec rigueur et proximité, en sélectionnant des produits de qualité qui allient performance, durabilité et élégance pour un résultat à la hauteur de vos ambitions." />
            <div className="mt-40" />
            <Container>
                <div className="flex items-start gap-11">
                    <div className="flex-1 grid grid-cols-3 gap-6">
                        <RevealImage src={image_1.src} alt="..." className=" aspect-9/16 object-cover" parallax parallaxAmount={80} />
                        <RevealImage src={image_1.src} alt="..." className=" aspect-9/16 object-cover" parallax parallaxAmount={80} delay={.5} />
                        <RevealImage src={image_1.src} alt="..." className=" aspect-9/16 object-cover" parallax parallaxAmount={80} delay={1} />
                        {/* <div className="w-full aspect-video overflow-hidden flex items-center">
                        </div> */}
                    </div>
                    <div className="w-112.5">
                        <h1 className="text-[38px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Une vision fondée sur l'excellence</h1>
                        <div className="mb-8">
                            <p className="text-lg mt-4 text-neutral-700">
                                La Kataleya est une entreprise spécialisée dans la fourniture de solutions et de produits de qualité pour vos projets d'aménagement et de construction. Notre mission est d'accompagner nos clients avec professionnalisme afin de transformer leurs idées en réalisations durables et élégantes.
                            </p>
                        </div>
                        <h1 className="text-[38px] font-bold inter mb-10" style={{ lineHeight: 1 }}>Un accompagnement de proximité</h1>
                        <div className="mb-8">
                            <p className="text-lg mt-4 text-neutral-700">
                                Nous croyons que chaque projet mérite une attention particulière. C'est pourquoi nous assurons un suivi personnalisé à chaque étape, en apportant conseils, expertise et solutions adaptées aux besoins de nos clients.
                            </p>
                        </div>

                    </div>

                </div>
            </Container>
            <div className="h-20 w-full" />
            <Partenaire />
            <Footer />
        </div>)
}