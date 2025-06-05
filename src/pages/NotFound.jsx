import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        if (isAuthenticated) {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Illustration d'erreur */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    {/* Code d'erreur */}
                    <h1 className="text-8xl font-bold text-gray-300 mb-2">
                        404
                    </h1>
                </div>

                {/* Message d'erreur */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Page introuvable
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Oups ! La page que vous recherchez n'existe pas.
                    </p>
                    <p className="text-sm text-gray-500">
                        Il se peut que l'URL soit incorrecte ou que la page ait
                        été déplacée.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGoHome}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6"
                                />
                            </svg>
                            {isAuthenticated
                                ? "Retour au tableau de bord"
                                : "Retour à l'accueil"}
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Page précédente
                        </button>
                    </div>

                    {/* Liens utiles pour les utilisateurs connectés */}
                    {isAuthenticated && (
                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">
                                Liens utiles :
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <Link
                                    to="/dashboard"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Tableau de bord
                                </Link>
                                <Link
                                    to="/dashboard/freelance"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Missions disponibles
                                </Link>
                                <Link
                                    to="/create-mission"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Créer une mission
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Liens pour les utilisateurs non connectés */}
                    {!isAuthenticated && (
                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">
                                Vous n'êtes pas encore inscrit ?
                            </p>
                            <div className="flex justify-center gap-4 text-sm">
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Informations techniques (optionnel, peut être retiré en production) */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        Code d'erreur : 404 - Page non trouvée
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        URL actuelle : {window.location.pathname}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
