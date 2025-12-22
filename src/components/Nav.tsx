import { BsCheck2Square, BsHouse } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../stores/language";
import Select from "./Select";

export default function Nav(
    { setCountryName, countryName, dataList }:
        { setCountryName: Function, countryName?: string, dataList: string[] }
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
                        {/* <form onSubmit={(e) => {
                            e.preventDefault();
                            setCountryName(searchParam);
                        }}>
                            <div className="bg-white text-black p-2 flex items-center gap-2">
                                <BsSearch />
                                <input
                                    type="text"
                                    className="focus:outline-0"
                                    placeholder={`${language == "pt" ? "Ache um país..." : "Find a country..."}`}
                                    list="countries-list"
                                    onChange={(e) => setSearchParam(e.target.value)}
                                    onBlur={() => setCountryName(searchParam)}
                                    value={searchParam}
                                />
                            </div>
                        </form> */}
                        <div className="text-black w-full lg:w-1/3">
                            <Select
                                options={dataList.map(c => ({ label: c, value: c }))}
                                value={countryName || ""}
                                onChange={(value: string) => setCountryName(value)}
                                includeSearch={true}
                                multiple={false}
                            />
                        </div>
                        <datalist id="countries-list">
                            {dataList.map((c) => (
                                <option key={c} value={c} />
                            ))}

                        </datalist>
                    </>
                )
            }
            <ul className="flex justify-end gap-8">
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