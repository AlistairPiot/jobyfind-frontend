import { useState } from "react";

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Étudiants",
            content:
                "Recherche d'une vraie expérience, un stage ou une alternance.",
        },
        {
            title: "École",
            content: "Permet de suivre ses différents étudiants.",
        },
        {
            title: "Entreprise",
            content: "Trouver la perle rare parmi une sélection d'étudiants.",
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="bg-white h-[calc(100vh-4rem)] overflow-hidden">
            {/* Layout mobile : vertical avec défilement */}
            <div className="lg:hidden h-full">
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="grid grid-rows-[auto_1fr_1fr_auto] gap-3 h-full">
                        {/* Titre et sous-titre mobile */}
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 tracking-tight leading-tight">
                                Bienvenue sur Jobyfind
                            </h1>
                            <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                                La plateforme qui connecte les écoles, les
                                entreprises et les étudiants pour des
                                opportunités professionnelles.
                            </p>
                        </div>

                        {/* Bloc missions mobile */}
                        <div className="bg-gray-100 rounded-2xl p-6 text-center flex flex-col">
                            <h2 className="text-lg font-bold text-black mb-4">
                                DES MISSIONS RIEN QUE POUR VOUS ET VOS
                                COMPÉTENCES, C'EST POSSIBLE !
                            </h2>
                            <div className="flex-1 bg-white rounded-lg flex items-center justify-center">
                                <div className="text-gray-400 text-4xl">🎯</div>
                            </div>
                        </div>

                        {/* Bloc carrousel mobile */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-base font-semibold text-black mb-4 text-center">
                                QUI ÊTES VOUS ?
                            </h3>
                            <div className="flex-1 flex flex-col justify-center text-center">
                                <h4 className="text-lg font-bold text-primary mb-2">
                                    {slides[currentSlide].title.toUpperCase()} :
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {slides[currentSlide].content}
                                </p>
                            </div>
                            <div className="flex justify-center items-center space-x-3 mt-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex space-x-1">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlide(index)
                                            }
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentSlide
                                                    ? "bg-primary"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={nextSlide}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Carte statistiques */}
                        <div className="bg-gray-100 rounded-2xl p-6">
                            <div className="flex flex-col">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    + 150
                                </div>
                                <div className="text-sm text-gray-700 uppercase font-medium">
                                    Entreprises qui ont démarré une mission avec
                                    nos jeunes freelances
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout tablette horizontale et desktop : vraie bento grid plein écran */}
            <div className="hidden lg:block h-full">
                <div className="px-2 sm:px-4 xl:px-6 h-full">
                    <div className="grid grid-cols-12 grid-rows-6 gap-1.5 xl:gap-1.5 h-full w-full">
                        {/* Zone titre - 6 colonnes, 4 rangées (moitié gauche) */}
                        <div className="col-span-6 row-span-4 flex flex-col justify-center items-center text-center p-4">
                            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-primary mb-4 xl:mb-6 tracking-tight leading-tight">
                                Bienvenue sur Jobyfind
                            </h1>
                            <p className="text-base xl:text-lg 2xl:text-xl text-gray-600 leading-relaxed max-w-lg">
                                La plateforme qui connecte les écoles, les
                                entreprises et les étudiants pour des
                                opportunités professionnelles.
                            </p>
                        </div>

                        {/* Bloc missions - 6 colonnes, 3 rangées (en haut à droite) */}
                        <div className="col-span-6 row-span-3 bg-gray-100 rounded-xl xl:rounded-2xl p-4 xl:p-6 text-center flex flex-col">
                            <h2 className="text-sm xl:text-base font-bold text-black mb-3 xl:mb-4 leading-tight">
                                DES MISSIONS RIEN QUE POUR VOUS ET VOS
                                COMPÉTENCES, C'EST POSSIBLE !
                            </h2>
                            <div className="flex-1 bg-white rounded-lg flex items-center justify-center">
                                <div className="text-gray-400 text-3xl xl:text-4xl">
                                    🎯
                                </div>
                            </div>
                        </div>

                        {/* Bloc carrousel - 6 colonnes, 3 rangées (en bas à droite) */}
                        <div className="col-span-6 row-span-3 bg-white rounded-xl xl:rounded-2xl p-4 xl:p-6 border border-gray-200 shadow-sm flex flex-col">
                            <h3 className="text-sm xl:text-base font-semibold text-black mb-3 text-center">
                                QUI ÊTES VOUS ?
                            </h3>
                            <div className="flex-1 flex flex-col justify-center text-center">
                                <h4 className="text-base xl:text-lg font-bold text-primary mb-2 xl:mb-3">
                                    {slides[currentSlide].title.toUpperCase()} :
                                </h4>
                                <p className="text-gray-600 mb-4 text-sm xl:text-base leading-relaxed">
                                    {slides[currentSlide].content}
                                </p>
                            </div>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-10 h-10 xl:w-12 xl:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    aria-label="Diapositive précédente"
                                >
                                    <svg
                                        className="w-5 h-5 xl:w-6 xl:h-6 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex space-x-2">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlide(index)
                                            }
                                            className={`w-4 h-4 rounded-full transition-colors ${
                                                index === currentSlide
                                                    ? "bg-primary"
                                                    : "bg-gray-300"
                                            }`}
                                            aria-label={`Aller à la diapositive ${
                                                index + 1
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={nextSlide}
                                    className="w-10 h-10 xl:w-12 xl:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    aria-label="Diapositive suivante"
                                >
                                    <svg
                                        className="w-5 h-5 xl:w-6 xl:h-6 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Carte statistiques */}
                        <div className="col-span-6 row-span-2 bg-gray-100 rounded-xl xl:rounded-2xl p-4 xl:p-6">
                            <div className="flex flex-col h-full justify-center">
                                <div className="text-5xl font-bold text-primary mb-3">
                                    + 150
                                </div>
                                <div className="text-lg text-gray-700 uppercase font-medium">
                                    Entreprises qui ont démarré une mission avec
                                    nos jeunes freelances
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
