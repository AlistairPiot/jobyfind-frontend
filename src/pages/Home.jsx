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
        <div className="h-full flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-7xl mx-auto w-full">
                {/* Layout Bento Grid - hauteur adaptative */}
                <div className="grid grid-cols-12 grid-rows-6 gap-4 sm:gap-6 h-[70vh] min-h-[500px] max-h-[600px]">
                    {/* Grande zone titre à gauche (6 colonnes, 6 rangées) */}
                    <div className="col-span-12 lg:col-span-6 row-span-3 lg:row-span-6 flex flex-col justify-center items-start p-4 sm:p-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 lg:mb-6 tracking-tight">
                            Bienvenue sur Jobyfind
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 lg:mb-12 max-w-2xl">
                            La plateforme qui connecte les écoles, les
                            entreprises et les étudiants pour des opportunités
                            professionnelles.
                        </p>
                        {/* <div className="flex flex-wrap gap-3 sm:gap-4">
                            <a
                                href="/signup"
                                className="px-6 sm:px-8 py-2 sm:py-3 rounded-md btn-primary font-medium transition-colors duration-300 shadow-md text-sm sm:text-base"
                            >
                                Inscription
                            </a>
                            <a
                                href="/login"
                                className="px-6 sm:px-8 py-2 sm:py-3 rounded-md btn-primary-outline font-medium transition-colors duration-300 text-sm sm:text-base"
                            >
                                Connexion
                            </a>
                        </div> */}
                    </div>

                    {/* Rectangle missions en haut à droite (6 colonnes, 2 rangées) */}
                    <div className="col-span-12 lg:col-span-6 row-span-2 bg-primary-light rounded-lg p-4 sm:p-6 flex flex-col justify-center items-center border border-primary">
                        <div className="text-center">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-3 sm:mb-4">
                                Des missions rien que pour vous et vos
                                compétences, c'est possible !
                            </h2>
                            <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-primary">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-light rounded-full flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-semibold">
                                        🎯
                                    </span>
                                </div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-light rounded-full flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-semibold">
                                        💼
                                    </span>
                                </div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-light rounded-full flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-semibold">
                                        ⭐
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carré en bas à gauche (3 colonnes, 2 rangées) */}
                    <div className="col-span-6 lg:col-span-3 row-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-6 flex flex-col justify-center items-center border border-gray-200">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-light rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                                <span className="text-xl sm:text-2xl">🚀</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                                Lancez-vous !
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Rejoignez notre communauté et trouvez votre
                                prochaine opportunité.
                            </p>
                        </div>
                    </div>

                    {/* Carré carousel en bas à droite (3 colonnes, 2 rangées) */}
                    <div className="col-span-6 lg:col-span-3 row-span-2 bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm relative">
                        <div className="h-full flex flex-col">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                                Qui êtes-vous ?
                            </h3>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="text-center">
                                    <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                                        {slides[currentSlide].title}
                                    </h4>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        {slides[currentSlide].content}
                                    </p>
                                </div>
                            </div>

                            {/* Contrôles de navigation et indicateurs centrés */}
                            <div className="flex flex-col items-center space-y-2 mt-3 sm:mt-4">
                                {/* Contrôles de navigation */}
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <svg
                                            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
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
                                    <button
                                        onClick={nextSlide}
                                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                    >
                                        <svg
                                            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
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

                                {/* Indicateurs de slide */}
                                <div className="flex justify-center space-x-1">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
