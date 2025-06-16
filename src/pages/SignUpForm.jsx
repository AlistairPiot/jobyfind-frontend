import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // School, Company, Freelance
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook pour la redirection

    // Validation du mot de passe
    const passwordValidation = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[@$!%*?&.]/.test(password),
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!role) {
            setError("Please select a role.");
            return;
        }

        // Vérifier si le mot de passe est valide
        if (!Object.values(passwordValidation).every(Boolean)) {
            setError(
                "Le mot de passe ne respecte pas tous les critères requis."
            );
            return;
        }

        try {
            const userData = { email, password, role };
            const response = await registerUser(userData);
            console.log("User registered:", response);
            // Rediriger l'utilisateur vers la page de connexion
            navigate("/login");
        } catch (err) {
            console.error("Erreur lors de l'inscription :", err);
            // Vérifier si l'erreur concerne une adresse email déjà utilisée
            if (err.response?.data?.error === "User already exists") {
                setError(
                    "Cette adresse email est déjà utilisée. Veuillez en utiliser une autre ou vous connecter."
                );
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Rejoignez la communauté Jobyfind
                    </p>
                </div>
                <div className="mt-8">
                    <div className="h-1 w-full bg-primary rounded-full mb-8"></div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
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
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="votre@email.com"
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    />
                                </div>
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${
                                                passwordValidation.minLength
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm">
                                            Au moins 8 caractères
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${
                                                passwordValidation.hasUpperCase
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm">
                                            Une lettre majuscule
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${
                                                passwordValidation.hasLowerCase
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm">
                                            Une lettre minuscule
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${
                                                passwordValidation.hasNumber
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm">
                                            Un chiffre
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mr-2 ${
                                                passwordValidation.hasSpecialChar
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></div>
                                        <span className="text-sm">
                                            Un caractère spécial (@$!%*?&.)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Rôle
                                </label>
                                <div>
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                                    >
                                        <option value="">
                                            Sélectionner...
                                        </option>
                                        <option value="ROLE_SCHOOL">
                                            École
                                        </option>
                                        <option value="ROLE_COMPANY">
                                            Entreprise
                                        </option>
                                        <option value="ROLE_FREELANCE">
                                            Etudiant
                                        </option>
                                    </select>
                                </div>
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
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md"
                            >
                                Créer mon compte
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <a
                                href="/login"
                                className="font-medium text-primary hover:text-primary-hover transition-all duration-200"
                            >
                                Déjà inscrit ? Se connecter
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;
