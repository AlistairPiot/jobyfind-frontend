import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // Importer la fonction loginUser depuis api.js

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook pour la redirection

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await loginUser({ email, password }); // Appel de la fonction loginUser

            if (response) {
                // Connexion réussie : redirection vers la page d'accueil ou dashboard
                console.log("User logged in:", response);
                navigate("/"); // Redirection vers la page d'accueil après une connexion réussie
            } else {
                // Affichage du message d'erreur en cas de mauvaise connexion
                setError("Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Log In</button>
        </form>
    );
}

export default LoginForm;
