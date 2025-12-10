import { useEffect, useRef, useState } from "react"
import WorldSvg from "./components/WorldSvg";
import ZoomableSvg from "./components/ZoomableSvg";
import { useQuery } from "@tanstack/react-query";
import { fetchComment } from "./requests/pollinations";
import Spinner from "./components/Spinner";
import { BsCheck2Square, BsGithub, BsInfo, BsXCircle } from "react-icons/bs";
import { countries } from "./data/countries";

type CardContentEntry = {
  name: string;
  capital: string;
  subregion: string;
  region: string;
  demonym: string;
  independent: string;
  gini: string;
  languages: string;
  currencies: string;
};

type CardContent = {
  Portuguese: CardContentEntry;
  English: CardContentEntry;
};

const cardContent: CardContent = {
  "Portuguese": {
    name: "Nome",
    capital: "Capital",
    subregion: "Sub-região",
    region: "Região",
    demonym: "Gentílico",
    independent: "Independente",
    gini: "Desigualdade Social (Gini)",
    languages: "Idiomas",
    currencies: "Moedas",
  },
  "English": {
    name: "Name",
    capital: "Capital",
    subregion: "Subregion",
    region: "Region",
    demonym: "Demonym",
    independent: "Independent",
    gini: "Social Inequality (Gini)",
    languages: "Languages",
    currencies: "Currencies",
  }
}

