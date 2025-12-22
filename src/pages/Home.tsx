import { useEffect, useRef, useState } from "react"
import WorldSvg from "../components/WorldSvg";
import ZoomableSvg from "../components/ZoomableSvg";
import { useQuery } from "@tanstack/react-query";
import { fetchComment } from "../requests/pollinations";
import Spinner from "../components/Spinner";
import { countries } from "../data/countries";
import { cardContent } from "../data/card";
import { handleSvgClick, paintByName } from "../functions/svg";
import Card from "../components/Card";
import Nav from "../components/Nav";
import { getListOfCountries } from "../functions/misc";
import { useLanguageStore } from "../stores/language";
import Footer from "../components/Footer";

export default function Home() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [countryName, setCountryName] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const language = useLanguageStore((s) => s.language);
  const comment = useQuery({
    queryKey: ["countryComment", countryName, language],
    enabled: false,
    queryFn: () => fetchComment(`Make a comment about the political system of ${countryName}, constitutional form and predominant religion, culture and the biggest problem the country suffers from. Also tells if the country was colonized and by whom. Be short. Do not say anything besides the comment. Write everything in ${language}.`),
    retry: 1,
  });

  const countryData = countries.find(c => c.altSpellings?.includes(countryName) || c.name == countryName || c.nativeName == countryName || Object.values(c.translations).includes(countryName));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!countryName) return;
    if (!svgRef.current) return;

    paintByName(svgRef.current, countryData?.name ?? "", "green");
    setShowInfo(true);
  }, [countryName]);

  useEffect(() => {
    if (!countryName) return;
    if (!audioRef.current) return;
    if (!svgRef.current) return;

    const audio = audioRef.current;
    const alpha2 = countryData?.alpha2Code;
    if (!alpha2) return;

    audio.pause();
    audio.currentTime = 0;

    const tryLoad = (ext: string) =>
      new Promise<void>((resolve, reject) => {
        const src = `/anthems/${alpha2}.${ext}`;
        audio.src = src;
        audio.load();

        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject();
      });

    tryLoad("mp3").catch(() => tryLoad("ogg"));
  }, [countryName]);


  useEffect(() => {
    if (!countryName) return
    comment.refetch()
  }, [countryName]);

  return (
    <div className="bg-blue-100 max-h-screen w-full overflow-hidden">
      {
        comment.isLoading && (
          <Spinner />
        )
      }
      <Nav
        setCountryName={setCountryName}
        countryName={countryName}
        dataList={getListOfCountries()}
      />

      <ZoomableSvg>
        <WorldSvg svgRef={svgRef} onClick={(e) => handleSvgClick(e, svgRef.current, (key: string) => {
          setCountryName(key);
          setShowInfo(true);
        })} />
      </ZoomableSvg>

      {
        showInfo && (
          <Card
            onClose={() => setShowInfo(false)}
            countryData={countryData}
            countryName={countryName}
            cardContent={cardContent}
            language={language}
            audioRef={audioRef}
            comment={{
              isLoading: comment.isLoading,
              isError: comment.isError,
              data: comment.data ?? "",
            }}
          />
        )
      }
      <Footer language={language} />
    </div>
  )
}