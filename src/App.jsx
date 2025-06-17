import React from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
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
                    <Footer />
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
