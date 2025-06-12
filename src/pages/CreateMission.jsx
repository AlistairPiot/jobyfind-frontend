import { Link } from "react-router-dom";
import CreateMissionForm from "../components/CreateMissionForm";

function CreateMission() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">
                        Créer une nouvelle mission
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Complétez le formulaire ci-dessous pour publier votre
                        mission
                    </p>
                </div>
                <Link
                    to="/dashboard/company"
                    className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Retour au dashboard
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <CreateMissionForm />
            </div>
        </div>
    );
}

export default CreateMission;
