import React from "react";
import { BrowserRouter } from "react-router-dom"; // Utilisation de BrowserRouter ici
import Nav from "./components/Nav"; // Importation de Nav pour la navigation
import Root from "./router/root"; // Importation de Root pour gérer les routes

function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Root /> {/* Utilisation de Root pour gérer les routes */}
        </BrowserRouter>
    );
}

export default App;
