import React from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Nav from "./components/Nav";
import Root from "./router/root";

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <div className="flex flex-col min-h-screen bg-gray-50">
                    <Nav />
                    <main className="flex-grow w-full">
                        <div className="w-full h-full">
                            <Root />
                        </div>
                    </main>
                    <footer className="py-4 bg-white shadow-inner">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="flex flex-col items-center space-y-3">
                                <div className="flex space-x-6 text-sm">
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
                                <div className="text-center text-gray-600 text-sm">
                                    <p>
                                        © 2025 Jobyfind - Tous droits réservés
                                    </p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
