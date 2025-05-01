import React from "react";
import CreateMissionForm from "./../components/CreateMissionForm";

function DashboardCompany() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Bienvenue sur le dashboard Entreprise
            </h1>
            <h2 className="text-xl font-semibold mb-2">
                Créer une nouvelle mission
            </h2>
            <CreateMissionForm />
        </div>
    );
}

export default DashboardCompany;
