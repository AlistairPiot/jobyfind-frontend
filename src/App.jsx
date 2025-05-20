import React from "react";
import { BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Root from "./router/root";

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Nav />
                <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
                    <div className="w-full">
                        <Root />
                    </div>
                </main>
                <footer className="py-6 bg-gray-100 shadow-inner">
                    <div className="text-center text-gray-600 text-sm">
                        <p>© 2024 Jobyfind - Tous droits réservés</p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
