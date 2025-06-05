function Home() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12">
            <div className="max-w-3xl mx-auto text-center px-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-6 tracking-tight">
                    Bienvenue sur Jobyfind
                </h1>
                <p className="text-xl text-gray-600 mb-12 mx-auto max-w-2xl">
                    La plateforme qui connecte les écoles, les entreprises et
                    les étudiants pour des opportunités professionnelles.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="/signup"
                        className="px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md"
                    >
                        Inscription
                    </a>
                    <a
                        href="/login"
                        className="px-8 py-3 rounded-md border border-blue-300 text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-300"
                    >
                        Connexion
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;
