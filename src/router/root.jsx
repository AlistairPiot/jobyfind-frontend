import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home"; // Import de la page d'accueil
import LoginForm from "../pages/LoginForm"; // Import du formulaire de connexion
import SignUpForm from "../pages/SignUpForm"; // Import du formulaire d'inscription

function Root() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
        </Routes>
    );
}

export default Root;
