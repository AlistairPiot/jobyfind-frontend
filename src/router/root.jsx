import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import CreateMission from "../pages/CreateMission";
import DashboardCompany from "../pages/DashboardCompany";
import DashboardFreelance from "../pages/DashboardFreelance";
import DashboardSchool from "../pages/DashboardSchool";
import Home from "../pages/Home";
import LoginForm from "../pages/LoginForm";
import SignUpForm from "../pages/SignUpForm";
import DashboardRouter from "../router/DashboardRoot";

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
        </Routes>
    );
}

export default Root;
