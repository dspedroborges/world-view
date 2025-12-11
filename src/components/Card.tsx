import { BsXCircle } from "react-icons/bs";

interface Country {
    name: string;
    topLevelDomain: string[];
    alpha2Code: string;
    alpha3Code: string;
    callingCodes: string[];
    capital?: string;
    altSpellings?: string[];
    subregion?: string;
    region?: string;
    population?: number;
    latlng?: number[];
    demonym?: string;
    area?: number;
    nativeName?: string;
    numericCode?: string;
    flags: { svg: string; png?: string };
    currencies?: { code?: string; name: string; symbol?: string }[];
    languages?: { iso639_1?: string; iso639_2?: string; name: string; nativeName?: string }[];
    translations?: Record<string, string | undefined>;
    flag?: string;
    regionalBlocs?: { acronym: string; name: string }[];
    cioc?: string;
    independent?: boolean;
    gini?: number;
}


interface CardProps {
    onClose: () => void;
    countryData?: Country;
    countryName: string;
    cardContent: Record<string, Record<string, string>>;
    language: string;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    comment: {
        isLoading: boolean;
        isError: boolean;
        data?: string;
    };
}

export default function Card({
    onClose,
    countryData,
    countryName,
    cardContent,
    language,
    audioRef,
    comment,
}: CardProps) {
    return (
        <div className="fixed top-1/2 lg:top-1/2 -translate-y-1/2 h-1/2 overflow-y-scroll border-4 lg:left-2 bg-neutral-200/80 shadow-2xl w-full md:w-[350px] text-neutral-800 rounded-b-xl">
            <div className="p-2 mb-4 bg-neutral-800 text-white w-full flex justify-center items-center sticky top-0 z-40">
                <h3 className="text-center font-bold text-xl w-[90%]">Info</h3>
                <BsXCircle
                    onClick={onClose}
                    className="hover:scale-110 cursor-pointer text-white ml-auto"
                />
            </div>


            {countryData && countryName !== "" ? (
                <div className="p-4">
                    <img
                        src={countryData.flags.svg}
                        alt="Country flag"
                        className="w-1/2 block mx-auto"
                    />
                    <audio ref={audioRef} className="mt-3" controls>
                        <source src="" type="audio/mp3" />
                        <source src="" type="audio/ogg" />
                        Your browser does not support the audio element.
                    </audio>

                    <ul className="mt-3">
                        <li>
                            <span>{cardContent[language].name}: </span>
                            <span className="font-bold">{countryName}</span>
                        </li>
                        <li>
                            <span>{cardContent[language].capital}: </span>
                            <span className="font-bold">{countryData.capital}</span>
                        </li>
                        <li>
                            <span>{cardContent[language].subregion}: </span>
                            <span className="font-bold">{countryData.subregion}</span>
                        </li>
                        <li>
                            <span>{cardContent[language].region}: </span>
                            <span className="font-bold">{countryData.region}</span>
                        </li>
                        <li>
                            <span>{cardContent[language].demonym}: </span>
                            <span className="font-bold">{countryData.demonym}</span>
                        </li>
                        <li>
                            <span>{cardContent[language].independent}: </span>
                            <span className="font-bold">
                                {countryData.independent ? "Yes" : "No"}
                            </span>
                        </li>
                        <li>
                            <span>{cardContent[language].gini}: </span>
                            <span className="font-bold">
                                {countryData.gini ? countryData.gini + "%" : "Unknown"}
                            </span>
                        </li>
                        {
                            countryData.languages && (
                                <li>
                                    <span>{cardContent[language].languages}: </span>
                                    {countryData.languages?.map((l, i) => (
                                        <span key={i} className="font-bold">
                                            {l.name}
                                            {countryData.languages!.length > 1 &&
                                                i !== countryData.languages!.length - 1 &&
                                                ", "}
                                        </span>
                                    ))}
                                </li>
                            )
                        }
                        {
                            countryData.currencies && (
                                <li>
                                    <span>{cardContent[language].currencies}: </span>
                                    {countryData.currencies.map((c, i) => (
                                        <span key={i} className="font-bold">
                                            {c.name} ({c.symbol})
                                            {countryData.currencies!.length > 1 &&
                                                i !== countryData.currencies!.length - 1 &&
                                                ", "}
                                        </span>
                                    ))}
                                </li>
                            )
                        }
                    </ul>
                </div>
            ) : countryName === "" ? (
                <p className="p-4 text-center animate-pulse">Click on a country to get the info.</p>
            ) : null}

            {!comment.isLoading && !comment.isError && <p className="mt-4 p-4">{comment.data}</p>}
        </div>
    );
}
