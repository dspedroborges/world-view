import { BsGithub } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Footer({ language }: { language: "pt"|"en" }) {
    return (
        <footer className="fixed bottom-0 w-full bg-neutral-800 px-4 py-2 text-xs lg:text-base text-white flex flex-col lg:flex-row justify-center items-center z-50 lg:gap-4">
            <p>{language == "pt" ? "feito por" : "made by"} Pedro Borges &copy; {new Date().getFullYear()}</p>
            <Link to="https://github.com/dspedroborges/world-view" target="_blank" className="flex items-center gap-1">
                <BsGithub />
                Github
            </Link>
        </footer>
    )
}