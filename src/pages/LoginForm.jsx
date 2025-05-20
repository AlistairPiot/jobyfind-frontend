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

            if (response && response.token && response.roles) {
                // Connexion réussie : appel du login dans le contexte avec le token
                login(response.token, response.roles, response.userId);
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
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Bienvenue
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Connectez-vous à votre compte Jobyfind
                    </p>
                </div>
                <div className="mt-8">
                    <div className="h-1 w-full bg-blue-500 rounded-full mb-8"></div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mot de passe
                            </label>
                            <div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-sm text-red-600 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
                            >
                                Se connecter
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <a
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200"
                            >
                                Pas encore de compte ? S'inscrire
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
