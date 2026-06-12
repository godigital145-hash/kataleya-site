import { RiArrowRightLine } from "./icons";

export default function Titre({ title, url }: { title: string, url?: string, }) {
    return (
        <div className="flex items-center gap-6">
            <h2 className="text-[40px] font-bold inter py-7">
                {title}
            </h2>
            {
                url && (
                    <a href={url} className="px-4 py-2 bg-white/20 inline-flex items-center gap-4 text-xl">
                        Voir plus
                        <RiArrowRightLine className="w-6 h-6" />
                    </a>
                )
            }
        </div>
    )
}