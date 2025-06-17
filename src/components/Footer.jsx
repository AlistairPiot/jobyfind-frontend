function Footer() {
    return (
        <footer className="py-2 bg-white shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-6 text-sm justify-center">
                        <a
                            href="/mentions-legales"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            Mentions légales
                        </a>
                        <a
                            href="/cgv"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            CGV
                        </a>
                        <a
                            href="/cgu"
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            CGU
                        </a>
                    </div>
                    <p className="text-gray-600 text-sm text-center">
                        © 2025 Jobyfind - Tous droits réservés
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
