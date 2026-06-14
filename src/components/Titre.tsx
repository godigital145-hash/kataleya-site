import { RiArrowRightLine } from "./icons";

export default function Titre({ title, url }: { title: string, url?: string, }) {
    return (
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold inter py-5 md:py-7">
                {title}
            </h2>
            {
                url && (
                    <a href={url} className="px-3 py-2 md:px-4 bg-white/20 inline-flex items-center gap-2 md:gap-4 text-base md:text-xl">
                        Voir plus
                        <RiArrowRightLine className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                )
            }
        </div>
    )
}