import { useCallback } from "react";

const useErrorHandler = () => {
    // Extraire les messages d'erreur de validation depuis la réponse API Symfony
    const extractValidationErrors = useCallback((error) => {
        if (error.response && error.response.data) {
            const data = error.response.data;

            // Format d'erreur Symfony Validator
            if (data.violations && Array.isArray(data.violations)) {
                const validationErrors = {};
                data.violations.forEach((violation) => {
                    const field = violation.propertyPath;
                    const message = violation.message;
                    validationErrors[field] = message;
                });
                return validationErrors;
            }

            // Format d'erreur API Platform
            if (data["hydra:description"]) {
                return { general: data["hydra:description"] };
            }

            // Message d'erreur simple
            if (data.message) {
                return { general: data.message };
            }
        }

        return null;
    }, []);

    // Gérer les erreurs avec extraction des messages de validation
    const handleError = useCallback(
        (error, defaultMessage = "Une erreur est survenue") => {
            console.error("Erreur détectée:", error);

            const validationErrors = extractValidationErrors(error);

            if (validationErrors) {
                // Si on a des erreurs de validation spécifiques, les retourner
                return {
                    type: "validation",
                    errors: validationErrors,
                    message: "Veuillez corriger les erreurs de validation.",
                };
            }

            // Sinon, retourner l'erreur générale
            return {
                type: "general",
                message: defaultMessage,
            };
        },
        [extractValidationErrors]
    );

    // Vérifier si une erreur est liée à la validation
    const isValidationError = useCallback(
        (error) => {
            return extractValidationErrors(error) !== null;
        },
        [extractValidationErrors]
    );

    // Obtenir un message d'erreur utilisateur-friendly
    const getErrorMessage = useCallback(
        (error, defaultMessage = "Une erreur est survenue") => {
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                switch (status) {
                    case 400:
                        if (data.violations) {
                            return "Les données saisies ne sont pas valides.";
                        }
                        return data.message || "Données invalides.";

                    case 401:
                        return "Vous n'êtes pas autorisé à effectuer cette action.";

                    case 403:
                        return "Accès refusé.";

                    case 404:
                        return "Ressource non trouvée.";

                    case 422:
                        return "Les données envoyées ne peuvent pas être traitées.";

                    case 500:
                        return "Erreur interne du serveur. Veuillez réessayer plus tard.";

                    default:
                        return data.message || defaultMessage;
                }
            }

            if (error.request) {
                return "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
            }

            return error.message || defaultMessage;
        },
        []
    );

    // Fonction pour afficher un message d'erreur sans redirection
    const showError = useCallback((message, type = "error") => {
        // Cette fonction peut être utilisée pour afficher des notifications
        console.error(`[${type.toUpperCase()}]:`, message);

        // Ici on pourrait intégrer avec une bibliothèque de notifications
        // comme react-toastify, react-hot-toast, etc.

        return {
            type,
            message,
            timestamp: new Date().toISOString(),
        };
    }, []);

    return {
        handleError,
        extractValidationErrors,
        isValidationError,
        getErrorMessage,
        showError,
    };
};

export default useErrorHandler;
