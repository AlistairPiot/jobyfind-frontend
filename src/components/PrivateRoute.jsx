import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("authToken");

    // Tu peux aussi ajouter une logique de vérification d'expiration du token ici
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
