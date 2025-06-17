import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";

function Nav() {
    const { isAuthenticated, logout, profileName } = useAuth();
    const navigate = useNavigate();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirection vers la page de connexion après la déconnexion
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white">
                <div className="max-w-full mx-auto px-2 sm:px-4 xl:px-6 py-2">
                    {/* Encadré gris pour tout le header */}
                    <div className="rounded-full px-4 py-2 border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex-shrink-0">
                                <Link to="/" className="flex items-center">
                                    <img
                                        src="/logo_jobyfind.svg"
                                        alt="Jobyfind"
                                        className="h-8 w-auto"
                                    />
                                </Link>
                            </div>

                            {/* Menu central sans fond gris - Desktop */}
                            {!isAuthenticated && (
                                <div className="hidden lg:flex items-center space-x-1">
                                    <Link
                                        to="/about"
                                        className="px-4 py-2 rounded-full text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 text-sm font-medium"
                                    >
                                        À Propos
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="px-4 py-2 rounded-full text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 text-sm font-medium"
                                    >
                                        Nos Services
                                    </Link>
                                    <Link
                                        to="/missions"
                                        className="px-4 py-2 rounded-full text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 text-sm font-medium"
                                    >
                                        Les Missions
                                    </Link>
                                    <Link
                                        to="/blog"
                                        className="px-4 py-2 rounded-full text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 text-sm font-medium"
                                    >
                                        Notre Blog
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="px-4 py-2 rounded-full text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 text-sm font-medium"
                                    >
                                        Nous Contacter
                                    </Link>
                                </div>
                            )}

                            {/* Boutons Desktop et Hamburger Mobile */}
                            <div className="flex items-center space-x-4">
                                {/* Boutons Desktop */}
                                <div className="hidden lg:flex items-center space-x-4">
                                    {!isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/signup"
                                                className="px-6 py-2 rounded-full btn-primary-outline transition-colors text-sm font-medium"
                                            >
                                                Inscription
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="px-6 py-2 rounded-full btn-primary transition-colors text-sm font-medium"
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
                                                className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Profil
                                            </button>
                                            <Link
                                                to="/dashboard"
                                                className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Tableau de bord
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                                            >
                                                Déconnexion
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Bouton Hamburger Mobile */}
                                <button
                                    onClick={toggleMobileMenu}
                                    className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="Menu mobile"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {isMobileMenuOpen ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Mobile */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                            {/* Liens de navigation mobile */}
                            {!isAuthenticated && (
                                <>
                                    <Link
                                        to="/about"
                                        onClick={closeMobileMenu}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
                                    >
                                        À Propos
                                    </Link>
                                    <Link
                                        to="/services"
                                        onClick={closeMobileMenu}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
                                    >
                                        Nos Services
                                    </Link>
                                    <Link
                                        to="/missions"
                                        onClick={closeMobileMenu}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
                                    >
                                        Les Missions
                                    </Link>
                                    <Link
                                        to="/blog"
                                        onClick={closeMobileMenu}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
                                    >
                                        Notre Blog
                                    </Link>
                                    <Link
                                        to="/contact"
                                        onClick={closeMobileMenu}
                                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium"
                                    >
                                        Nous Contacter
                                    </Link>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 my-3"></div>
                                </>
                            )}

                            {/* Boutons d'authentification mobile */}
                            {!isAuthenticated ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/signup"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg btn-primary-outline transition-colors text-base font-medium text-center"
                                    >
                                        Inscription
                                    </Link>
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg btn-primary transition-colors text-base font-medium text-center"
                                    >
                                        Connexion
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {profileName && (
                                        <div className="px-4 py-2 text-gray-700 font-medium text-center">
                                            {profileName}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setShowProfileModal(true);
                                            closeMobileMenu();
                                        }}
                                        className="block w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium text-center"
                                    >
                                        Profil
                                    </button>
                                    <Link
                                        to="/dashboard"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium text-center"
                                    >
                                        Tableau de bord
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                        className="block w-full px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-base font-medium text-center"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
}

export default Nav;
