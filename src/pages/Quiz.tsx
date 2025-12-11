import { useEffect, useRef, useState } from "react"
import WorldSvg from "../components/WorldSvg";
import ZoomableSvg from "../components/ZoomableSvg";
import { paintByName } from "../functions/svg";
import Nav from "../components/Nav";
import { getListOfCountries, getRandomNumber } from "../functions/misc";
import { countries } from "../data/countries";
import { BsSend } from "react-icons/bs";
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { useLanguageStore } from "../stores/language";

export default function Quiz() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [countryName, setCountryName] = useState("");
    const [randomCountry, setRandomCountry] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const language = useLanguageStore((s) => s.language);

    const paintRandomCountry = () => {
        if (!svgRef.current) return;
        const randomNumber = getRandomNumber(countries.length - 1);
        setRandomCountry(randomNumber);
        paintByName(svgRef.current, countries[randomNumber].name, "red");
    }

    useEffect(() => {
        paintRandomCountry();
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                buttonRef?.current?.click();
            } else {
                inputRef?.current?.focus();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleAnswer = () => {
        const c = countries[randomCountry];
        if (c.altSpellings?.includes(countryName) || c.name == countryName || c.nativeName == countryName || Object.values(c.translations).includes(countryName)) {
            toast.success(language == "en" ? "Right! Good job!" : "Correto! Parabéns!");
        } else {
            toast.warning(language == "en" ? `Wrong! The answer was ${c.name}` : `Errado! A resposta era ${c.translations.pt}`);
        }

        paintRandomCountry();
        setCountryName("");
    }

    return (
        <div className="bg-blue-100 max-h-screen w-full overflow-hidden">
            <Nav
                setCountryName={setCountryName}
                dataList={[]}
                setShowInfo={() => ""}
                showInfo={false}
            />
            <Toaster position="top-right" />
            <ZoomableSvg>
                <WorldSvg svgRef={svgRef} />
            </ZoomableSvg>

            <div className="w-full flex h-[10vh] fixed bottom-10 left-0">
                <input
                    ref={inputRef}
                    placeholder={language == "en" ? "Type your answer here..." : "Digite sua resposta aqui..."}
                    type="text"
                    list="countries-list"
                    className="w-[90%] py-4 px-2 text-center bg-white/90 focus:outline-0"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                />
                <datalist id="countries-list">
                    {getListOfCountries().map((c) => (
                        <option key={c} value={c} />
                    ))}

                </datalist>

                <button
                    ref={buttonRef}
                    onClick={() => handleAnswer()}
                    className="flex justify-center items-center w-[10%] py-4 border-l bg-green-600 text-white hover:bg-green-800 cursor-pointer"
                >
                    <BsSend />
                </button>
            </div>

            <footer className="fixed bottom-0 w-full bg-neutral-800 px-4 py-2 text-white flex justify-center z-50">
                <p>{language == "pt" ? "feito por" : "made by"} Pedro Borges &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}