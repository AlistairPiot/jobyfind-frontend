import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ErrorPage({
    errorCode = "500",
    title = "Erreur du serveur",
    message = "Une erreur est survenue sur le serveur.",
    description = "Veuillez réessayer plus tard ou contacter le support si le problème persiste.",
}) {
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

    const handleRefresh = () => {
        window.location.reload();
    };

    // Déterminer l'icône en fonction du code d'erreur
    const getErrorIcon = () => {
        switch (errorCode) {
            case "403":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                );
            case "404":
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                );
            default:
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
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
                            {getErrorIcon()}
                        </svg>
                    </div>

                    {/* Code d'erreur */}
                    <h1 className="text-8xl font-bold text-gray-300 mb-2">
                        {errorCode}
                    </h1>
                </div>

                {/* Message d'erreur */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">{message}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleRefresh}
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Actualiser la page
                        </button>

                        <button
                            onClick={handleGoHome}
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6"
                                />
                            </svg>
                            {isAuthenticated
                                ? "Retour au tableau de bord"
                                : "Retour à l'accueil"}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleGoBack}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                            ← Retour à la page précédente
                        </button>
                    </div>

                    {/* Informations de contact support */}
                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">
                            Besoin d'aide ?
                        </p>
                        <p className="text-sm text-gray-600">
                            Contactez notre support technique :{" "}
                            <a
                                href="mailto:support@jobyfind.com"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                support@jobyfind.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Informations techniques */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        Code d'erreur : {errorCode} - {title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Heure : {new Date().toLocaleString("fr-FR")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        URL : {window.location.pathname}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
