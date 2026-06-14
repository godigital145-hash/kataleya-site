import { useEffect, useState } from "react";
import Container from "../Container";
import { NavbarSearch } from "../Navbar";
import images_1 from "../../assets/images_1.jpg";
import diaporama from "../../assets/diaporama.jpg";
import CEO from "../../assets/CEO.jpg";
import CEO_2 from "../../assets/CEO_2.jpg";
import background from "../../assets/background.svg";
import Footer from "../Footer";

const quickSearches = [
    { label: "Evier de Cuisine", image: images_1.src },
    { label: "Double Vasque", image: diaporama.src },
    { label: "Mirroir", image: CEO.src },
    { label: "Lampe Pendante", image: CEO_2.src },
    { label: "Événements", image: background.src },
];

export default function SeachPage() {
    const [searchList, setSearchList] = useState<string[]>([])

    useEffect(() => {
        const raw = window.localStorage.getItem('listSearch')
        setSearchList(raw === null ? [] : JSON.parse(raw))
    }, [])

    const addToResearchList = (value: string) => {
        const raw = window.localStorage.getItem('listSearch')
        const lastContent = (raw === null ? [] : JSON.parse(raw)) as string[]
        const filtered = lastContent.filter((v) => v !== value)
        const next = [value, ...filtered].slice(0, 10)
        window.localStorage.setItem('listSearch', JSON.stringify(next))
        setSearchList(next)
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('search') as HTMLInputElement | null;
        const value = input?.value.trim() ?? '';
        if (!value) return;
        addToResearchList(value);
    }
    return (
        <div>
            <NavbarSearch onSubmit={handleSearch} />
            <TitreAndRecentSearch searchList={searchList} />
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
                    {quickSearches.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => addToResearchList(item.label)}
                            className="relative aspect-square overflow-hidden group"
                        >
                            <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/30" />
                            <span className="absolute bottom-5 left-6 right-6 text-white inter font-bold text-left">{item.label}</span>
                        </button>
                    ))}
                </div>
                <div className="h-[70vh]">

                </div>
            </Container>
            <Footer />
        </div>
    )
}

function TitreAndRecentSearch({ searchList }: { searchList: string[] }) {

    return (
        <div className="mt-10">
            <Container>
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold inter mb-5" style={{ lineHeight: 1 }}>Recherche</h1>
                {
                    searchList && (<div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-xl font-bold">Dernière Recherche</h3>
                        {searchList.map((item) => (
                            <span key={item} className="px-4 py-2 bg-slate-100 inter">{item}</span>
                        ))}
                    </div>)
                }
            </Container>
        </div>
    )
}
