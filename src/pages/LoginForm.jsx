import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import du hook pour utiliser l'authentification
import { loginUser } from "../services/api";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Utilisation du hook de contexte

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await loginUser({ email, password });

            if (response && response.token) {
                // Connexion réussie : appel du login dans le contexte avec le token
                login(response.token);
                navigate("/dashboard"); // Redirection vers le dashboard après connexion
            } else {
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
