import React from "react";
import ErrorPage from "../pages/ErrorPage";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError() {
        // Met à jour le state pour afficher l'UI d'erreur
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Enregistrer l'erreur dans la console
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({
            errorInfo: errorInfo,
        });

        // Ici vous pourriez envoyer l'erreur à un service de monitoring
        // comme Sentry, LogRocket, etc.
        // logErrorToService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Vous pouvez personnaliser l'UI d'erreur
            return (
                <ErrorPage
                    errorCode="JS_ERROR"
                    title="Erreur d'application"
                    message="Une erreur inattendue s'est produite dans l'application."
                    description="L'erreur a été automatiquement signalée à notre équipe technique. Veuillez actualiser la page ou revenir plus tard."
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
