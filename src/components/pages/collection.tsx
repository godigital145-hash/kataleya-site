import Container from "../Container";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { RiArrowLeftLongLine, RiArrowRightUpLine } from "../icons";
import { Partenaire } from "./home";

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
};

type Collection = {
    title: string;
    description: string;
    products: Product[];
};

const collections: Record<string, Collection> = {
    cuisine: {
        title: "Cuisine",
        description: "Des cuisines pensées pour allier fonctionnalité et élégance, conçues pour durer.",
        products: [
            { id: "c1", name: "Évier de Cuisine", price: "À partir de 120 000 FCFA", image: "/aff_1.jpg" },
            { id: "c2", name: "Plan de travail", price: "À partir de 180 000 FCFA", image: "/aff_2.jpg" },
            { id: "c3", name: "Robinet mitigeur", price: "À partir de 45 000 FCFA", image: "/aff_3.jpg" },
            { id: "c4", name: "Hotte aspirante", price: "À partir de 150 000 FCFA", image: "/aff_1.jpg" },
            { id: "c5", name: "Îlot central", price: "Sur devis", image: "/aff_2.jpg" },
            { id: "c6", name: "Rangement modulable", price: "Sur devis", image: "/aff_3.jpg" },
        ],
    },
    carrelage: {
        title: "Carrelage",
        description: "Une sélection de carrelages d'exception pour sublimer chaque pièce de votre intérieur.",
        products: [
            { id: "ca1", name: "Carrelage marbre", price: "À partir de 25 000 FCFA / m²", image: "/aff_2.jpg" },
            { id: "ca2", name: "Carrelage effet bois", price: "À partir de 18 000 FCFA / m²", image: "/aff_3.jpg" },
            { id: "ca3", name: "Mosaïque", price: "À partir de 30 000 FCFA / m²", image: "/aff_1.jpg" },
            { id: "ca4", name: "Grès cérame", price: "À partir de 15 000 FCFA / m²", image: "/aff_2.jpg" },
        ],
    },
    "salle-de-bain": {
        title: "Salle de Bain",
        description: "Transformez votre salle de bain en un espace de bien-être avec nos collections exclusives.",
        products: [
            { id: "s1", name: "Double Vasque", price: "À partir de 250 000 FCFA", image: "/aff_3.jpg" },
            { id: "s2", name: "Miroir LED", price: "À partir de 80 000 FCFA", image: "/aff_1.jpg" },
            { id: "s3", name: "Colonne de douche", price: "À partir de 175 000 FCFA", image: "/aff_2.jpg" },
            { id: "s4", name: "Baignoire îlot", price: "À partir de 450 000 FCFA", image: "/aff_3.jpg" },
            { id: "s5", name: "Meuble suspendu", price: "Sur devis", image: "/aff_1.jpg" },
        ],
    },
    amenagement: {
        title: "Aménagement",
        description: "Des solutions d'aménagement sur mesure pour des espaces harmonieux et fonctionnels.",
        products: [
            { id: "a1", name: "Lampe pendante", price: "À partir de 60 000 FCFA", image: "/aff_1.jpg" },
            { id: "a2", name: "Étagère murale", price: "Sur devis", image: "/aff_2.jpg" },
            { id: "a3", name: "Dressing", price: "Sur devis", image: "/aff_3.jpg" },
            { id: "a4", name: "Rangement intégré", price: "Sur devis", image: "/aff_1.jpg" },
        ],
    },
};

const defaultCollection: Collection = {
    title: "Collection",
    description: "Découvrez les produits de cette collection.",
    products: [],
};

export default function CollectionPage({ id }: { id: string }) {
    const collection = collections[id] ?? defaultCollection;

    return (
        <div>
            <Navbar />
            <div className="mt-10" />
            <Container>
                <div className="flex items-start gap-11 mb-16">
                    <div className="w-112.5">
                        <a href="/catalogue" className="inter text-sm text-neutral-500 hover:text-neutral-900 mb-6 flex items-center gap-4">
                            <RiArrowLeftLongLine className="h-6 w-6" />
                            Retour au catalogue</a>
                        <h1 className="text-[64px] font-bold inter mb-6" style={{ lineHeight: 1 }}>{collection.title}</h1>
                        <p className="text-lg text-neutral-700">{collection.description}</p>
                    </div>
                    <div className="flex-1 inter text-neutral-500 text-sm self-end">
                        {collection.products.length} produit{collection.products.length > 1 ? "s" : ""}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {collection.products.map((product) => (
                        <a key={product.id} href="#" className="group block">
                            <div className="relative aspect-square overflow-hidden border border-neutral-100 bg-neutral-100 mb-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="inter font-bold text-lg">{product.name}</h3>
                                    <p className="inter text-neutral-500 text-sm mt-1">{product.price}</p>
                                </div>
                                <RiArrowRightUpLine className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                            </div>
                        </a>
                    ))}
                </div>
            </Container>
            <div className="h-20 w-full" />
            <Partenaire />
            <Footer />
        </div>
    );
}
