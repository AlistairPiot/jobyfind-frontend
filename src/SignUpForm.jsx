import { useState } from "react";
import { registerUser } from "./services/api"; // Import de la nouvelle fonction

function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // School, Company, Freelance
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!role) {
            setError("Please select a role.");
            return;
        }

        try {
            const userData = { email, password, role };
            const response = await registerUser(userData); // Utilisation de registerUser
            console.log("Inscription réussie :", response);
            // Rediriger l'utilisateur ou afficher un message de succès
        } catch (err) {
            console.error("Erreur lors de l'inscription :", err);
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
            <label>
                Role:
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="">Selection...</option>
                    <option value="ROLE_SCHOOL">École</option>
                    <option value="ROLE_COMPANY">Entreprise</option>
                    <option value="ROLE_FREELANCE">Freelance</option>
                </select>
            </label>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">Create Account</button>
        </form>
    );
}

export default SignUpForm;
