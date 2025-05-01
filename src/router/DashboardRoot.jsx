import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardRoot() {
    const { userRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole === "ROLE_COMPANY") {
            navigate("/dashboard/company");
        } else if (userRole === "ROLE_SCHOOL") {
            navigate("/dashboard/school");
        } else if (userRole === "ROLE_FREELANCE") {
            navigate("/dashboard/freelance");
        } else {
            navigate("/login");
        }
    }, [userRole, navigate]);

    return <p>Chargement du tableau de bord...</p>;
}

export default DashboardRoot;
