import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashboardCompany from "../pages/DashboardCompany";
import DashboardFreelance from "../pages/DashboardFreelance";
import DashboardSchool from "../pages/DashboardSchool";
import Home from "../pages/Home";
import LoginForm from "../pages/LoginForm";
import SignUpForm from "../pages/SignUpForm";
import DashboardRouter from "./../router/DashboardRoot";

function Root() {
    const { isAuthenticated } = useAuth();

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
        </Routes>
    );
}

export default Root;
