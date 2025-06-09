import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import CGU from "../pages/CGU";
import CGV from "../pages/CGV";
import CreateMission from "../pages/CreateMission";
import DashboardCompany from "../pages/DashboardCompany";
import DashboardFreelance from "../pages/DashboardFreelance";
import DashboardSchool from "../pages/DashboardSchool";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import LoginForm from "../pages/LoginForm";
import MentionsLegales from "../pages/MentionsLegales";
import NotFound from "../pages/NotFound";
import SignUpForm from "../pages/SignUpForm";
import DashboardRouter from "../router/DashboardRoot";

// Composant wrapper pour la page d'erreur avec gestion de l'état
function ErrorPageWrapper() {
    const location = useLocation();
    const errorState = location.state || {};

    return (
        <ErrorPage
            errorCode={errorState.errorCode || "500"}
            title={errorState.title || "Erreur du serveur"}
            message={
                errorState.message || "Une erreur est survenue sur le serveur."
            }
            description={
                errorState.description ||
                "Veuillez réessayer plus tard ou contacter le support si le problème persiste."
            }
        />
    );
}

function Root() {
    const { isAuthenticated, loading } = useAuth();

    // Afficher un écran de chargement pendant l'initialisation
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Home />
                }
            />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Pages légales - accessibles à tous */}
            <Route path="/cgu" element={<CGU />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />

            {/* Route centrale qui redirige vers le bon dashboard */}
            <Route
                path="/dashboard"
                element={
                    isAuthenticated ? (
                        <DashboardRouter />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* Dashboards spécifiques */}
            <Route
                path="/dashboard/company"
                element={
                    isAuthenticated ? (
                        <DashboardCompany />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/dashboard/school"
                element={
                    isAuthenticated ? (
                        <DashboardSchool />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/dashboard/freelance"
                element={
                    isAuthenticated ? (
                        <DashboardFreelance />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* Nouvelle route ajoutée */}
            <Route
                path="/create-mission"
                element={
                    isAuthenticated ? (
                        <CreateMission />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* Route pour les erreurs génériques */}
            <Route path="/error" element={<ErrorPageWrapper />} />

            {/* Route spécifique pour 404 */}
            <Route path="/404" element={<NotFound />} />

            {/* Route catch-all pour les pages non trouvées - doit être en dernier */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Root;
