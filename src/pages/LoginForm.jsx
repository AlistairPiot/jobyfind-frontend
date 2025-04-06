import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook pour la redirection

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Simuler une connexion réussie
            console.log("User logged in:", { email, password });
            // Rediriger l'utilisateur vers la page d'accueil ou un dashboard
            navigate("/");
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            setError("Invalid credentials. Please try again.");
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
