import { BsCheck2Square, BsHouse, BsSearch, BsX, BsList } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../stores/language";
import { useState } from "react";

export default function Nav(
    { setCountryName, dataList }: { setCountryName: Function; dataList: string[] }
) {
    const [searchParam, setSearchParam] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const language = useLanguageStore((s) => s.language);
    const setLanguage = useLanguageStore((s) => s.setLanguage);

    return (
        <nav className="bg-neutral-800 text-white fixed top-0 w-full z-50">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                    <img src="icon.png" className="w-6" />
                    <h1 className="font-bold text-xl">World View</h1>
                </div>
                <BsList
                    className="text-2xl lg:hidden cursor-pointer"
                    onClick={() => setShowMenu(true)}
                />
            </div>

            <div
                className={`fixed top-0 left-0 h-screen w-full bg-neutral-800 lg:bg-transparent lg:h-auto lg:static lg:flex transition-transform ${showMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 gap-4 lg:gap-0`}
            >
                <BsX
                    className="text-3xl absolute top-2 right-2 lg:hidden cursor-pointer"
                    onClick={() => setShowMenu(false)}
                />

                {dataList.length > 0 && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setCountryName(searchParam);
                            setShowMenu(false);
                        }}
                        className="lg:flex-1"
                    >
                        <div className="bg-white text-black rounded-xl p-2 flex items-center gap-2">
                            <BsSearch />
                            <input
                                type="text"
                                className="focus:outline-0 flex-1 text-center"
                                placeholder={language === "pt" ? "Ache um país..." : "Find a country..."}
                                list="countries-list"
                                onChange={(e) => setSearchParam(e.target.value)}
                                value={searchParam}
                            />
                        </div>
                        <datalist id="countries-list">
                            {dataList.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </form>
                )}

                <ul className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:ml-4 items-center">
                    <li className="hover:underline">
                        <Link to="/" className="flex items-center gap-1" onClick={() => setShowMenu(false)}>
                            <BsHouse />
                            Home
                        </Link>
                    </li>
                    <li className="hover:underline">
                        <Link
                            to="/quiz"
                            className="flex items-center gap-1"
                            onClick={() => setShowMenu(false)}
                        >
                            <BsCheck2Square />
                            Quiz
                        </Link>
                    </li>
                    <li>
                        {language === "pt" ? (
                            <button
                                onClick={() => setLanguage("en")}
                                className="hover:underline"
                            >
                                🇧🇷 Português
                            </button>
                        ) : (
                            <button
                                onClick={() => setLanguage("pt")}
                                className="hover:underline"
                            >
                                🇺🇸 English
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}