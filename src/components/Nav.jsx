import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";

function Nav() {
    const { isAuthenticated, logout, profileName } = useAuth();
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirection vers la page de connexion après la déconnexion
    };

    return (
        <>
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <span className="text-blue-600 font-bold text-2xl">
                                    Jobyfind
                                </span>
                            </Link>
                        </div>
                        <div>
                            <div className="flex items-center space-x-4">
                                {!isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/signup"
                                            className="px-4 py-2 rounded-md bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            Inscription
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        >
                                            Connexion
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {profileName && (
                                            <span className="text-gray-700 font-medium">
                                                {profileName}
                                            </span>
                                        )}
                                        <button
                                            onClick={() =>
                                                setShowProfileModal(true)
                                            }
                                            className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Profil
                                        </button>
                                        <Link
                                            to="/dashboard"
                                            className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Tableau de bord
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
}

export default Nav;
