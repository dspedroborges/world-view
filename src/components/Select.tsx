import { useState, useEffect, useRef } from "react";
import { BsCaretDownFill, BsCaretUpFill, BsCheck2Circle, BsCircle, BsSearch } from "react-icons/bs";

type Option = { label: string; image?: { src: string, size: string }; description?: string; value: string };

type Props = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    includeSearch: boolean;
    multiple: boolean;
};

export default function Select({ options, value, onChange, includeSearch, multiple }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const selected = value && typeof value === "string" ? value.split(",") : [];

    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    const filtered = includeSearch
        ? options.filter(o => {
            if (!search) return;
            const result =
                o.label.toLowerCase().includes(search.toLowerCase()) ||
                o.description?.toLowerCase().includes(search.toLowerCase());
            return result;
        })
        : options;

    function toggle(v: string) {
        console.log({ v })
        if (multiple) {
            if (selected.includes(v)) {
                onChange(selected.filter(s => s !== v).join(","));
            } else {
                onChange([...selected, v].join(","));
            }
        } else {
            if (selected.includes(v)) {
                onChange("");
            } else {
                onChange(v);
            }
        }

        if (!multiple) setOpen(false);
    }

    const getSelectedLabels = () => {
        let labels: string[] = [];
        options.forEach(o => {
            if (selected.includes(o.value)) labels.push(o.label);
        });
        if (!labels.length) return "Find a country...";
        return labels.join(", ");
    };

    return (
        <div ref={ref} className="w-full relative bg-white">
            <div
                className="text-gray-900 border border-gray-300 p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                onClick={() => setOpen(!open)}
            >
                <p>{getSelectedLabels()}</p>
                {!open && <BsCaretDownFill />}
                {open && <BsCaretUpFill />}
            </div>

            {open && (
                <div className="absolute w-full shadow-xl py-2 bg-gray-100 p-2 border-gray-300 border-x border-b">
                    {includeSearch && (
                        <div className="border border-gray-300 rounded-xl mb-2 p-4 flex items-center">
                            <input
                                className="w-full h-full focus:outline-0"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                            />
                            <BsSearch className="text-gray-600" />
                        </div>
                    )}

                    <div>
                        {filtered.map(o => (
                            <div
                                className={`first:rounded-t-xl last:rounded-b-xl pb-4 px-2 pt-2 border-gray-200 hover:bg-gray-50 cursor-pointer ${selected.includes(o.value) && "bg-green-100 hover:bg-green-200"} relative flex items-center gap-3`}
                                key={o.value}
                                onClick={() => toggle(o.value)}
                            >
                                {o.image && <img src={o.image.src} className={
                                    `
                                        ${o.image.size == "small" && "w-8"}
                                        ${o.image.size == "medium" && "w-12"}
                                        ${o.image.size == "large" && "w-24"}    
                                    `
                                } />}
                                <div>
                                    <p>{o.label}</p>
                                    {o.description && <p className="text-xs text-gray-600">{o.description}</p>}
                                </div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
                                    {selected.includes(o.value) ? <BsCheck2Circle className="text-xl" /> : <BsCircle />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}