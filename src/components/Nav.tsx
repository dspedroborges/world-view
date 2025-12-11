import { BsCheck2Square, BsGithub, BsHouse, BsInfo } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../stores/language";

export default function Nav(
    { setCountryName, dataList, setShowInfo, showInfo }:
        { setCountryName: Function, dataList: string[], setShowInfo: Function, showInfo: boolean }
) {
    const language = useLanguageStore((s) => s.language);
    const setLanguage = useLanguageStore((s) => s.setLanguage);

    return (
        <nav className="bg-neutral-800 px-4 py-2 text-white flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center fixed top-0 w-full z-50">
            <h1 className="font-bold flex items-center gap-1 text-xl">
                <img src="icon.png" className="w-4" />
                World View
            </h1>
            {
                dataList.length > 0 && (
                    <>
                        <input
                            type="text"
                            className="bg-white text-black rounded-xl p-2"
                            placeholder={`${language == "pt" ? "Ache um país..." : "Find a country..."}`}
                            list="countries-list"
                            onChange={(e) => {
                                setCountryName(e.target.value);
                            }}
                        />
                        <datalist id="countries-list">
                            {dataList.map((c) => (
                                <option key={c} value={c} />
                            ))}

                        </datalist>
                    </>
                )
            }
            <ul className="flex justify-end gap-8">
                {
                    dataList.length > 0 && (
                        <li className="cursor-pointer hover:underline">
                            <span onClick={() => setShowInfo(!showInfo)} className="flex items-center gap-1">
                                <BsInfo />
                                Info
                            </span>
                        </li>
                    )
                }
                <li className="cursor-pointer hover:underline">
                    <Link to="/" className="flex items-center gap-1">
                        <BsHouse />
                        Home
                    </Link>
                </li>
                <li className="cursor-pointer hover:underline">
                    <Link to="/quiz" className="flex items-center gap-1">
                        <BsCheck2Square />
                        Quiz
                    </Link>
                </li>
                <li className="cursor-pointer hover:underline">
                    <Link to="https://github.com/dspedroborges/world-view" target="_blank" className="flex items-center gap-1">
                        <BsGithub />
                        Github
                    </Link>
                </li>
                <li>
                    {
                        language == "pt" ? (
                            <button onClick={() => setLanguage("en")} className="cursor-pointer hover:underline">
                                🇧🇷 Português
                            </button>
                        ) : (
                            <button onClick={() => setLanguage("pt")} className="cursor-pointer hover:underline">
                                🇺🇸 English
                            </button>
                        )
                    }
                </li>
            </ul>
        </nav>
    )
}