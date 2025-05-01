import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Nav() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirection vers la page de connexion après la déconnexion
    };

    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4 items-center">
                {/* Si l'utilisateur n'est pas authentifié, afficher Home */}
                {!isAuthenticated && (
                    <li>
                        <Link to="/" className="text-white">
                            Home
                        </Link>
                    </li>
                )}

                {!isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/signup" className="text-white">
                                Sign Up
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="text-white">
                                Log In
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/dashboard" className="text-white">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:underline"
                            >
                                Log Out
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
