import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function useErrorHandler() {
    const navigate = useNavigate();

    const handleError = useCallback(
        (error, customMessage = null) => {
            console.error("API Error:", error);

            // Déterminer le type d'erreur et naviguer vers la page appropriée
            if (error.response) {
                const status = error.response.status;

                switch (status) {
                    case 401:
                        // Non autorisé - rediriger vers la page de connexion
                        navigate("/login", {
                            state: {
                                message:
                                    "Votre session a expiré. Veuillez vous reconnecter.",
                            },
                        });
                        break;

                    case 403:
                        // Accès interdit
                        navigate("/error", {
                            state: {
                                errorCode: "403",
                                title: "Accès interdit",
                                message:
                                    "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
                                description:
                                    "Contactez votre administrateur si vous pensez que c'est une erreur.",
                            },
                        });
                        break;

                    case 404:
                        // Ressource non trouvée
                        navigate("/404");
                        break;

                    case 500:
                    case 502:
                    case 503:
                        // Erreurs serveur
                        navigate("/error", {
                            state: {
                                errorCode: status.toString(),
                                title: "Erreur du serveur",
                                message:
                                    customMessage ||
                                    "Une erreur est survenue sur le serveur.",
                                description:
                                    "Nos équipes techniques ont été notifiées. Veuillez réessayer plus tard.",
                            },
                        });
                        break;

                    default:
                        // Autres erreurs HTTP
                        navigate("/error", {
                            state: {
                                errorCode: status.toString(),
                                title: "Erreur",
                                message:
                                    customMessage ||
                                    error.response.data?.message ||
                                    "Une erreur inattendue s'est produite.",
                                description:
                                    "Veuillez réessayer ou contacter le support si le problème persiste.",
                            },
                        });
                }
            } else if (error.request) {
                // Erreur de réseau
                navigate("/error", {
                    state: {
                        errorCode: "NETWORK",
                        title: "Erreur de connexion",
                        message: "Impossible de se connecter au serveur.",
                        description:
                            "Vérifiez votre connexion internet et réessayez.",
                    },
                });
            } else {
                // Erreur lors de la configuration de la requête
                navigate("/error", {
                    state: {
                        errorCode: "REQUEST",
                        title: "Erreur de requête",
                        message:
                            customMessage ||
                            "Une erreur est survenue lors de la préparation de la requête.",
                        description:
                            "Veuillez réessayer ou contacter le support.",
                    },
                });
            }
        },
        [navigate]
    );

    // Fonction pour afficher un message d'erreur sans redirection
    const showError = useCallback((message) => {
        // Ici vous pourriez utiliser un toast ou un système de notification
        console.error("User Error:", message);

        // Pour l'instant, on utilise une alerte simple
        // Dans une vraie application, vous pourriez utiliser une library comme react-hot-toast
        alert(message);

        return () => {
            // Cleanup si nécessaire
        };
    }, []);

    return { handleError, showError };
}

export default useErrorHandler;
