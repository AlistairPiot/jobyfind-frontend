import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardRoot() {
    const { userRole } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole) {
            if (userRole === "ROLE_COMPANY") {
                navigate("/dashboard/company");
            } else if (userRole === "ROLE_SCHOOL") {
                navigate("/dashboard/school");
            } else if (userRole === "ROLE_FREELANCE") {
                navigate("/dashboard/freelance");
            } else {
                navigate("/login");
            }
        } else {
            // Si le rôle n'est pas encore défini, on attend
            setLoading(true);
        }
    }, [userRole, navigate]);

    if (loading) {
        return <p>Chargement du tableau de bord...</p>;
    }

    return null;
}

export default DashboardRoot;