function App() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countryName, setCountryName] = useState("");
  const [language, setLanguage] = useState<"Portuguese" | "English">("English");
  const [showInfo, setShowInfo] = useState(true);
  const comment = useQuery({
    queryKey: ["countryComment", countryName, language],
    enabled: false,
    queryFn: () => fetchComment(`Make a comment about the political system of ${countryName}, constitutional form and predominant religion, culture and the biggest problem the country suffers from. Also tells if the country was colonized and by whom. Be short. Do not say anything besides the comment. Write everything in ${language}.`),
    retry: 1,
  });
  const countryData = countries.find(c => c.altSpellings?.includes(countryName) || c.name == countryName || c.nativeName == countryName);
  console.log(countryData);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!countryName) return;
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const alpha2 = countryData?.alpha2Code;
    if (!alpha2) return;

    const tryLoad = (ext: string) => {
      return new Promise<void>((resolve, reject) => {
        audio.src = `/anthems/${alpha2}.${ext}`;
        audio.load();
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
      });
    };

    audio.pause();
    audio.currentTime = 0;

    tryLoad("mp3").catch(() => tryLoad("ogg"));
  }, [countryName]);


  useEffect(() => {
    console.log(countryName);
    if (!countryName) return
    comment.refetch()
  }, [countryName]);

  function paintByName(svg: SVGSVGElement, key: string, color: string) {
    svg.querySelectorAll("path").forEach(p => {
      p.setAttribute("fill", "lightgreen");
      p.setAttribute("stroke-width", ".2");
    });

    let selector = "";

    const byName = `path[name="${key}"]`;
    const byTitle = `path[title="${key}"]`;
    const byClass = `path.${key.replace(/\s+/g, ".")}`;
    const byId = `path#${key}`;

    if (svg.querySelectorAll(byName).length > 0) selector = byName;
    else if (svg.querySelectorAll(byTitle).length > 0) selector = byTitle;
    else if (svg.querySelectorAll(byClass).length > 0) selector = byClass;
    else if (svg.querySelectorAll(byId).length > 0) selector = byId;
    else return;

    const paths = svg.querySelectorAll(selector);
    paths.forEach(p => {
      p.setAttribute("fill", color);
      p.setAttribute("stroke-width", "2");
    });
  }

  const handleSvgClick = async (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGPathElement;
    const svg = svgRef.current;

    if (!svg) return;
    if (target.tagName !== "path") return;

    const id = target.getAttribute("id");
    const name = target.getAttribute("name");
    const className = target.getAttribute("class");
    const key = name ?? className ?? id;
    if (!key) return;

    paintByName(svg, key, "green");
    setCountryName(key);
  };

  return (
    <div className="bg-blue-100 max-h-screen w-full overflow-hidden">
      {
        comment.isLoading && (
          <Spinner />
        )
      }
      <nav className="bg-neutral-800 px-4 py-2 text-white flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center fixed top-0 w-full z-50">
        <h1 className="font-bold flex items-center gap-1 text-xl">
          <img src="icon.png" className="w-4" />
          World View
        </h1>
        <input
          type="text"
          className="bg-white text-black rounded-xl p-2"
          placeholder="Find a country..."
          list="countries-list"
          onChange={(e) => {
            const svg = svgRef.current;
            if (!svg) return;
            setCountryName(e.target.value);
            paintByName(svg, e.target.value, "green");
          }}
        />
        <datalist id="countries-list">
          {countries.map((c) => (
            <option key={c.name} value={c.name} />
          ))}
        </datalist>
        <ul className="flex justify-end gap-8">
          <li className="cursor-pointer hover:underline">
            <span onClick={() => setShowInfo(true)} className="flex items-center gap-1">
              <BsInfo />
              Show info
            </span>
          </li>
          <li className="cursor-pointer hover:underline">
            <a href="/quiz" className="flex items-center gap-1">
              <BsCheck2Square />
              Quiz
            </a>
          </li>
          <li className="cursor-pointer hover:underline">
            <a href="https://github.com/dspedroborges/world-view" target="_blank" className="flex items-center gap-1">
              <BsGithub />
              Github
            </a>
          </li>
          <li>
            {
              language == "Portuguese" ? (
                <button onClick={() => setLanguage("English")} className="cursor-pointer hover:underline">
                  🇧🇷 Português
                </button>
              ) : (
                <button onClick={() => setLanguage("Portuguese")} className="cursor-pointer hover:underline">
                  🇺🇸 English
                </button>
              )
            }
          </li>
        </ul>
      </nav>

      <ZoomableSvg>
        <WorldSvg svgRef={svgRef} onClick={handleSvgClick} />
      </ZoomableSvg>

      {
        showInfo && (
          <div className="fixed top-1/2  lg:top-1/2 -translate-y-1/2 h-1/2 overflow-y-scroll border-4 lg:left-2 bg-neutral-200/80 p-4 shadow-2xl w-full md:w-[350px] rounded-xl text-neutral-800">
            <BsXCircle onClick={() => setShowInfo(false)} className="absolute right-2 top-2 hover:scale-110 cursor-pointer" />
            <h3 className="text-center font-bold text-xl border-b pb-2 mb-4">Info</h3>

            {
              countryData && (
                <div>
                  <img src={`${countryData.flags.svg}`} alt="Country flag" className="w-1/2 block mx-auto" />
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
                      <span className="font-bold">{countryData.independent ? "Yes" : "No"}</span>
                    </li>

                    <li>
                      <span>{cardContent[language].gini}: </span>
                      <span className="font-bold">
                        {countryData.gini ? countryData.gini + "%" : "Unknown"}
                      </span>
                    </li>

                    <li>
                      <span>{cardContent[language].languages}: </span>
                      {countryData.languages?.map((l, i: number) => (
                        <span key={i} className="font-bold">
                          {l.name}
                          {countryData.languages.length > 1 && i !== countryData.languages.length - 1 && ", "}
                        </span>
                      ))}
                    </li>

                    <li>
                      <span>{cardContent[language].currencies}: </span>
                      {countryData.currencies?.map((c, i: number) => (
                        <span key={i} className="font-bold">
                          {c.name} ({c.symbol})
                          {countryData.currencies.length > 1 && i !== countryData.currencies.length - 1 && ", "}
                        </span>
                      ))}
                    </li>
                  </ul>
                </div>
              )
            }

            {
              countryName == "" && (
                <p>Click on a country to get the info.</p>
              )
            }

            {
              (!comment.isLoading && !comment.isError) && (
                <p className="mt-4">{comment.data}</p>
              )
            }
          </div>
        )
      }
      <footer className="fixed bottom-0 w-full bg-neutral-800 px-4 py-2 text-white flex justify-center z-50">
        <p>{language == "Portuguese" ? "feito por" : "made by"} Pedro Borges &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
